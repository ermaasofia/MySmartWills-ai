# AI SmartWills - Production Security & Architecture Audit

**Date:** 2026-04-01
**Target:** https://smartwills.ai
**Codebase:** Next.js 16 + Supabase + Groq LLM

---

## 1. Architecture Review

### Strengths
- Clean App Router structure with proper separation of concerns (API routes, components, lib modules)
- Defense-in-depth on admin routes: middleware gate + layout `isAdmin()` + API-level `isAdmin()` + RLS policies
- Supabase RLS on every table with proper ownership policies
- Streaming chat architecture with proper session management
- AI memory system is well-designed with whitelist-based fact validation and prompt injection sanitization (`sanitizeForPrompt()` strips section delimiters and newlines)

### Scalability Concerns
- **In-memory rate limit fallback** (`src/lib/rate-limit.ts:32`): The `rateLimitMap` is a module-level `Map`. On Vercel serverless, each cold start gets its own map, making rate limits ineffective across instances. If Redis goes down, rate limiting is essentially disabled.
- **Fire-and-forget memory extraction** (`src/app/api/chat/route.ts:440-444`): `extractAndSaveMemory()` makes an additional LLM call after every chat response. At scale, this doubles your Groq API usage. No circuit breaker if Groq is slow/down.
- **No caching layer**: Custom prompts (`getCustomPrompts`) and user memory are fetched from Supabase on every single chat request. These are read-heavy, rarely-changing data.
- **Country contexts hardcoded** (`src/app/api/chat/route.ts:20-119`): 100+ lines of legal text baked into the source. Cannot be updated without deployment.

---

## 2. Security Audit

### CRITICAL ISSUES

#### 2.1 CAPTCHA is Optional on Login (Brute Force Risk)
**File:** `src/app/api/auth/login/route.ts:60-68`
```typescript
if (captchaToken) {  // <-- Only verified IF provided
  const turnstileResult = await verifyTurnstileToken(captchaToken, ip);
```
**Risk:** An attacker can omit `captchaToken` from the request body entirely, bypassing CAPTCHA. Combined with the IP spoofing issue below, this enables unlimited brute force.

**Fix:** Make CAPTCHA mandatory:
```typescript
if (!captchaToken) {
  return NextResponse.json({ error: 'CAPTCHA verification is required' }, { status: 400 });
}
const turnstileResult = await verifyTurnstileToken(captchaToken, ip);
if (!turnstileResult.success) {
  return NextResponse.json({ error: 'CAPTCHA verification failed.' }, { status: 403 });
}
```

#### 2.2 IP-Based Rate Limiting Bypassable via Header Spoofing
**File:** `src/lib/ip.ts:5-11`
```typescript
export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  );
}
```
**Risk:** If your app is deployed on Vercel (not directly behind Cloudflare proxy), `cf-connecting-ip` won't be present. The function falls back to `x-forwarded-for`, which is **client-controlled**. An attacker can send:
```bash
for i in $(seq 1 1000); do
  curl -X POST https://smartwills.ai/api/auth/login \
    -H "X-Forwarded-For: 10.0.0.$((i % 256))" \
    -d '{"email":"victim@email.com","password":"guess'$i'"}'
done
```
This bypasses the 5-attempt/5-minute rate limit completely.

**Fix:** Use Vercel's trusted IP header:
```typescript
export function getClientIp(headers: Headers): string {
  // Vercel sets this from the actual client socket - cannot be spoofed
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ??
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    'unknown'  // Never fall back to x-forwarded-for
  );
}
```

#### 2.3 Origin Check Skipped When Header Is Absent
**File:** `src/app/api/chat/route.ts:286`
```typescript
if (origin && !allowedOrigins.includes(origin)) {
```
**Risk:** Non-browser clients (curl, scripts, bots) don't send an `Origin` header. The check is skipped entirely for them. This allows automated abuse of the chat API from any origin.

**Fix:** For sensitive API endpoints, consider requiring the origin header OR validating auth is sufficient (which it is here since user must be authenticated). This is lower priority since auth is enforced, but worth documenting.

### HIGH PRIORITY ISSUES

#### 2.4 Session ID Accepted Without Explicit User Ownership Check
**File:** `src/app/api/chat/route.ts:371-381`
```typescript
const { data: existingSession } = await supabase
  .from('chat_sessions')
  .select('id')
  .eq('id', incomingSessionId)
  .single();

if (existingSession) {
  sessionId = existingSession.id;  // No .eq('user_id', user.id) check
}
```
**Risk:** This relies solely on Supabase RLS to prevent cross-user session access. The RLS policy `USING (auth.uid() = user_id)` on `chat_sessions` should protect this, but it's a defense-in-depth gap. If RLS is ever misconfigured, this becomes an IDOR vulnerability.

**Fix:** Add explicit ownership filter:
```typescript
const { data: existingSession } = await supabase
  .from('chat_sessions')
  .select('id')
  .eq('id', incomingSessionId)
  .eq('user_id', user.id)  // Explicit ownership check
  .single();
```

#### 2.5 Forgot-Password Has No Server-Side CAPTCHA Verification
**File:** `src/app/api/auth/forgot-password/route.ts:58`
```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo,
  captchaToken,  // Passed to Supabase but NOT verified server-side first
});
```
**Risk:** Combined with IP spoofing (2.2), attacker can trigger password reset emails at scale (email flooding / enumeration).

**Fix:** Add server-side verification before the Supabase call (same pattern as signup).

#### 2.6 CSP Allows `unsafe-inline` Scripts
**File:** `next.config.ts:57`
```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com ...
```
**Risk:** `unsafe-inline` weakens XSS protection. If an attacker finds any way to inject HTML content, inline scripts will execute.

**Mitigation:** This is currently required for Cloudflare Turnstile and Next.js hydration. Consider migrating to nonce-based CSP when Next.js fully supports it.

#### 2.7 No Rate Limiting on GET /api/chat/sessions
**File:** `src/app/api/chat/sessions/route.ts`
The GET endpoint has no rate limit. An authenticated user (or compromised account) can enumerate all their sessions at unlimited speed, creating unnecessary database load.

### MEDIUM ISSUES

#### 2.8 `ADMIN_EMAILS` Environment Variable as Fallback Admin Check
**File:** `src/lib/admin.ts`
If the database `profiles.role` check fails (e.g., Supabase down), the system falls back to a comma-separated env var. This means admin access persists even during database outages, which may not be desired.

#### 2.9 Markdown Renderer Missing `rehype-sanitize`
**File:** `src/components/chat/markdown-renderer.tsx`
`react-markdown` does NOT render raw HTML by default (safe), but adding `rehype-sanitize` provides defense-in-depth against future changes or plugin interactions. The `a` tag renderer does use `rel="noopener noreferrer"` and `target="_blank"` correctly.

#### 2.10 CORS Origin Comparison Without Trailing Slash Normalization
**File:** `src/app/api/chat/route.ts:280`
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartwills.ai';
```
If `NEXT_PUBLIC_APP_URL` is set with a trailing slash (`https://smartwills.ai/`), origin comparison will fail and legitimate requests will be blocked.

---

## 3. Performance & Optimization

### Token & Cost Waste
- **Double LLM call per message**: Every user message triggers the main chat response PLUS a memory extraction call (`extractAndSaveMemory`). The extraction call uses `maxOutputTokens: 512` but still consumes input tokens for the full conversation context.
- **Estimated overhead**: ~30-50% extra Groq API cost from memory extraction alone.

### Missing Caching
- `getCustomPrompts()` hits Supabase on every chat request for data that changes maybe once a week.
- `getUserMemory()` is fetched per-request; could be cached for the session duration.

**Fix:** Add a simple in-memory cache with 5-minute TTL for custom prompts:
```typescript
let promptCache: { data: CustomPrompts; expiresAt: number } | null = null;

async function getCustomPrompts(supabase) {
  if (promptCache && Date.now() < promptCache.expiresAt) return promptCache.data;
  // ... fetch from DB ...
  promptCache = { data: result, expiresAt: Date.now() + 5 * 60 * 1000 };
  return result;
}
```

### Bundle Size Concerns
- `framer-motion` (~40KB gzipped) imported in multiple components for simple fade/slide animations
- `react-markdown` + `remark-gfm` (~50KB) loaded eagerly in chat

**Fix:** Lazy-load `MarkdownRenderer` with `next/dynamic`:
```typescript
const MarkdownRenderer = dynamic(
  () => import('./markdown-renderer').then(m => m.MarkdownRenderer),
  { loading: () => <p>...</p> }
);
```

### Re-render Inefficiency
**File:** `src/components/chat/chat-interface.tsx`
During streaming, every chunk triggers `setMessages()` which re-renders the entire messages array. Individual `ChatMessage` components are not memoized.

---

## 4. AI System Audit

### Prompt Design: Good
- System prompt is well-structured with clear sections and non-negotiable identity rules
- Anti-jailbreak protections are explicit (identity rules, social engineering prevention)
- Country-specific legal context is accurate and relevant
- Prompt injection sanitization in memory system (`sanitizeForPrompt`) strips section delimiters

### Token Efficiency: Needs Improvement
- System prompt is ~1500-2000 tokens depending on custom prompts and memory context
- Memory extraction prompt re-sends existing facts + conversation = redundant tokens
- `maxOutputTokens: 3072` for chat responses is generous; most responses are 200-400 words (~300-500 tokens)

**Recommendation:** Reduce `maxOutputTokens` to `1536` and let users request "more detail" if needed. Saves cost on output tokens.

### Abuse Vectors
- **Prompt injection via memory poisoning**: A user could craft messages to inject instructions into their stored memory facts. The `sanitizeForPrompt()` function mitigates this by stripping newlines and section delimiters, but sophisticated Unicode-based attacks may bypass it.
- **Cost abuse**: Rate limit of 20 requests/60 seconds = 1200 requests/hour per user. Each request triggers 2 LLM calls. That's 2400 LLM calls/hour per user.

**Fix:** Consider a daily token budget per user (e.g., 100K tokens/day for free tier).

---

## 5. Payment & Billing Audit

**N/A** - No payment system detected in the codebase. The application appears to be free-tier only. If a paid tier is planned, implement:
- Stripe webhook handler with idempotency keys
- Usage tracking (token counts per user)
- Graceful degradation when quota is exceeded

---

## 6. Database & Backend

### Missing Indexes
```sql
-- Sessions are queried by user_id + ordered by updated_at. Add composite:
CREATE INDEX idx_chat_sessions_user_updated
  ON public.chat_sessions(user_id, updated_at DESC);

-- Messages are queried by session_id + ordered by created_at:
CREATE INDEX idx_chat_messages_session_created
  ON public.chat_messages(session_id, created_at ASC);
```

### Schema Observations
- **Good**: RLS on all tables, ownership policies, admin audit logging
- **Good**: `ON DELETE CASCADE` on all foreign keys
- **Good**: `CHECK` constraints on `role` and `prompt_type`
- **Missing**: No data retention policy. `chat_messages`, `user_memories`, and `admin_audit_logs` grow unbounded
- **Missing**: `user_memories` has no `created_at` column, only `updated_at`

### RLS Policy Note
The `documents` table has `USING (true)` for SELECT - anyone can read all documents. This is intentional for RAG but must be restricted if documents ever contain sensitive data.

---

## 7. DevOps & Deployment

### Environment Variables
- `.env.local` is in `.gitignore` - confirmed never committed to git
- `src/instrumentation.ts` validates `SUPABASE_URL` and `SUPABASE_ANON_KEY` at startup but only warns; does NOT fail
- Missing validation for `CLOUDFLARE_TURNSTILE_SECRET_KEY` (silently disables CAPTCHA if missing)

**Fix:** Fail startup for critical vars:
```typescript
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}
```

### Monitoring Gaps
- No error tracking service (Sentry, etc.)
- No structured logging (just `console.error`)
- No health check endpoint
- No uptime monitoring
- Admin audit logs exist but no alerting on suspicious activity

### CI/CD
- No CI/CD configuration detected (no `.github/workflows/`, no `vercel.json`)
- No automated linting/type-checking in pipeline
- Relies on Vercel's auto-deploy from git push

---

## 8. Production Readiness Scores

| Category        | Score | Notes |
|-----------------|-------|-------|
| **Security**    | 6/10  | Good foundation (RLS, defense-in-depth, input validation) but critical gaps in CAPTCHA bypass and IP spoofing |
| **Performance** | 6/10  | Streaming works well but double LLM calls, no caching, bundle size concerns |
| **Scalability** | 5/10  | In-memory rate limit fallback breaks at scale, no caching, unbounded DB growth |
| **Reliability** | 5/10  | No error tracking, no health checks, no monitoring, memory extraction is fire-and-forget |
| **Maintainability** | 7/10 | Clean architecture, good TypeScript, consistent patterns, well-documented CLAUDE.md |

**Overall: 5.8/10** - Solid MVP but needs hardening before handling real users at scale.

---

## 9. Critical Issues (Priority)

### RED - Must Fix Immediately
1. **CAPTCHA bypass on login** - Attacker omits `captchaToken` to skip CAPTCHA entirely
2. **IP spoofing bypasses rate limits** - `x-forwarded-for` is client-controlled; all IP-based rate limits are ineffective
3. **Forgot-password has no server-side CAPTCHA** - Enables email flooding

### ORANGE - High Priority
4. **Session ownership not explicitly checked** in chat route (relies solely on RLS)
5. **No error tracking/monitoring** - Flying blind in production
6. **Environment vars don't fail startup** - Missing CAPTCHA key silently disables security
7. **No rate limit on session GET endpoint**
8. **CORS origin trailing slash normalization**

### YELLOW - Nice to Improve
9. **Cache custom prompts and user memory** - Reduces DB load and latency
10. **Add database indexes** for session/message queries
11. **Reduce `maxOutputTokens`** from 3072 to 1536
12. **Add `rehype-sanitize`** to markdown renderer
13. **Lazy-load heavy components** (framer-motion, react-markdown)
14. **Add data retention policy** for old messages and memories
15. **Add CI/CD pipeline** with lint + type-check + security audit
16. **Memoize ChatMessage components** to reduce re-renders

---

## 10. Action Plan

### Phase 1: Critical Security Fixes (Do Now)
1. Make CAPTCHA mandatory on login (`src/app/api/auth/login/route.ts`)
2. Fix IP extraction to use `x-vercel-forwarded-for` (`src/lib/ip.ts`)
3. Add server-side CAPTCHA verification to forgot-password (`src/app/api/auth/forgot-password/route.ts`)
4. Add explicit `user_id` check on session lookup in chat route (`src/app/api/chat/route.ts`)
5. Normalize CORS origin comparison (strip trailing slashes)

### Phase 2: Reliability (This Week)
6. Add error tracking (Sentry free tier)
7. Fail startup on missing critical env vars
8. Add rate limiting to GET `/api/chat/sessions`
9. Add missing database indexes

### Phase 3: Performance (Next Sprint)
10. Cache `getCustomPrompts()` with 5-min TTL
11. Lazy-load MarkdownRenderer and framer-motion
12. Reduce `maxOutputTokens` to 1536
13. Memoize ChatMessage components

### Phase 4: Ops (Later)
14. Set up CI/CD with automated lint + type-check
15. Add health check endpoint
16. Implement data retention policies
17. Add structured logging (pino or similar)

---

*Report generated from static code analysis. Dynamic penetration testing recommended for full coverage.*

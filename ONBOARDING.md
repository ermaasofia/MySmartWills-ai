# SmartWills AI — Intern Onboarding Guide

Welcome. You are taking over the SmartWills AI project. The previous developer has handed over with no overlap, so this document is designed to be **fully self-contained**. Read it from top to bottom before touching any code.

The product is live in production at **https://smartwills.ai**. Anything you break in production affects real users, so develop locally first and only deploy after testing.

### Your role: maintainer

This project is **mostly built**. Your job is not to ship a stream of new features — it's to **keep it running and respond when asked**. Realistically, your day-to-day will look like:

- **Most days:** edit AI prompts in `/admin` (the main lever you have to change product behavior without writing code), respond to small content/copy tweaks, watch for production issues.
- **Sometimes:** the boss asks for something new. When that happens, you need to know the codebase well enough to either ship the change yourself or scope it honestly.
- **Rarely:** activate a dormant country (TW, ID, TH, etc.) if the company decides to expand.

So this guide gets you to two things, in order: (1) **competent at running the live app**, and (2) **familiar enough with the code to handle ad-hoc requests when they come up**.

---

## 1. What you are inheriting

**SmartWills AI** is a chat assistant that gives users country-specific legal guidance about wills and inheritance. The codebase supports 12 Asia-Pacific countries (MY, SG, HK, CN, TW, ID, TH, AU, NZ, BN, VN, PH), but **only 4 are currently active in production**:

- **Savy MY** — Malaysia, conventional (non-Muslim) wills under the Wills Act 1959
- **Savy WasiatKu (`MY_WK`)** — Malaysia, Islamic wills / Faraid / Hibah / Wasiat
- **Savy SG** — Singapore wills
- **Savy HK** — Hong Kong wills

The other 8 countries are dormant placeholders — listed in `SAVY_COUNTRIES` with `isActive: false`. They have hardcoded legal context in the source but no UI exposure yet.

### What "Savy" means

Each active jurisdiction is presented to users as a named persona called a "Savy" (Savy MY, Savy WasiatKu, etc.). Each Savy has its own admin-editable prompts and its own scope. The AI auto-detects when a user's question belongs to a different Savy and emits a `[REDIRECT:CODE]` marker at the end of its response so the frontend can offer to switch. This is why you'll see `MY_WK` treated as a separate country code throughout the code even though it's not in the `COUNTRIES` array — it's a **synthetic code** for the Islamic-will Savy.

A user signs up, picks their Savy, asks questions in plain English, and the AI replies with relevant legal context for that jurisdiction. There is also an admin panel for editing each Savy's behavior.

It is **not** a legal advice platform. The AI explains general legal concepts and points users toward the SmartWills wills-drafting service.

### The main pieces

| Layer | Technology | What it does |
|---|---|---|
| Web app | Next.js 16 (App Router) + React 19 + TypeScript | The website itself — pages, API routes, all in one repo |
| Styling | Tailwind CSS 4 + shadcn/ui | Utility-first CSS + a library of pre-built components |
| Auth | Supabase Auth | Login, signup, Google OAuth, password reset |
| Database | Supabase Postgres + Row Level Security (RLS) | Stores users, chat sessions, messages, AI prompts |
| AI | Vercel AI SDK + Groq | Streams AI responses from Groq's `gpt-oss-120b` model |
| Email | Amazon SES (via Supabase SMTP) | Sends signup confirmation, password reset emails |
| Rate limiting | Upstash Redis | Prevents abuse of API endpoints |
| Hosting | Vercel | Deploys the app, manages the production domain |
| Domain DNS | Cloudflare | DNS records for `smartwills.ai` |
| CAPTCHA | Cloudflare Turnstile | Bot protection on signup |

### What runs where

- **GitHub repo**: `SmartWills/smartwillsai` (private). Push to `main` → Vercel auto-deploys to production.
- **Vercel project**: under the SmartWills team account. Builds run automatically on every push.
- **Supabase project**: hosts the database and auth. Project ref starts with `bngq...`.
- **Cloudflare**: holds DNS for `smartwills.ai` and the Turnstile site.

---

## 2. Before you touch anything — accounts and access

You need login access (or shared credentials) to **all** of these before you can effectively maintain the project. Confirm with whoever is handing over:

- [ ] **GitHub** — invited to the `SmartWills` org, push access to `smartwillsai` repo
- [ ] **Vercel** — invited to the SmartWills team, can view production project + env vars
- [ ] **Supabase** — invited to the project, can read/write SQL and manage auth settings
- [ ] **Cloudflare** — access to manage DNS for `smartwills.ai` and the Turnstile site
- [ ] **Groq Console** — can view/regenerate the API key
- [ ] **Upstash** — can view/regenerate Redis credentials
- [ ] **Google Cloud Console** — can manage the OAuth client used for "Login with Google"
- [ ] **AWS** (held by CTO) — only needed if SES email starts failing; the CTO controls this
- [ ] **`.env.local` file** — get this from the previous developer or recreate from Vercel env vars (see Section 4)

If any of the above is missing, **stop and ask**. Do not try to recreate accounts — the production app already points at specific projects, and creating new ones will break things.

---

## 3. Tools to install on your machine

You are working on Windows. Install in this order:

1. **Node.js 20 LTS** — https://nodejs.org/ (download the LTS installer, click through defaults)
2. **pnpm** — open PowerShell and run:
   ```powershell
   npm install -g pnpm
   ```
   Verify: `pnpm --version` should print a version number.
3. **Git** — https://git-scm.com/download/win (defaults are fine)
4. **VS Code** — https://code.visualstudio.com/ (recommended editor)
   - Install these extensions: **ESLint**, **Tailwind CSS IntelliSense**, **Prettier** (optional)
5. **GitHub CLI** (optional but useful) — https://cli.github.com/ — lets you do `gh pr create` etc.

Verify everything works:
```powershell
node --version    # should print v20.x.x or higher
pnpm --version    # should print 8.x or 9.x
git --version     # should print git version 2.x
```

---

## 4. First-time local setup

### 4.1 Clone the repo

```powershell
cd C:\Users\<YourUsername>\Documents
git clone https://github.com/SmartWills/smartwillsai.git
cd smartwillsai
```

### 4.2 Install dependencies

```powershell
pnpm install
```

This downloads everything in `package.json` into `node_modules/`. Takes 1–3 minutes the first time. If it fails, check your internet connection and that `pnpm` is installed.

### 4.3 Create the `.env.local` file

The repo does **not** include real API keys (they are gitignored). You need to create `.env.local` in the project root with the values from production. Get them by:

1. Logging in to Vercel → SmartWills team → `smartwillsai` project → Settings → Environment Variables
2. Copy each value into a new file at the project root called `.env.local`

The file should look like this (replace `<...>` with the real values from Vercel):

```env
# Supabase (the database + auth)
NEXT_PUBLIC_SUPABASE_URL=<from Vercel>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Vercel>

# AI provider
GROQ_API_KEY=<from Vercel>
GOOGLE_GENERATIVE_AI_API_KEY=<optional fallback, from Vercel>

# App URL — for local dev use localhost
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin allowlist — put your own email here so you can access /admin
ADMIN_EMAILS=your.email@example.com

# Rate limiting (optional — app falls back to in-memory if missing)
UPSTASH_REDIS_REST_URL=<from Vercel>
UPSTASH_REDIS_REST_TOKEN=<from Vercel>

# CAPTCHA on signup
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=<from Vercel>
CLOUDFLARE_TURNSTILE_SECRET_KEY=<from Vercel>
```

**Never commit `.env.local` to git.** It is already in `.gitignore`, but double-check before you push.

### 4.4 Run the dev server

```powershell
pnpm dev
```

Open http://localhost:3000 in your browser. You should see the SmartWills landing page. The dev server hot-reloads automatically when you edit files.

To stop the server: press `Ctrl+C` in the terminal.

### 4.5 Create yourself an admin account locally

1. Go to http://localhost:3000/signup, sign up with your real email
2. Check your inbox for the confirmation email (sent via SES from `noreply@mysmartwills.com`), click the link
3. Open Supabase → SQL Editor and run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your.email@example.com';
   ```
4. Sign out, sign back in. You can now visit http://localhost:3000/admin

---

## 5. How the app is organized

Open the project in VS Code. The important folders are:

```
smartwillsai/
├── src/
│   ├── app/                    ← Pages and API routes (Next.js App Router)
│   │   ├── page.tsx              Landing page (the "/" route)
│   │   ├── layout.tsx            Root layout — fonts, theme, metadata
│   │   ├── globals.css           Tailwind imports + custom CSS
│   │   ├── chat/                 The /chat page (main feature)
│   │   ├── admin/                The /admin dashboard (admin only)
│   │   ├── login/, signup/, ...  Auth pages
│   │   ├── auth/callback/        OAuth + password reset callback
│   │   └── api/                  Backend endpoints
│   │       ├── chat/route.ts       The streaming AI chat endpoint
│   │       ├── chat/sessions/      List/create/delete chat sessions
│   │       ├── auth/               Login, signup, OAuth, forgot-password
│   │       └── admin/ai-prompts/   Admin endpoint to manage AI prompts
│   │
│   ├── components/             ← Reusable React components
│   │   ├── auth/                 Login/signup forms, Turnstile widget
│   │   ├── chat/                 Chat UI: messages, input box, sidebar
│   │   ├── admin/                Admin sidebar, AI prompt editor
│   │   ├── landing/              Landing page sections
│   │   ├── layout/               App-shell layout pieces (headers, footers)
│   │   ├── ui/                   shadcn/ui primitives — DO NOT EDIT MANUALLY
│   │   └── providers/            Theme provider, smooth-scroll provider
│   │
│   ├── lib/                    ← Helper functions and integrations
│   │   ├── supabase/             Supabase client setup (browser + server)
│   │   ├── admin.ts              isAdmin() check used in admin routes
│   │   ├── chat.ts               Database helpers for chat sessions/messages
│   │   ├── memory.ts             Cross-session AI memory extraction
│   │   ├── rate-limit.ts         Rate limiter (Upstash + in-memory fallback)
│   │   ├── constants.ts          COUNTRIES list, prompt types, app name
│   │   └── validation.ts         Input sanitization helpers
│   │
│   ├── hooks/                  ← React hooks (e.g. useChatSessions)
│   ├── types/                  ← Shared TypeScript types
│   ├── proxy.ts                ← Next.js middleware (auth gating) — NOT middleware.ts
│   └── instrumentation.ts      ← Validates env vars at startup
│
├── supabase/
│   └── schema.sql              ← Full database schema. Run this on a fresh Supabase project.
│
├── public/                     ← Static assets (images, icon.png)
├── docs/                       ← Reference docs (DOMAIN_SETUP, EMAIL_SETUP, OAUTH_SETUP, SECURITY_AUDIT)
├── next.config.ts              ← Next.js base config + non-CSP security headers (HSTS, X-Frame-Options, etc.)
├── package.json                ← Dependencies and scripts
├── README.md                   ← Short project summary (intentionally lightweight)
├── CLAUDE.md                   ← Detailed architecture notes — READ THIS NEXT
└── ONBOARDING.md               ← This file
```

> **Important quirk:** Next.js middleware lives at `src/proxy.ts` (not the conventional `middleware.ts`). It exports a `proxy()` function. This is intentional — do not rename it.

---

## 6. The mental model — how a user message flows through the system

Understanding this end-to-end is the most important thing. Trace it once in the code:

```
User types a message in the chat UI
        │
        ▼
  src/components/chat/chat-interface.tsx
  (sends fetch request to /api/chat with messages + country code)
        │
        ▼
  src/app/api/chat/route.ts
  ┌────────────────────────────────────────────────────────┐
  │ 1. Check origin (security)                             │
  │ 2. Verify user is authenticated (via Supabase cookie)  │
  │ 3. Apply rate limit (20 req/60s per user)              │
  │ 4. Sanitize input (max 8 messages, 1500 chars each)    │
  │ 5. Build the system prompt:                            │
  │    - Hardcoded country legal context (COUNTRY_CONTEXTS)│
  │    - Admin-edited prompts from `ai_prompts` table      │
  │    - User's long-term memory (from `user_memories`)    │
  │ 6. Call Groq (`gpt-oss-120b`) and stream the response  │
  │ 7. Save user + assistant messages to Supabase          │
  │ 8. In the background, extract new memory facts using   │
  │    a smaller, cheaper model (`llama-3.1-8b-instant`)   │
  └────────────────────────────────────────────────────────┘
        │
        ▼
  Streaming response goes back to the browser, rendered
  word-by-word as markdown in the chat window.
```

**Why two AI models?** Groq's free tier has a limit of 8,000 tokens per minute on the big model. Memory extraction is a background task — using the small model for it keeps the big model's quota free for actual chat replies.

**Why so much sanitization?** The AI is exposed to anything the user types. Caps on length and message count prevent abuse and runaway token costs.

---

## 7. The database — what tables exist and why

Open `supabase/schema.sql` to see the full definitions. Quick summary:

| Table | Purpose |
|---|---|
| `profiles` | One row per user. Auto-created by trigger on `auth.users` insert. Has `role` ('user' or 'admin'). |
| `chat_sessions` | One row per conversation. Has `country_code` and `title`. |
| `chat_messages` | The actual messages. Each links to a session. Has `role` ('user', 'assistant', or 'system'). |
| `ai_prompts` | Admin-editable AI behavior settings, keyed by (`country_code`, `prompt_type`). Includes the synthetic `MY_WK` code. |
| `user_memories` | Long-term facts about a user (extracted by AI) in JSONB. One row per user. |
| `conversation_summaries` | Rolling summaries per session, used to keep context manageable. One row per session. |
| `admin_audit_logs` | Records admin actions (who did what, when, with what details). Insert-only — admins log their own actions. |

**Row Level Security (RLS) is enabled on every table.** This means even if the API has a bug, users can only see their own data — Postgres enforces it. The `is_admin()` Postgres function (defined in `schema.sql`) is what RLS checks for admin-only access.

**Never use a service role key in client code.** All queries go through the user's session and RLS. If you need to bypass RLS for some legitimate admin task, do it inside a server-side API route with proper checks first.

---

## 8. Authentication flow

Three auth flows exist:

1. **Email + password signup**: User submits the form → Cloudflare Turnstile validates the CAPTCHA → `/api/auth/signup` creates the user in Supabase → confirmation email sent via SES → user clicks link → `/auth/callback` exchanges the code for a session → user is logged in.
2. **Google OAuth**: User clicks "Login with Google" → `/api/auth/oauth` generates a PKCE URL → user authenticates with Google → Google redirects to Supabase → Supabase redirects to `/auth/callback` → session set → user lands on `/chat`.
3. **Password reset**: User submits email at `/forgot-password` → `/api/auth/forgot-password` triggers Supabase reset email → user clicks link → `/auth/callback?next=/reset-password` → user sets new password.

Sessions are stored in HTTP-only cookies via `@supabase/ssr`. The middleware at `src/proxy.ts` refreshes these cookies on every request and redirects unauthenticated users away from `/chat` and `/admin`.

---

## 9. The admin panel

Admins can edit how the AI behaves per Savy. There are 5 prompt types per Savy:

- **character** — personality and tone
- **sop** — standard operating procedure / step-by-step guidance
- **company_info** — about SmartWills (services offered, pricing, etc.)
- **services** — specific services to recommend
- **other** — anything that doesn't fit the above

Three layers of protection on `/admin`:

1. **Middleware** (`src/proxy.ts` → `src/lib/supabase/middleware.ts`) — blocks unauthenticated users, and re-checks admin role for `/admin/*` paths
2. **Layout** (`src/app/admin/layout.tsx`) — calls `isAdmin()`, redirects non-admins
3. **API route** (`src/app/api/admin/ai-prompts/route.ts`) — calls `isAdmin()` again before any write
4. **Database** — RLS policies use the `is_admin()` Postgres function as the final gate

Belt **and** braces — never assume one layer is enough.

### How admin status is determined (important)

The `isAdmin()` helper in `src/lib/admin.ts` works in two modes:

1. **Normal mode** (the default once production is set up): admin status is read **only** from the `profiles.role` column. The `ADMIN_EMAILS` env var is ignored.
2. **Bootstrap mode** (only when zero admin rows exist in `profiles`): the `ADMIN_EMAILS` env var (comma-separated emails) is honored as a fallback so the first admin can promote themselves.

The moment any admin row exists in `profiles`, bootstrap mode is permanently disabled for the running Node process (it's cached in memory). To re-enable bootstrap mode you would have to delete every admin row **and** restart the server. In practice this means: **`ADMIN_EMAILS` only matters on a fresh deployment**. Once you've promoted yourself once via SQL, only the database controls admin access.

### Prompt length cap

The combined length of all prompts per Savy is capped at **6,000 characters** (~1,500 tokens). This is because the Groq free tier limits us to 8,000 tokens per minute, and the reasoning model also burns tokens for internal thinking. If you exceed the cap, the system auto-truncates with a `[...truncated for token limit]` marker.

---

## 10. Common tasks you will do

Ordered by how often you'll actually do them.

### Daily / weekly

#### Edit an AI prompt for a Savy (most common task)
The admin panel at `/admin/ai-instructions` is the main way to change how the AI behaves — **no code changes needed, no deployment needed.** Pick the Savy (MY, MY_WK, SG, HK, or any of the dormant ones), pick the prompt type (character / sop / company_info / services / other), edit, save. Changes take effect on the next chat message.

This is the single most important UI in the project. Master it. When the boss says "the AI should mention X" or "the AI keeps saying Y, make it stop" — this is where you fix it.

Remember the **6,000-char cap per Savy** (sum of all prompt types). Going over auto-truncates.

#### Look at production logs
Vercel dashboard → `smartwillsai` project → Logs tab. Filter by route (e.g. `/api/chat`) to see errors. Check this whenever a user reports something weird.

#### Promote a user to admin
```sql
-- In Supabase SQL Editor (Production project)
UPDATE public.profiles SET role = 'admin' WHERE email = 'someone@example.com';
```
Have the person sign out and back in for the change to take effect.

#### Look at users / chats in the database
Supabase dashboard → Table Editor. You can browse `profiles`, `chat_sessions`, `chat_messages` directly. Useful for debugging a specific user's issue (RLS is bypassed for the Supabase dashboard admin view).

---

### Occasional — when something needs a code change

#### Run the dev server
```powershell
pnpm dev
```

#### Check for TypeScript and lint errors before pushing
```powershell
pnpm build       # full production build, catches type errors
pnpm lint        # ESLint
```
Always run `pnpm build` before pushing — Vercel will fail the deploy if there are type errors, and rolling back is annoying.

#### Deploy a change to production
```powershell
git add <files>
git commit -m "your message"
git push
```
Vercel auto-deploys when you push to `main`. Watch the deploy log in the Vercel dashboard. If the build fails, the previous version stays live — fix the error, push again. **There is no staging environment — `main` IS production.**

#### Fix a typo or small content change
Edit the relevant `.tsx` file under `src/`, run `pnpm dev` to verify, commit, push. This is the simplest possible workflow and the one you'll use most often for code changes.

---

### Rare — only when the boss asks for something bigger

#### Activate a dormant country / add a new Savy
The 8 non-active countries already exist in the codebase. To "turn one on":
1. Edit `SAVY_COUNTRIES` in `src/lib/constants.ts` — set `isActive: true` and add a `video: '/savy-XX.mp4'` path
2. Add the video file to `public/`
3. The legal context in `COUNTRY_CONTEXTS` (`src/app/api/chat/route.ts`) already exists — review it for accuracy
4. Use `/admin/ai-instructions` to fill in the prompts (character, sop, etc.) for that country
5. Test end-to-end before pushing

#### Add a brand new country (not one of the existing 12)
1. Edit `src/lib/constants.ts` — add to the `COUNTRIES` array
2. Edit `src/app/api/chat/route.ts` — add a `COUNTRY_CONTEXTS` entry with the legal context
3. Add to `AI_INSTRUCTION_COUNTRIES` and `SAVY_COUNTRIES` arrays
4. Use `/admin/ai-instructions` to configure the prompts

#### Add a new shadcn/ui component
```powershell
pnpm dlx shadcn@latest add <component-name>
```
Do **not** hand-edit files in `src/components/ui/` — they are managed by the shadcn CLI.

#### Add a new external service (API, font, CDN)
You **must** update the Content Security Policy (CSP) in `src/lib/supabase/middleware.ts` (the `buildCsp()` function), otherwise the browser will silently block the request. CSP is set per-request from middleware with a nonce — **not** in `next.config.ts` (a comment in `next.config.ts` reminds you of this). This catches everyone out at least once.

The directives that usually need updating:
- **`connect-src`** — for new APIs you fetch from (e.g. a new Supabase project, a new analytics endpoint)
- **`img-src`** — for image CDNs
- **`script-src`** — for third-party scripts (e.g. another CAPTCHA provider)
- **`frame-src`** — for embedded iframes

---

## 11. Things that will trip you up

These are the issues the previous developer hit. Read them so you don't repeat them.

| Symptom | Likely cause | Fix |
|---|---|---|
| Browser console shows "Refused to connect to ... because it violates CSP" | You added a new external service but didn't update CSP | Edit the `buildCsp()` function in `src/lib/supabase/middleware.ts` (NOT `next.config.ts` — CSP moved to per-request middleware in commit `0a3158b`) |
| Auth redirect loop or "redirect_uri_mismatch" | Supabase's Site URL or Redirect URLs don't include your dev URL | In Supabase → Authentication → URL Configuration, ensure `http://localhost:3000/**` is in the allowlist |
| Google OAuth fails with "redirect_uri_mismatch" | Google Cloud OAuth client doesn't list the Supabase callback | Add `https://<supabase-ref>.supabase.co/auth/v1/callback` to the Google OAuth client |
| Signup email never arrives | SES is in sandbox mode, or the email is in spam | Check AWS SES is in production mode (CTO holds AWS access) |
| Chat returns "rate limit exceeded" while testing | Hit the per-user 20 req/60s limit | Wait 60 seconds, or temporarily comment out the rate limit in `src/app/api/chat/route.ts` |
| AI response cuts off or errors with "TPM exceeded" | Combined prompts are too long | Trim the admin prompts in `/admin/ai-instructions` (cap is 6,000 chars per country) |
| Landing page scroll feels broken or jittery | Someone removed the Lenis CSS rule | In `src/app/globals.css`, ensure `html.lenis body { height: auto }` is still there |
| `/chat` or `/admin` page has a double scrollbar | An app-shell layout lost its overflow lock | Check the layout adds `overflow-locked` class to `<html>` and `<body>` in a `useEffect` |
| `pnpm build` fails with type errors but `pnpm dev` works | The dev server is more lenient than the build | Read the error, fix the type — never push without a clean build |
| Supabase queries return empty for a logged-in user | RLS policy is blocking | Check the policy in `supabase/schema.sql`, test in SQL Editor with `set role authenticated; set request.jwt.claims = ...` |

---

## 12. Things you should NOT do

- **Do not** commit `.env.local` or any file containing API keys.
- **Do not** edit files in `src/components/ui/` directly. Use the shadcn CLI.
- **Do not** use the Supabase service role key in any code that runs in the browser.
- **Do not** push directly to `main` without testing locally first. There is no staging environment — `main` IS production.
- **Do not** rename `src/proxy.ts` to `middleware.ts`. The custom name is intentional.
- **Do not** create a new Supabase, Vercel, or GitHub project. The production app is already wired to specific instances. If something is wrong, fix the existing instance.
- **Do not** disable RLS on any table to "make a query work". RLS is the security boundary — fix the policy instead.

---

## 13. Where to learn the technologies

If a topic below is unfamiliar, spend an hour or two on the official docs before trying to change related code. Listed in priority order:

1. **Next.js App Router** — https://nextjs.org/docs/app — learn the difference between Server Components and Client Components, and how API routes work
2. **TypeScript basics** — https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
3. **Supabase Auth + RLS** — https://supabase.com/docs/guides/auth and https://supabase.com/docs/guides/database/postgres/row-level-security
4. **Tailwind CSS** — https://tailwindcss.com/docs — utility classes and the design system
5. **shadcn/ui** — https://ui.shadcn.com/docs — how the component system works
6. **Vercel AI SDK** — https://sdk.vercel.ai/docs — `streamText`, message format, tool calls
7. **React 19** — https://react.dev — especially hooks (`useState`, `useEffect`, `useRef`)

After this guide, **read `CLAUDE.md`** — it has more architectural detail.

---

## 14. Asking for help

You will get stuck. That is normal. When you do:

1. **First**, read the relevant code. The codebase is small — most answers are in `src/`.
2. **Second**, search the official docs for the technology that's giving you trouble.
3. **Third**, paste the error into Claude Code or ChatGPT with the relevant file open. Be specific about what you tried.
4. **Fourth**, if it's a production-blocking issue, contact the previous developer or whoever introduced you to the project.

Do **not** silently work around problems by disabling features (rate limits, RLS, CSP). If you have to disable something to make progress, that's a sign you're going down the wrong path — ask first.

---

## 15. First-week checklist

Goal for week 1: be able to operate the live app confidently. Goal for week 2: be familiar enough with the code that if the boss asks "can you change X", you can answer honestly with "yes, here's roughly how" or "no, here's why it's harder than it sounds."

### Day 1 — Get in
- [ ] Get all the accounts in Section 2. Don't skip — without these you can't do anything.
- [ ] Install the tools in Section 3.
- [ ] Get the dev server running locally (Section 4). See `localhost:3000` load.
- [ ] Read this whole document end to end.

### Day 2 — Master the admin panel (this is your daily tool)
- [ ] Promote yourself to admin via SQL (Section 4.5).
- [ ] Open `/admin` locally. Visit every page. Understand what each one shows.
- [ ] Go to `/admin/ai-instructions`. Pick **Savy MY**. Edit the `character` prompt to add one harmless line (e.g. "Always end responses with a friendly note.").
- [ ] Open `/chat`, pick Malaysia, ask a question. **Confirm the change shows up.**
- [ ] Revert the change. Re-test. You now understand the loop that controls 90% of the product's behavior.
- [ ] Do the same for Savy WasiatKu (`MY_WK`), Savy SG, Savy HK. Notice how each is independent.

### Day 3 — Understand the codebase enough to debug
- [ ] Read `CLAUDE.md` end to end. It has architectural detail this doc skips.
- [ ] Open `src/app/api/chat/route.ts` and trace a message from request to response. Put `console.log` lines if it helps.
- [ ] Read every file in `src/lib/` (small files, none long). These are the helpers used everywhere.
- [ ] Read `supabase/schema.sql` end to end. Then open the Supabase Table Editor and look at real production rows — see how a real `chat_sessions` row looks, click into its messages.

### Day 4 — Practice the things you'll need in an emergency
- [ ] Open the Vercel dashboard → Logs tab. Filter by `/api/chat`. Get used to where errors show up.
- [ ] Open Supabase → Logs → Auth logs. Get used to where signup / login errors show up.
- [ ] Make one tiny, harmless change (fix a typo somewhere on the landing page). Commit, push, watch it auto-deploy on Vercel. **This proves your write-access works end to end before you ever need it under pressure.**
- [ ] Read `docs/EMAIL_SETUP.md` and `docs/DOMAIN_SETUP.md`. You don't need to memorise — just know they exist and what's in them.

### Day 5 — Stress-test your understanding
- [ ] Pretend a user complains: "the AI keeps recommending wrong services for Singapore." Walk through how you'd diagnose it — which logs you'd check, which prompt you'd edit, how you'd verify the fix.
- [ ] Pretend the boss asks: "can we make the AI respond in Bahasa Malaysia by default for MY users?" Don't actually implement it — just identify where in the code that change would live. (Hint: it's a prompt change in `/admin/ai-instructions`, no code needed.)
- [ ] Pretend signup emails stop arriving. Walk through `docs/EMAIL_SETUP.md` troubleshooting table — which logs you'd check, who you'd contact.

If you can do all of Day 5 confidently, you are ready to maintain this project. Anything else you need will come up situationally — and now you know the shape of the codebase well enough to find the answer when it does.

Good luck. The codebase is small and well-organized — you can absolutely own this.

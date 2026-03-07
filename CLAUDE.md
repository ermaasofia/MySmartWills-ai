# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI SmartWills — an intelligent will planning assistant providing country-specific legal guidance for 12 Asia-Pacific countries (MY, SG, HK, CN, TW, ID, TH, AU, NZ, BN, VN, PH). Live at `https://aismartwills.me`.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server on http://localhost:3000
pnpm build            # Production build (includes type checking)
pnpm start            # Run production server
pnpm lint             # ESLint (flat config, ESLint 9)
```

No test framework is configured.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style) + Framer Motion
- **Auth:** Supabase Auth (email/password + Google OAuth), middleware-protected routes
- **Database:** Supabase PostgreSQL with Row Level Security, pgvector for embeddings
- **AI:** Vercel AI SDK v6 with Groq (primary, gpt-oss-120b model) , streaming responses
- **Rate Limiting:** Upstash Redis (distributed) with in-memory fallback
- **CAPTCHA:** Cloudflare Turnstile on signup
- **Package Manager:** pnpm

## Architecture

### Path alias
`@/*` maps to `./src/*`

### App Router structure (`src/app/`)
- `/` — Landing page
- `/chat` — Protected chat interface (main feature)
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — Auth pages
- `/api/chat/route.ts` — Streaming chat endpoint (auth + rate limit + Groq LLM)
- `/api/chat/sessions/` — Session CRUD (GET/POST, DELETE by ID)
- `/api/auth/oauth/route.ts` — Google OAuth URL generation (rate limited)
- `/api/auth/verify-turnstile/` — CAPTCHA verification
- `/auth/callback/route.ts` — OAuth callback handler

### Key modules
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client (cookie-based SSR)
- `src/lib/supabase/middleware.ts` — Auth session refresh middleware
- `src/lib/chat.ts` — Chat session & message database helpers
- `src/lib/rate-limit.ts` — Upstash + in-memory fallback rate limiter
- `src/lib/constants.ts` — `COUNTRIES` array and `APP_NAME`
- `src/types/index.ts` — Shared TypeScript interfaces

### Chat flow
1. Client (`chat-interface.tsx`) sends message via fetch to `/api/chat/route.ts`
2. Server validates auth, rate limits (20 req/60s per user), sanitizes input
3. Country-specific legal context injected into system prompt (`COUNTRY_CONTEXTS` in route.ts)
4. Groq LLM streams response via Vercel AI SDK
5. Messages saved to Supabase; session ID returned via `X-Session-Id` header
6. Client renders streaming markdown response

### Auth flow
- Middleware (`src/middleware.ts`) protects `/chat`; unauthenticated users → `/login`
- Google OAuth: `/api/auth/oauth` generates PKCE URL → Google → `/auth/callback` → session cookie → `/chat`
- Session stored in HTTP-only cookies via `@supabase/ssr`

### Component organization
- `src/components/auth/` — Login, signup, OAuth, password reset, Turnstile
- `src/components/chat/` — Chat interface, sidebar, messages, country selector
- `src/components/ui/` — shadcn/ui primitives (do not edit manually, use `npx shadcn@latest add`)
- `src/components/providers/theme-provider.tsx` — next-themes wrapper
- `src/hooks/use-chat-sessions.ts` — Session list state management hook

## Database Schema (Supabase)

Schema defined in `supabase/schema.sql`. All tables have RLS policies.

- **profiles** — User profiles (auto-created via trigger on signup)
- **chat_sessions** — Conversations with country_code and title
- **chat_messages** — Messages (role: user/assistant/system) within sessions
- **documents** — Knowledge base with pgvector embeddings (384-dim, for future RAG)

## Environment Variables

See `.env.local` for the full template. Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `GROQ_API_KEY` — Primary AI provider (required)
- `GOOGLE_GENERATIVE_AI_API_KEY` — Fallback AI provider (optional)
- `NEXT_PUBLIC_APP_URL` — Production URL for OAuth callbacks
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Rate limiting (optional, falls back to in-memory)
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` / `CLOUDFLARE_TURNSTILE_SECRET_KEY` — CAPTCHA

## Security Notes

- Security headers configured in `next.config.ts` (CSP, HSTS, X-Frame-Options)
- Origin validation on chat API endpoint
- Rate limiting: chat (20/60s per user), OAuth (10/10min per IP)
- Input sanitization: message length caps, control character removal
- All database access goes through RLS — never bypass with service role key in client code

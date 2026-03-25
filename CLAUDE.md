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
- **AI:** Vercel AI SDK v6 with Groq (primary, gpt-oss-120b model), streaming responses
- **Rate Limiting:** Upstash Redis (distributed) with in-memory fallback
- **CAPTCHA:** Cloudflare Turnstile on signup
- **Package Manager:** pnpm

## Architecture

### Path alias
`@/*` maps to `./src/*`

### App Router structure (`src/app/`)
- `/` — Landing page
- `/chat` — Protected chat interface (main feature)
- `/admin` — Protected admin dashboard (admin role required)
- `/admin/ai-instructions` — AI prompt configuration
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — Auth pages
- `/api/chat/route.ts` — Streaming chat endpoint (auth + rate limit + Groq LLM)
- `/api/chat/sessions/` — Session CRUD (GET/POST, DELETE by ID)
- `/api/admin/ai-prompts/route.ts` — AI prompt management (admin only, GET/PUT/POST)
- `/api/auth/login/route.ts` — Email/password login (rate limited: 5/5min per IP, generic errors to prevent enumeration)
- `/api/auth/oauth/route.ts` — Google OAuth URL generation (rate limited)
- `/api/auth/verify-turnstile/` — CAPTCHA verification
- `/auth/callback/route.ts` — OAuth + password reset callback handler (PKCE code exchange)

### Key modules
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client (cookie-based SSR)
- `src/lib/supabase/middleware.ts` — Auth session refresh + route protection
- `src/lib/admin.ts` — `isAdmin()` helper: checks `profiles.role` column, falls back to `ADMIN_EMAILS` env var
- `src/lib/chat.ts` — Chat session & message database helpers
- `src/lib/memory.ts` — AI memory system (cross-session fact extraction and retrieval)
- `src/lib/rate-limit.ts` — Upstash + in-memory fallback rate limiter
- `src/lib/constants.ts` — `COUNTRIES` array and `APP_NAME`
- `src/types/index.ts` — Shared TypeScript interfaces

### Chat flow
1. Client (`chat-interface.tsx`) sends message via fetch to `/api/chat/route.ts`
2. Server validates auth, rate limits (20 req/60s per user), sanitizes input
3. Country-specific legal context injected into system prompt (`COUNTRY_CONTEXTS` in route.ts)
4. Admin-configured prompts (character, SOP, company info, services) loaded from `ai_prompts` table
5. Groq LLM streams response via Vercel AI SDK
6. Messages saved to Supabase; session ID returned via `X-Session-Id` header
7. Client renders streaming markdown response

### Auth flow
- Middleware (`src/lib/supabase/middleware.ts`) protects `/chat` and `/admin`; unauthenticated users → `/login`
- Google OAuth: `/api/auth/oauth` generates PKCE URL → Google → `/auth/callback` → session cookie → `/chat`
- Password reset: `/forgot-password` → email with link → `/auth/callback?next=/reset-password` → code exchange → `/reset-password`
- Session stored in HTTP-only cookies via `@supabase/ssr`

### Admin panel
- Protected by 3 layers: middleware (auth gate), layout `isAdmin()` check, API route `isAdmin()` check
- `src/app/admin/layout.tsx` — Server component: calls `isAdmin()`, redirects non-admins to `/chat`
- `src/components/admin/admin-shell.tsx` — Client wrapper managing sidebar state
- `src/components/admin/admin-sidebar.tsx` — Navigation sidebar (follows same pattern as `chat-sidebar.tsx`)
- Admin role determined by `profiles.role` column OR `ADMIN_EMAILS` env var (comma-separated fallback)
- RLS enforced via `public.is_admin()` Postgres function

### Scroll management
- **Landing page** uses Lenis smooth scroll (`src/components/providers/lenis-provider.tsx`), activated only on `/` via pathname check
- **Chat & Admin** use app-shell layouts (`h-screen overflow-hidden` root + `overflow-y-auto` on `<main>`). Both shells add `overflow-locked` class to `<html>` and `<body>` via `useEffect` to prevent double-scroll
- **Auth/legal pages** use standard body scroll (`min-h-screen` wrappers)
- Lenis CSS in `globals.css` sets `html.lenis body { height: auto }` — do not remove, it's needed for the landing page scroll

### Component organization
- `src/components/auth/` — Login, signup, OAuth, password reset, Turnstile
- `src/components/chat/` — Chat interface, sidebar, messages, country selector
- `src/components/admin/` — Admin shell, sidebar, header, AI instructions form
- `src/components/ui/` — shadcn/ui primitives (do not edit manually, use `pnpm dlx shadcn@latest add`)
- `src/components/providers/theme-provider.tsx` — next-themes wrapper
- `src/components/providers/lenis-provider.tsx` — Smooth scroll (landing page only)
- `src/hooks/use-chat-sessions.ts` — Session list state management hook

## Database Schema (Supabase)

Schema defined in `supabase/schema.sql`. All tables have RLS policies.

- **profiles** — User profiles with `role` field (`'user'` | `'admin'`), auto-created via trigger on signup
- **chat_sessions** — Conversations with country_code and title
- **chat_messages** — Messages (role: user/assistant/system) within sessions
- **ai_prompts** — Admin-configurable AI behavior (character, sop, company_info, services, other). Admins write via `is_admin()` RLS function
- **user_memories** — Cross-session persistent facts (JSONB), per user
- **conversation_summaries** — Rolling per-session summaries for context management
- **documents** — Knowledge base with pgvector embeddings (384-dim, for future RAG)

## Environment Variables

See `.env.local` for the full template. Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `GROQ_API_KEY` — Primary AI provider (required)
- `GOOGLE_GENERATIVE_AI_API_KEY` — Fallback AI provider (optional)
- `NEXT_PUBLIC_APP_URL` — Production URL for OAuth callbacks
- `ADMIN_EMAILS` — Comma-separated admin email allowlist (fallback when `profiles.role` not set)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Rate limiting (optional, falls back to in-memory)
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` / `CLOUDFLARE_TURNSTILE_SECRET_KEY` — CAPTCHA

## Security Notes

- Security headers configured in `next.config.ts` (CSP, HSTS, X-Frame-Options)
- Origin validation on chat API endpoint
- Rate limiting: chat (20/60s per user), login (5/5min per IP), OAuth (10/10min per IP)
- Input sanitization: message length caps, control character removal
- All database access goes through RLS — never bypass with service role key in client code
- Admin routes protected at middleware, layout, and API levels; RLS enforces via `public.is_admin()`

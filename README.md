# AI SmartWills

Country-specific AI chat assistant for will planning and inheritance guidance across Asia-Pacific.

Live at **https://smartwills.ai**.

## What it does

Users sign up, pick their jurisdiction, and ask questions about wills in plain language. The AI responds with relevant legal context for that country and points them toward the SmartWills wills-drafting service.

The product is organized around **Savys** — country-specific AI personas, each with their own admin-editable behavior.

### Active Savys

| Savy | Code | Scope |
|---|---|---|
| Savy MY | `MY` | Malaysia — conventional (non-Muslim) wills |
| Savy WasiatKu | `MY_WK` | Malaysia — Islamic wills (Faraid, Hibah, Wasiat) |
| Savy SG | `SG` | Singapore wills |
| Savy HK | `HK` | Hong Kong wills |

8 more countries (`CN`, `TW`, `ID`, `TH`, `AU`, `NZ`, `BN`, `VN`, `PH`) are wired up in code as dormant placeholders — ready to activate when the company expands.

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui + Framer Motion
- **Auth + Database:** Supabase (Postgres with RLS)
- **AI:** Vercel AI SDK + Groq (`gpt-oss-120b` for chat, `llama-3.1-8b-instant` for background memory extraction)
- **Email:** Amazon SES (via Supabase SMTP)
- **Rate limiting:** Upstash Redis
- **CAPTCHA:** Cloudflare Turnstile
- **Hosting:** Vercel (auto-deploy from `main`)

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

You'll need a `.env.local` with credentials (Supabase, Groq, Upstash, Turnstile). Pull the values from the Vercel project's environment variables.

## Documentation

- **[ONBOARDING.md](./ONBOARDING.md)** — full intern onboarding guide. **Start here.**
- **[CLAUDE.md](./CLAUDE.md)** — detailed architecture notes for AI coding assistants and humans alike.
- **[docs/DOMAIN_SETUP.md](./docs/DOMAIN_SETUP.md)** — DNS, hosting, infrastructure reference.
- **[docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)** — SES + Supabase SMTP setup and email templates.
- **[docs/OAUTH_SETUP.md](./docs/OAUTH_SETUP.md)** — Google OAuth configuration.
- **[docs/SECURITY_AUDIT.md](./docs/SECURITY_AUDIT.md)** — Production security review (2026-04-01).

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build (also runs type-check)
pnpm start        # Run production build locally
pnpm lint         # ESLint
```

No test framework is configured.

## License

Private — all rights reserved.

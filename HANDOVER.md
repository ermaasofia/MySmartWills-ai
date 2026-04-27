# SmartWills AI — Handover Guide

Migration steps untuk intern baru take over project ni. Domain `smartwills.ai` kekal, tapi semua infrastructure (GitHub, Supabase, Vercel, API keys) akan ditukar fresh. Database start kosong (no data migration).

**Tech stack:** Next.js 16 + React 19 + Tailwind 4 + Supabase + Groq AI. Package manager: `pnpm`.

---

## Phase 0 — Sebelum mula (Omar / current owner)

- [ ] Confirm CTO sedia bagi AWS IAM credentials untuk SES (region `ap-southeast-1`, sender `noreply@mysmartwills.com`). Minta access key + secret key dengan policy `AmazonSESFullAccess` atau minimum SMTP send permission.
- [ ] Decide siapa pegang Cloudflare DNS untuk `smartwills.ai` lepas handover — kalau intern, transfer Cloudflare account access. Kalau Omar kekal pegang, intern hanya perlu bagi Vercel domain target untuk Omar update DNS records.
- [ ] Confirm intern punya email untuk:
  - GitHub account
  - Supabase account
  - Vercel account
  - Google Cloud Console (untuk OAuth)
  - Cloudflare account (untuk Turnstile + DNS kalau applicable)
  - Groq account
  - Upstash account
- [ ] Backup `.env.local` sekarang sebagai reference (jangan share ke intern — semua keys baru).

---

## Phase 1 — GitHub repo baru

1. Intern create new **private** repo (e.g. `smartwills-ai`) dalam GitHub akaun dia.
2. Dari local clone existing:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/<intern-username>/smartwills-ai.git
   git push -u origin main
   ```
3. Confirm `.gitignore` cover `.env*` (dah confirmed di repo ni — `.env.local` tak akan push).
4. Intern verify push successful, semua files masuk kecuali `node_modules/` dan `.env.local`.

---

## Phase 2 — Supabase project baru

1. Sign up / login Supabase, create new project (region: **Southeast Asia — Singapore** untuk latency rendah).
2. Save **Project URL** + **anon key** dari Settings → API.
3. Buka **SQL Editor**, run keseluruhan content `supabase/schema.sql`. Ni akan create:
   - `profiles`, `chat_sessions`, `chat_messages`, `documents`, `ai_prompts`
   - `user_memories`, `conversation_summaries`, `admin_audit_logs`
   - RLS policies, triggers, `is_admin()` function, `match_documents()` function
   - pgvector extension untuk RAG
4. **Enable Google OAuth provider:**
   - Authentication → Providers → Google → Enable
   - Tinggalkan Client ID/Secret dulu (isi dalam Phase 4)
5. **Configure SMTP (Amazon SES):**
   - SMTP credentials dah exist dalam **old Supabase project** — buka old project → Authentication → Settings → SMTP Settings, copy semua values, paste ke new project SMTP settings.
   - Yang akan dicopy:
     - Host: `email-smtp.ap-southeast-1.amazonaws.com`
     - Port: `587`
     - Username (SES SMTP username)
     - Password (SES SMTP password) — **password tak visible dalam Supabase, kena minta CTO bagi balik atau regenerate dari AWS Console → SES → SMTP Settings**
     - Sender email: `noreply@mysmartwills.com`
     - Sender name: `SmartWills AI`
   - Enable "Custom SMTP" toggle, save.
6. **Configure auth email templates** (Authentication → Email Templates):
   - Confirm signup, magic link, reset password — set redirect URL ke `https://smartwills.ai/auth/callback`
7. **Configure URL settings** (Authentication → URL Configuration):
   - Site URL: `https://smartwills.ai`
   - Redirect URLs: `https://smartwills.ai/**`, `http://localhost:3000/**`

---

## Phase 3 — Service-service lain (API keys baru)

| Service | Action |
|---|---|
| **Groq** | Sign up [console.groq.com](https://console.groq.com), create API key. Free tier cukup untuk dev. |
| **Upstash Redis** | Create new Redis database (region: Singapore). Copy `REST URL` + `REST TOKEN` dari REST API tab. |
| **Cloudflare Turnstile** | Cloudflare dashboard → Turnstile → Add site. Domain: `smartwills.ai` (+ `localhost` untuk dev). Copy site key + secret key. |
| **Google OAuth** | [Google Cloud Console](https://console.cloud.google.com) → new project → OAuth consent screen (External, app name "SmartWills AI") → Credentials → OAuth Client ID (Web application). Authorized redirect URI: `https://<NEW-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback`. Copy Client ID + Secret, paste balik ke Supabase Authentication → Providers → Google. |

---

## Phase 4 — Vercel deployment

1. Sign up / login Vercel, **Import Git Repository** → pilih repo GitHub baru.
2. Framework: Next.js (auto-detect). Build command: `pnpm build`. Output: default.
3. **Environment Variables** — paste semua ni:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<dari Phase 2>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<dari Phase 2>
   GROQ_API_KEY=<dari Phase 3>
   NEXT_PUBLIC_APP_URL=https://smartwills.ai
   UPSTASH_REDIS_REST_URL=<dari Phase 3>
   UPSTASH_REDIS_REST_TOKEN=<dari Phase 3>
   NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=<dari Phase 3>
   CLOUDFLARE_TURNSTILE_SECRET_KEY=<dari Phase 3>
   ADMIN_EMAILS=<email intern>
   ```
4. Deploy. Tunggu build pass.
5. **Custom domain:**
   - Project Settings → Domains → Add `smartwills.ai`
   - Vercel akan bagi DNS records (A / CNAME). Update di Cloudflare DNS:
     - `A` record: `@` → `76.76.21.21` (atau apa Vercel suggest)
     - `CNAME`: `www` → `cname.vercel-dns.com`
   - **Penting:** Set Cloudflare proxy mode ke **DNS only** (grey cloud) untuk records ni — kalau orange cloud, Vercel SSL akan conflict.
6. Tunggu DNS propagate (5–30 min), confirm `https://smartwills.ai` load.

---

## Phase 5 — Bootstrap admin

Selepas intern login pertama kali via `https://smartwills.ai/signup`:

1. Buka Supabase SQL Editor, run:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = '<email-intern>';
   ```
2. Sign out & sign in balik. Check `/admin` accessible.
3. Test create AI prompt untuk Malaysia (`MY`) di `/admin/ai-instructions` — confirm save success.

---

## Phase 6 — End-to-end smoke test

- [ ] Signup pakai email baru → terima confirmation email dari `noreply@mysmartwills.com` (confirms SES kerja)
- [ ] Login pakai email/password → masuk `/chat`
- [ ] Login pakai Google OAuth → masuk `/chat`
- [ ] Forgot password → terima reset email → set new password → login
- [ ] Hantar mesej dalam chat → AI response stream properly
- [ ] Check Turnstile CAPTCHA tunjuk dekat signup page
- [ ] `/admin` accessible untuk admin, redirect untuk user biasa
- [ ] Browser console takda CSP errors (kalau ada, check `next.config.ts`)

---

## Phase 7 — Cleanup (Omar)

Lepas intern confirm semua jalan:

- [ ] Revoke / delete old API keys:
  - Old Groq key (`gsk_BciYP...`)
  - Old Upstash database (`romantic-wasp-39767`)
  - Old Turnstile site (`0x4AAAAAAC8rSO1gGuUWaeEH`)
  - Old Supabase project (`qkhlsbgycewpidtacmzg`) — **pause dulu** seminggu sebagai backup, baru delete
- [ ] Remove `omarxml45@gmail.com` dari new `ADMIN_EMAILS` kalau Omar tak nak akses lagi
- [ ] Update `MEMORY.md` / project notes kalau ada — Cloudflare ownership status, etc.
- [ ] Transfer Cloudflare DNS access kalau applicable
- [ ] Delete file ni (`HANDOVER.md`) atau move ke `docs/` folder

---

## Common gotchas

- **CSP blocked external request:** Update `next.config.ts` Content-Security-Policy header bila tambah service baru.
- **Supabase auth redirect tak jalan:** Pastikan Site URL + Redirect URLs di Supabase Auth settings include both production (`https://smartwills.ai`) dan local dev (`http://localhost:3000`).
- **Google OAuth "redirect_uri_mismatch":** Redirect URI kena exactly match — guna Supabase callback URL (`https://<ref>.supabase.co/auth/v1/callback`), bukan app URL.
- **Email tak sampai:** Check AWS SES dalam **Production mode**, bukan sandbox. Sandbox mode hanya boleh send ke verified email. Request production access via AWS Console kalau perlu.
- **Rate limit aggressive masa dev:** Upstash kira shared. Boleh comment out rate limit dalam dev atau guna in-memory fallback (just remove `UPSTASH_REDIS_*` env vars locally).
- **Lenis scroll patah:** Jangan remove `html.lenis body { height: auto }` dari `globals.css` — diperlukan untuk landing page smooth scroll.

---

## Reference: Project structure cepat

- `src/app/` — Next.js App Router pages + API routes
- `src/components/` — Auth, chat, admin, UI components
- `src/lib/` — Supabase clients, chat helpers, memory, rate limit, admin check
- `supabase/schema.sql` — Full database schema (single file, idempotent)
- `CLAUDE.md` — Detailed architecture notes (read this first untuk context)

Semua context detail ada dalam `CLAUDE.md` — intern wajib baca file tu sebelum mula coding.

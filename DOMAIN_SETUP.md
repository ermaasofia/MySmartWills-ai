# Domain & Infrastructure Setup — smartwills.ai

Reference doc for the current production infrastructure. Describes the live setup so it can be reproduced or modified.

---

## Stack Overview

| Component | Owner | Provider | Notes |
|---|---|---|---|
| Domain registration | CTO | Namecheap | `smartwills.ai` registered on CTO's Namecheap account |
| DNS management | Omar | Cloudflare (free plan) | Nameservers delegated from Namecheap → Cloudflare |
| Hosting | Omar | Vercel | Auto-deploy from `main` branch |
| Auth + database | Omar | Supabase | Project ID `qkhlsbgycewpidtacmzg` |
| Transactional email | Omar | Resend | `noreply@smartwills.ai`, SMTP relay into Supabase |
| CAPTCHA | Omar | Cloudflare Turnstile | Site key in `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` |
| OAuth (Google) | Omar | Google Cloud Console | Redirect URI → `/auth/callback` |

---

## DNS Layout (Cloudflare → smartwills.ai → DNS)

All records below should be **DNS only (grey cloud)** unless noted otherwise. Vercel issues its own SSL cert and Cloudflare proxy breaks the provisioning.

| Type | Name | Value | Purpose |
|---|---|---|---|
| CNAME | `@` | `cname.vercel-dns.com` *(or the project-specific value Vercel's "Authorize in Cloudflare" flow writes)* | Serve site on apex |
| CNAME | `www` | same as `@` | www redirect |
| TXT | `_vercel` | *(value from Vercel)* | Vercel domain verification |
| TXT | `@` | *(SPF from Resend)* | Email sender policy |
| TXT / CNAME | *(Resend DKIM selector)* | *(value from Resend)* | DKIM signing for outbound mail |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | Reporting-only DMARC, optional but recommended |

---

## One-Time Setup (already done)

If this ever needs to be rebuilt from scratch, the order is:

1. **Cloudflare** — add `smartwills.ai` as a site (free plan), get 2 nameservers
2. **CTO (Namecheap)** — switch nameservers on `smartwills.ai` to the Cloudflare ones. Wait for Cloudflare dashboard to show "Active" (usually <1h, up to 24h)
3. **Vercel** — Project → Settings → Domains → add `smartwills.ai` and `www.smartwills.ai`. Use the **"Authorize in Cloudflare"** button so Vercel writes its own DNS records — avoids guessing CNAME targets
4. **Resend** — see `EMAIL_SETUP.md`
5. **Supabase** — Dashboard → Authentication → URL Configuration:
   - **Site URL:** `https://smartwills.ai`
   - **Redirect URLs:** add `https://smartwills.ai/**`
6. **Supabase → SMTP Settings** — plug in Resend credentials (see `EMAIL_SETUP.md`)
7. **Google Cloud Console** — OAuth 2.0 Client → Authorized redirect URIs → add:
   - `https://smartwills.ai/auth/callback`
   - `https://www.smartwills.ai/auth/callback`
8. **Vercel** — Settings → Environment Variables → set `NEXT_PUBLIC_APP_URL=https://smartwills.ai` on Production + Preview + Development

---

## Verification

After any change to domain / email / auth infra, run the full smoke test:

| Step | Expected |
|---|---|
| Open `https://smartwills.ai` | Landing page loads, SSL valid, logo + dark mode work |
| `/signup` → create account | Confirmation email arrives from `noreply@smartwills.ai`, click link → `/chat` |
| `/forgot-password` → submit | Reset email arrives from `noreply@smartwills.ai`, link opens `/reset-password` |
| Sign out → "Continue with Google" | Redirects back to `/chat` authenticated |
| `/chat` → pick country → ask question | Streaming AI response works |

Cross-check **Supabase → Logs → Auth logs** for any `500 Error sending recovery email` or `535 Authentication Failed` entries — both indicate SMTP misconfiguration.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "This site can't be reached" | Nameserver propagation incomplete | Wait up to 24h; verify with `dig smartwills.ai +short` returns Vercel CNAME target |
| "Too many redirects" | Cloudflare proxy (orange cloud) enabled on apex/www CNAME | Switch those records to **DNS only** (grey cloud) |
| Vercel SSL stuck on "Pending" | Cloudflare proxy blocking Let's Encrypt challenge | Same — set proxy to DNS only |
| Email not arriving | Domain not verified in Resend, or wrong SMTP creds | Verify domain in Resend dashboard, re-check Supabase SMTP credentials |
| DKIM verification fails in Resend | Record value truncated or has a typo | Re-paste the full value; Cloudflare has no character limit, so a full copy should always work |
| Google OAuth fails after login | Redirect URI not whitelisted | Add `https://smartwills.ai/auth/callback` in Google Cloud Console → wait a few minutes |

---

## Required Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=https://smartwills.ai
GROQ_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY                (optional fallback)
ADMIN_EMAILS                                  (comma-separated)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
CLOUDFLARE_TURNSTILE_SECRET_KEY
```

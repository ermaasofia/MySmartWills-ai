# Complete Setup Guide for smartwills.ai

Follow these steps **in order**. Each step builds on the previous one.

> **Setup:**
> - **Domain:** `smartwills.ai` (owned by CTO, registered at Namecheap)
> - **DNS:** Managed by Omar via **Cloudflare** (free plan) — CTO points nameservers to Cloudflare
> - **Email:** Zoho Zepto (SMTP relay through Supabase) — CTO owns Zepto dashboard
> - **Hosting:** Vercel (managed by Omar)

---

## STEP 1: Add smartwills.ai to Cloudflare

### What this does:
Gives you full control of DNS records for smartwills.ai through your Cloudflare account.

### How to do it:

1. **Go to Cloudflare Dashboard**
   - Open [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign in with your account

2. **Add the site**
   - Click **+ Add a site**
   - Enter: `smartwills.ai`
   - Select **Free plan** → Continue

3. **Cloudflare gives you 2 nameservers**
   - Example (yours will be different):
     ```
     anna.ns.cloudflare.com
     rick.ns.cloudflare.com
     ```
   - **Copy these** — you'll send them to the CTO

4. **Skip the DNS scan for now** — click Continue/Done, you'll add records manually later

---

## STEP 2: CTO Changes Nameservers in Namecheap

### What this does:
Transfers DNS control from Namecheap to your Cloudflare account.

### Message to send CTO:

> Bro, tolong tukar nameservers untuk smartwills.ai di Namecheap:
>
> 1. Pergi Namecheap → Domain List → smartwills.ai → Manage
> 2. Under **Nameservers**, change from "Namecheap BasicDNS" to **Custom DNS**
> 3. Paste these two nameservers:
>    - `anna.ns.cloudflare.com` *(replace with your actual CF nameservers)*
>    - `rick.ns.cloudflare.com`
> 4. Click the green checkmark to save
>
> Lepas tu aku handle semua DNS records dari Cloudflare side.

**Wait 1–24 hours** for nameserver propagation. Cloudflare dashboard will show status change from "Pending" to **"Active"** when ready.

---

## STEP 3: Add Vercel DNS Records in Cloudflare

### What this does:
Points `smartwills.ai` and `www.smartwills.ai` to Vercel's servers.

### How to do it:

1. **Go to Cloudflare Dashboard**
   - Click on `smartwills.ai` → **DNS** → **Records**

2. **Vercel auto-configures via Cloudflare integration**
   - When you add `smartwills.ai` in Vercel (Step 4), Vercel detects Cloudflare and shows an **"Authorize"** button
   - Click **Authorize** — this lets Vercel add the correct DNS records directly in Cloudflare:
     - CNAME `@` → `fe9c5e6b95614830.vercel-dns-017.com` (DNS only)
     - CNAME `www` → `fe9c5e6b95614830.vercel-dns-017.com` (DNS only)
     - TXT `_vercel` for domain verification
   - Vercel will also remove old parking page records (e.g. Namecheap defaults)

3. **Clean up old records (if any)**
   - If you manually added an A record `76.76.21.21`, delete it — Vercel now uses CNAME instead
   - All records should be **DNS only (grey cloud / proxy off)**

> **IMPORTANT:** Records MUST be **DNS only (grey cloud / proxy off)**. Vercel issues its own SSL certificate — Cloudflare proxy will interfere with SSL provisioning and cause "Too many redirects" errors.

---

## STEP 4: Add Domain to Vercel

### What this does:
Tells Vercel to serve your app on the new domain and issue an SSL certificate.

### How to do it:

1. **Go to Vercel Dashboard**
   - Open [vercel.com](https://vercel.com) → your project

2. **Open Domain Settings**
   - Settings → Domains

3. **Add domains**
   - Add: `smartwills.ai` → Click Add
   - Add: `www.smartwills.ai` → Click Add
   - Vercel will auto-configure www → root redirect

4. **Wait for verification**
   - Status will show "Pending" → then **"Valid"** once DNS propagates
   - SSL certificate is issued automatically

---

## STEP 5: Set Up Zoho Zepto Email DNS

### What this does:
Configures email authentication (SPF, DKIM, DMARC) so auth emails from `noreply@mysmartwills.com` don't go to spam.

### How to do it:

1. **Ask CTO for Zepto DNS records**

   > Bro, tolong add domain `smartwills.ai` dalam Zoho Zepto dashboard:
   > - Pergi Zepto → Domains → Add Domain → `smartwills.ai`
   > - Dia akan show DNS records yang perlu add (SPF, DKIM, verification)
   > - Screenshot atau copy semua records tu hantar kat aku
   > - Aku yang add dalam Cloudflare

2. **Add records in Cloudflare**
   - Go to Cloudflare → `smartwills.ai` → DNS → Records
   - Add each record the CTO sends you. Typically:

   | Type | Name | Value |
   |------|------|-------|
   | TXT | `@` | `v=spf1 include:zeptomail.net ~all` |
   | TXT | `zmail._domainkey` *(or whatever Zepto says)* | *(long DKIM key from CTO)* |
   | TXT | `_dmarc` | `v=DMARC1; p=none;` |
   | CNAME/TXT | *(verification record from CTO)* | *(value from CTO)* |

   > Note: Copy the exact names and values from the CTO's screenshot. Do not guess.

3. **Tell CTO to verify**

   > Records dah add. Tolong click Verify dalam Zepto dashboard.

4. **Get SMTP credentials from CTO**

   > Domain dah verified. Tolong bagi aku SMTP credentials dari Zepto:
   > - Pergi Settings → Send Mail Tokens → SMTP
   > - Aku perlukan: **SMTP username** dan **SMTP password/token**
   > - (Bukan API key — aku perlukan SMTP specific credentials)

---

## STEP 6: Configure Supabase with Zoho Zepto SMTP

### What this does:
Routes all Supabase auth emails (signup confirmation, password reset, magic link) through Zoho Zepto.

### How to do it:

1. **Update Site URL**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qkhlsbgycewpidtacmzg)
   - Click **Authentication** in left sidebar
   - Click **URL Configuration** tab
   - **Site URL:** `https://smartwills.ai`
   - Click **Save**

2. **Add Redirect URLs**
   - Still in **URL Configuration**
   - Add: `https://smartwills.ai/**`
   - Click **Save**

3. **Enable Custom SMTP**
   - Click **SMTP Settings** tab
   - Toggle **Enable Custom SMTP** to ON
   - Fill in:
     - **Host:** `smtp.zeptomail.com`
     - **Port:** `587`
     - **Username:** *(from CTO — usually `emailapikey`)*
     - **Password:** *(SMTP token from CTO — NOT the API key)*
     - **Sender email:** `noreply@mysmartwills.com`
     - **Sender name:** `AI SmartWills`
   - Click **Save**

4. **Update Email Templates**
   - Click **Email Templates** tab
   - For each template (Confirm signup, Reset password, Magic link):
     - Update logo `<img>` src to `https://smartwills.ai/logo.png`
     - Update footer link to `smartwills.ai`
   - See `EMAIL_SETUP.md` for full branded HTML templates

---

## STEP 7: Update Environment Variables in Vercel

1. Go to Vercel → your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` = `https://smartwills.ai`
3. Apply to: **Production**, **Preview**, **Development**
4. Click **Save**

Ensure all other env vars are present:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- `ADMIN_EMAILS`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` / `CLOUDFLARE_TURNSTILE_SECRET_KEY`

---

## STEP 8: Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Open your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   - `https://smartwills.ai/auth/callback`
   - `https://www.smartwills.ai/auth/callback`
4. Click **Save**

---

## STEP 9: Deploy

```powershell
git add .
git commit -m "Migrate to smartwills.ai domain + Zoho Zepto SMTP"
git push
```

Vercel will auto-deploy. Wait 1–2 minutes.

---

## STEP 10: Test Everything

### Test 1: Website
- Open `https://smartwills.ai` — landing page loads
- Logo and dark mode work

### Test 2: Signup Email
- Go to `https://smartwills.ai/signup` → sign up
- Email arrives from `noreply@mysmartwills.com`
- Click verification link → redirects to `https://smartwills.ai/chat`

### Test 3: Password Reset
- `/forgot-password` → enter email
- Reset email arrives from `noreply@mysmartwills.com`
- Link leads to `https://smartwills.ai/reset-password`

### Test 4: Google OAuth
- Sign out → "Continue with Google" → redirects to `smartwills.ai/chat`

### Test 5: Chat
- Select country → ask question → AI responds

---

## Quick Checklist

- [ ] Added `smartwills.ai` to Cloudflare (got nameservers)
- [ ] CTO changed nameservers at Namecheap
- [ ] Cloudflare shows "Active"
- [ ] Added Vercel A + CNAME records in Cloudflare (grey cloud!)
- [ ] Added `smartwills.ai` to Vercel (domain shows "Valid")
- [ ] CTO added `smartwills.ai` in Zepto, sent DNS records
- [ ] Added Zepto email DNS records in Cloudflare
- [ ] CTO verified domain in Zepto
- [ ] Got SMTP credentials from CTO
- [ ] Enabled custom SMTP in Supabase
- [ ] Updated Supabase Site URL + redirect URLs
- [ ] Updated email templates
- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel
- [ ] Updated Google OAuth redirect URIs
- [ ] Pushed code and deployed
- [ ] All 5 tests pass

---

## Troubleshooting

### "This site can't be reached"
- Nameservers not propagated → Wait up to 24 hours
- Check: `dig smartwills.ai +short` should return `76.76.21.21`

### "Too many redirects"
- Cloudflare proxy is ON → Turn it OFF (grey cloud) for both A and CNAME records
- Or if you want Cloudflare proxy: set SSL mode to **Full (Strict)** in Cloudflare

### SSL certificate pending in Vercel
- Make sure Cloudflare records are **DNS only (grey cloud)**
- Vercel needs direct access to issue Let's Encrypt certificate

### Email not arriving
- Domain not verified in Zepto → Ask CTO to check
- Wrong SMTP credentials → Double-check username/password in Supabase SMTP settings
- Check spam folder
- Check Zepto logs: Reports → Sent Emails

### DKIM verification fails
- DKIM key value got truncated — paste the **entire** value without line breaks
- Cloudflare doesn't have the same character limit as Namecheap, so this is less likely

### Google OAuth fails
- Redirect URI not added → Check Step 8
- May take a few minutes for Google to propagate changes

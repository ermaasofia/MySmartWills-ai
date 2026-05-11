# OAuth Setup Guide (Google)

This guide explains how to configure Google social login for AI SmartWills.

---

## Architecture Overview

1. **Client** clicks "Continue with Google"
2. **Client** calls `POST /api/auth/oauth` (rate-limited: 10 requests / 10 min per IP)
3. **Server** generates a PKCE-protected OAuth URL via Supabase
4. **Client** is redirected to the Google consent screen
5. **Google** redirects back to `https://yourdomain.com/auth/callback?code=...`
6. **Server** exchanges the code for a session (PKCE verified internally by Supabase)
7. **User** lands on `/chat`

---

## Step 1 — Configure Supabase

### 1.1 Enable Google provider

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication → Providers**
2. Enable **Google**
3. Fill in the credentials you obtain in Step 2 below

### 1.2 Add the callback URL in Supabase

In **Authentication → URL Configuration** add:

```
https://yourdomain.com/auth/callback
```

> For local development also add `http://localhost:3000/auth/callback`

---

## Step 2 — Google OAuth

### 2.1 Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Authorised JavaScript origins:
   ```
   https://yourdomain.com
   http://localhost:3000
   ```
5. Authorised redirect URIs — add **your Supabase project callback URL**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   (Find this in Supabase Dashboard → Authentication → Providers → Google)

6. Copy the **Client ID** and **Client Secret**

### 2.2 Add to Supabase

Paste into Supabase → Authentication → Providers → Google:
- **Client ID** → `<Google Client ID>`
- **Client Secret** → `<Google Client Secret>`

---

## Step 3 — Environment Variables

No additional environment variables are required — the OAuth flow is handled entirely
through your existing Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

The site origin (used to build the callback URL) is read from:

```env
# Set this in production to your canonical domain
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

> **Vercel deployments** — if `NEXT_PUBLIC_SITE_URL` is not set the system automatically
> falls back to `VERCEL_URL`. Set `NEXT_PUBLIC_SITE_URL` explicitly to avoid preview
> deployment URLs leaking into production auth callbacks.

---

## Step 4 — Verify Rate Limiting

OAuth initiation is rate-limited at the server level:

| Limit | Window | Scope |
|-------|--------||-------|
| 10 requests | 10 minutes | Per IP address |

If Upstash Redis is configured (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`),
the rate limit is **distributed** across all serverless instances.  
Without Redis it falls back to **in-memory** (per instance) limiting.

For large-scale production, **Upstash Redis is strongly recommended**.

---

## Step 5 — Test the Flow

```bash
# Local development
pnpm dev

# Visit http://localhost:3000/login
# Click "Continue with Google"
# Complete the OAuth consent screen
# Should land on /chat
```

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Invalid redirect_uri" | Callback URL not registered in Google Cloud Console | Add Supabase callback URL to the OAuth client's authorised redirect URIs |
| Redirect to `/login?error=Could+not+authenticate+user` | Code exchange failed | Verify `NEXT_PUBLIC_SUPABASE_URL` and that Google is enabled in Supabase |
| "Sign-in was cancelled" | User denied consent | Normal — user can try again |
| 429 Too Many Requests | Rate limit hit | Wait 10 minutes or check Upstash Redis config |
| Avatar image broken | CDN domain not whitelisted | `next.config.ts` already includes `lh3.googleusercontent.com` |


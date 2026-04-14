# Email Setup — Resend + Supabase

How auth emails (signup confirmation, password reset, magic link) are delivered in production.

- **Provider:** Resend (free tier, 3,000/month, 100/day)
- **Sender:** `noreply@smartwills.ai`
- **Relay:** Supabase Auth → Resend SMTP → user inbox
- **Why Resend (not Zepto or SES):** Resend authenticates via API key, so there's no IP allowlist problem. Supabase's email workers can connect from any of their dynamic IPs. `smartwills.ai` DNS is in our own Cloudflare, so we can verify the domain without depending on the CTO.

---

## Part 1: Verify `smartwills.ai` in Resend

1. Log in to [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter `smartwills.ai`, confirm region (closest to your users — `ap-southeast-1` works for APAC)
3. Resend displays DNS records to add. Typically 3 of them:
   - **SPF** — `TXT` on apex
   - **DKIM** — `TXT` or `CNAME` on a selector hostname (e.g. `resend._domainkey`)
   - **DMARC** — `TXT` at `_dmarc.smartwills.ai` (optional but recommended)
4. **Add all records in Cloudflare** (smartwills.ai → DNS → Records):
   - Copy the exact hostname and value from Resend — don't hardcode
   - For any **CNAME**, set Cloudflare proxy status to **DNS only (grey cloud)** — orange cloud breaks email DNS validation
5. Return to Resend → click **Verify** → wait for green status (usually <5 minutes)

---

## Part 2: Generate Resend SMTP Credentials

1. Resend dashboard → **API Keys** → **Create API Key**
2. Name: something like `supabase-prod`
3. Permission: **Full access** (or sending-only if available)
4. Copy the key immediately — Resend shows it once, then hides it

SMTP values to use:
- **Host:** `smtp.resend.com`
- **Port:** `587` (STARTTLS) or `465` (SSL)
- **Username:** `resend`
- **Password:** [the API key from step 4]

---

## Part 3: Plug into Supabase

Supabase dashboard → **Authentication → SMTP Settings**:

| Field | Value |
|---|---|
| Enable Custom SMTP | ON |
| Sender email | `noreply@smartwills.ai` |
| Sender name | `AI SmartWills` |
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` |
| Password | Resend API key |

Click **Save**. Supabase validates the connection; if it throws an error here, credentials are wrong.

Also ensure **Authentication → URL Configuration**:
- **Site URL:** `https://smartwills.ai`
- **Redirect URLs:** includes `https://smartwills.ai/**`

---

## Part 4: Email Templates (Optional Branding)

Supabase default email templates work out of the box. If you want the branded version matching the site's typography (Crimson Text, black/white), use the template below for **Confirm signup**, then reuse with small tweaks for Magic Link and Reset Password.

**Template variables available to all templates:**

| Variable | Purpose |
|---|---|
| `{{ .ConfirmationURL }}` | Action link (confirm/reset/magic) |
| `{{ .Email }}` | User's email |
| `{{ .SiteURL }}` | Your configured site URL |
| `{{ .Token }}` / `{{ .TokenHash }}` | Auth tokens (magic link) |

### Confirm Signup template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email — AI SmartWills</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">

          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <img src="https://smartwills.ai/logo.png" alt="AI SmartWills" width="64" height="64" style="display: block; margin: 0 auto 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #000000; letter-spacing: -0.5px;">AI SmartWills</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #525252;">Intelligent Legal Will Planning</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #000000;">Confirm Your Email Address</h2>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #000000;">
                Thank you for signing up with AI SmartWills. To complete your registration and start planning your will, please confirm your email address.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #000000;">
                Click the button below to verify your email and activate your account:
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 0 0 30px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.6; color: #525252;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 30px; font-size: 13px; line-height: 1.6; color: #525252; word-break: break-all; background-color: #f5f5f5; padding: 12px; border-radius: 4px; border: 1px solid #e5e5e5;">
                {{ .ConfirmationURL }}
              </p>

              <div style="margin: 30px 0 0; padding: 20px; background-color: #f5f5f5; border-left: 3px solid #000000; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #000000;">Security Notice</p>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #525252;">
                  This confirmation link will expire in 24 hours. If you didn't create an account with AI SmartWills, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #f5f5f5; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #000000;">AI SmartWills</p>
              <p style="margin: 0 0 15px; font-size: 13px; line-height: 1.6; color: #525252;">
                Your AI-powered assistant for legal will planning<br>
                Serving 12 countries across Asia-Pacific
              </p>
              <p style="margin: 0 0 10px; font-size: 13px; color: #525252;">
                <a href="https://smartwills.ai" style="color: #000000; text-decoration: none; font-weight: 600;">smartwills.ai</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #737373;">© 2026 AI SmartWills. All rights reserved.</p>
            </td>
          </tr>

        </table>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto 0;">
          <tr>
            <td style="padding: 0 20px; text-align: center;">
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #737373;">
                This email was sent to {{ .Email }} because you signed up for AI SmartWills.<br>
                If you did not sign up, please disregard this email.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
```

### Tweaks for other templates

- **Magic Link:** Change heading to `Sign In to Your Account`, button to `Sign In`, keep `{{ .ConfirmationURL }}` href
- **Reset Password:** Change heading to `Reset Your Password`, button to `Reset Password`, keep `{{ .ConfirmationURL }}` href

---

## Verification

After wiring everything up:

1. Hard refresh `https://smartwills.ai/forgot-password`
2. Submit with a Gmail account you own
3. Check **Supabase → Logs → Auth logs** for `/recover`:
   - Expect success
   - No `535 Authentication Failed`
   - No `timeout-or-duplicate` captcha errors
4. Within 30 seconds, email should arrive from `noreply@smartwills.ai` (check Inbox + Promotions + Spam)
5. Click the reset link → should open `https://smartwills.ai/reset-password`
6. Submit a new password → should log in and redirect to `/chat`

Then do the same for signup (`/signup`) to verify the Confirm Signup template.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `535 Authentication Failed` in Supabase logs | Wrong SMTP username/password | Username is literal `resend`; password is the API key, not an OAuth token |
| Domain stuck "Pending" in Resend | DNS records wrong or Cloudflare proxy ON | Re-check records match exactly; set CNAMEs to DNS only (grey cloud) |
| Email lands in Spam | DKIM/DMARC missing or SPF too lax | Make sure all 3 records (SPF, DKIM, DMARC) are present; use `mail-tester.com` for a full deliverability score |
| Logo not showing in Gmail | Image blocked by default | Not fixable server-side; users can click "Display images" |
| Link in email opens wrong page | Supabase Site URL or Redirect URLs mismatched | Re-check URL Configuration values; add `https://smartwills.ai/**` to redirect allowlist |

---

## Notes

- Resend free tier quota resets monthly. Monitor usage in Resend dashboard → **Usage**
- If traffic grows past ~3K emails/month, either upgrade Resend tier or consider migrating to AWS SES (same SMTP interface in Supabase, different credentials — no code changes)
- Keep the old Resend API key disabled/rotated quarterly
- Email templates update in Supabase immediately; no deployment needed

# Email Setup — Amazon SES + Supabase

How auth emails (signup confirmation, password reset, magic link) are delivered in production.

- **Provider:** Amazon SES (AWS account owned by CTO)
- **Region:** `ap-southeast-1` (Singapore)
- **Sender:** `noreply@mysmartwills.com` — company-wide sending address, not `smartwills.ai`. Users will see emails arrive from `mysmartwills.com` but links point back to `smartwills.ai`.
- **Relay:** Supabase Auth → Amazon SES SMTP → user inbox
- **Mode:** Production access approved (out of sandbox — safe to send to any recipient)
- **Why SES (over Resend / Zepto):** Company standard. CTO handles the AWS account; Omar only plugs SMTP credentials into Supabase. No SDK, no app-code changes.
- **Zero DNS work on `smartwills.ai`:** Domain verification, DKIM, and SPF all live on `mysmartwills.com` (CTO-controlled DNS). Do not add any email DNS records to Cloudflare for `smartwills.ai`.

---

## Part 1: Confirm `mysmartwills.com` is a Verified Sending Identity in SES

The sender domain is `mysmartwills.com` (company-wide), not `smartwills.ai`. Verification is fully owned by CTO on their DNS for `mysmartwills.com`. **No DNS changes are needed in Cloudflare for `smartwills.ai`.**

Before touching Supabase, ask CTO to confirm (screenshot is enough):

1. AWS Console → **SES** → region set to **Asia Pacific (Singapore) ap-southeast-1**
2. **Verified identities** → `mysmartwills.com` status = **Verified** (green)
3. DKIM status = **Success** (3 CNAMEs live in `mysmartwills.com`'s DNS)
4. Account dashboard shows **Production access** (not sandbox), daily cap comfortably above expected send volume

If any of those are not green, stop — ask CTO to fix on their side. Do not try to add records to Cloudflare `smartwills.ai` DNS; that does nothing for a `mysmartwills.com` sender.

**Deliverability note:** Sending from `mysmartwills.com` with links to `smartwills.ai` is a cross-domain pattern. Strict spam filters (especially corporate Outlook) occasionally flag it. If delivery issues appear after go-live, CTO can tighten DMARC alignment on `mysmartwills.com`.

---

## Part 2: Obtain SMTP Credentials from CTO

Supabase needs **SMTP username + password** — these are not the same as AWS IAM access keys.

If CTO hands over raw access keys by mistake, ask them to go to **AWS Console → SES → SMTP settings → Create SMTP credentials**, which generates the correct pair. The username starts with `AKIA...`, the password is a ~44-character base64 string.

You should end up with:

```
Host:     email-smtp.ap-southeast-1.amazonaws.com
Port:     587          (STARTTLS)
Username: AKIA...      (SMTP username, not bare access key ID)
Password: <base64>     (SMTP password, not access key secret)
Sender:   noreply@mysmartwills.com
```

Do not commit these anywhere. They live only in the Supabase Auth dashboard.

---

## Part 3: Plug into Supabase

Supabase dashboard → **Authentication → SMTP Settings**:

| Field | Value |
|---|---|
| Enable Custom SMTP | ON |
| Sender email | `noreply@mysmartwills.com` |
| Sender name | `AI SmartWills` |
| Host | `email-smtp.ap-southeast-1.amazonaws.com` |
| Port | `587` |
| Username | SES SMTP username |
| Password | SES SMTP password |

The "Sender name" field controls what users see as the display name in their inbox — `AI SmartWills <noreply@mysmartwills.com>` reassures users that the email belongs to this product even though the domain differs from the site they signed up on.

Click **Save**. Supabase runs a TCP handshake on save; an error here means wrong credentials, wrong host, or a port mismatch.

Also ensure **Authentication → URL Configuration**:
- **Site URL:** `https://smartwills.ai`
- **Redirect URLs:** includes `https://smartwills.ai/**`

---

## Part 4: Email Templates (Optional Branding)

Supabase default email templates work out of the box. The templates below match the site's typography (Crimson Text, black/white) and work with any SMTP provider — use them for **Confirm signup**, then reuse with small tweaks for Magic Link and Reset Password.

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
2. Submit with a Gmail account you own (any inbox — production mode means no allowlist)
3. Check **Supabase → Logs → Auth logs** for `/recover`:
   - Expect HTTP 200
   - No `535 Authentication Failed`
   - No `Email address is not verified`
   - No `timeout-or-duplicate` captcha errors
4. Within 30 seconds, email should arrive from `noreply@mysmartwills.com` (check Inbox + Promotions + Spam)
5. Open the email → **Show original** in Gmail → confirm `Return-Path:` contains `amazonses.com`, DKIM = `PASS`, and the signing domain = `mysmartwills.com`
6. Click the reset link → should open `https://smartwills.ai/reset-password`
7. Submit a new password → should log in and redirect to `/chat`

Then do the same for signup (`/signup`) to verify the Confirm Signup template.

Optional: run your send through [mail-tester.com](https://www.mail-tester.com) for a deliverability score. Aim for 9/10 or higher.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `535 Authentication Failed` in Supabase logs | Wrong SMTP username/password | Username must start `AKIA...`; password is the SMTP password (not the IAM secret). Have CTO regenerate SMTP credentials in SES console. |
| `Email address is not verified` from SES | `mysmartwills.com` not verified in SES (CTO side) | Ask CTO to confirm `mysmartwills.com` status in AWS → SES → Verified identities (ap-southeast-1). Omar cannot fix this — the DNS and AWS account are CTO's. |
| Emails flagged as spam on first send | Cross-domain sender (`mysmartwills.com`) + link (`smartwills.ai`) tripping reputation checks | Ask CTO to verify SPF / DKIM / DMARC are all passing on `mysmartwills.com`; run `mail-tester.com` for a score. |
| `Daily message quota exceeded` | Hit SES sending cap (starts ~50k/day in production) | Check SES → Sending statistics. Request a quota increase in the AWS console. |
| `Maximum sending rate exceeded` | Sending faster than 14 msg/s default | Unlikely for auth emails; if it happens, open AWS support for a rate bump. |
| Emails land in Spam | SPF/DKIM/DMARC incomplete | Confirm SPF TXT on apex contains `include:amazonses.com`; DKIM CNAMEs verified; DMARC TXT at `_dmarc`. Use `mail-tester.com` to pinpoint. |
| Domain stuck "Pending" in SES | DNS records wrong or Cloudflare proxy ON | Re-check records match exactly; set CNAMEs to DNS only (grey cloud) |
| Logo not showing in Gmail | Image blocked by default | Not fixable server-side; users can click "Display images" |
| Link in email opens wrong page | Supabase Site URL or Redirect URLs mismatched | Re-check URL Configuration values; add `https://smartwills.ai/**` to redirect allowlist |

---

## Notes

- Request for SES quota / rate increases goes through CTO since they own the AWS account.
- Email templates update in Supabase immediately; no deployment needed.
- Monitor SES send volume in **AWS Console → SES → Account dashboard**.
- If SES is ever taken offline and an emergency fallback is needed, any other SMTP provider (Resend, SendGrid, Mailgun) can be plugged into the same Supabase SMTP Settings panel — no code change required.

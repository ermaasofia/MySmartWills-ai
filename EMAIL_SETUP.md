# Email Setup for AI SmartWills (via Supabase Custom SMTP)

## ✅ What You Already Did

You configured Supabase to send emails through Resend's SMTP server. This means:
- Supabase handles ALL auth emails (verification, password reset)
- Emails are sent through Resend automatically
- No custom code needed - it "just works"

---

## 📧 Current SMTP Configuration

Your Supabase Custom SMTP settings:

| Setting | Value |
|---------|-------|
| **Host** | `smtp.resend.com` |
| **Port** | `465` |
| **Username** | `resend` |
| **Password** | Your Resend API key (`re_4wWRZhsA...`) |
| **Sender Email** | `onboarding@resend.dev` |
| **Sender Name** | `AI SmartWills` |

---

## ⚠️ Testing Limitation

**Important:** With `onboarding@resend.dev`, you can only send test emails to:
- The email address you used to sign up for Resend
- Any email you manually verify in Resend dashboard

To send to **any user**, you need a custom domain (see below).

---

## 🎯 How to Test Right Now

1. Go to `https://aismartwills.vercel.app/signup`
2. Sign up with **the email you used for Resend** (or one you verified)
3. Check your inbox for the verification email
4. It should come from "AI SmartWills via Resend" or similar

---

## 🚀 To Send to All Users (Production)

### Step 1: Buy a Domain
- Namecheap, GoDaddy, Cloudflare, etc.
- Example: `smartwills.com`

### Step 2: Verify Domain in Resend
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain (e.g., `smartwills.com`)
4. Add the DNS records Resend provides to your domain registrar:
   - **SPF record** (TXT)
   - **DKIM record** (TXT)
   - **DMARC record** (TXT, optional but recommended)
5. Wait 5-30 minutes for verification

### Step 3: Update Supabase SMTP Settings
1. Go to Supabase → Authentication → Email Settings
2. Change **Sender email address** to: `noreply@smartwills.com`
3. Click **Save changes**

### Done!
Now you can send to anyone, unlimited users.

---

## 📊 Resend Free Tier Limits

- **100 emails/day**
- **3,000 emails/month**
- Perfect for MVP and early users

**When to upgrade ($20/month):**
- 50,000 emails/month
- No daily limit
- Better for production with many users

---

## ✅ Current Status

- ✅ Resend integrated via SMTP
- ✅ Auth emails configured
- ✅ Working in test mode (your email only)
- ⏳ Need custom domain for production

---

## 🔧 Troubleshooting

### Email not arriving?
1. Check spam folder
2. Make sure you're testing with the email you use for Resend
3. Check Resend logs: [resend.com/emails](https://resend.com/emails)

### Want to test with a different email?
1. Go to [resend.com/audiences](https://resend.com/audiences)
2. Add the test email address
3. Verify it (they'll receive a confirmation email)
4. Now you can test signup with that email

---

## 📝 Notes

- Your Resend API key is securely stored in Supabase (not in your code)
- Emails are sent automatically on signup/password reset
- No need to deploy anything - works immediately
- The webhook/API route files were removed since you don't need them with SMTP

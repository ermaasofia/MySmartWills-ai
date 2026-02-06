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
| **Sender Email** | `onboarding@resend.dev` (testing) |
| **Sender Name** | `AI SmartWills` |

---

## 🎯 Next: Verify Your Custom Domain (aismartwills.me)

### Step 1: Add Domain in Resend
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter: `aismartwills.me`
4. Resend will give you DNS records to add

### Step 2: Add DNS Records in Namecheap
1. Go to [Namecheap Dashboard](https://ap.www.namecheap.com/)
2. Click **Domain List** → **Manage** next to `aismartwills.me`
3. Click **Advanced DNS**
4. Add the records Resend provided (typically):
   - **SPF** (TXT record): `v=spf1 include:send.resend.com ~all`
   - **DKIM** (TXT record): Resend will provide this
   - **DMARC** (TXT record): `v=DMARC1; p=none;` (can strengthen later)
5. Wait 5-30 minutes for DNS propagation

### Step 3: Verify in Resend
1. Go back to Resend → Domains
2. Click **Verify** next to `aismartwills.me`
3. Once verified, you're ready

### Step 4: Update Supabase SMTP Sender
1. Go to Supabase → Authentication → SMTP Settings
2. Change **Sender email address** to: `noreply@aismartwills.me`
3. Click **Save changes**

### Done!
Now ALL users can receive emails from `noreply@aismartwills.me`

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

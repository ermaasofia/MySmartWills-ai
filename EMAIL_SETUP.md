# 📧 Email Template Setup for AI SmartWills

Complete guide to customize your Supabase email templates with AI SmartWills branding.

---

## Step 1: Go to Supabase Email Templates

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/qkhlsbgycewpidtacmzg)
2. Click **Authentication** (⚡ icon) in the left sidebar
3. Click **Email Templates** tab at the top

---

## Step 2: Update "Confirm signup" Template

Click on **Confirm signup** and replace the entire content with this branded template:

### 📝 Copy This HTML Template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - AI SmartWills</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Crimson Text', Georgia, 'Times New Roman', serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <img src="https://aismartwills.me/logo.png" alt="AI SmartWills" width="64" height="64" style="display: block; margin: 0 auto 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #000000; letter-spacing: -0.5px;">AI SmartWills</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #525252;">Intelligent Legal Will Planning</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #000000;">Confirm Your Email Address</h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #000000;">
                Thank you for signing up with AI SmartWills. To complete your registration and start planning your will, please confirm your email address.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #000000;">
                Click the button below to verify your email and activate your account:
              </p>

              <!-- CTA Button -->
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

              <!-- Security Notice -->
              <div style="margin: 30px 0 0; padding: 20px; background-color: #f5f5f5; border-left: 3px solid #000000; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #000000;">
                  🔒 Security Notice
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #525252;">
                  This confirmation link will expire in 24 hours. If you didn't create an account with AI SmartWills, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f5f5f5; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #000000;">
                AI SmartWills
              </p>
              <p style="margin: 0 0 15px; font-size: 13px; line-height: 1.6; color: #525252;">
                Your AI-powered assistant for legal will planning<br>
                Serving 12 countries across Asia-Pacific
              </p>
              <p style="margin: 0 0 10px; font-size: 13px; color: #525252;">
                <a href="https://aismartwills.me" style="color: #000000; text-decoration: none; font-weight: 600;">aismartwills.me</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #737373;">
                © 2026 AI SmartWills. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Legal Footer -->
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

**Then click "Save" at the bottom.**

---

## Step 3: Update Other Email Templates (Optional but Recommended)

### Magic Link Template

Use the same template structure, but change these lines:

**Line 34:** Change to:
```html
<h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #000000;">Sign In to Your Account</h2>
```

**Line 36-38:** Change to:
```html
<p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #000000;">
  Click the button below to securely sign in to your AI SmartWills account:
</p>
```

**Line 48:** Change button text to:
```html
Sign In to Your Account
```

**Button href:** Change from `{{ .ConfirmationURL }}` to `{{ .TokenHash }}`

---

### Reset Password Template

Use the same template structure, but change:

**Title:** "Reset Your Password"
**Button text:** "Reset Password"
**Button href:** `{{ .ConfirmationURL }}`

---

## Step 4: Configure Email Settings

### A. Update SMTP Settings
1. Still in Authentication, click **SMTP Settings** tab
2. **Sender email:** `noreply@aismartwills.me`
3. **Sender name:** `AI SmartWills`
4. Click **Save changes**

### B. Update URL Configuration
1. Click **URL Configuration** tab
2. **Site URL:** `https://aismartwills.me`
3. **Redirect URLs:** Add `https://aismartwills.me/**`
4. Click **Save**

---

## Step 5: Test the Email

1. **Delete your test account** in Supabase Dashboard:
   - Authentication → Users → Find your email → Delete

2. **Sign up again:**
   - Go to `https://aismartwills.me/signup`
   - Use your email
   - Fill the form and submit

3. **Check your inbox:**
   - You should receive a beautifully branded email
   - It should have the AI SmartWills logo
   - Black and white design matching your site

4. **Click the confirmation link:**
   - Should redirect to `https://aismartwills.me/chat`

---

## ✅ What This Template Includes

- ✅ AI SmartWills logo from your live site
- ✅ Crimson Text font (matches your website)
- ✅ Clean black and white design
- ✅ Professional layout with proper spacing
- ✅ Security notice
- ✅ Mobile responsive
- ✅ Works in all email clients (Gmail, Outlook, Apple Mail)
- ✅ Alt text for accessibility
- ✅ Footer with legal text

---

## 🎨 Design Details

**Colors used:**
- Background: `#f5f5f5` (light gray)
- Card: `#ffffff` (white)
- Text: `#000000` (black)
- Muted text: `#525252` (dark gray)
- Button: `#000000` background, `#ffffff` text
- Borders: `#e5e5e5` (light gray)

**Typography:**
- Font: Crimson Text (Google Fonts)
- Heading: 28px bold
- Subheading: 24px semibold
- Body: 16px regular
- Small: 13-14px

---

## 📊 Supabase Template Variables

Available in all email templates:

- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Confirmation/verification link
- `{{ .Token }}` - Auth token
- `{{ .TokenHash }}` - Token hash (for magic links)
- `{{ .SiteURL }}` - Your configured site URL
- `{{ .RedirectTo }}` - Redirect URL parameter

---

## 🔧 Troubleshooting

### Logo not showing in email?
- Make sure your site is deployed to `aismartwills.me`
- Logo must be publicly accessible at `https://aismartwills.me/logo.png`
- Some email clients block images by default - users need to "Display images"

### Email showing plain text?
- Make sure you pasted the **entire** HTML template
- Click "Save" in Supabase after pasting
- Test with a fresh signup (delete old test account first)

### Font not loading?
- Crimson Text is loaded from Google Fonts
- Some email clients don't support web fonts
- Falls back to Georgia and Times New Roman

---

## 📝 Notes

- Email templates update immediately (no deployment needed)
- Test emails in both Gmail and Outlook for best results
- Keep templates under 100KB for best deliverability
- Inline CSS is required for email (done in template)

# 🚀 Complete Setup Guide for aismartwills.me

Follow these steps **in order**. Each step builds on the previous one.

---

## STEP 1: Connect Domain to Vercel (Your Website)

### What this does:
Points `aismartwills.me` to your Vercel website instead of `aismartwills.vercel.app`

### How to do it:

1. **Go to Vercel Dashboard**
   - Open [vercel.com](https://vercel.com)
   - Sign in
   - Click on your **aismartwills** project

2. **Open Domain Settings**
   - Click the **Settings** tab at the top
   - Click **Domains** in the left sidebar

3. **Add Your Domain**
   - In the box that says "Enter domain", type: `aismartwills.me`
   - Click **Add**
   - Also add: `www.aismartwills.me` (so both work)

4. **Vercel will show you DNS records**
   - You'll see something like:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - **Keep this tab open** — you'll need these values in Step 2

---

## STEP 2: Update DNS in Namecheap

### What this does:
Tells the internet that `aismartwills.me` points to Vercel's servers

### How to do it:

1. **Go to Namecheap**
   - Open [namecheap.com](https://namecheap.com)
   - Sign in
   - Click **Domain List** in the left sidebar

2. **Open DNS Settings**
   - Find `aismartwills.me` in your list
   - Click the **Manage** button next to it
   - Click the **Advanced DNS** tab

3. **Delete Old Records (if any)**
   - Look for any existing `A Record` with Host `@`
   - Look for any existing `CNAME Record` with Host `www`
   - Click the **trash icon** to delete them

4. **Add Vercel's A Record**
   - Click **+ Add New Record**
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21` (from Vercel)
   - TTL: `Automatic`
   - Click the **✓ checkmark** to save

5. **Add Vercel's CNAME Record**
   - Click **+ Add New Record**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com` (from Vercel)
   - TTL: `Automatic`
   - Click the **✓ checkmark** to save

6. **Wait 10-30 minutes**
   - DNS changes take time to propagate
   - Go back to Vercel → Domains
   - You'll see "Pending" → then "Valid" when ready

---

## STEP 3: Set Up Email Domain in Resend

### What this does:
Allows you to send emails from `noreply@aismartwills.me` instead of `onboarding@resend.dev`

### How to do it:

1. **Go to Resend**
   - Open [resend.com](https://resend.com)
   - Sign in
   - Click **Domains** in the left sidebar

2. **Add Your Domain**
   - Click **+ Add Domain** button
   - Enter: `aismartwills.me`
   - Click **Add**

3. **Resend Shows DNS Records**
   - You'll see 3 records to add:
   
   **Record 1 - SPF (TXT)**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:send.resend.com ~all
   ```
   
   **Record 2 - DKIM (TXT)**
   ```
   Type: TXT
   Name: resend._domainkey
   Value: (long string that Resend provides)
   ```
   
   **Record 3 - DMARC (TXT)**
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none;
   ```

4. **Add These to Namecheap DNS**
   - Go back to Namecheap → `aismartwills.me` → **Advanced DNS**
   - For **each of the 3 records** above:
     - Click **+ Add New Record**
     - Type: `TXT Record`
     - Host: (copy from Resend - `@`, `resend._domainkey`, or `_dmarc`)
     - Value: (copy the exact value from Resend)
     - TTL: `Automatic`
     - Click **✓ checkmark**

5. **Verify in Resend**
   - Wait 5-15 minutes
   - Go back to Resend → Domains
   - Click **Verify** next to `aismartwills.me`
   - Status will change to ✅ **Verified**

---

## STEP 4: Update Supabase Settings

### What this does:
Makes auth emails redirect to your domain and send from your domain

### How to do it:

1. **Update Site URL**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qkhlsbgycewpidtacmzg)
   - Click **Authentication** (lightning bolt icon) in left sidebar
   - Click **URL Configuration** tab
   - Find **Site URL** field
   - Change from `http://localhost:3000` to: `https://aismartwills.me`
   - Click **Save**

2. **Add Redirect URLs**
   - Still in **URL Configuration**
   - Find **Redirect URLs** section
   - Add this: `https://aismartwills.me/**`
   - Click **Save**

3. **Update Email Sender**
   - Click **SMTP Settings** tab (still in Authentication)
   - Find **Sender email address**
   - Change from `onboarding@resend.dev` to: `noreply@aismartwills.me`
   - Click **Save changes**

---

## STEP 5: Update Environment Variables in Vercel

### What this does:
Tells your app to use the new domain

### How to do it:

1. **Go to Vercel Dashboard**
   - Your project → **Settings** → **Environment Variables**

2. **Find NEXT_PUBLIC_APP_URL**
   - Look for the variable `NEXT_PUBLIC_APP_URL`
   - If it exists, click the **...** menu → **Edit**
   - If it doesn't exist, click **Add**

3. **Set the Value**
   - Value: `https://aismartwills.me`
   - Apply to: **Production**, **Preview**, **Development** (check all)
   - Click **Save**

4. **Also add all your other variables** (if not already there):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   
   (Copy from your `.env.local` file)

---

## STEP 6: Deploy

### What this does:
Applies all the changes to your live website

### How to do it:

1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Update domain to aismartwills.me"
   git push
   ```

2. **Vercel Auto-Deploys**
   - Go to Vercel Dashboard → **Deployments**
   - Wait for "Building..." to finish (1-2 minutes)
   - Status will show ✅ **Ready**

---

## STEP 7: Test Everything

### Test 1: Website Access
1. Open `https://aismartwills.me` in your browser
2. You should see your landing page
3. Logo and dark mode should work

### Test 2: Signup with Email
1. Go to `https://aismartwills.me/signup`
2. Sign up with **any email address**
3. Check your email inbox
4. You should receive an email from `noreply@aismartwills.me`
5. Click the verification link
6. It should redirect to `https://aismartwills.me/chat` (not localhost)

### Test 3: Chat Functionality
1. Go to `https://aismartwills.me/chat`
2. Select a country
3. Type a question about will planning
4. AI should respond

---

## 📋 Quick Checklist

Copy this checklist and check off as you go:

- [ ] Added domain to Vercel
- [ ] Added Vercel's A record to Namecheap DNS
- [ ] Added Vercel's CNAME record to Namecheap DNS
- [ ] Waited for DNS to propagate (10-30 min)
- [ ] Added domain to Resend
- [ ] Added all 3 email DNS records to Namecheap
- [ ] Verified domain in Resend (shows ✅)
- [ ] Updated Supabase Site URL to `https://aismartwills.me`
- [ ] Updated Supabase email sender to `noreply@aismartwills.me`
- [ ] Added environment variables to Vercel
- [ ] Pushed code to GitHub
- [ ] Waited for Vercel deployment to finish
- [ ] Tested website loads at `https://aismartwills.me`
- [ ] Tested signup email works
- [ ] Tested email verification redirects correctly
- [ ] Tested chat functionality

---

## ❓ Troubleshooting

### "This site can't be reached"
- DNS not propagated yet → Wait 30 more minutes
- Wrong DNS records → Double-check Step 2

### "Too many redirects"
- Vercel domain not configured → Check Step 1
- Wait for deployment → Check Vercel Deployments tab

### Email not arriving
- Domain not verified in Resend → Check Step 3
- Check spam folder
- Resend logs: [resend.com/emails](https://resend.com/emails)

### Email goes to localhost
- Supabase Site URL not updated → Check Step 4
- Need to redeploy → Push a new commit

---

## 🎉 When All Done

You'll have:
- ✅ Professional domain: `aismartwills.me`
- ✅ Branded emails: `noreply@aismartwills.me`
- ✅ Secure HTTPS with SSL certificate (automatic)
- ✅ Production-ready with all security headers
- ✅ Rate limiting and input validation
- ✅ SEO optimized with sitemap and robots.txt

**Ready to show people!** 🚀

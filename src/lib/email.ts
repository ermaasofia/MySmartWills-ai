import nodemailer from 'nodemailer';

// ─── Transporter ─────────────────────────────────────────────────────────────

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If no SMTP configured, use MailHog (dev catch-all SMTP on localhost:1025)
  if (!smtpHost || !smtpUser || !smtpPass) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP not configured for production email sending');
    }
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
    });
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

const FROM_EMAIL = process.env.SMTP_FROM || 'noreply@smartwills.ai';
const APP_NAME = 'AI SmartWills';

// ─── Password Reset ──────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const transporter = getTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
    .logo { font-size: 22px; font-weight: 700; margin-bottom: 24px; color: #0a0a0a; }
    .button { display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">${APP_NAME}</div>
    <h2>Reset your password</h2>
    <p>We received a request to reset the password for your ${APP_NAME} account.</p>
    <p>Click the button below to set a new password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="font-size: 13px; word-break: break-all; color: #666;">${resetLink}</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>This link expires in 1 hour.</p>
    <div class="footer">
      <p>${APP_NAME} — SmartWills.ai</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html,
  });
}

// ─── Welcome Email ───────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  fullName: string | null
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const transporter = getTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
    .logo { font-size: 22px; font-weight: 700; margin-bottom: 24px; color: #0a0a0a; }
    .button { display: inline-block; padding: 14px 32px; background: #0a0a0a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">${APP_NAME}</div>
    <h2>Welcome${fullName ? `, ${fullName}` : ''}!</h2>
    <p>Your account has been created successfully.</p>
    <p>Start planning your will with our AI assistant:</p>
    <a href="${appUrl}/chat" class="button">Start Chatting</a>
    <div class="footer">
      <p>${APP_NAME} — SmartWills.ai</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `Welcome to ${APP_NAME}`,
    html,
  });
}




import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/auth/forgot-password
 *
 * Server-side password reset using Supabase Auth with rate limiting.
 */
export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const rateLimitResult = await rateLimitAsync(`auth-forgot:${ip}`, {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json({ success: true });
  }

  // ── Parse & validate body ─────────────────────────────────────────
  let body: { email?: unknown; captchaToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  // ── CAPTCHA verification (required) ────────────────────────────────
  if (!captchaToken) {
    return NextResponse.json(
      { error: 'CAPTCHA verification is required' },
      { status: 400 }
    );
  }

  const turnstileResult = await verifyTurnstileToken(captchaToken, ip);
  if (!turnstileResult.success) {
    return NextResponse.json(
      { error: 'CAPTCHA verification failed' },
      { status: 403 }
    );
  }

  // ── Send reset email via Supabase Auth ────────────────────────────
  try {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
    }
  } catch (err) {
    console.error('Failed to send password reset email:', err);
  }

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true });
}


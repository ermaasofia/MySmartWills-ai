import { createClient } from '@/lib/supabase/server';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/auth/forgot-password
 *
 * Server-side password reset with rate limiting.
 * - Rate limited per IP: 3 attempts / 15 minutes
 * - Always returns success to prevent email enumeration
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
    // Still return success to prevent enumeration via rate limit timing
    return NextResponse.json({ success: true });
  }

  // ── Parse & validate body ─────────────────────────────────────────
  let body: { email?: unknown; captchaToken?: unknown; redirectTo?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

  // Validate redirectTo — must be absolute URL with same origin as the request.
  // Supabase's Redirect URLs allowlist provides defense-in-depth.
  const rawRedirect = typeof body.redirectTo === 'string' ? body.redirectTo : null;
  let redirectTo: string | undefined;
  if (rawRedirect) {
    try {
      const parsed = new URL(rawRedirect);
      const requestUrl = new URL(request.url);
      if (parsed.origin === requestUrl.origin) {
        redirectTo = rawRedirect;
      }
    } catch {
      // Invalid URL — leave redirectTo undefined so Supabase falls back to Site URL
    }
  }

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  // ── Send reset email via Supabase ───────────────────────────────
  // Supabase verifies the Turnstile token itself when captcha protection
  // is enabled in Auth settings. Don't verify here too — Turnstile tokens
  // are single-use, so a double-verify produces "timeout-or-duplicate".
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
    captchaToken: captchaToken || undefined,
  });

  // Always return success to prevent email enumeration
  return NextResponse.json({ success: true });
}

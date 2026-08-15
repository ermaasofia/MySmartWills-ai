import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/signup
 *
 * Server-side signup using Supabase Auth with rate limiting and CAPTCHA verification.
 */
export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const rateLimitResult = await rateLimitAsync(`auth-signup:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please wait before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  // ── Parse & validate body ─────────────────────────────────────────
  let body: {
    email?: unknown;
    password?: unknown;
    fullName?: unknown;
    captchaToken?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 320) : '';
  const password = typeof body.password === 'string' ? body.password.slice(0, 1000) : '';
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim().slice(0, 200) : '';
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Password strength check
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // ── Verify Turnstile CAPTCHA server-side ──────────────────────────
  if (!captchaToken) {
    return NextResponse.json(
      { error: 'CAPTCHA verification is required' },
      { status: 400 }
    );
  }

  const turnstileResult = await verifyTurnstileToken(captchaToken, ip);
  if (!turnstileResult.success) {
    return NextResponse.json(
      { error: turnstileResult.error || 'CAPTCHA verification failed. Please try again.' },
      { status: 403 }
    );
  }

  // ── Create account via Supabase Auth ──────────────────────────────
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
          role: 'user',
        },
      },
    });

    if (error) {
      // Handle duplicate email
      if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: 'Unable to create account. Please try again.' },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Unable to create account. Please try again.' },
        { status: 400 }
      );
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, fullName || null).catch(err =>
      console.error('Failed to send welcome email:', err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Unable to create account. Please try again.' },
      { status: 400 }
    );
  }
}


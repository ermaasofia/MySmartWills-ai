import { createClient } from '@/lib/supabase/server';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/auth/login
 *
 * Server-side login with rate limiting.
 * - Rate limited per IP: 5 attempts / 5 minutes
 * - Validates input before forwarding to Supabase
 * - Returns generic error messages to prevent user enumeration
 */
export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const rateLimitResult = await rateLimitAsync(`auth-login:${ip}`, {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait a few minutes.' },
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
  let body: { email?: unknown; password?: unknown; captchaToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : undefined;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // ── Authenticate via Supabase ───────────────────────────────────
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

  if (error) {
    // Generic message to prevent user enumeration
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true });
}

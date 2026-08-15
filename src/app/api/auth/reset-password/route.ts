import { createClient } from '@/lib/supabase/server';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * POST /api/auth/reset-password
 *
 * Updates the user's password using Supabase Auth.
 */
export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const rateLimitResult = await rateLimitAsync(`auth-reset:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait before trying again.' },
      { status: 429 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';

  if (!password) {
    return NextResponse.json(
      { error: 'Password is required' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // ── Update password via Supabase Auth ─────────────────────────────
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Password update error:', error);
      return NextResponse.json(
        { error: 'Failed to update password. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to update password. Please try again.' },
      { status: 400 }
    );
  }
}


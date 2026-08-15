/**
 * Supabase Middleware Session Management
 *
 * Uses @supabase/ssr to manage the session cookie in middleware.
 * Refreshes the session and applies CSP headers.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'sw_session';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session / validate token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user has an old JWT cookie (sw_session), migrate it by clearing it.
  // Supabase uses its own cookie names, so the old cookie will be orphaned.
  const oldToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (oldToken && !user) {
    // Invalid old session — clear it
    supabaseResponse.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
  }

  // ── CSP Headers ─────────────────────────────────────────────
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.googleusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  supabaseResponse.headers.set('Content-Security-Policy', csp.join('; '));

  return supabaseResponse;
}


import { createClient } from '@/lib/supabase/server';
import { rateLimitAsync } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

type OAuthProvider = 'google';
const ALLOWED_PROVIDERS: OAuthProvider[] = ['google'];

/**
 * POST /api/auth/oauth
 *
 * Server-side OAuth URL generation.
 * - Rate limited per IP: 10 attempts / 10 minutes
 * - Validates provider against allow-list
 * - Uses PKCE (handled by Supabase SSR client) for security
 * - Returns the provider redirect URL to the client
 */
export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const headersList = await headers();
  const ip =
    headersList.get('cf-connecting-ip') ??    // Cloudflare
    headersList.get('x-real-ip') ??           // Nginx / proxy
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown';

  const rateLimitResult = await rateLimitAsync(`oauth:${ip}`, {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
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
  let body: { provider?: unknown; redirectTo?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const provider = body.provider as string;
  if (!ALLOWED_PROVIDERS.includes(provider as OAuthProvider)) {
    return NextResponse.json(
      { error: 'Invalid OAuth provider' },
      { status: 400 }
    );
  }

  // Validate redirectTo (safe relative path only, or omitted)
  const rawRedirect = typeof body.redirectTo === 'string' ? body.redirectTo : null;
  const safeRedirect =
    rawRedirect &&
    rawRedirect.startsWith('/') &&
    !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/chat';

  // ── Build absolute callback URL ───────────────────────────────────
  // Always derive the origin from the actual incoming request.
  // This automatically gives http://localhost:3000 on local dev and
  // https://www.aismartwills.me on production — no env vars needed.
  // NEXT_PUBLIC_SITE_URL can force-override (e.g. behind a reverse proxy).
  const requestOrigin = new URL(request.url).origin;
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? requestOrigin;

  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`;

  // ── Generate OAuth URL via Supabase (PKCE flow) ───────────────────
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as OAuthProvider,
    options: {
      redirectTo: callbackUrl,
      skipBrowserRedirect: true, // we return the URL; client does the redirect
      queryParams:
        provider === 'google'
          ? { access_type: 'offline', prompt: 'select_account' }
          : undefined,
    },
  });

  if (error || !data.url) {
    console.error('[OAuth] Supabase error:', error);
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.url });
}

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isBootstrapMode } from '@/lib/admin';

function generateNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr));
}

function buildCsp(nonce: string, isHttps: boolean): string {
  // script-src removes 'unsafe-inline' (the main security gain) and instead
  // allows: same-origin Next.js bundles ('self'), inline scripts with our
  // per-request nonce (JSON-LD, next-themes), and the two Cloudflare hosts
  // for Turnstile + Insights. We deliberately omit 'strict-dynamic' because
  // @marsidev/react-turnstile injects its loader script via DOM APIs that
  // can break the trust chain — the explicit host allowlist is more reliable.
  // style-src keeps 'unsafe-inline' until Tailwind/framer inline styles are
  // migrated (tracked as a separate follow-up).
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "connect-src 'self' https://*.supabase.co https://api.groq.com https://generativelanguage.googleapis.com https://challenges.cloudflare.com https://*.upstash.io",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  // Only emit upgrade-insecure-requests on HTTPS origins. On http://localhost
  // it causes the browser to upgrade subsequent navigations to https://, which
  // fails because the local dev server has no TLS cert.
  if (isHttps) directives.push('upgrade-insecure-requests');
  return directives.join('; ');
}

export async function updateSession(request: NextRequest) {
  const nonce = generateNonce();
  const isHttps =
    request.nextUrl.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https';
  const csp = buildCsp(nonce, isHttps);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

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
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your application
  // vulnerable to security issues.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/chat') ||
     request.nextUrl.pathname.startsWith('/admin'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes - verify admin role (defense-in-depth: middleware + layout + API)
  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdminByRole = profile?.role === 'admin';

    // Bootstrap-only fallback: ADMIN_EMAILS is honored only until the first
    // admin row exists in profiles. After that, profiles.role is authoritative.
    let isAdminByEmail = false;
    if (!isAdminByRole && user.email && (await isBootstrapMode(supabase))) {
      const adminEmails = (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      isAdminByEmail = adminEmails.includes(user.email.toLowerCase());
    }

    if (!isAdminByRole && !isAdminByEmail) {
      const url = request.nextUrl.clone();
      url.pathname = '/chat';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/chat';
    return NextResponse.redirect(url);
  }

  // Add security headers to all responses
  supabaseResponse.headers.set('Content-Security-Policy', csp);
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  return supabaseResponse;
}

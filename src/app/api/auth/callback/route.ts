import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/auth/callback
 *
 * Auth callback handler used by Supabase Auth (OAuth, email verification, etc.).
 * Exchanges the auth code for a session and redirects the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirectTo = searchParams.get('redirectTo') || '/chat';

  // Handle OAuth errors
  if (error) {
    const errorMsg =
      error === 'access_denied'
        ? 'Sign-in was cancelled'
        : errorDescription || 'Authentication failed. Please try again.';
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorMsg)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Missing authorization code')}`
    );
  }

  try {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Auth code exchange error:', exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`
      );
    }

    // Redirect to the intended destination
    const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/chat';

    return NextResponse.redirect(`${origin}${safeRedirect}`);
  } catch (err) {
    console.error('Auth callback error:', err);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}


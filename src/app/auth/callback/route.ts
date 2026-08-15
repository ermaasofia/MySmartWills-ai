import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Validate redirect to prevent open redirect attacks
function getSafeRedirect(url: string | null): string {
  if (!url) return '/chat';
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  return '/chat';
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = getSafeRedirect(searchParams.get('next'));
  const errorCode = searchParams.get('error_code');
  const providerError = searchParams.get('error');

  // Handle errors from OAuth provider
  if (providerError) {
    if (errorCode === 'otp_expired' && next === '/reset-password') {
      return NextResponse.redirect(
        `${origin}/forgot-password?error=${encodeURIComponent('Reset link has expired. Please request a new one.')}`
      );
    }

    const errorMsg =
      providerError === 'access_denied'
        ? 'Sign-in was cancelled'
        : 'Authentication failed. Please try again.';
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorMsg)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Missing authorization code')}`);
  }

  try {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] Code exchange failed:', error);

      // Handle password reset link errors specifically
      if (next === '/reset-password') {
        return NextResponse.redirect(
          `${origin}/forgot-password?error=${encodeURIComponent('Reset link is invalid or expired. Please request a new one.')}`
        );
      }

      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
    }

    // Successful auth — redirect to the intended destination
    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Could not authenticate user')}`);
  }
}


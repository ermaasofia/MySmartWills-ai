import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Validate redirect to prevent open redirect attacks
function getSafeRedirect(url: string | null): string {
  if (!url) return '/chat';
  // Only allow relative paths starting with / (not //)
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

  // Handle errors from Supabase (OAuth denied, OTP expired, etc.)
  const providerError = searchParams.get('error');
  if (providerError) {
    // If this was a password reset attempt and the link expired
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

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error.message);

    // If code exchange failed for a password reset, redirect back to forgot-password
    if (next === '/reset-password') {
      return NextResponse.redirect(
        `${origin}/forgot-password?error=${encodeURIComponent('Reset link is invalid. Please request a new one.')}`
      );
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}

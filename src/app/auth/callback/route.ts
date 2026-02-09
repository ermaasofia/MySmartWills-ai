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
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = getSafeRedirect(searchParams.get('next'));

  console.log('Auth callback params:', { code: !!code, token_hash: !!token_hash, type, next });

  // Handle PKCE flow (code exchange)
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log('Code exchange result:', { success: !!data.session, error: error?.message });
    
    if (!error) {
      // For password recovery, always redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Code exchange error:', error);
    }
  }

  // Handle token hash flow (older method, still used for password reset)
  if (token_hash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    console.log('Token hash verification result:', { success: !!data.session, error: error?.message });

    if (!error) {
      // For password recovery, always redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Token hash verification error:', error);
    }
  }

  console.log('No valid auth flow detected, redirecting to reset-password for recovery type');
  
  // If type is recovery, redirect to reset password page anyway
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}

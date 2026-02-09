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

  // Handle PKCE flow (code exchange)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // For password recovery, always redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle token hash flow (older method, still used for password reset)
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // For password recovery, always redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}

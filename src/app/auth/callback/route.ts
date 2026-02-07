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

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}

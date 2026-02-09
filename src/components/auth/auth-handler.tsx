'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Auth Handler Component
 * Detects auth codes in URL and redirects to callback route for processing
 * This handles cases where Supabase redirects to homepage instead of callback
 */
export function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // If auth code exists, redirect to callback route to process it
    if (code) {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      
      // Only redirect if we're NOT already on the callback route
      if (!url.pathname.includes('/auth/callback')) {
        // Preserve all query parameters
        const callbackUrl = `/auth/callback?${url.searchParams.toString()}`;
        router.replace(callbackUrl);
      }
    }

    // Handle auth errors
    if (error) {
      console.error('Auth error:', error, errorDescription);
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}

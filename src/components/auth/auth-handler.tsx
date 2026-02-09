'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Auth Handler Component
 * Listens for Supabase PASSWORD_RECOVERY auth event
 * and redirects to the reset password page.
 * This handles cases where Supabase redirects to the homepage
 * instead of the auth callback route.
 */
export function AuthHandler() {
  const hasRedirected = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !hasRedirected.current) {
        hasRedirected.current = true;
        // Use window.location for a full page redirect (most reliable)
        window.location.href = '/reset-password';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}

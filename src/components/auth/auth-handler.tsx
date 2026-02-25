'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Auth Handler Component
 *
 * 1. Listens for PASSWORD_RECOVERY events and redirects to /reset-password.
 * 2. Safety-net: if Supabase drops the OAuth `?code=` on a non-callback page
 *    (e.g. the homepage), this detects it and forwards to /auth/callback so the
 *    session can be exchanged properly.
 */
export function AuthHandler() {
  const hasRedirected = useRef(false);

  useEffect(() => {
    // ── Safety-net: forward stray OAuth codes to /auth/callback ──────
    // This happens when Supabase's Site URL is set to the root domain and
    // the redirectTo URL isn't in the Redirect URLs allowlist.
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const currentPath = window.location.pathname;
    if (code && currentPath !== '/auth/callback' && !hasRedirected.current) {
      hasRedirected.current = true;
      // Preserve any ?next= param the callback route expects
      const next = params.get('next') ?? '/chat';
      window.location.replace(
        `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`
      );
      return;
    }

    // ── Handle PASSWORD_RECOVERY event ───────────────────────────────
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !hasRedirected.current) {
        hasRedirected.current = true;
        window.location.href = '/reset-password';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}

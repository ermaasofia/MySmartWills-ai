'use client';

import { useEffect, useRef } from 'react';

/**
 * Auth Handler Component
 *
 * Handles auth-related client-side redirects:
 * 1. Safety-net: forwards stray OAuth `?code=` params to /auth/callback
 * 2. Checks URL params for password reset flow
 */
export function AuthHandler() {
  const hasRedirected = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const currentPath = window.location.pathname;

    // Safety-net: forward stray OAuth codes to /auth/callback
    if (code && currentPath !== '/auth/callback' && !hasRedirected.current) {
      hasRedirected.current = true;
      const next = params.get('next') ?? '/chat';
      window.location.replace(
        `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`
      );
      return;
    }

    // Check if we're on the reset-password page with a token
    const token = params.get('token');
    if (token && currentPath === '/reset-password' && !hasRedirected.current) {
      hasRedirected.current = true;
      // The reset-password-form component handles the actual token exchange
      return;
    }
  }, []);

  return null;
}

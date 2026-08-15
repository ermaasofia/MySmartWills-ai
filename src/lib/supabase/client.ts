/**
 * Supabase Browser Client
 *
 * Creates an authenticated Supabase client for client-side usage using
 * the @supabase/ssr package.
 */

import { createBrowserClient } from '@supabase/ssr';

export type AuthChangeCallback = (event: string) => void;

interface AuthSubscription {
  subscription: { unsubscribe: () => void };
}

interface ClientAuthAPI {
  signOut: () => Promise<{ error: null }>;
  onAuthStateChange: (callback: AuthChangeCallback) => AuthSubscription;
}

interface ClientSupabaseClient {
  auth: ClientAuthAPI;
}

export function createClient(): ClientSupabaseClient {
  // Return a compat shim that mirrors the old interface
  return {
    auth: {
      signOut: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/';
        } catch {
          window.location.href = '/';
        }
        return { error: null };
      },
      onAuthStateChange: (callback: AuthChangeCallback) => {
        const handler = (event: Event) => {
          const customEvent = event as CustomEvent;
          if (customEvent.detail?.event) {
            callback(customEvent.detail.event);
          }
        };
        window.addEventListener('sw-auth-change', handler);

        return {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('sw-auth-change', handler);
            },
          },
        };
      },
    },
  };
}

// Helper to dispatch auth state changes from anywhere in the client
export function dispatchAuthChange(event: string): void {
  window.dispatchEvent(
    new CustomEvent('sw-auth-change', { detail: { event } })
  );
}


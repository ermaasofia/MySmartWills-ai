'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OAuthButtonsProps {
  /** Relative path to redirect to after successful OAuth sign-in */
  redirectTo?: string;
  /** Label context shown in the divider: "login" or "signup" */
  mode?: 'login' | 'signup';
}

type OAuthProvider = 'google';

// Google SVG (official brand mark, monochrome-safe)
function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 488 512"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z" />
    </svg>
  );
}

const PROVIDER_CONFIG: Record<
  OAuthProvider,
  { label: string; loadingLabel: string; icon: React.ReactNode; colorClass: string }
> = {
  google: {
    label: 'Continue with Google',
    loadingLabel: 'Connecting to Google…',
    icon: <GoogleIcon />,
    colorClass:
      'border-[var(--border)] bg-white/[0.04] text-[#ededed] hover:bg-white/[0.08]',
  },
};

export function OAuthButtons({ redirectTo = '/chat', mode = 'login' }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    if (loadingProvider) return; // prevent double-click
    setError(null);
    setLoadingProvider(provider);

    try {
      // Use server-side endpoint for rate limiting and PKCE security
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          redirectTo,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to start Google sign-in. Please try again.');
        setLoadingProvider(null);
        return;
      }

      // Server returns the provider URL — redirect to it
      window.location.href = data.url;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoadingProvider(null);
    }
  };

  const dividerText = mode === 'login' ? 'or sign in with' : 'or sign up with';

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-[var(--border)]" />
        <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-white/45 whitespace-nowrap">
          {dividerText}
        </span>
        <div className="flex-1 border-t border-[var(--border)]" />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[10px] border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {(Object.keys(PROVIDER_CONFIG) as OAuthProvider[]).map((provider) => {
          const config = PROVIDER_CONFIG[provider];
          const isLoading = loadingProvider === provider;
          const isDisabled = !!loadingProvider;

          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              className={`w-full flex items-center justify-center gap-2 transition-colors ${config.colorClass}`}
              disabled={isDisabled}
              onClick={() => handleOAuth(provider)}
              aria-label={config.label}
            >
              {config.icon}
              {isLoading ? config.loadingLabel : config.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

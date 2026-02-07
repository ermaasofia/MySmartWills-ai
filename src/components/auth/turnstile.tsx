'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error('Cloudflare Turnstile site key is not configured');
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      options={{
        theme: 'auto',
        size: 'normal',
      }}
    />
  );
}

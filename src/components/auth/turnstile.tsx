'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onSuccess, onError }, ref) => {
    const turnstileRef = useRef<TurnstileInstance>(null);
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
      },
    }));

    if (!siteKey) {
      console.error('Cloudflare Turnstile site key is not configured');
      return null;
    }

    return (
      <Turnstile
        ref={turnstileRef}
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
);

TurnstileWidget.displayName = 'TurnstileWidget';

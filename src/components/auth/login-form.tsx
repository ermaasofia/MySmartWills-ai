'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurnstileWidget, TurnstileWidgetRef } from './turnstile';
import { OAuthButtons } from './oauth-buttons';
import { CAPTCHA_ERROR } from '@/lib/validation';

// Validate redirect URL to prevent open redirect attacks
function getSafeRedirect(url: string | null): string {
  if (!url) return '/chat';
  // Only allow relative paths starting with /
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  return '/chat';
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!turnstileToken) {
      setError(CAPTCHA_ERROR);
      return;
    }

    setLoading(true);

    try {
      // Use server-side endpoint for rate limiting and generic error messages
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          captchaToken: turnstileToken ?? undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Invalid email or password');
        // Reset Turnstile to get a new token for next attempt
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      // Reset Turnstile to get a new token for next attempt
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <OAuthButtons redirectTo={redirectTo} mode="login" />

      <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={8}
          autoComplete="current-password"
        />
      </div>

      <div className="flex justify-center">
        <TurnstileWidget
          ref={turnstileRef}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !turnstileToken}>
        {loading && <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />}
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
    </div>
  );
}

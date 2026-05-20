'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validatePasswordStrength } from '@/lib/validation';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  // Verify the user has a valid recovery session before showing the form
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      // A valid recovery session is set by Supabase after the user clicks the reset link
      if (!session) {
        setValidSession(false);
        return;
      }
      setValidSession(true);
    };
    checkSession();
  }, []);

  if (validSession === null) {
    return (
      <div className="text-center p-6">
        <span className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
        <p className="mt-2 text-muted-foreground">Validating reset session...</p>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="text-center p-6 border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Invalid or Expired Link</h2>
        <p className="text-muted-foreground mb-4">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Button variant="outline" onClick={() => router.push('/forgot-password')}>
          Request New Link
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError('Failed to update password. The reset link may have expired.');
        return;
      }

      setSuccess(true);
      // Redirect to chat after 3 seconds
      setTimeout(() => {
        router.push('/chat');
        router.refresh();
      }, 3000);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6 border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Password Updated</h2>
        <p className="text-muted-foreground mb-4">
          Your password has been successfully reset. Redirecting you now...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-sm text-muted-foreground">
          Must contain uppercase, lowercase, and a number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />}
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}

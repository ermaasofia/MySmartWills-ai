/**
 * Returns true if the request origin is allowed (or absent — non-browser callers).
 * Mirrors the allowlist used originally on /api/chat: NEXT_PUBLIC_APP_URL, its
 * www. variant, and localhost in development. Use for state-changing endpoints
 * to block cross-origin requests that ride along on the user's auth cookie.
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://smartwills.ai').replace(/\/+$/, '');
  const allowed = [
    appUrl,
    appUrl.replace('://', '://www.'),
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
  ];
  return allowed.includes(origin);
}

/**
 * Validates password strength requirements.
 * Returns an error message string if invalid, or null if valid.
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Password must contain uppercase, lowercase, and a number';
  }

  return null;
}

export const CAPTCHA_ERROR = 'Please complete the security check';

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

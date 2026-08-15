'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { validatePasswordStrength } from '@/lib/validation';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resetToken,
    setResetToken,
  ] = useState<string | null>(null);

  /* =========================================================
     RESET TOKEN
  ========================================================= */

  useEffect(() => {
    const token =
      searchParams.get('token');

    if (!token) {
      setError(
        'Missing reset token. Please request a new password reset link.'
      );

      return;
    }

    setResetToken(token);
  }, [searchParams]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);

    const passwordError =
      validatePasswordStrength(
        password
      );

    if (passwordError) {
      setError(
        passwordError
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match'
      );

      return;
    }

    if (!resetToken) {
      setError(
        'Reset token is missing. Please request a new password reset link.'
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          '/api/auth/reset-password',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                {
                  token:
                    resetToken,

                  password,
                }
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            'Failed to update password. The reset link may have expired.'
        );

        return;
      }

      setSuccess(true);

      /* Redirect after success */

      setTimeout(() => {
        router.push(
          '/chat'
        );

        router.refresh();
      }, 3000);
    } catch {
      setError(
        'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VALIDATING RESET LINK
  ========================================================= */

  if (
    resetToken === null &&
    !error
  ) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          px-6
          py-10
          text-center
        "
      >
        <span
          className="
            h-6
            w-6
            animate-spin
            rounded-full
            border-2
            border-[#a42025]/15
            border-t-[#a42025]
          "
        />

        <p
          className="
            mb-0
            mt-4
            text-[12px]
            font-medium
            text-[#888888]
          "
        >
          Validating reset link...
        </p>
      </div>
    );
  }

  /* =========================================================
     INVALID / EXPIRED LINK
  ========================================================= */

  if (
    error &&
    !resetToken
  ) {
    return (
      <div
        className="
          rounded-[14px]
          border
          border-[#a42025]/15
          bg-[#a42025]/[0.03]
          px-6
          py-8
          text-center
        "
      >
        {/* ICON */}

        <div
          className="
            mx-auto
            mb-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[#a42025]/[0.08]
            text-[20px]
            font-semibold
            text-[#a42025]
          "
        >
          !
        </div>

        {/* TITLE */}

        <h2
          className="
            m-0
            font-serif
            text-[24px]
            font-semibold
            tracking-[-0.03em]
            text-[#171717]
          "
        >
          Invalid or Expired Link
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            mx-auto
            mb-6
            mt-3
            max-w-[330px]
            text-[13px]
            leading-[1.7]
            text-[#777777]
          "
        >
          {error}
        </p>

        {/* REQUEST NEW LINK */}

        <Button
          type="button"
          onClick={() =>
            router.push(
              '/forgot-password'
            )
          }
          className="
            h-10
            rounded-[9px]
            bg-[#a42025]!
            px-5
            text-[12px]
            font-semibold
            text-white

            hover:bg-[#891b1f]!
          "
        >
          Request New Link
        </Button>
      </div>
    );
  }

  /* =========================================================
     SUCCESS
  ========================================================= */

  if (success) {
    return (
      <div
        className="
          rounded-[14px]
          border
          border-[#a42025]/15
          bg-[#a42025]/[0.03]
          px-6
          py-8
          text-center
        "
      >
        {/* SUCCESS ICON */}

        <div
          className="
            mx-auto
            mb-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[#a42025]/[0.08]
            text-[20px]
            font-semibold
            text-[#a42025]
          "
        >
          ✓
        </div>

        {/* TITLE */}

        <h2
          className="
            m-0
            font-serif
            text-[24px]
            font-semibold
            tracking-[-0.03em]
            text-[#171717]
          "
        >
          Password Updated
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            mx-auto
            mb-0
            mt-3
            max-w-[330px]
            text-[13px]
            leading-[1.7]
            text-[#777777]
          "
        >
          Your password has been
          successfully reset.
          Redirecting you now...
        </p>

        {/* REDIRECTING */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            text-[10px]
            font-medium
            text-[#999999]
          "
        >
          <span
            className="
              h-3.5
              w-3.5
              animate-spin
              rounded-full
              border-2
              border-[#a42025]/15
              border-t-[#a42025]
            "
          />

          Opening SmartWills...
        </div>
      </div>
    );
  }

  /* =========================================================
     RESET PASSWORD FORM
  ========================================================= */

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5"
    >
      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div
          className="
            rounded-[10px]
            border
            border-[#a42025]/20
            bg-[#a42025]/[0.05]
            px-4
            py-3
            text-[12px]
            font-medium
            leading-[1.5]
            text-[#a42025]
          "
        >
          {error}
        </div>
      )}

      {/* =====================================
          NEW PASSWORD
      ===================================== */}

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="
            text-[13px]
            font-semibold
            text-[#242424]
          "
        >
          New Password
        </Label>

        <Input
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={
            password
          }
          onChange={(
            e
          ) =>
            setPassword(
              e.target.value
            )
          }
          required
          disabled={
            loading
          }
          minLength={8}
          autoComplete="new-password"
          className="
            h-11
            rounded-[10px]
            border-[#dedede]
            bg-white
            px-4
            text-[13px]
            text-[#171717]
            shadow-none

            placeholder:text-[#a0a0a0]

            hover:border-[#cccccc]

            focus-visible:border-[#a42025]
            focus-visible:ring-2
            focus-visible:ring-[#a42025]/10

            disabled:bg-[#f5f5f5]
            disabled:text-[#999999]
          "
        />

        <p
          className="
            m-0
            text-[10px]
            leading-[1.5]
            text-[#999999]
          "
        >
          Must contain uppercase,
          lowercase, and a number.
        </p>
      </div>

      {/* =====================================
          CONFIRM PASSWORD
      ===================================== */}

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="
            text-[13px]
            font-semibold
            text-[#242424]
          "
        >
          Confirm New Password
        </Label>

        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={
            confirmPassword
          }
          onChange={(
            e
          ) =>
            setConfirmPassword(
              e.target.value
            )
          }
          required
          disabled={
            loading
          }
          minLength={8}
          autoComplete="new-password"
          className="
            h-11
            rounded-[10px]
            border-[#dedede]
            bg-white
            px-4
            text-[13px]
            text-[#171717]
            shadow-none

            placeholder:text-[#a0a0a0]

            hover:border-[#cccccc]

            focus-visible:border-[#a42025]
            focus-visible:ring-2
            focus-visible:ring-[#a42025]/10

            disabled:bg-[#f5f5f5]
            disabled:text-[#999999]
          "
        />
      </div>

      {/* =====================================
          UPDATE PASSWORD BUTTON
      ===================================== */}

      <Button
        type="submit"
        disabled={
          loading
        }
        className="
          h-11
          w-full
          rounded-[10px]

          bg-[#a42025]!

          text-[13px]
          font-semibold
          text-white

          shadow-[0_7px_18px_rgba(164,32,37,0.18)]

          transition-all

          hover:bg-[#891b1f]!
          hover:shadow-[0_9px_22px_rgba(164,32,37,0.24)]

          focus-visible:ring-2
          focus-visible:ring-[#a42025]/20

          disabled:bg-[#a42025]!
          disabled:text-white
          disabled:opacity-60
        "
      >
        {loading && (
          <span
            className="
              mr-2
              inline-block
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-white/40
              border-t-white
            "
          />
        )}

        {loading
          ? 'Updating...'
          : 'Update Password'}
      </Button>

      {/* =====================================
          SECURITY NOTE
      ===================================== */}

      <p
        className="
          m-0
          text-center
          text-[9px]
          leading-[1.5]
          text-[#a0a0a0]
        "
      >
        Choose a strong password that
        you do not use for other
        accounts.
      </p>
    </form>
  );
}
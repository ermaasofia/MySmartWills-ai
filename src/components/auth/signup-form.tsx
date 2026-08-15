'use client';

import {
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  TurnstileWidget,
  type TurnstileWidgetRef,
} from './turnstile';

import { OAuthButtons } from './oauth-buttons';

import {
  CAPTCHA_ERROR,
  validatePasswordStrength,
} from '@/lib/validation';

export function SignupForm() {
  const router = useRouter();

  const turnstileRef =
    useRef<TurnstileWidgetRef>(null);

  const [
    fullName,
    setFullName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

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
    turnstileToken,
    setTurnstileToken,
  ] = useState<string | null>(null);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);

    if (!turnstileToken) {
      setError(
        CAPTCHA_ERROR
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

    setLoading(true);

    try {
      const res =
        await fetch(
          '/api/auth/signup',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                {
                  email,
                  password,
                  fullName,
                  captchaToken:
                    turnstileToken,
                }
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            'Unable to create account. Please try again.'
        );

        setTurnstileToken(
          null
        );

        turnstileRef.current?.reset();

        return;
      }

      setSuccess(true);
    } catch {
      setError(
        'An unexpected error occurred'
      );

      setTurnstileToken(
        null
      );

      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

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
          Check your email
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
          We&apos;ve sent you a
          confirmation link. Please
          check your email to verify
          your account.
        </p>

        {/* SIGN IN */}

        <Button
          type="button"
          onClick={() =>
            router.push(
              '/login'
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
          Go to Sign In
        </Button>
      </div>
    );
  }

  /* =========================================================
     SIGNUP FORM
  ========================================================= */

  return (
    <div>
      {/* =========================================
          SOCIAL LOGIN
      ========================================= */}

      <OAuthButtons
        redirectTo="/chat"
        mode="signup"
      />

      {/* =========================================
          DIVIDER
      ========================================= */}

      <div
        className="
          my-6
          flex
          items-center
          gap-4
        "
      >
        <div className="h-px flex-1 bg-[#ececec]" />

        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#a0a0a0]
          "
        >
          Or sign up with email
        </span>

        <div className="h-px flex-1 bg-[#ececec]" />
      </div>

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
            FULL NAME
        ===================================== */}

        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="
              text-[13px]
              font-semibold
              text-[#242424]
            "
          >
            Full Name
          </Label>

          <Input
            id="fullName"
            type="text"
            placeholder="Your Name"
            value={
              fullName
            }
            onChange={(
              e
            ) =>
              setFullName(
                e.target.value
              )
            }
            required
            disabled={
              loading
            }
            autoComplete="name"
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
            "
          />
        </div>

        {/* =====================================
            EMAIL
        ===================================== */}

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="
              text-[13px]
              font-semibold
              text-[#242424]
            "
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={
              email
            }
            onChange={(
              e
            ) =>
              setEmail(
                e.target.value
              )
            }
            required
            disabled={
              loading
            }
            autoComplete="email"
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
            "
          />
        </div>

        {/* =====================================
            PASSWORD
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
            Password
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="Create a password"
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
            Minimum 8 characters with
            uppercase, lowercase, and
            number.
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
            Confirm Password
          </Label>

          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
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
            "
          />
        </div>

        {/* =====================================
            TURNSTILE
        ===================================== */}

        <div
          className="
            flex
            justify-center
            py-1
          "
        >
          <TurnstileWidget
            ref={
              turnstileRef
            }
            onSuccess={(
              token
            ) =>
              setTurnstileToken(
                token
              )
            }
            onError={() =>
              setTurnstileToken(
                null
              )
            }
          />
        </div>

        {/* =====================================
            CREATE ACCOUNT BUTTON
        ===================================== */}

        <Button
          type="submit"
          disabled={
            loading ||
            !turnstileToken
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
            ? 'Creating account...'
            : 'Create Account'}
        </Button>

        {/* SECURITY */}

        <p
          className="
            m-0
            text-center
            text-[9px]
            leading-[1.5]
            text-[#a0a0a0]
          "
        >
          Your account information is
          protected and kept private.
        </p>
      </form>
    </div>
  );
}
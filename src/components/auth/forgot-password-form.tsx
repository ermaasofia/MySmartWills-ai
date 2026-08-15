'use client';

import {
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  TurnstileWidget,
  type TurnstileWidgetRef,
} from './turnstile';

import { CAPTCHA_ERROR } from '@/lib/validation';

export function ForgotPasswordForm() {
  const turnstileRef =
    useRef<TurnstileWidgetRef>(null);

  const [
    email,
    setEmail,
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

    setLoading(true);

    try {
      const res =
        await fetch(
          '/api/auth/forgot-password',
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

                  captchaToken:
                    turnstileToken ??
                    undefined,

                  redirectTo:
                    `${window.location.origin}/auth/callback?next=/reset-password`,
                }
              ),
          }
        );

      if (!res.ok) {
        const data =
          await res.json();

        setError(
          data.error ||
            'An unexpected error occurred. Please try again.'
        );

        setTurnstileToken(
          null
        );

        turnstileRef.current?.reset();

        return;
      }

      /*
       * Always show success
       * to prevent email enumeration.
       */
      setSuccess(true);
    } catch {
      setError(
        'An unexpected error occurred. Please try again.'
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
            mb-0
            mt-3
            max-w-[340px]
            text-[13px]
            leading-[1.7]
            text-[#777777]
          "
        >
          If an account exists with
          that email, we&apos;ve sent
          a password reset link.
          Please check your inbox and
          spam folder.
        </p>

        {/* EXPIRY NOTE */}

        <div
          className="
            mx-auto
            mt-5
            w-fit
            rounded-full
            border
            border-[#e5e5e5]
            bg-white
            px-3
            py-1.5
            text-[9px]
            font-medium
            text-[#888888]
            shadow-[0_3px_10px_rgba(0,0,0,0.025)]
          "
        >
          Reset link expires in 1 hour
        </div>
      </div>
    );
  }

  /* =========================================================
     FORM
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
          Email Address
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

            disabled:bg-[#f5f5f5]
            disabled:text-[#999999]
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
          SEND RESET LINK
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
          ? 'Sending...'
          : 'Send Reset Link'}
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
        For your security, we do not
        reveal whether an email is
        registered.
      </p>
    </form>
  );
}
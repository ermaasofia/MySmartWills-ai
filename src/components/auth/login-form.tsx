'use client';

import {
  useState,
  useRef,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  TurnstileWidget,
  TurnstileWidgetRef,
} from './turnstile';

import { OAuthButtons } from './oauth-buttons';

import { CAPTCHA_ERROR } from '@/lib/validation';

/* =========================================================
   SAFE REDIRECT
========================================================= */

function getSafeRedirect(
  url: string | null
): string {
  if (!url) {
    return '/chat';
  }

  if (
    url.startsWith('/') &&
    !url.startsWith('//')
  ) {
    return url;
  }

  return '/chat';
}

/* =========================================================
   LOGIN FORM
========================================================= */

export function LoginForm() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const redirectTo =
    getSafeRedirect(
      searchParams.get(
        'redirect'
      )
    );

  const turnstileRef =
    useRef<TurnstileWidgetRef>(
      null
    );

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    turnstileToken,
    setTurnstileToken,
  ] =
    useState<
      string | null
    >(null);

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      setError(null);

      if (
        !turnstileToken
      ) {
        setError(
          CAPTCHA_ERROR
        );

        return;
      }

      setLoading(true);

      try {
        const res =
          await fetch(
            '/api/auth/login',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  {
                    email,
                    password,

                    captchaToken:
                      turnstileToken ??
                      undefined,
                  }
                ),
            }
          );

        if (!res.ok) {
          const data =
            await res.json();

          setError(
            data.error ||
              'Invalid email or password'
          );

          setTurnstileToken(
            null
          );

          turnstileRef.current?.reset();

          return;
        }

        router.push(
          redirectTo
        );

        router.refresh();
      } catch {
        setError(
          'An unexpected error occurred'
        );

        setTurnstileToken(
          null
        );

        turnstileRef.current?.reset();
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div>
      {/* =========================================
          SOCIAL LOGIN
      ========================================= */}

      <OAuthButtons
        redirectTo={
          redirectTo
        }
        mode="login"
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
          Or sign in with email
        </span>

        <div className="h-px flex-1 bg-[#ececec]" />
      </div>

      {/* =========================================
          LOGIN FORM
      ========================================= */}

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
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
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
            PASSWORD
        ===================================== */}

        <div className="space-y-2">
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
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

            <Link
              href="/forgot-password"
              className="
                text-[11px]
                font-medium
                text-[#777777]
                transition-colors

                hover:text-[#a42025]
              "
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
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
            autoComplete="current-password"
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
            CLOUDFLARE TURNSTILE
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
            SIGN IN
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
          {/* LOADING */}

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
            ? 'Signing in...'
            : 'Sign In'}
        </Button>

        {/* =====================================
            SECURITY
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
          Your account
          information is
          protected and kept
          private.
        </p>
      </form>
    </div>
  );
}
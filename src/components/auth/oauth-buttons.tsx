'use client';

import { useState } from 'react';

interface OAuthButtonsProps {
  redirectTo?: string;
  mode?: 'login' | 'signup';
}

type OAuthProvider =
  | 'google'
  | 'facebook';

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.9A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.49l3.35-2.59Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z"
      />
    </svg>
  );
}

/* =========================================================
   FACEBOOK ICON
========================================================= */

function FacebookIcon() {
  return (
    <div
      className="
        flex
        h-[18px]
        w-[18px]
        items-center
        justify-center
        rounded-full
        bg-[#1877F2]
        text-[13px]
        font-bold
        text-white
      "
    >
      f
    </div>
  );
}

/* =========================================================
   OAUTH BUTTONS
========================================================= */

export function OAuthButtons({
  redirectTo = '/chat',
}: OAuthButtonsProps) {
  const [
    loadingProvider,
    setLoadingProvider,
  ] = useState<OAuthProvider | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  /* =======================================================
     OAUTH HANDLER
  ======================================================= */

  const handleOAuth = async (
    provider: OAuthProvider
  ) => {
    if (loadingProvider) {
      return;
    }

    setError(null);
    setLoadingProvider(
      provider
    );

    try {
      const res =
        await fetch(
          '/api/auth/oauth',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              {
                provider,
                redirectTo,
              }
            ),
          }
        );

      const data =
        await res.json();

      if (
        !res.ok ||
        !data.url
      ) {
        setError(
          data.error ??
            `Failed to start ${provider} sign-in.`
        );

        setLoadingProvider(
          null
        );

        return;
      }

      window.location.assign(
        data.url
      );
    } catch {
      setError(
        'Network error. Please try again.'
      );

      setLoadingProvider(
        null
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-3">
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
          GOOGLE
      ===================================== */}

      <button
        type="button"
        onClick={() =>
          handleOAuth(
            'google'
          )
        }
        disabled={
          !!loadingProvider
        }
        className="
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-3
          rounded-[10px]
          border
          border-[#dedede]
          bg-white
          px-4
          text-[13px]
          font-semibold
          text-[#202020]
          shadow-[0_2px_8px_rgba(0,0,0,0.02)]
          transition-all

          hover:border-[#a42025]/20
          hover:bg-[#a42025]/[0.025]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#a42025]/15

          disabled:cursor-not-allowed
          disabled:bg-[#fafafa]
          disabled:opacity-60
        "
      >
        {loadingProvider ===
        'google' ? (
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-[#dddddd]
              border-t-[#a42025]
            "
          />
        ) : (
          <GoogleIcon />
        )}

        {loadingProvider ===
        'google'
          ? 'Connecting to Google...'
          : 'Continue with Google'}
      </button>

      {/* =====================================
          FACEBOOK
      ===================================== */}

      <button
        type="button"
        onClick={() =>
          handleOAuth(
            'facebook'
          )
        }
        disabled={
          !!loadingProvider
        }
        className="
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-3
          rounded-[10px]
          border
          border-[#dedede]
          bg-white
          px-4
          text-[13px]
          font-semibold
          text-[#202020]
          shadow-[0_2px_8px_rgba(0,0,0,0.02)]
          transition-all

          hover:border-[#a42025]/20
          hover:bg-[#a42025]/[0.025]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#a42025]/15

          disabled:cursor-not-allowed
          disabled:bg-[#fafafa]
          disabled:opacity-60
        "
      >
        {loadingProvider ===
        'facebook' ? (
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-[#dddddd]
              border-t-[#a42025]
            "
          />
        ) : (
          <FacebookIcon />
        )}

        {loadingProvider ===
        'facebook'
          ? 'Connecting to Facebook...'
          : 'Continue with Facebook'}
      </button>
    </div>
  );
}
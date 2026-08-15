import { createClient } from '@/lib/supabase/server';
import { rateLimitAsync } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/* =========================================================
   ALLOWED OAUTH PROVIDERS
========================================================= */

type OAuthProvider =
  | 'google'
  | 'facebook';

const ALLOWED_PROVIDERS: OAuthProvider[] = [
  'google',
  'facebook',
];

/* =========================================================
   POST /api/auth/oauth

   Generates the Supabase OAuth sign-in URL.

   Rate limit:
   10 attempts / 10 minutes / IP
========================================================= */

export async function POST(
  request: Request
) {
  /* =======================================================
     RATE LIMITING
  ======================================================= */

  const headersList =
    await headers();

  const ip =
    getClientIp(
      headersList
    );

  const rateLimitResult =
    await rateLimitAsync(
      `oauth:${ip}`,
      {
        maxRequests: 10,
        windowMs:
          10 *
          60 *
          1000,
      }
    );

  if (
    !rateLimitResult.success
  ) {
    return NextResponse.json(
      {
        error:
          'Too many requests. Please wait before trying again.',
      },
      {
        status: 429,

        headers: {
          'Retry-After':
            String(
              Math.ceil(
                (
                  rateLimitResult.resetAt -
                  Date.now()
                ) /
                  1000
              )
            ),
        },
      }
    );
  }

  /* =======================================================
     PARSE REQUEST
  ======================================================= */

  let body: {
    provider?: unknown;
    redirectTo?: unknown;
  };

  try {
    body =
      await request.json();
  } catch {
    return NextResponse.json(
      {
        error:
          'Invalid request body',
      },
      {
        status: 400,
      }
    );
  }

  /* =======================================================
     VALIDATE PROVIDER
  ======================================================= */

  const rawProvider =
    typeof body.provider ===
    'string'
      ? body.provider
      : '';

  if (
    !ALLOWED_PROVIDERS.includes(
      rawProvider as OAuthProvider
    )
  ) {
    return NextResponse.json(
      {
        error:
          'Invalid OAuth provider',
      },
      {
        status: 400,
      }
    );
  }

  const provider =
    rawProvider as OAuthProvider;

  /* =======================================================
     VALIDATE REDIRECT PATH

     Only allow local relative paths.

     Good:
     /chat
     /settings
     /chat?session=123

     Block:
     https://evil.com
     //evil.com
  ======================================================= */

  const rawRedirect =
    typeof body.redirectTo ===
    'string'
      ? body.redirectTo
      : null;

  const safeRedirect =
    rawRedirect &&
    rawRedirect.startsWith(
      '/'
    ) &&
    !rawRedirect.startsWith(
      '//'
    )
      ? rawRedirect
      : '/chat';

  /* =======================================================
     SITE ORIGIN
  ======================================================= */

  const requestOrigin =
    new URL(
      request.url
    ).origin;

  const origin =
    process.env
      .NEXT_PUBLIC_SITE_URL
      ?.replace(
        /\/$/,
        ''
      ) ??
    requestOrigin;

  /* =======================================================
     CREATE SUPABASE OAUTH URL
  ======================================================= */

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithOAuth(
        {
          /*
           * IMPORTANT:
           * Dynamic provider.
           *
           * google   -> Google OAuth
           * facebook -> Facebook OAuth
           */
          provider,

          options: {
            redirectTo:
              `${origin}/auth/callback?redirectTo=${encodeURIComponent(
                safeRedirect
              )}`,
          },
        }
      );

    /* =====================================================
       SUPABASE ERROR
    ===================================================== */

    if (error) {
      console.error(
        `OAuth ${provider} error:`,
        error
      );

      return NextResponse.json(
        {
          error:
            `Failed to initiate ${provider} sign-in`,
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       MISSING URL
    ===================================================== */

    if (!data.url) {
      return NextResponse.json(
        {
          error:
            'Failed to generate OAuth URL',
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        url:
          data.url,
      }
    );
  } catch (error) {
    console.error(
      `OAuth ${provider} error:`,
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to initiate OAuth sign-in',
      },
      {
        status: 500,
      }
    );
  }
}
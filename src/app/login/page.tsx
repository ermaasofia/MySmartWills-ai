import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { headers } from 'next/headers';

import { LoginForm } from '@/components/auth/login-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Sign In - SmartWills.ai',

  description:
    'Sign in to your SmartWills.ai account to access personalized will planning guidance.',

  openGraph: {
    title: 'Sign In - SmartWills.ai',

    description:
      'Sign in to your SmartWills.ai account to access personalized will planning guidance.',

    url: '/login',
  },
};

export default async function LoginPage() {
  const nonce =
    (await headers()).get(
      'x-nonce'
    ) ?? undefined;

  return (
    <>
      {/* =========================================
          STRUCTURED DATA
      ========================================= */}

      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              'Sign In',
              '/login'
            )
          ),
        }}
      />

      {/* =========================================
          AUTH PAGE
      ========================================= */}

      <AuthShell
        title="Welcome back"
        description="Sign in to continue your will planning."
        footer={
          <>
            <span>
              Don&apos;t have an
              account?{' '}
            </span>

            <Link
              href="/signup"
              className="
                font-semibold
                text-[#a42025]
                underline
                decoration-[#a42025]/30
                underline-offset-4
                transition-colors

                hover:text-[#891b1f]
                hover:decoration-[#891b1f]/50
              "
            >
              Sign up
            </Link>
          </>
        }
      >
        <Suspense
          fallback={
            <div
              className="
                flex
                h-48
                items-center
                justify-center
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[12px]
                  text-[#888888]
                "
              >
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-[#a42025]/15
                    border-t-[#a42025]
                  "
                />

                Loading...
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthShell>
    </>
  );
}
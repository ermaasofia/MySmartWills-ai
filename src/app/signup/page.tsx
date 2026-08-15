import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

import { SignupForm } from '@/components/auth/signup-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Sign Up - SmartWills.ai',

  description:
    'Create your free SmartWills.ai account and start planning your will with AI guidance.',

  openGraph: {
    title: 'Sign Up - SmartWills.ai',

    description:
      'Create your free SmartWills.ai account and start planning your will with AI guidance.',

    url: '/signup',
  },
};

export default async function SignupPage() {
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
              'Sign Up',
              '/signup'
            )
          ),
        }}
      />

      {/* =========================================
          SIGNUP PAGE
      ========================================= */}

      <AuthShell
        title="Create account"
        description="Start your will planning journey today."
        footer={
          <>
            <span>
              Already have an
              account?{' '}
            </span>

            <Link
              href="/login"
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
              Sign in
            </Link>
          </>
        }
      >
        <SignupForm />
      </AuthShell>
    </>
  );
}
import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Forgot Password - SmartWills.ai',

  description:
    "Reset your SmartWills.ai account password. We'll send you a secure link to create a new one.",

  openGraph: {
    title: 'Forgot Password - SmartWills.ai',
    description:
      'Reset your SmartWills.ai account password.',
    url: '/forgot-password',
  },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const params =
    await searchParams;

  const errorMessage =
    params.error;

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
              'Forgot Password',
              '/forgot-password'
            )
          ),
        }}
      />

      {/* =========================================
          FORGOT PASSWORD PAGE
      ========================================= */}

      <AuthShell
        title="Forgot password"
        description="Enter your email and we'll send you a reset link."
        error={errorMessage}
        footer={
          <>
            <span>
              Remember your
              password?{' '}
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
        <ForgotPasswordForm />
      </AuthShell>
    </>
  );
}
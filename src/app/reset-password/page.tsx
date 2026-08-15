import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { AuthShell } from '@/components/auth/auth-shell';
import { breadcrumbJsonLd } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Reset Password - SmartWills.ai',

  description:
    'Set a new secure password for your SmartWills.ai account.',

  openGraph: {
    title:
      'Reset Password - SmartWills.ai',

    description:
      'Set a new secure password for your SmartWills.ai account.',

    url:
      '/reset-password',
  },
};

export default async function ResetPasswordPage() {
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
              'Reset Password',
              '/reset-password'
            )
          ),
        }}
      />

      {/* =========================================
          RESET PASSWORD PAGE
      ========================================= */}

      <AuthShell
        title="Reset password"
        description="Enter your new password below."
        footer={
          <Link
            href="/login"
            className="
              inline-flex
              items-center
              gap-1.5
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
            ← Back to Sign In
          </Link>
        }
      >
        <ResetPasswordForm />
      </AuthShell>
    </>
  );
}
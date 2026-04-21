import { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Forgot Password - SmartWills.ai",
  description: "Reset your SmartWills.ai account password. We'll send you a secure link to create a new one.",
  openGraph: {
    title: "Forgot Password - SmartWills.ai",
    description: "Reset your SmartWills.ai account password.",
    url: "/forgot-password",
  },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Forgot Password', '/forgot-password')) }}
      />
      <AuthShell
        title="Forgot password"
        description="Enter your email and we'll send you a reset link."
        error={errorMessage}
        footer={
          <>
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[#ededed] underline underline-offset-4 hover:text-white">
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

import { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Reset Password - SmartWills.ai",
  description: "Set a new secure password for your SmartWills.ai account.",
  openGraph: {
    title: "Reset Password - SmartWills.ai",
    description: "Set a new secure password for your SmartWills.ai account.",
    url: "/reset-password",
  },
};

export default function ResetPasswordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Reset Password', '/reset-password')) }}
      />
      <AuthShell
        title="Reset password"
        description="Enter your new password below."
        footer={
          <Link href="/login" className="font-medium text-[#ededed] underline underline-offset-4 hover:text-white">
            ← Back to Sign In
          </Link>
        }
      >
        <ResetPasswordForm />
      </AuthShell>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Sign Up - SmartWills.ai",
  description: "Create your free SmartWills.ai account and start planning your will with AI guidance.",
  openGraph: {
    title: "Sign Up - SmartWills.ai",
    description: "Create your free SmartWills.ai account and start planning your will with AI guidance.",
    url: "/signup",
  },
};

export default async function SignupPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Sign Up', '/signup')) }}
      />
      <AuthShell
        title="Create account"
        description="Start your will planning journey today."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#ededed] underline underline-offset-4 hover:text-white">
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

import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Sign In - SmartWills.ai",
  description: "Sign in to your SmartWills.ai account to access personalized will planning guidance.",
  openGraph: {
    title: "Sign In - SmartWills.ai",
    description: "Sign in to your SmartWills.ai account to access personalized will planning guidance.",
    url: "/login",
  },
};

export default async function LoginPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Sign In', '/login')) }}
      />
      <AuthShell
        title="Welcome back"
        description="Sign in to continue your will planning."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#ededed] underline underline-offset-4 hover:text-white">
              Sign up
            </Link>
          </>
        }
      >
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-base text-white/45">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </>
  );
}

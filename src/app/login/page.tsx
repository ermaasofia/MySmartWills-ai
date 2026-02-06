import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sign In - AI SmartWills",
  description: "Sign in to your AI SmartWills account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-2xl font-bold tracking-tight">
            <Image src="/logo.png" alt="SmartWills" width={32} height={32} className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
            AI SmartWills
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue your will planning journey
            </p>
          </div>
          
          <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 sm:py-6 px-4 sm:px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}

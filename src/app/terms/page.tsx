import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service - SmartWills.ai",
  description: "Read the Terms of Service for SmartWills.ai. Understand your rights and obligations when using our AI will planning assistant.",
  openGraph: {
    title: "Terms of Service - SmartWills.ai",
    description: "Terms of Service for using SmartWills.ai will planning assistant.",
    url: "/terms",
  },
};

export default async function TermsPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0a] text-[#ededed]">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Terms of Service', '/terms')) }}
      />
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-[4px] font-mono text-[13px] font-bold text-[#0a0a0a]"
              style={{ background: 'linear-gradient(135deg, var(--accent), #ededed)' }}
            >
              sw
            </span>
            <span className="text-base font-semibold">SmartWills</span>
            <span className="rounded-[3px] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[12px] text-white/50">
              .ai
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[13px] uppercase tracking-[1.5px] text-white/45 hover:text-white/80"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb currentPage="Terms of Service" />
          <div className="mb-8">
            <div className="mb-3 font-mono text-[12px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // terms_of_service
            </div>
            <h1 className="text-3xl font-medium tracking-[-0.02em] text-[#ededed] sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 font-mono text-[13px] text-white/45">Last updated: February 7, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-h2:mt-8 prose-h2:text-xl prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#ededed] prose-li:text-lg prose-li:text-white/70 prose-p:text-lg prose-p:text-white/70">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SmartWills.ai (&ldquo;the Service&rdquo;), you agree to be bound
              by these Terms of Service. If you do not agree, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              SmartWills.ai is an AI-powered educational tool that provides general information
              about will planning across multiple jurisdictions in the Asia-Pacific region.
              The Service is part of the SmartWills ecosystem.
            </p>

            <h2>3. Not Legal Advice</h2>
            <p>
              <strong>IMPORTANT:</strong> SmartWills.ai provides general educational information only.
              It does NOT constitute legal advice. The information provided should not be relied upon
              as a substitute for consultation with a qualified legal professional. Always seek
              professional legal counsel for your specific situation.
            </p>

            <h2>4. User Accounts</h2>
            <ul>
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>One person may not maintain more than one account</li>
              <li>You must notify us immediately of any unauthorized access to your account</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to bypass security measures or rate limits</li>
              <li>Reverse engineer, decompile, or extract source code from the Service</li>
              <li>Use automated tools to scrape or access the Service</li>
              <li>Impersonate others or provide false information</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to other users&apos; data</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              The Service, including its design, code, AI models, and content, is owned by
              SmartWills and protected by intellectual property laws. You retain ownership of
              the content you provide in chat conversations.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMARTWILLS.AI AND ITS AFFILIATES SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              We are not liable for any decisions made based on information provided by the AI
              assistant. Legal matters should always be handled by qualified professionals.
            </p>

            <h2>8. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access.
              The Service may be temporarily unavailable for maintenance, updates, or due to
              factors beyond our control.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time for violation
              of these Terms or for any reason at our discretion. You may delete your account
              at any time.
            </p>

            <h2>10. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the
              Service after changes constitutes acceptance of the modified Terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of
              Malaysia, without regard to conflict of law provisions.
            </p>

            <h2>12. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:legal@smartwills.ai">legal@smartwills.ai</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-5">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[13px] text-white/40">
          <span>© 2026 SmartWills.ai</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/70">privacy</Link>
            <Link href="/terms" className="hover:text-white/70">terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

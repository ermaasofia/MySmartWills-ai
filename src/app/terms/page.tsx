import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service - AI SmartWills",
  description: "Read the Terms of Service for AI SmartWills. Understand your rights and obligations when using our AI will planning assistant.",
  openGraph: {
    title: "Terms of Service - AI SmartWills",
    description: "Terms of Service for using AI SmartWills will planning assistant.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Terms of Service', '/terms')) }}
      />
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg sm:text-2xl font-bold tracking-tight">
            <Image src="/logo.png" alt="SmartWills" width={32} height={32} className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
            AI SmartWills
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl prose dark:prose-invert">
          <Breadcrumb currentPage="Terms of Service" />
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 7, 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using AI SmartWills (&ldquo;the Service&rdquo;), you agree to be bound
            by these Terms of Service. If you do not agree, please do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            AI SmartWills is an AI-powered educational tool that provides general information
            about will planning across multiple jurisdictions in the Asia-Pacific region.
            The Service is part of the SmartWills ecosystem.
          </p>

          <h2>3. Not Legal Advice</h2>
          <p>
            <strong>IMPORTANT:</strong> AI SmartWills provides general educational information only.
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
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI SMARTWILLS AND ITS AFFILIATES SHALL
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
      </main>

      <footer className="border-t border-border py-4 sm:py-6 px-4 sm:px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}

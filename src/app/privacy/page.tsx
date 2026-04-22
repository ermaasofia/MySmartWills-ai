import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, breadcrumbJsonLd } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy - SmartWills.ai",
  description: "Learn how SmartWills.ai collects, uses, and protects your personal data. PDPA and GDPR compliant.",
  openGraph: {
    title: "Privacy Policy - SmartWills.ai",
    description: "Learn how SmartWills.ai collects, uses, and protects your personal data.",
    url: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0a] text-[#ededed]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd('Privacy Policy', '/privacy')) }}
      />
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-[4px] font-mono text-[11px] font-bold text-[#0a0a0a]"
              style={{ background: 'linear-gradient(135deg, var(--accent), #ededed)' }}
            >
              sw
            </span>
            <span className="text-sm font-semibold">SmartWills</span>
            <span className="rounded-[3px] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/50">
              .ai
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[1.5px] text-white/45 hover:text-white/80"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb currentPage="Privacy Policy" />
          <div className="mb-8">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--accent)]">
              // privacy_policy
            </div>
            <h1 className="text-3xl font-medium tracking-[-0.02em] text-[#ededed] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 font-mono text-[11px] text-white/45">Last updated: February 7, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-h2:mt-8 prose-h2:text-xl prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#ededed] prose-li:text-white/70 prose-p:text-white/70">
            <h2>1. Information We Collect</h2>
            <p>When you use SmartWills.ai, we collect the following information:</p>
            <ul>
              <li><strong>Account Information:</strong> Your name and email address when you create an account.</li>
              <li><strong>Chat Data:</strong> Conversations you have with our AI assistant to provide the service.</li>
              <li><strong>Usage Data:</strong> Anonymous analytics about how you use the platform (pages visited, features used).</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and performance.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve our AI will planning assistant service</li>
              <li>To authenticate your identity and secure your account</li>
              <li>To prevent fraud, abuse, and unauthorized access</li>
              <li>To communicate important service updates</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>3. Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using Supabase (hosted on AWS) with
              Row Level Security (RLS) policies ensuring you can only access your own data.
              All data is encrypted in transit (TLS 1.3) and at rest (AES-256).
            </p>

            <h2>4. AI Conversations</h2>
            <p>
              Your conversations with SmartWills.ai are processed by third-party AI providers
              (Groq, Google) to generate responses. We do not use your conversations to train AI
              models. Conversations may be temporarily processed by these providers according to
              their respective privacy policies.
            </p>

            <h2>5. Data Sharing</h2>
            <p>We do <strong>not</strong> sell your personal data. We only share data with:</p>
            <ul>
              <li>Infrastructure providers (Supabase, Vercel) to operate the service</li>
              <li>AI providers (Groq, Google) to process chat requests</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use essential cookies only for authentication and session management.
              We do not use advertising or tracking cookies.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              SmartWills.ai is not intended for users under 18 years of age.
              We do not knowingly collect data from minors.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you
              of any material changes via email or a notice on our website.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:privacy@smartwills.ai">privacy@smartwills.ai</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-5">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[11px] text-white/40">
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

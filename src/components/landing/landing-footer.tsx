import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-8 font-mono text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6 lg:px-8">
        <div>© 2026 smartwills.ai · PDPA + GDPR compliant</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="hover:text-white/70">/privacy</Link>
          <Link href="/terms" className="hover:text-white/70">/terms</Link>
          <a href="mailto:support@mysmartwills.com" className="hover:text-white/70">
            support@mysmartwills.com
          </a>
        </div>
      </div>
    </footer>
  );
}

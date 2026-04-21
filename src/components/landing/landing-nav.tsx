import Link from 'next/link';

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(10,10,10,0.7)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-3.5">
        <div className="flex items-center gap-7">
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
          <div className="hidden items-center gap-5 text-[13px] text-white/65 md:flex">
            <Link href="#features" className="hover:text-white">Product</Link>
            <Link href="#countries" className="hover:text-white">Jurisdictions</Link>
            <Link href="#faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>
        <div className="flex items-center gap-3.5 text-[13px]">
          <Link href="/login" className="text-white/65 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-[6px] bg-[#ededed] px-3.5 py-[7px] text-[13px] font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(10,10,10,0.7)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SmartWills"
              width={28}
              height={28}
              className="rounded-[4px]"
            />
            <span className="text-sm font-semibold">SmartWills</span>
          </Link>
          <div className="hidden items-center gap-5 text-[13px] text-white/65 md:flex">
            <Link href="#features" className="hover:text-white">What we do</Link>
            <Link href="#countries" className="hover:text-white">Countries</Link>
            <Link href="#faq" className="hover:text-white">Questions</Link>
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

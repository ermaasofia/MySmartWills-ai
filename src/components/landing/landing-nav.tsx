import Image from 'next/image';
import Link from 'next/link';

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#ececec] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-4 sm:px-6 lg:px-0">
        {/* LEFT - LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="SmartWills.ai"
            width={30}
            height={30}
            className="rounded-[5px]"
            priority
          />

          <span className="font-serif text-[20px] font-semibold tracking-[-0.02em] text-[#171717]">
            SmartWills.ai
          </span>
        </Link>

        {/* CENTER - NAVIGATION */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="#features"
            className="text-[13px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            What we do
          </Link>

          <Link
            href="#countries"
            className="text-[13px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            Countries
          </Link>

          <Link
            href="#faq"
            className="text-[13px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            Questions
          </Link>

          <Link
            href="#about"
            className="text-[13px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            About us
          </Link>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-[13px] font-medium text-[#292929] transition-colors hover:text-[#a42025] sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="
              rounded-[7px]
              bg-[#a42025]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              shadow-[0_6px_18px_rgba(164,32,37,0.18)]
              transition-all
              hover:-translate-y-[1px]
              hover:bg-[#8f1c20]
              hover:shadow-[0_8px_22px_rgba(164,32,37,0.24)]
            "
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
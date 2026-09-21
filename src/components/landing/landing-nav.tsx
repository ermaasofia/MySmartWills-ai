import Link from 'next/link';

import { SmartWillsBrand } from '@/components/brand/smartwills-brand';

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e8ec] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-4 sm:px-8">

        {/* BRAND */}
        <SmartWillsBrand size="md" textColor="text-[#171717]" />

        {/* CENTER NAVIGATION */}
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="#features"
            className="text-[13.5px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            What we do
          </Link>

          <Link
            href="#countries"
            className="text-[13.5px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            Countries
          </Link>

          <Link
            href="#feedback-faq"
            className="text-[13.5px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            Questions
          </Link>

          <Link
            href="#about"
            className="text-[13.5px] font-medium text-[#292929] transition-colors hover:text-[#a42025]"
          >
            About us
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-[13.5px] font-medium text-[#292929] transition-colors hover:text-[#a42025] sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#d11a2a]
              to-[#a42025]
              px-5
              py-2.5
              text-[13px]
              font-semibold
              text-white
              shadow-[0_4px_18px_rgba(209,26,42,0.25)]
              transition-all
              duration-200
              hover:scale-105
              hover:shadow-[0_6px_22px_rgba(209,26,42,0.4)]
              active:scale-95
            "
          >
            <span>Get started</span>
            <span className="text-[14px]">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
import Link from 'next/link';

import {
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050508] text-white">
      <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-0">
        {/* TOP */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.35fr_0.7fr_0.7fr_0.7fr_1.2fr]">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white no-underline"
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-[9px]
                  bg-[#a42025]
                  text-white
                  shadow-[0_5px_14px_rgba(164,32,37,0.4)]
                "
              >
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <span className="font-serif text-[19px] font-semibold tracking-[-0.02em] text-white">
                SmartWills.ai
              </span>
            </Link>

            <p className="mt-4 max-w-[260px] text-[11px] leading-[1.7] text-[#8e8e9c]">
              AI-guided will planning that helps you organise
              what matters most, one step at a time.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[10px] text-[#8e8e9c]">
              <Mail
                size={13}
                strokeWidth={1.7}
                className="text-[#ff4d5a]"
              />

              <a
                href="mailto:support@mysmartwills.com"
                className="transition-colors hover:text-[#ff4d5a]"
              >
                support@mysmartwills.com
              </a>
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="m-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71717a]">
              Product
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="#features"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                What we do
              </Link>

              <Link
                href="#how"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                How it works
              </Link>

              <Link
                href="#countries"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                Countries
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="m-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71717a]">
              Company
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="#about"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                About us
              </Link>

              <Link
                href="#feedback-faq"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                Questions
              </Link>

              <a
                href="mailto:support@mysmartwills.com"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                Contact us
              </a>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="m-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71717a]">
              Legal
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/privacy"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                Privacy policy
              </Link>

              <Link
                href="/terms"
                className="text-[10px] text-[#a1a1aa] transition-colors hover:text-[#ff4d5a]"
              >
                Terms of service
              </Link>
            </div>
          </div>

          {/* PRIVACY CARD */}
          <div
            className="
              flex
              h-fit
              gap-3
              rounded-[14px]
              border
              border-[#a42025]/30
              bg-[#a42025]/10
              p-5
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#121218]
                text-[#ff4d5a]
                border
                border-[#a42025]/40
                shadow-[0_4px_14px_rgba(164,32,37,0.2)]
              "
            >
              <LockKeyhole
                size={18}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <h4 className="m-0 text-[11px] font-semibold text-white">
                Your privacy is our priority
              </h4>

              <p className="mt-2 text-[9px] leading-[1.6] text-[#8e8e9c]">
                Your personal information and will-planning
                details stay protected within your account.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-3
            border-t
            border-white/[0.08]
            pt-5
            text-[9px]
            text-[#71717a]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            © 2026 SmartWills.ai. All rights reserved.
          </span>

          <div className="flex flex-wrap items-center gap-4">
            <span>
              PDPA & GDPR compliant
            </span>

            <span className="inline-flex items-center gap-1.5">
              Made with care in Asia

              <Heart
                size={11}
                strokeWidth={1.7}
                className="text-[#ff4d5a]"
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
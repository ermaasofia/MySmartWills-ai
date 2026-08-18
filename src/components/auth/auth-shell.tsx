import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;

  /** Footer line under the card */
  footer?: ReactNode;

  /** Optional error banner */
  error?: string;
}

export function AuthShell({
  title,
  description,
  children,
  footer,
  error,
}: AuthShellProps) {
  return (
    <div
      className="
        relative
        flex
        min-h-dvh
        flex-col
        overflow-hidden
        bg-white
        text-[#171717]
      "
    >
      {/* ==================================================
          SOFT BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
      >
        {/* TOP BRAND GLOW */}
        <div
          className="
            absolute
            -top-[220px]
            left-1/2
            h-[440px]
            w-[760px]
            -translate-x-1/2
            rounded-full
            bg-[#a42025]/[0.045]
            blur-[130px]
          "
        />

        {/* RIGHT BRAND GLOW */}
        <div
          className="
            absolute
            right-[-160px]
            top-[32%]
            h-[340px]
            w-[340px]
            rounded-full
            bg-[#a42025]/[0.025]
            blur-[110px]
          "
        />

        {/* LEFT SOFT GLOW */}
        <div
          className="
            absolute
            bottom-[-180px]
            left-[-120px]
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#a42025]/[0.018]
            blur-[100px]
          "
        />
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className="
          relative
          z-20
          border-b
          border-[#eeeeee]
          bg-white/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[82px]
            max-w-[1120px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-0
          "
        >
          {/* =================================================
              SMARTWILLS.AI BRAND
          ================================================= */}

          <Link
            href="/"
            aria-label="SmartWills.Ai Home"
            className="
              group
              flex
              items-center
              gap-2.5
              no-underline
            "
          >
            {/* LOGO SYMBOL */}
            <Image
              src="/icon.png"
              alt="SmartWills logo"
              width={52}
              height={52}
              priority
              className="
                h-[46px]
                w-[46px]
                shrink-0
                object-contain
                transition-transform
                duration-300
                group-hover:scale-[1.03]
                sm:h-[50px]
                sm:w-[50px]
              "
            />

            {/* BRAND NAME */}
            <span
              className="
                whitespace-nowrap
                font-serif
                text-[18px]
                font-semibold
                tracking-[-0.03em]
                text-[#171717]
                sm:text-[20px]
              "
            >
              SmartWills.Ai
            </span>
          </Link>

          {/* =================================================
              BACK
          ================================================= */}

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-[7px]
              px-2
              py-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.13em]
              text-[#777777]
              transition-all
              hover:bg-[#a42025]/[0.05]
              hover:text-[#a42025]
            "
          >
            <span>←</span>
            Back
          </Link>
        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          relative
          z-10
          flex
          flex-1
          items-center
          justify-center
          px-4
          py-10
          sm:px-6
          sm:py-14
        "
      >
        <div className="w-full max-w-[460px]">
          {/* =========================================
              TITLE AREA
          ========================================= */}

          <div className="mb-8 text-center">
            {/* TITLE */}

            <h1
              className="
                m-0
                font-serif
                text-[34px]
                font-semibold
                tracking-[-0.04em]
                text-[#171717]
                sm:text-[40px]
              "
            >
              {title}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-3
                max-w-[360px]
                text-[14px]
                leading-[1.65]
                text-[#777777]
              "
            >
              {description}
            </p>
          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div
              className="
                mb-4
                rounded-[10px]
                border
                border-[#a42025]/20
                bg-[#a42025]/[0.05]
                px-4
                py-3
                text-[12px]
                font-medium
                leading-[1.5]
                text-[#a42025]
              "
            >
              {error}
            </div>
          )}

          {/* =========================================
              FORM CARD
          ========================================= */}

          <div
            className="
              rounded-[18px]
              border
              border-[#e7e7e7]
              bg-white
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.065)]
              sm:p-7
            "
          >
            {children}
          </div>

          {/* =========================================
              FOOTER UNDER FORM
          ========================================= */}

          {footer && (
            <div
              className="
                mt-6
                text-center
                text-[13px]
                text-[#777777]
              "
            >
              {footer}
            </div>
          )}
        </div>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        className="
          relative
          z-10
          border-t
          border-[#eeeeee]
          bg-[#fafafa]
          px-4
          py-5
          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1120px]
            flex-col
            items-center
            gap-3
            text-[10px]
            text-[#8b8b8b]
            sm:flex-row
            sm:justify-between
          "
        >
          <span>© 2026 SmartWills.Ai</span>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="
                transition-colors
                hover:text-[#a42025]
              "
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="
                transition-colors
                hover:text-[#a42025]
              "
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
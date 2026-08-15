import Link from 'next/link';

import {
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react';

import { Reveal } from './reveal';

export function LandingCTA() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#a42025]/[0.035]
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-[1120px] px-4 py-20 text-center sm:px-6 lg:px-0 lg:py-28">
        {/* BADGE */}
        <Reveal>
          <div
            className="
              mx-auto
              mb-7
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#e7e7e7]
              bg-white
              px-3.5
              py-1.5
              shadow-[0_4px_15px_rgba(0,0,0,0.04)]
            "
          >
            <Sparkles
              size={13}
              strokeWidth={1.7}
              className="text-[#a42025]"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              Start planning today
            </span>
          </div>
        </Reveal>

        {/* HEADING */}
        <Reveal delay={80}>
          <h2
            className="
              m-0
              font-serif
              font-medium
              leading-[0.98]
              tracking-[-0.045em]
              text-[#171717]
            "
            style={{
              fontSize: 'clamp(46px, 5vw, 68px)',
            }}
          >
            Plan today.
            <br />

            <span className="text-[#a42025]">
              Protect tomorrow.
            </span>
          </h2>
        </Reveal>

        {/* DESCRIPTION */}
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-[560px] text-[14px] leading-[1.75] text-[#6f6f6f] sm:text-[15px]">
            Let Savy guide you through your will one simple
            question at a time. Your progress stays organised,
            private and ready whenever you return.
          </p>
        </Reveal>

        {/* BUTTONS */}
        <Reveal delay={200}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* PRIMARY */}
            <Link
              href="/signup"
              className="
                inline-flex
                min-w-[165px]
                items-center
                justify-center
                gap-5
                rounded-[8px]
                bg-[#a42025]
                px-6
                py-3.5
                text-[13px]
                font-semibold
                text-white
                shadow-[0_8px_22px_rgba(164,32,37,0.18)]
                transition-all

                hover:-translate-y-[1px]
                hover:bg-[#891b1f]
                hover:shadow-[0_12px_28px_rgba(164,32,37,0.24)]
              "
            >
              Start for free

              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </Link>

            {/* SECONDARY */}
            <Link
              href="#how"
              className="
                inline-flex
                min-w-[165px]
                items-center
                justify-center
                gap-3
                rounded-[8px]
                border
                border-[#dddddd]
                bg-white
                px-6
                py-3.5
                text-[13px]
                font-semibold
                text-[#282828]
                transition-all

                hover:border-[#a42025]/20
                hover:bg-[#a42025]/[0.025]
              "
            >
              See how it works

              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#555555]
                "
              >
                <Play
                  size={8}
                  fill="currentColor"
                />
              </span>
            </Link>
          </div>
        </Reveal>

        {/* SMALL NOTE */}
        <Reveal delay={260}>
          <p className="mt-7 text-[10px] text-[#999999]">
            Create an account for free • Save your progress •
            Continue anytime
          </p>
        </Reveal>

        {/* DECORATIVE DOTS */}
        <span className="absolute left-[12%] top-[30%] h-2 w-2 rounded-full bg-[#a42025]/50" />

        <span className="absolute right-[14%] top-[24%] h-3 w-3 rounded-full bg-[#a42025]/20" />

        <span className="absolute bottom-[24%] left-[20%] h-1.5 w-1.5 rounded-full bg-[#a42025]/30" />
      </div>
    </section>
  );
}
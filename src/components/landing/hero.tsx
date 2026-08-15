import Link from 'next/link';

import {
  ArrowRight,
  Globe2,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
  FileText,
  MapPin,
} from 'lucide-react';

import { Reveal } from './reveal';
import { ApacGlobe } from './apac-globe';

const STATS = [
  {
    value: '12',
    line1: 'countries',
    line2: 'supported',
    icon: Globe2,
  },
  {
    value: '100%',
    line1: 'private &',
    line2: 'secure',
    icon: ShieldCheck,
  },
  {
    value: '5',
    line1: 'trusted',
    line2: 'platforms',
    icon: UsersRound,
  },
  {
    value: '24/7',
    line1: 'AI assistant',
    line2: 'support',
    icon: Sparkles,
  },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* =========================================
          SOFT BACKGROUND GLOW
      ========================================= */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 35%, rgba(164,32,37,0.045) 0%, rgba(164,32,37,0.015) 28%, transparent 55%)',
        }}
      />

      <div
        className="
          relative
          mx-auto
          grid
          min-h-[520px]
          max-w-[1120px]
          grid-cols-1
          items-center
          gap-10
          px-4
          py-14
          sm:px-6
          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-12
          lg:px-0
          lg:py-16
        "
      >
        {/* =========================================
            LEFT CONTENT
        ========================================= */}

        <div className="relative z-10">
          {/* BADGE */}

          <Reveal>
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#e8e8e8]
                bg-white
                px-3
                py-1.5
                shadow-[0_3px_12px_rgba(0,0,0,0.04)]
              "
            >
              <Sparkles
                size={13}
                strokeWidth={1.8}
                className="text-[#a42025]"
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  tracking-[0.08em]
                  text-[#343434]
                "
              >
                AI-POWERED • HUMAN GUIDED
              </span>
            </div>
          </Reveal>

          {/* =========================================
              HEADING
          ========================================= */}

          <Reveal delay={80}>
            <h1
              className="
                m-0
                max-w-[570px]
                font-serif
                font-medium
                leading-[0.98]
                tracking-[-0.045em]
                text-[#161616]
              "
              style={{
                fontSize: 'clamp(48px, 5vw, 68px)',
              }}
            >
              Plan your will,
              <br />

              <span className="text-[#a42025]">
                protect
              </span>{' '}
              your family.
            </h1>
          </Reveal>

          {/* =========================================
              DESCRIPTION
          ========================================= */}

          <Reveal delay={160}>
            <p
              className="
                mt-6
                max-w-[510px]
                text-[15px]
                leading-[1.7]
                text-[#555555]
                sm:text-[16px]
              "
            >
              SmartWills.ai gives you country-aware guidance,
              step-by-step support, and a clear summary of your
              will. So you can plan with confidence and peace of
              mind.
            </p>
          </Reveal>

          {/* =========================================
              CTA
          ========================================= */}

          <Reveal delay={240}>
            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              {/* START FOR FREE */}

              <Link
                href="/signup"
                className="
                  inline-flex
                  items-center
                  gap-5
                  rounded-[7px]
                  bg-[#a42025]
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(164,32,37,0.16)]
                  transition-all

                  hover:-translate-y-[1px]
                  hover:bg-[#891b1f]
                  hover:shadow-[0_10px_24px_rgba(164,32,37,0.22)]
                "
              >
                Start for free

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                />
              </Link>

              {/* SEE HOW IT WORKS */}

              <Link
                href="#how"
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-[7px]
                  border
                  border-[#dedede]
                  bg-white
                  px-5
                  py-3
                  text-[13px]
                  font-semibold
                  text-[#252525]
                  transition-all

                  hover:border-[#a42025]/20
                  hover:bg-[#a42025]/[0.025]
                "
              >
                See how it works

                <span
                  className="
                    flex
                    h-[19px]
                    w-[19px]
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

          {/* =========================================
              STATS
          ========================================= */}

          <Reveal delay={320}>
            <div
              className="
                mt-9
                grid
                max-w-[520px]
                grid-cols-2
                gap-x-7
                gap-y-5
                sm:grid-cols-4
              "
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.value}
                    className="flex items-start gap-2.5"
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.7}
                      className="
                        mt-[2px]
                        shrink-0
                        text-[#a42025]
                      "
                    />

                    <div className="flex flex-col">
                      <span
                        className="
                          text-[16px]
                          font-semibold
                          leading-none
                          text-[#202020]
                        "
                      >
                        {stat.value}
                      </span>

                      <span
                        className="
                          mt-1
                          text-[10px]
                          leading-[1.3]
                          text-[#787878]
                        "
                      >
                        {stat.line1}
                        <br />
                        {stat.line2}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* =========================================
            RIGHT VISUAL
        ========================================= */}

        <Reveal delay={180}>
          <div
            className="
              relative
              mx-auto
              min-h-[430px]
              w-full
              max-w-[570px]
            "
          >
            {/* =====================================
                BACKGROUND GLOW
            ===================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[350px]
                w-[350px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#a42025]/[0.025]
                blur-3xl
              "
            />

            {/* =====================================
                GLOBE
            ===================================== */}

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div className="w-[370px] max-w-[78vw] opacity-90">
                <ApacGlobe />
              </div>
            </div>

            {/* =====================================
                ORBIT LINES
            ===================================== */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[220px]
                w-[440px]
                max-w-[90%]
                -translate-x-1/2
                -translate-y-1/2
                rotate-[-10deg]
                rounded-[50%]
                border
                border-[#a42025]/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[290px]
                w-[400px]
                max-w-[80%]
                -translate-x-1/2
                -translate-y-1/2
                rotate-[28deg]
                rounded-[50%]
                border
                border-[#a42025]/10
              "
            />

            {/* =====================================
                PRIVATE CARD
            ===================================== */}

            <div
              className="
                absolute
                left-[3%]
                top-[12%]
                z-10
                flex
                w-[175px]
                gap-3
                rounded-[10px]
                border
                border-[#e8e8e8]
                bg-white/95
                p-3.5
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#a42025]/[0.07]
                  text-[#a42025]
                "
              >
                <LockKeyhole
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p
                  className="
                    m-0
                    text-[10px]
                    font-semibold
                    text-[#222222]
                  "
                >
                  Private & secure
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    leading-[1.5]
                    text-[#707070]
                  "
                >
                  Your data is encrypted and never shared.
                </p>
              </div>
            </div>

            {/* =====================================
                COUNTRY CARD
            ===================================== */}

            <div
              className="
                absolute
                right-[0%]
                top-[28%]
                z-10
                flex
                w-[175px]
                gap-3
                rounded-[10px]
                border
                border-[#e8e8e8]
                bg-white/95
                p-3.5
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#a42025]/[0.07]
                  text-[#a42025]
                "
              >
                <MapPin
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p
                  className="
                    m-0
                    text-[10px]
                    font-semibold
                    text-[#222222]
                  "
                >
                  Country-aware
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    leading-[1.5]
                    text-[#707070]
                  "
                >
                  Guidance based on your jurisdiction.
                </p>
              </div>
            </div>

            {/* =====================================
                WILL READY CARD
            ===================================== */}

            <div
              className="
                absolute
                bottom-[12%]
                left-[12%]
                z-10
                flex
                w-[175px]
                gap-3
                rounded-[10px]
                border
                border-[#e8e8e8]
                bg-white/95
                p-3.5
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#a42025]/[0.07]
                  text-[#a42025]
                "
              >
                <FileText
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p
                  className="
                    m-0
                    text-[10px]
                    font-semibold
                    text-[#222222]
                  "
                >
                  Will ready
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    leading-[1.5]
                    text-[#707070]
                  "
                >
                  Get a clear summary of your will information.
                </p>
              </div>
            </div>

            {/* =====================================
                SHIELD
            ===================================== */}

            <div
              className="
                absolute
                bottom-[8%]
                left-[54%]
                z-10
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-[14px]
                bg-[#a42025]
                text-white
                shadow-[0_8px_25px_rgba(164,32,37,0.25)]
              "
            >
              <ShieldCheck
                size={23}
                strokeWidth={2}
              />
            </div>

            {/* =====================================
                DECORATIVE DOTS
            ===================================== */}

            <span
              className="
                absolute
                left-[27%]
                top-[7%]
                h-2
                w-2
                rounded-full
                bg-[#a42025]
                shadow-[0_0_9px_rgba(164,32,37,0.6)]
              "
            />

            <span
              className="
                absolute
                left-[2%]
                top-[49%]
                h-2
                w-2
                rounded-full
                bg-[#a42025]
                shadow-[0_0_9px_rgba(164,32,37,0.6)]
              "
            />

            <span
              className="
                absolute
                right-[8%]
                top-[15%]
                h-2
                w-2
                rounded-full
                bg-[#a42025]
                shadow-[0_0_9px_rgba(164,32,37,0.6)]
              "
            />

            <span
              className="
                absolute
                bottom-[16%]
                right-[11%]
                h-3
                w-3
                rounded-full
                bg-[#a42025]
                shadow-[0_0_12px_rgba(164,32,37,0.65)]
              "
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
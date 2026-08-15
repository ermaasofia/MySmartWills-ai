import {
  ArrowUpRight,
  FileCheck2,
  Globe2,
  HeartHandshake,
  ListChecks,
  LockKeyhole,
  RefreshCcw,
} from 'lucide-react';

import { Reveal } from './reveal';

const FEATURES = [
  {
    k: '01',
    title: 'Knows your country',
    description:
      'Choose your jurisdiction and SmartWills will guide you through the appropriate will-planning process.',
    icon: Globe2,
  },
  {
    k: '02',
    title: 'Private and secure',
    description:
      'Your personal information and conversations stay protected throughout your will-planning journey.',
    icon: LockKeyhole,
  },
  {
    k: '03',
    title: 'Clear guidance, without jargon',
    description:
      'Savy explains each part of your will using simple language that is easy to understand.',
    icon: HeartHandshake,
  },
  {
    k: '04',
    title: 'The hard parts, simplified',
    description:
      'We guide you through executors, guardians, assets, beneficiaries, residue estate and witnesses step-by-step.',
    icon: ListChecks,
  },
  {
    k: '05',
    title: 'Come back anytime',
    description:
      'Your progress is saved so you can continue your will planning whenever you are ready.',
    icon: RefreshCcw,
  },
  {
    k: '06',
    title: 'Clear will summary',
    description:
      'Review your information in one organised summary before continuing to your final will document.',
    icon: FileCheck2,
  },
] as const;

export function FeaturesMatrix() {
  return (
    <section
      id="features"
      className="bg-white"
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1120px]
          grid-cols-1
          gap-12
          px-4
          py-16
          sm:px-6
          lg:grid-cols-[330px_1fr]
          lg:gap-16
          lg:px-0
          lg:py-24
        "
      >
        {/* LEFT CONTENT */}
        <Reveal>
          <div className="lg:sticky lg:top-[110px]">
            {/* LABEL */}
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
                What we do
              </span>
            </div>

            {/* TITLE */}
            <h2
              className="
                m-0
                font-serif
                font-medium
                leading-[1.03]
                tracking-[-0.035em]
                text-[#171717]
              "
              style={{
                fontSize: 'clamp(34px, 4vw, 48px)',
              }}
            >
              Made to look after
              <br />

              <span className="text-[#a42025]">
                the people you love.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-[310px] text-[15px] leading-[1.75] text-[#6a6a6a]">
              SmartWills.ai makes will planning easier to
              understand by guiding you through each important
              decision one step at a time.
            </p>

            {/* SMALL LINK */}
            <a
              href="#how"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                text-[12px]
                font-semibold
                text-[#202020]
                transition-colors
                hover:text-[#a42025]
              "
            >
              See how SmartWills works

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
              />
            </a>
          </div>
        </Reveal>

        {/* RIGHT FEATURE GRID */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal
                key={feature.k}
                delay={index * 50}
              >
                <div
                  className="
                    group
                    relative
                    min-h-[220px]
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-[#e8e8e8]
                    bg-[#fcfcfc]
                    p-6
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#a42025]/20
                    hover:bg-white
                    hover:shadow-[0_16px_40px_rgba(164,32,37,0.08)]
                  "
                >
                  {/* SOFT HOVER GLOW */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12
                      h-28
                      w-28
                      rounded-full
                      bg-[#a42025]/0
                      blur-3xl
                      transition-colors
                      duration-300
                      group-hover:bg-[#a42025]/[0.04]
                    "
                  />

                  {/* TOP */}
                  <div className="relative flex items-start justify-between">
                    {/* ICON */}
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-[#a42025]/[0.07]
                        text-[#a42025]
                      "
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* NUMBER */}
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        tracking-[0.16em]
                        text-[#b0b0b0]
                        transition-colors
                        group-hover:text-[#a42025]
                      "
                    >
                      {feature.k}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="relative mt-7">
                    <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-[#202020]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-[290px] text-[12px] leading-[1.7] text-[#737373]">
                      {feature.description}
                    </p>
                  </div>

                  {/* BOTTOM LINE */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-0
                      bg-[#a42025]
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
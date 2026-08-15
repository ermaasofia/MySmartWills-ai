import {
  Globe2,
  Network,
  ShieldCheck,
} from 'lucide-react';

import { Reveal } from './reveal';

const STATS = [
  {
    value: '12',
    label: 'Countries',
    description: 'Supported jurisdictions',
    icon: Globe2,
  },
  {
    value: '5',
    label: 'Trusted platforms',
    description: 'Across the SmartWills family',
    icon: Network,
  },
  {
    value: '100%',
    label: 'Private',
    description: 'Your information stays protected',
    icon: ShieldCheck,
  },
] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="border-b border-[#eeeeee] bg-white"
    >
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-0 lg:py-20">
        {/* LEFT */}
        <Reveal>
          <div>
            {/* LABEL */}
            <div className="mb-5 inline-flex items-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
                About us
              </span>
            </div>

            {/* HEADING */}
            <h2
              className="
                m-0
                max-w-[420px]
                font-serif
                font-medium
                leading-[1.02]
                tracking-[-0.035em]
                text-[#171717]
              "
              style={{
                fontSize: 'clamp(34px, 4vw, 48px)',
              }}
            >
              Part of the
              <br />
              <span className="text-[#a42025]">
                SmartWills
              </span>{' '}
              family.
            </h2>

            {/* SMALL DECORATION */}
            <div className="mt-7 h-[2px] w-12 rounded-full bg-[#a42025]" />
          </div>
        </Reveal>

        {/* RIGHT */}
        <Reveal delay={120}>
          <div>
            {/* DESCRIPTION */}
            <p className="m-0 max-w-[650px] text-[16px] leading-[1.8] text-[#5f5f5f] sm:text-[17px]">
              SmartWills.ai is where your will journey begins.
              We&apos;re part of a trusted family of will services
              helping people across Asia plan for what matters
              most.
            </p>

            <p className="mt-5 max-w-[650px] text-[15px] leading-[1.75] text-[#777777]">
              Savy guides you in simple language, helps organise
              your information step-by-step, and adapts the
              experience according to your selected country.
            </p>

            {/* STATS */}
            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {STATS.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.value}
                    className="
                      group
                      rounded-[12px]
                      border
                      border-[#e8e8e8]
                      bg-[#fcfcfc]
                      p-5
                      transition-all
                      duration-200

                      hover:-translate-y-1
                      hover:border-[#a42025]/20
                      hover:bg-white
                      hover:shadow-[0_12px_30px_rgba(164,32,37,0.08)]
                    "
                  >
                    {/* ICON */}
                    <div
                      className="
                        mb-4
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[#a42025]/[0.07]
                        text-[#a42025]
                      "
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* VALUE */}
                    <div
                      className="
                        text-[26px]
                        font-semibold
                        tracking-[-0.03em]
                        text-[#a42025]
                      "
                    >
                      {stat.value}
                    </div>

                    {/* LABEL */}
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#292929]">
                      {stat.label}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-2 text-[10px] leading-[1.5] text-[#858585]">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
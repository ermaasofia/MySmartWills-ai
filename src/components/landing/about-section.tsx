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
      className="relative overflow-hidden bg-[#050508] border-b border-white/[0.08] text-white"
    >
      {/* Background Red Glow & Space Ambience */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 25% 40%, rgba(209, 26, 42, 0.12) 0%, rgba(130, 10, 20, 0.04) 45%, transparent 70%)',
        }}
      />

      {/* Subtle Star Sparkles */}
      <span className="pointer-events-none absolute left-[8%] top-[30%] h-1 w-1 rounded-full bg-white opacity-70 animate-pulse" />
      <span className="pointer-events-none absolute right-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_8px_#ff3b47] animate-pulse" />
      <span className="pointer-events-none absolute right-[25%] bottom-[25%] h-1 w-1 rounded-full bg-white opacity-50" />
      <span className="pointer-events-none absolute left-[15%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_10px_#ff3b47]" />

      <div className="relative z-10 mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20">
        {/* LEFT */}
        <Reveal>
          <div>
            {/* LABEL */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#12131c]/80 px-3.5 py-1 shadow-[0_0_20px_rgba(209,26,42,0.18)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e2e2ec]">
                About us
              </span>
            </div>

            {/* HEADING */}
            <h2
              className="
                m-0
                max-w-[420px]
                font-serif
                font-normal
                leading-[1.06]
                tracking-[-0.03em]
                text-white
              "
              style={{
                fontSize: 'clamp(34px, 4vw, 48px)',
              }}
            >
              Part of the
              <br />
              <span className="font-serif italic text-[#ff3847] drop-shadow-[0_0_30px_rgba(255,56,71,0.85)]">
                SmartWills
              </span>{' '}
              family.
            </h2>

            {/* SMALL DECORATION */}
            <div className="mt-7 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#e01a2c] to-[#960d17] shadow-[0_0_10px_rgba(224,26,44,0.6)]" />
          </div>
        </Reveal>

        {/* RIGHT */}
        <Reveal delay={120}>
          <div>
            {/* DESCRIPTION */}
            <p className="m-0 max-w-[650px] text-[16px] leading-[1.8] text-[#c4c4cc] sm:text-[17px]">
              SmartWills.ai is where your will journey begins.
              We&apos;re part of a trusted family of will services
              helping people across Asia plan for what matters
              most.
            </p>

            <p className="mt-5 max-w-[650px] text-[15px] leading-[1.75] text-[#8e8e9c]">
              Savy guides you in simple language, helps organise
              your information step-by-step, and adapts the
              experience according to your selected country.
            </p>

            {/* STATS */}
            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.value}
                    className="
                      group
                      rounded-2xl
                      border
                      border-white/[0.12]
                      bg-[#0c0d14]/85
                      p-5
                      shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#ff3b47]/40
                      hover:shadow-[0_12px_35px_rgba(209,26,42,0.25)]
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
                        rounded-xl
                        bg-[#d11a2a]/15
                        text-[#ff4d5a]
                        border
                        border-[#d11a2a]/30
                        transition-transform
                        group-hover:scale-110
                      "
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* VALUE */}
                    <div
                      className="
                        text-[28px]
                        font-bold
                        tracking-[-0.03em]
                        text-[#ff3847]
                        drop-shadow-[0_0_15px_rgba(255,56,71,0.5)]
                      "
                    >
                      {stat.value}
                    </div>

                    {/* LABEL */}
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                      {stat.label}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-2 text-[10.5px] leading-[1.5] text-gray-400">
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
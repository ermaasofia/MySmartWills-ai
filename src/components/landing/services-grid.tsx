import {
  ArrowRight,
  FileCheck2,
  MessagesSquare,
  PenLine,
} from 'lucide-react';

import { Reveal } from './reveal';

const SERVICES = [
  {
    number: '01',
    title: 'Will guidance',
    description:
      'Get clear guidance about executors, beneficiaries, witnesses, assets and inheritance throughout your will-planning journey.',
    badge: 'Free',
    icon: MessagesSquare,
  },
  {
    number: '02',
    title: 'A clear will summary',
    description:
      'Your information is organised into one clear summary so you can review everything before completing your will.',
    badge: 'Free',
    icon: FileCheck2,
  },
  {
    number: '03',
    title: 'Write your will',
    description:
      'When your information is complete, continue to the next step without starting your will-planning process again.',
    badge: 'Connected',
    icon: PenLine,
  },
] as const;

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="border-y border-white/[0.08] bg-[#050508] text-white"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        {/* HEADER */}
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* SECTION LABEL */}
              <div className="mb-5 flex items-center gap-2">
                <span className="h-[6px] w-[6px] rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff3847]">
                  What we offer
                </span>
              </div>

              {/* HEADING */}
              <h2
                className="
                  m-0
                  max-w-[600px]
                  font-serif
                  font-medium
                  leading-[1.03]
                  tracking-[-0.035em]
                  text-white
                "
                style={{
                  fontSize: 'clamp(34px, 4vw, 48px)',
                }}
              >
                Everything you need,
                <br />

                <span className="text-[#ff3847] drop-shadow-[0_0_25px_rgba(255,56,71,0.7)]">
                  in one place.
                </span>
              </h2>
            </div>

            {/* SMALL DESCRIPTION */}
            <p className="m-0 max-w-[380px] text-[14px] leading-[1.75] text-[#8e8e9c]">
              SmartWills.ai keeps your will-planning journey
              simple, organised and easy to continue.
            </p>
          </div>
        </Reveal>

        {/* SERVICE CARDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal
                key={service.number}
                delay={index * 80}
              >
                <div
                  className="
                    group
                    relative
                    flex
                    h-full
                    min-h-[320px]
                    flex-col
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-white/[0.12]
                    bg-[#0c0d14]/85
                    p-7
                    transition-all
                    duration-300
                    backdrop-blur-xl
                    shadow-[0_10px_30px_rgba(0,0,0,0.7)]

                    hover:-translate-y-1
                    hover:border-[#ff3847]/40
                    hover:shadow-[0_18px_45px_rgba(209,26,42,0.15)]
                  "
                >
                  {/* TOP ROW */}
                  <div className="flex items-start justify-between">
                    {/* ICON */}
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-[#d11a2a]/15
                        text-[#ff4d5a]
                        border
                        border-[#d11a2a]/30
                      "
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* NUMBER */}
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        tracking-[0.18em]
                        text-[#6e6e7c]
                        transition-colors
                        group-hover:text-[#ff3847]
                      "
                    >
                      {service.number}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-8">
                    <h3 className="m-0 text-[20px] font-semibold tracking-[-0.02em] text-white">
                      {service.title}
                    </h3>

                    <p className="mt-4 text-[13px] leading-[1.75] text-[#8e8e9c]">
                      {service.description}
                    </p>
                  </div>

                  {/* BOTTOM */}
                  <div className="mt-auto flex items-center justify-between pt-8">
                    {/* BADGE */}
                    <span
                      className="
                        rounded-full
                        border
                        border-[#d11a2a]/25
                        bg-[#d11a2a]/10
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#ff3847]
                      "
                    >
                      {service.badge}
                    </span>

                    {/* ARROW */}
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.12]
                        bg-[#0c0d14]
                        text-[#b0b0be]
                        transition-all
                        duration-200

                        group-hover:border-[#ff3847]
                        group-hover:bg-[#d11a2a]
                        group-hover:text-white
                      "
                    >
                      <ArrowRight
                        size={15}
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* HOVER LINE */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[3px]
                      w-0
                      bg-[#ff3847]
                      transition-all
                      duration-300
                      group-hover:w-full
                      group-hover:shadow-[0_0_8px_rgba(255,56,71,0.5)]
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
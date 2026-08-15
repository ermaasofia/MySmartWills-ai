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
      className="border-y border-[#eeeeee] bg-[#fafafa]"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        {/* HEADER */}
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* SECTION LABEL */}
              <div className="mb-5 flex items-center gap-2">
                <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
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
                  text-[#171717]
                "
                style={{
                  fontSize: 'clamp(34px, 4vw, 48px)',
                }}
              >
                Everything you need,
                <br />

                <span className="text-[#a42025]">
                  in one place.
                </span>
              </h2>
            </div>

            {/* SMALL DESCRIPTION */}
            <p className="m-0 max-w-[380px] text-[14px] leading-[1.75] text-[#6f6f6f]">
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
                    border-[#e5e5e5]
                    bg-white
                    p-7
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-[#a42025]/20
                    hover:shadow-[0_18px_45px_rgba(164,32,37,0.08)]
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
                        bg-[#a42025]/[0.07]
                        text-[#a42025]
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
                        text-[#b0b0b0]
                        transition-colors
                        group-hover:text-[#a42025]
                      "
                    >
                      {service.number}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-8">
                    <h3 className="m-0 text-[20px] font-semibold tracking-[-0.02em] text-[#202020]">
                      {service.title}
                    </h3>

                    <p className="mt-4 text-[13px] leading-[1.75] text-[#737373]">
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
                        border-[#a42025]/15
                        bg-[#a42025]/[0.05]
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#a42025]
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
                        border-[#e6e6e6]
                        bg-white
                        text-[#333333]
                        transition-all
                        duration-200

                        group-hover:border-[#a42025]
                        group-hover:bg-[#a42025]
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
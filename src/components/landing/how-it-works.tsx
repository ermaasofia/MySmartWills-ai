import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react';

import { Reveal } from './reveal';

const STEPS = [
  {
    number: '01',
    title: 'Answer a few questions',
    description:
      'Tell Savy about yourself, your family and your situation using simple everyday language.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'We build your plan',
    description:
      'Your executors, guardians, assets and beneficiaries are organised step-by-step.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Review and continue',
    description:
      'Review your Will Detail Summary and continue when all important information is complete.',
    icon: CheckCircle2,
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-y border-[#eeeeee] bg-white"
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1120px]
          grid-cols-1
          gap-14
          px-4
          py-16
          sm:px-6
          lg:grid-cols-[0.8fr_1.2fr]
          lg:items-center
          lg:gap-20
          lg:px-0
          lg:py-24
        "
      >
        {/* ==================================================
            LEFT SIDE
        ================================================== */}
        <Reveal>
          <div>
            {/* LABEL */}
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
                How it works
              </span>
            </div>

            {/* TITLE */}
            <h2
              className="
                m-0
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
              Three simple steps.
              <br />
              <span className="text-[#a42025]">
                One clear plan.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-[390px] text-[14px] leading-[1.75] text-[#707070]">
              Savy guides you through your will one section at a
              time, so you always know what comes next.
            </p>

            {/* STEPS */}
            <div className="mt-9 flex flex-col gap-7">
              {STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Reveal
                    key={step.number}
                    delay={index * 80}
                  >
                    <div className="group flex gap-4">
                      {/* NUMBER / ICON */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#a42025]/[0.07]
                            text-[#a42025]
                            transition-colors
                            group-hover:bg-[#a42025]
                            group-hover:text-white
                          "
                        >
                          <Icon
                            size={19}
                            strokeWidth={1.7}
                          />
                        </div>

                        {index !== STEPS.length - 1 && (
                          <div className="mt-2 h-full min-h-[30px] w-px bg-[#e6e6e6]" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="pb-3">
                        <span className="text-[9px] font-semibold tracking-[0.15em] text-[#a42025]">
                          STEP {step.number}
                        </span>

                        <h3 className="mt-1.5 text-[15px] font-semibold text-[#202020]">
                          {step.title}
                        </h3>

                        <p className="mt-2 max-w-[330px] text-[12px] leading-[1.65] text-[#737373]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* TIME */}
            <div
              className="
                mt-8
                flex
                w-fit
                items-center
                gap-3
                rounded-[10px]
                border
                border-[#e8e8e8]
                bg-[#fafafa]
                px-4
                py-3
              "
            >
              <Clock3
                size={18}
                strokeWidth={1.7}
                className="text-[#a42025]"
              />

              <div>
                <p className="m-0 text-[11px] font-semibold text-[#303030]">
                  Complete at your own pace
                </p>

                <p className="mt-1 text-[9px] text-[#818181]">
                  Save your progress and continue anytime.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ==================================================
            RIGHT SIDE — SMARTWILLS PREVIEW
        ================================================== */}
        <Reveal delay={140}>
          <div>
            <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#a42025]">
              See SmartWills.ai in action
            </div>

            <div
              className="
                overflow-hidden
                rounded-[18px]
                border
                border-[#e5e5e5]
                bg-white
                shadow-[0_20px_60px_rgba(0,0,0,0.07)]
              "
            >
              {/* BROWSER TOP */}
              <div className="flex h-11 items-center justify-between border-b border-[#eeeeee] bg-[#fafafa] px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#a42025]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d7d7d7]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d7d7d7]" />
                </div>

                <div className="text-[8px] text-[#929292]">
                  smartwills.ai/chat
                </div>

                <div className="w-[32px]" />
              </div>

              {/* APP */}
              <div className="grid min-h-[390px] grid-cols-[150px_1fr] sm:grid-cols-[175px_1fr]">

                {/* SIDEBAR */}
                <aside className="relative border-r border-[#eeeeee] bg-[#fafafa] p-4">
                  {/* LOGO */}
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-[7px]
                        bg-[#a42025]
                        text-white
                      "
                    >
                      <Sparkles
                        size={14}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span className="text-[10px] font-semibold text-[#202020]">
                      SmartWills.ai
                    </span>
                  </div>

                  {/* NEW CHAT */}
                  <button
                    type="button"
                    className="
                      mt-5
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-[7px]
                      border
                      border-[#a42025]/20
                      bg-[#a42025]/[0.05]
                      px-3
                      py-2.5
                      text-left
                      text-[8px]
                      font-semibold
                      text-[#a42025]
                    "
                  >
                    <MessageCircle size={12} />

                    New conversation
                  </button>

                  {/* MENU */}
                  <div className="mt-6 space-y-2">
                    <div className="rounded-[6px] bg-[#a42025]/[0.07] px-3 py-2 text-[8px] font-medium text-[#a42025]">
                      Overview
                    </div>

                    <div className="px-3 py-2 text-[8px] text-[#777777]">
                      Your plan
                    </div>

                    <div className="px-3 py-2 text-[8px] text-[#777777]">
                      Documents
                    </div>

                    <div className="px-3 py-2 text-[8px] text-[#777777]">
                      Help & support
                    </div>
                  </div>

                  {/* USER */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 border-t border-[#ededed] pt-3">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-[#a42025]
                        text-white
                      "
                    >
                      <UserRound
                        size={13}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div>
                      <p className="m-0 text-[8px] font-semibold text-[#303030]">
                        Muhammad Amin
                      </p>

                      <p className="mt-0.5 text-[6px] text-[#999999]">
                        Free plan
                      </p>
                    </div>
                  </div>
                </aside>

                {/* CHAT AREA */}
                <div className="relative flex flex-col bg-white">
                  {/* CHAT HEADER */}
                  <div className="flex h-[55px] items-center gap-3 border-b border-[#eeeeee] px-5">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#a42025]/[0.07]
                        text-[#a42025]
                      "
                    >
                      <Sparkles
                        size={15}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="m-0 text-[9px] font-semibold text-[#242424]">
                        Savy MY
                      </p>

                      <p className="mt-0.5 text-[7px] text-[#949494]">
                        Malaysia • Private conversation
                      </p>
                    </div>
                  </div>

                  {/* CHAT CONTENT */}
                  <div className="flex-1 p-5">
                    <div className="max-w-[310px]">
                      <p className="m-0 text-[15px] font-semibold tracking-[-0.02em] text-[#202020]">
                        Hi, I&apos;m{' '}
                        <span className="text-[#a42025]">
                          Savy.
                        </span>
                      </p>

                      <p className="mt-2 text-[9px] leading-[1.6] text-[#747474]">
                        I&apos;ll help you create your will
                        step-by-step. Choose a topic below or ask
                        me anything.
                      </p>
                    </div>

                    {/* QUICK OPTIONS */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {[
                        'About you',
                        'Executor',
                        'Guardian',
                        'Assets',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="
                            rounded-[8px]
                            border
                            border-[#e7e7e7]
                            bg-white
                            px-3
                            py-2.5
                            text-left
                            text-[8px]
                            font-medium
                            text-[#404040]
                            transition-colors
                            hover:border-[#a42025]/30
                            hover:bg-[#a42025]/[0.03]
                          "
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    {/* ASSISTANT BUBBLE */}
                    <div className="mt-5 max-w-[270px] rounded-[10px] rounded-tl-[3px] bg-[#f6f6f6] px-4 py-3">
                      <p className="m-0 text-[8px] leading-[1.55] text-[#555555]">
                        Let&apos;s start with some basic
                        information about you.
                      </p>
                    </div>
                  </div>

                  {/* INPUT */}
                  <div className="border-t border-[#eeeeee] p-4">
                    <div
                      className="
                        flex
                        h-11
                        items-center
                        justify-between
                        rounded-[10px]
                        border
                        border-[#e3e3e3]
                        bg-white
                        px-3
                        shadow-[0_4px_15px_rgba(0,0,0,0.035)]
                      "
                    >
                      <span className="text-[8px] text-[#a0a0a0]">
                        Ask Savy about your will...
                      </span>

                      <button
                        type="button"
                        aria-label="Send message"
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-[#a42025]
                          text-white
                        "
                      >
                        <Send
                          size={12}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>

                    <p className="mt-2 text-center text-[6px] text-[#aaaaaa]">
                      Please review important details before
                      completing your will.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM NOTE */}
            <div className="mt-4 flex items-center justify-end">
              <a
                href="/signup"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-[11px]
                  font-semibold
                  text-[#303030]
                  transition-colors
                  hover:text-[#a42025]
                "
              >
                Start your will

                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

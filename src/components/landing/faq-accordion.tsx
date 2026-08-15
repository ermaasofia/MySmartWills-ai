'use client';

import { useState } from 'react';

import {
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

import { Reveal } from './reveal';

const FAQ = [
  {
    q: 'Is the guidance considered legal advice?',
    a: 'No. SmartWills.ai provides general guidance to help you understand the will-planning process and organise your information clearly.',
  },
  {
    q: 'Which countries are supported?',
    a: 'SmartWills.ai currently supports Malaysia, Singapore, Hong Kong, China, Taiwan, Indonesia, Thailand, Australia, New Zealand, Brunei, Vietnam and the Philippines.',
  },
  {
    q: 'Is my conversation private and secure?',
    a: 'Yes. Your conversations and personal information are kept private and protected. Your saved information is only used to support your SmartWills experience.',
  },
  {
    q: 'Can I save my progress and continue later?',
    a: 'Yes. Your progress is saved to your account so you can return and continue your will planning whenever you are ready.',
  },
  {
    q: 'Is SmartWills.ai free?',
    a: 'The SmartWills.ai assistant can guide you through the will-planning process. Additional services or document preparation may have separate pricing depending on the selected service.',
  },
  {
    q: 'What happens to my conversation history?',
    a: 'Your conversations are saved to your account so Savy can remember your progress and continue from the information you have already provided.',
  },
] as const;

export function FaqAccordion() {
  return (
    <section
      id="faq"
      className="border-y border-[#eeeeee] bg-[#fafafa]"
    >
      <div className="mx-auto max-w-[960px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        {/* HEADER */}
        <Reveal>
          <div className="mb-12 text-center">
            {/* ICON */}
            <div
              className="
                mx-auto
                mb-5
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
              <HelpCircle
                size={20}
                strokeWidth={1.7}
              />
            </div>

            {/* LABEL */}
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
              Common questions
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
              Honest answers
              <br />

              <span className="text-[#a42025]">
                before you begin.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[520px] text-[14px] leading-[1.7] text-[#737373]">
              Everything you need to know before starting your
              will-planning journey with SmartWills.ai.
            </p>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal delay={100}>
          <div
            className="
              overflow-hidden
              rounded-[16px]
              border
              border-[#e5e5e5]
              bg-white
              shadow-[0_12px_35px_rgba(0,0,0,0.035)]
            "
          >
            {FAQ.map((item, index) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                number={String(index + 1).padStart(2, '0')}
                last={index === FAQ.length - 1}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  number,
  last,
}: {
  q: string;
  a: string;
  number: string;
  last: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        transition-colors
        duration-200
        ${
          open
            ? 'bg-[#a42025]/[0.025]'
            : 'bg-white'
        }
      `}
      style={{
        borderBottom: last
          ? 'none'
          : '1px solid #eeeeee',
      }}
    >
      {/* QUESTION */}
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="
          flex
          w-full
          cursor-pointer
          items-center
          gap-4
          border-0
          bg-transparent
          px-5
          py-5
          text-left
          sm:px-7
          sm:py-6
        "
      >
        {/* NUMBER */}
        <span
          className={`
            shrink-0
            text-[9px]
            font-semibold
            tracking-[0.14em]
            transition-colors

            ${
              open
                ? 'text-[#a42025]'
                : 'text-[#aaaaaa]'
            }
          `}
        >
          {number}
        </span>

        {/* QUESTION TEXT */}
        <span
          className={`
            flex-1
            text-[14px]
            font-semibold
            transition-colors
            sm:text-[15px]

            ${
              open
                ? 'text-[#a42025]'
                : 'text-[#252525]'
            }
          `}
        >
          {q}
        </span>

        {/* ARROW */}
        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-200

            ${
              open
                ? `
                    rotate-180
                    border-[#a42025]
                    bg-[#a42025]
                    text-white
                  `
                : `
                    border-[#e3e3e3]
                    bg-white
                    text-[#666666]
                  `
            }
          `}
        >
          <ChevronDown
            size={15}
            strokeWidth={1.8}
          />
        </span>
      </button>

      {/* ANSWER */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 260 : 0,
          opacity: open ? 1 : 0,
          transition:
            'max-height 300ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
        }}
      >
        <div className="px-5 pb-6 pl-[56px] sm:px-7 sm:pb-7 sm:pl-[72px]">
          <p className="m-0 max-w-[760px] text-[13px] leading-[1.75] text-[#707070]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

import type { SavyCountry } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';

interface SavyRedirectCTAProps {
  target: SavyCountry;
  onNavigate: () => void;
  onDismiss: () => void;
}

function getSavyDisplayName(target: SavyCountry) {
  if (target.code === 'MY') {
    return 'Savy Malaysia';
  }

  return target.savyName;
}

export function SavyRedirectCTA({
  target,
  onNavigate,
  onDismiss,
}: SavyRedirectCTAProps) {
  const savyName = getSavyDisplayName(target);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -4,
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      className="
        ml-10
        mt-3
        max-w-[85%]
        rounded-[14px]
        border
        border-[#a42025]/15
        bg-white
        p-4
        shadow-[0_8px_26px_rgba(164,32,37,0.07)]
      "
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* LABEL */}
          <div
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#a42025]
            "
          >
            Savy handoff
          </div>

          {/* TARGET */}
          <div className="mt-2 flex items-center gap-2.5">
            <div
              className="
                flex
                h-9
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[7px]
                border
                border-[#eeeeee]
                bg-[#fafafa]
              "
            >
              <CountryFlag
                code={target.code}
                name={target.name}
                className="
                  h-4
                  w-6
                  rounded-[2px]
                  object-cover
                "
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  m-0
                  truncate
                  text-[13px]
                  font-semibold
                  leading-snug
                  text-[#222222]
                "
              >
                Mungkin{' '}
                <span className="text-[#a42025]">
                  {savyName}
                </span>{' '}
                lebih sesuai?
              </p>

              <p
                className="
                  m-0
                  mt-1
                  text-[10px]
                  text-[#888888]
                "
              >
                {target.name}
              </p>
            </div>
          </div>
        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={onDismiss}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-[7px]
            text-[#999999]
            transition-all

            hover:bg-[#f3f3f3]
            hover:text-[#333333]
          "
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onNavigate}
        className="
          mt-4
          inline-flex
          items-center
          gap-2
          rounded-[8px]
          bg-[#a42025]
          px-3.5
          py-2
          text-[11px]
          font-semibold
          text-white
          shadow-[0_5px_14px_rgba(164,32,37,0.16)]
          transition-all

          hover:-translate-y-[1px]
          hover:bg-[#891b1f]
          hover:shadow-[0_7px_18px_rgba(164,32,37,0.22)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#a42025]/20
        "
      >
        Pergi ke {savyName}

        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
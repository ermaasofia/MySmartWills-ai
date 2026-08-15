'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import {
  SAVY_COUNTRIES,
  type SavyCountry,
} from '@/lib/constants';

import { CountryFlag } from '@/components/ui/country-flag';

interface SavyCountrySelectorProps {
  onSelect: (country: SavyCountry) => void;
}

/* =========================================================
   ANIMATION
========================================================= */

const container = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.4,

      ease: [
        0.25,
        0.1,
        0.25,
        1,
      ] as const,
    },
  },
};

/* =========================================================
   SAVY ICON
========================================================= */

function getSavyIcon(
  code: string
) {
  switch (code) {
    case 'MY':
      return '/savy-my.png';

    case 'MY_WK':
      return '/savy-my-wasiat.png';

    case 'SG':
      return '/savy-sg.png';

    case 'HK':
      return '/savy-hk.png';

    case 'TH':
      return '/savy-th.png';

    default:
      return null;
  }
}

/* =========================================================
   DISPLAY NAME
========================================================= */

function getSavyDisplayName(
  country: SavyCountry
) {
  switch (country.code) {
    case 'MY':
      return 'Savy Malaysia';

    case 'MY_WK':
      return 'Suri · Malaysia Wasiat';

    case 'SG':
      return 'Savy Singapore';

    case 'HK':
      return 'Savy Hong Kong';

    case 'TH':
      return 'Savy Thailand';

    default:
      return country.savyName;
  }
}

/* =========================================================
   SHORT COUNTRY CODE
========================================================= */

function getShortCode(
  country: SavyCountry
) {
  if (
    country.code === 'MY_WK'
  ) {
    return 'MY';
  }

  return country.code;
}

/* =========================================================
   SELECTOR
========================================================= */

export function SavyCountrySelector({
  onSelect,
}: SavyCountrySelectorProps) {
  const [
    tappedCode,
    setTappedCode,
  ] = useState<string | null>(
    null
  );

  /* =======================================================
     SELECT COUNTRY
  ======================================================= */

  const handleTap = (
    country: SavyCountry
  ) => {
    if (
      !country.isActive ||
      tappedCode
    ) {
      return;
    }

    setTappedCode(
      country.code
    );

    setTimeout(() => {
      onSelect(country);
    }, 300);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        relative
        flex-1
        overflow-y-auto
        bg-white
        text-[#171717]
      "
    >
      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-[-260px]

            h-[520px]
            w-[850px]

            -translate-x-1/2

            rounded-full

            bg-[#a42025]/[0.025]

            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[-220px]
            right-[-120px]

            h-[380px]
            w-[380px]

            rounded-full

            bg-[#a42025]/[0.018]

            blur-[120px]
          "
        />
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative

          flex
          min-h-full
          flex-col
          items-center
          justify-center

          px-5
          py-12

          sm:px-8
          sm:py-14
        "
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: 'easeOut',
          }}
          className="
            relative
            mb-10
            max-w-[620px]
            text-center
          "
        >
          {/* BADGE */}

          <div
            className="
              mx-auto
              mb-5

              flex
              w-fit
              items-center
              gap-2

              rounded-full

              border
              border-[#e5e5e5]

              bg-white

              px-3
              py-1.5

              shadow-[0_4px_14px_rgba(0,0,0,0.035)]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#a42025]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase

                tracking-[0.16em]

                text-[#666666]
              "
            >
              Choose your jurisdiction
            </span>
          </div>

          {/* HEADING */}

          <h2
            className="
              m-0

              font-serif

              text-[34px]
              font-semibold
              leading-[1.08]

              tracking-[-0.04em]

              text-[#171717]

              sm:text-[42px]
              lg:text-[46px]
            "
          >
            Pick a jurisdiction

            <br className="hidden sm:block" />

            <span className="text-[#a42025]">
              {' '}
              to begin.
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-4

              max-w-[470px]

              text-[13px]
              leading-[1.65]

              text-[#777777]

              sm:text-[14px]
            "
          >
            Choose the SmartWills guide
            for your country. Each Savy
            is designed around its local
            inheritance requirements.
          </p>
        </motion.div>

        {/* =================================================
            COUNTRY GRID
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="
            relative

            grid
            w-full
            max-w-[1080px]

            grid-cols-2

            gap-3

            sm:grid-cols-3
            sm:gap-4

            lg:grid-cols-4

            xl:grid-cols-5
          "
        >
          {SAVY_COUNTRIES.map(
            (country) => {
              const isActive =
                country.isActive;

              const isTapped =
                tappedCode ===
                country.code;

              const savyIcon =
                getSavyIcon(
                  country.code
                );

              const savyName =
                getSavyDisplayName(
                  country
                );

              const shortCode =
                getShortCode(
                  country
                );

              return (
                <motion.button
                  key={
                    country.code
                  }
                  variants={item}
                  whileHover={
                    isActive
                      ? {
                          y: -3,
                        }
                      : undefined
                  }
                  whileTap={
                    isActive
                      ? {
                          scale:
                            0.98,
                        }
                      : undefined
                  }
                  animate={
                    isTapped
                      ? {
                          scale: [
                            1,
                            1.02,
                            1,
                          ],
                        }
                      : undefined
                  }
                  transition={
                    isTapped
                      ? {
                          duration:
                            0.25,
                        }
                      : {
                          type:
                            'spring',

                          stiffness:
                            320,

                          damping:
                            24,
                        }
                  }
                  onClick={() =>
                    handleTap(
                      country
                    )
                  }
                  disabled={
                    !isActive
                  }
                  className={`
                    group

                    relative

                    flex
                    min-h-[200px]
                    flex-col

                    overflow-hidden

                    rounded-[14px]

                    border

                    bg-white

                    text-left

                    outline-none

                    transition-all

                    focus-visible:ring-2
                    focus-visible:ring-[#a42025]/20

                    ${
                      isActive
                        ? `
                            cursor-pointer

                            border-[#e4e4e4]

                            shadow-[0_6px_24px_rgba(0,0,0,0.045)]

                            hover:border-[#a42025]/30

                            hover:shadow-[0_12px_30px_rgba(0,0,0,0.075)]
                          `
                        : `
                            cursor-not-allowed

                            border-[#eeeeee]

                            bg-[#fcfcfc]

                            opacity-65
                          `
                    }
                  `}
                >
                  {/* =====================================
                      ACTIVE COUNTRY
                  ===================================== */}

                  {isActive ? (
                    <>
                      {/* =================================
                          TOP CODE
                      ================================= */}

                      <div
                        className="
                          flex
                          w-full
                          items-center

                          px-4
                          pt-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                          "
                        >
                          <CountryFlag
                            code={
                              country.code
                            }
                            name={
                              country.name
                            }
                            className="
                              h-3.5
                              w-5

                              rounded-[2px]

                              object-cover
                            "
                          />

                          <span
                            className="
                              text-[10px]
                              font-bold

                              uppercase

                              tracking-[0.06em]

                              text-[#333333]
                            "
                          >
                            {shortCode}
                          </span>
                        </div>
                      </div>

                      {/* =================================
                          SAVY ICON
                      ================================= */}

                      <div
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center

                          px-4
                          py-3
                        "
                      >
                        {savyIcon ? (
                          <img
                            src={
                              savyIcon
                            }
                            alt={
                              savyName
                            }
                            draggable={
                              false
                            }
                            className="
                              h-[76px]
                              w-[76px]

                              object-contain

                              transition-transform
                              duration-300

                              group-hover:scale-[1.04]

                              sm:h-[82px]
                              sm:w-[82px]

                              lg:h-[88px]
                              lg:w-[88px]
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-[76px]
                              w-[76px]

                              items-center
                              justify-center

                              rounded-full

                              bg-[#fafafa]
                            "
                          >
                            <CountryFlag
                              code={
                                country.code
                              }
                              name={
                                country.name
                              }
                              className="
                                h-7
                                w-10

                                rounded-[3px]

                                object-cover
                              "
                            />
                          </div>
                        )}
                      </div>

                      {/* =================================
                          ACTIVE INFO
                      ================================= */}

                      <div
                        className="
                          w-full

                          border-t
                          border-[#eeeeee]

                          px-4
                          pb-4
                          pt-3

                          text-center
                        "
                      >
                        <div
                          className="
                            truncate

                            text-[12px]
                            font-semibold

                            text-[#a42025]

                            sm:text-[13px]
                          "
                        >
                          {savyName}
                        </div>

                        <div
                          className="
                            mt-1

                            truncate

                            text-[8px]
                            font-semibold

                            uppercase

                            tracking-[0.12em]

                            text-[#777777]
                          "
                        >
                          {country.name}
                        </div>

                        {/* SELECT */}

                        <div
                          className="
                            mx-auto
                            mt-3

                            flex
                            h-8
                            w-[104px]

                            items-center
                            justify-center
                            gap-4

                            rounded-[7px]

                            bg-[#a42025]

                            text-[10px]
                            font-semibold

                            text-white

                            shadow-[0_5px_14px_rgba(164,32,37,0.14)]

                            transition-all

                            group-hover:bg-[#891b1f]
                          "
                        >
                          <span>
                            Select
                          </span>

                          <span>
                            →
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ===================================
                       COMING SOON
                    =================================== */

                    <div
                      className="
                        flex
                        h-full
                        min-h-[200px]
                        w-full

                        flex-col

                        items-center
                        justify-center

                        px-4
                        py-5

                        text-center
                      "
                    >
                      {/* FLAG */}

                      <div
                        className="
                          flex
                          h-[54px]
                          w-[70px]

                          items-center
                          justify-center

                          rounded-[11px]

                          border
                          border-[#e7e7e7]

                          bg-white

                          shadow-[0_4px_12px_rgba(0,0,0,0.03)]
                        "
                      >
                        <CountryFlag
                          code={
                            country.code
                          }
                          name={
                            country.name
                          }
                          className="
                            h-7
                            w-10

                            rounded-[3px]

                            object-cover
                          "
                        />
                      </div>

                      <span
                        className="
                          mt-4

                          text-[11px]
                          font-semibold

                          text-[#444444]
                        "
                      >
                        {country.savyName}
                      </span>

                      <span
                        className="
                          mt-1

                          text-[8px]
                          font-semibold

                          uppercase

                          tracking-[0.12em]

                          text-[#aaaaaa]
                        "
                      >
                        Coming soon
                      </span>
                    </div>
                  )}

                  {/* =====================================
                      LOADING
                  ===================================== */}

                  {isTapped && (
                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        bg-white/80

                        backdrop-blur-[2px]
                      "
                    >
                      <span
                        className="
                          h-5
                          w-5

                          animate-spin

                          rounded-full

                          border-2
                          border-[#a42025]/20
                          border-t-[#a42025]
                        "
                      />
                    </div>
                  )}
                </motion.button>
              );
            }
          )}
        </motion.div>

        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
            duration: 0.4,
          }}
          className="
            mb-0
            mt-7

            text-center
            text-[9px]
            leading-[1.5]

            text-[#aaaaaa]
          "
        >
          More SmartWills jurisdictions
          are being prepared.
        </motion.p>
      </div>
    </div>
  );
}
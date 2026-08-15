import {
  ArrowRight,
  Globe2,
  MapPin,
} from 'lucide-react';

import { COUNTRIES } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';
import { Reveal } from './reveal';

export function CountriesGrid() {
  return (
    <section
      id="countries"
      className="border-y border-[#eeeeee] bg-[#fafafa]"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        {/* ==========================================
            HEADER
        ========================================== */}
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              {/* LABEL */}
              <div className="mb-5 flex items-center gap-2">
                <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
                  Countries we cover
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
                Twelve countries.
                <br />

                <span className="text-[#a42025]">
                  One assistant.
                </span>
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p className="m-0 max-w-[390px] text-[14px] leading-[1.75] text-[#707070]">
              Choose your country and SmartWills.ai will adapt
              the experience based on your selected
              jurisdiction.
            </p>
          </div>
        </Reveal>

        {/* ==========================================
            FEATURED COUNTRY
        ========================================== */}
        <Reveal delay={60}>
          <div
            className="
              mb-4
              flex
              flex-col
              justify-between
              gap-5
              rounded-[16px]
              border
              border-[#a42025]/20
              bg-[#a42025]/[0.05]
              p-6
              shadow-[0_10px_35px_rgba(164,32,37,0.04)]
              sm:flex-row
              sm:items-center
            "
          >
            <div className="flex items-center gap-4">
              {/* FLAG */}
              <div
                className="
                  flex
                  h-14
                  w-16
                  items-center
                  justify-center
                  rounded-[10px]
                  border
                  border-[#a42025]/10
                  bg-white
                  shadow-[0_4px_15px_rgba(0,0,0,0.04)]
                "
              >
                <CountryFlag
                  code="MY"
                  name="Malaysia"
                  className="h-7 w-10 rounded-[2px] object-cover"
                />
              </div>

              {/* TEXT */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="m-0 text-[17px] font-semibold text-[#202020]">
                    Malaysia
                  </h3>

                  <span
                    className="
                      rounded-full
                      bg-[#a42025]
                      px-2.5
                      py-1
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      text-white
                    "
                  >
                    Available
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#777777]">
                  <MapPin
                    size={13}
                    strokeWidth={1.7}
                    className="text-[#a42025]"
                  />

                  Malaysia • MY
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/signup"
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-[8px]
                bg-[#a42025]
                px-5
                py-3
                text-[11px]
                font-semibold
                text-white
                shadow-[0_7px_18px_rgba(164,32,37,0.15)]
                transition-all
                hover:-translate-y-[1px]
                hover:bg-[#891b1f]
              "
            >
              Start with Malaysia

              <ArrowRight
                size={14}
                strokeWidth={1.8}
              />
            </a>
          </div>
        </Reveal>

        {/* ==========================================
            COUNTRY GRID
        ========================================== */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map((country, index) => {
            /*
             * Malaysia already appears as the
             * highlighted card above.
             */
            if (country.code === 'MY') {
              return null;
            }

            return (
              <Reveal
                key={country.code}
                delay={index * 30}
              >
                <div
                  className="
                    group
                    relative
                    min-h-[150px]
                    overflow-hidden
                    rounded-[12px]
                    border
                    border-[#e6e6e6]
                    bg-white
                    p-4
                    transition-all
                    duration-250
                    hover:-translate-y-1
                    hover:border-[#a42025]/20
                    hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)]
                  "
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between">
                    <div
                      className="
                        flex
                        h-10
                        w-12
                        items-center
                        justify-center
                        rounded-[7px]
                        border
                        border-[#eeeeee]
                        bg-[#fafafa]
                      "
                    >
                      <CountryFlag
                        code={country.code}
                        name={country.name}
                        className="h-5 w-8 rounded-[2px] object-cover"
                      />
                    </div>

                    <span className="text-[8px] font-semibold tracking-[0.12em] text-[#aaaaaa] transition-colors group-hover:text-[#a42025]">
                      {country.code}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-5">
                    <h3 className="m-0 text-[13px] font-semibold text-[#292929]">
                      {country.name}
                    </h3>

                    <p className="mt-1.5 text-[9px] text-[#888888]">
                      {country.language}
                    </p>
                  </div>

                  {/* BOTTOM RED LINE */}
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

        {/* ==========================================
            BOTTOM INFO
        ========================================== */}
        <Reveal delay={180}>
          <div
            className="
              mt-5
              flex
              flex-col
              justify-between
              gap-4
              rounded-[12px]
              border
              border-[#e6e6e6]
              bg-white
              px-5
              py-4
              sm:flex-row
              sm:items-center
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#a42025]/[0.07]
                  text-[#a42025]
                "
              >
                <Globe2
                  size={17}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="m-0 text-[11px] font-semibold text-[#303030]">
                  Can&apos;t find your country?
                </p>

                <p className="mt-1 text-[9px] text-[#858585]">
                  We&apos;re continuously expanding SmartWills.ai
                  to more jurisdictions.
                </p>
              </div>
            </div>

            <a
              href="#faq"
              className="
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-semibold
                text-[#454545]
                transition-colors
                hover:text-[#a42025]
              "
            >
              Learn more

              <ArrowRight
                size={13}
                strokeWidth={1.8}
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
import {
  Quote,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

import { Reveal } from './reveal';

export function Testimonial() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        <Reveal>
          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-[#e8e8e8]
              bg-[#fafafa]
              px-7
              py-10
              sm:px-10
              lg:px-14
              lg:py-14
            "
          >
            {/* SOFT BACKGROUND DECORATION */}
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-[280px]
                w-[280px]
                rounded-full
                bg-[#a42025]/[0.035]
                blur-[70px]
              "
            />

            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
              {/* LEFT */}
              <div>
                {/* LABEL */}
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#a42025]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a42025]">
                    A customer story
                  </span>
                </div>

                {/* QUOTE ICON */}
                <div
                  className="
                    mb-6
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
                  <Quote
                    size={20}
                    strokeWidth={1.7}
                  />
                </div>

                {/* QUOTE */}
                <blockquote
                  className="
                    m-0
                    max-w-[700px]
                    font-serif
                    text-[24px]
                    font-medium
                    leading-[1.45]
                    tracking-[-0.025em]
                    text-[#1f1f1f]
                    sm:text-[28px]
                  "
                >
                  “The answers were specific to Hong Kong —
                  not generic advice. When I eventually met
                  with my lawyer, I already knew the right
                  questions to ask.”
                </blockquote>

                {/* CUSTOMER */}
                <div className="mt-8 flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#a42025]
                      text-[13px]
                      font-semibold
                      text-white
                      shadow-[0_6px_16px_rgba(164,32,37,0.18)]
                    "
                  >
                    MC
                  </div>

                  <div>
                    <p className="m-0 text-[13px] font-semibold text-[#242424]">
                      Mei Yin C.
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#7f7f7f]">
                      <MapPin
                        size={11}
                        strokeWidth={1.7}
                        className="text-[#a42025]"
                      />

                      Hong Kong
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT TRUST CARD */}
              <div
                className="
                  rounded-[16px]
                  border
                  border-[#a42025]/15
                  bg-white
                  p-6
                  shadow-[0_12px_35px_rgba(164,32,37,0.06)]
                "
              >
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
                  <ShieldCheck
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="mt-5 text-[16px] font-semibold text-[#242424]">
                  Guidance that feels personal
                </h3>

                <p className="mt-3 text-[12px] leading-[1.7] text-[#727272]">
                  SmartWills.ai adapts the conversation to the
                  user&apos;s selected country and keeps the
                  process clear from start to finish.
                </p>

                <div className="mt-6 border-t border-[#eeeeee] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8b8b8b]">
                      Country
                    </span>

                    <span className="text-[10px] font-semibold text-[#252525]">
                      Hong Kong
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-[#8b8b8b]">
                      Experience
                    </span>

                    <span className="text-[10px] font-semibold text-[#a42025]">
                      Clear & guided
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
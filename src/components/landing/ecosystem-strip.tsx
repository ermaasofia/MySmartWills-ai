import {
  ArrowRight,
  FileText,
  Globe2,
  ListChecks,
  LockKeyhole,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Knows your country',
    description:
      'Guidance tailored to your selected country and jurisdiction.',
    icon: Globe2,
  },
  {
    title: 'Private and secure',
    description:
      'Your personal information and conversations stay protected.',
    icon: LockKeyhole,
  },
  {
    title: 'Step-by-step',
    description:
      'We guide you through each part of your will, one step at a time.',
    icon: ListChecks,
  },
  {
    title: 'Clear will summary',
    description:
      'Get a clear, organised summary of your will information.',
    icon: FileText,
  },
];

export function EcosystemStrip() {
  return (
    <section className="border-y border-[#ececec] bg-[#fafafa] py-6">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  flex
                  min-h-[175px]
                  flex-col
                  justify-between
                  rounded-[12px]
                  border
                  border-[#e8e8e8]
                  bg-white
                  p-5
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-[#a42025]/20
                  hover:shadow-[0_12px_32px_rgba(164,32,37,0.08)]
                "
              >
                {/* TOP */}
                <div className="flex items-start gap-4">
                  {/* ICON */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
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

                  {/* TEXT */}
                  <div>
                    <h3 className="m-0 text-[13px] font-semibold text-[#202020]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-[1.6] text-[#707070]">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* LEARN MORE */}
                <button
                  type="button"
                  className="
                    ml-[56px]
                    mt-5
                    flex
                    w-fit
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-[#666666]
                    transition-colors
                    group-hover:text-[#a42025]
                  "
                >
                  Learn more

                  <ArrowRight
                    size={12}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
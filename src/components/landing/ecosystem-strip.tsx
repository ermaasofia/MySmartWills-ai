const ECOSYSTEM_DOMAINS = [
  'smartwills.com.my',
  'smartwills.com.sg',
  'smartwills.com.hk',
  'mysmartwills.com',
  'wasiatku.com.my',
];

export function EcosystemStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--raised-1)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 overflow-hidden px-4 py-6 sm:flex-row sm:items-center sm:gap-12 sm:px-6 sm:py-7 lg:px-8">
        <div className="whitespace-nowrap text-[11px] uppercase tracking-[2px] text-white/55">
          The SmartWills family
        </div>
        <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/55 sm:flex-nowrap sm:justify-between sm:gap-10">
          {ECOSYSTEM_DOMAINS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

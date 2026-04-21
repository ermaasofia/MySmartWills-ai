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
      <div className="mx-auto flex max-w-[1280px] items-center gap-12 overflow-hidden px-8 py-7">
        <div className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[1px] text-white/45">
          SmartWills ecosystem
        </div>
        <div className="flex flex-1 justify-between gap-10 text-[13px] text-white/55">
          {ECOSYSTEM_DOMAINS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

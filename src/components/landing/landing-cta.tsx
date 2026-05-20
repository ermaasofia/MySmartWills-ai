import Link from 'next/link';
import { Reveal } from './reveal';

export function LandingCTA() {
  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-[120px]">
        <Reveal>
          <h2
            className="m-0 font-medium leading-[1]"
            style={{
              fontSize: 'clamp(44px, 5.5vw, 72px)',
              letterSpacing: '-0.03em',
            }}
          >
            The conversation your<br />
            family needs to have.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/signup"
              className="rounded-[8px] bg-[#ededed] px-[22px] py-[14px] text-base font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Start for free →
            </Link>
            <Link
              href="#how"
              className="rounded-[8px] border border-[var(--border)] bg-transparent px-[22px] py-[14px] text-base font-medium text-[#ededed] transition-colors hover:bg-white/[0.04]"
            >
              See how it works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { createTimeline, stagger } from 'animejs';
import {
  ArrowRight,
  Globe2,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
  FileText,
  ChevronDown,
} from 'lucide-react';

import { Reveal } from './reveal';
import { ApacGlobe } from './apac-globe';
import { useLenis } from '../providers/lenis-provider';

const STATS = [
  {
    value: '12',
    line1: 'countries',
    line2: 'supported',
    icon: Globe2,
  },
  {
    value: '100%',
    line1: 'private &',
    line2: 'secure',
    icon: ShieldCheck,
  },
  {
    value: '5',
    line1: 'trusted',
    line2: 'platforms',
    icon: UsersRound,
  },
  {
    value: '24/7',
    line1: 'AI assistant',
    line2: 'support',
    icon: Sparkles,
  },
] as const;

export function Hero() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPins, setShowPins] = useState(false);

  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introContentStackRef = useRef<HTMLDivElement>(null);
  const globeWrapperRef = useRef<HTMLDivElement>(null);
  const heroRightSlotRef = useRef<HTMLDivElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const lenis = useLenis();

  const triggerTransition = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsTransitioning(true);

    const tl = createTimeline({
      onComplete: () => {
        setIsIntroActive(false);
        setIsTransitioning(false);
        setShowPins(true);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (lenis) {
          lenis.start();
          lenis.resize();
        }
      },
    });

    // 1. Fade out Intro UI (0ms - 320ms)
    if (introContentStackRef.current) {
      tl.add(
        introContentStackRef.current,
        {
          opacity: [1, 0],
          translateY: [0, -32],
          duration: 320,
          ease: 'inQuad',
        },
        0
      );
    }

    // 2. Animate Globe from Bottom-Center Horizon into Hero Right Slot (80ms - 950ms)
    if (globeWrapperRef.current && heroRightSlotRef.current) {
      const targetRect = heroRightSlotRef.current.getBoundingClientRect();
      const currentRect = globeWrapperRef.current.getBoundingClientRect();

      const deltaX = targetRect.left + targetRect.width / 2 - (currentRect.left + currentRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (currentRect.top + currentRect.height / 2);

      tl.add(
        globeWrapperRef.current,
        {
          translateX: [0, deltaX],
          translateY: [0, deltaY],
          scale: [1.4, 1],
          duration: 880,
          ease: 'cubicBezier(0.16, 1, 0.3, 1)',
        },
        80
      );
    }

    // 3. Reveal Left Column in Hero (Text, Buttons, Stats) (400ms - 1000ms)
    if (heroLeftRef.current) {
      const elements = Array.from(heroLeftRef.current.children) as HTMLElement[];
      tl.add(
        elements,
        {
          opacity: [0, 1],
          translateX: [-28, 0],
          duration: 600,
          delay: stagger(75),
          ease: 'outCubic',
        },
        400
      );
    }

    // 4. Reveal Floating Badges & Savy Video Avatar (520ms - 1050ms)
    if (heroBadgesRef.current) {
      const badgeElements = Array.from(heroBadgesRef.current.children) as HTMLElement[];
      tl.add(
        badgeElements,
        {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 520,
          delay: stagger(70),
          ease: 'outBack',
        },
        520
      );
    }
  }, [lenis]);

  useEffect(() => {
    if (!isIntroActive && !isTransitioning) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenis) lenis.start();
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        triggerTransition();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      triggerTransition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        triggerTransition();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isIntroActive, isTransitioning, lenis, triggerTransition]);

  return (
    <section className="relative overflow-hidden bg-white min-h-[92vh] flex flex-col justify-center">
      {/* BACKGROUND GLOW */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 35%, rgba(164,32,37,0.045) 0%, rgba(164,32,37,0.015) 28%, transparent 55%)',
        }}
      />

      {/* =========================================
          INTRO OVERLAY (TOP CONTENT & CTA)
      ========================================= */}
      {isIntroActive && (
        <div
          ref={introOverlayRef}
          className={`fixed inset-0 z-40 flex flex-col items-center justify-start pt-20 sm:pt-24 select-none transition-opacity duration-300 ${
            isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div
            ref={introContentStackRef}
            className="flex flex-col items-center text-center max-w-3xl px-4 pointer-events-auto z-50"
          >
            {/* INTRO HEADLINE */}
            <h1
              className="m-0 font-serif font-medium leading-[1.02] tracking-[-0.045em] text-[#161616]"
              style={{ fontSize: 'clamp(32px, 5.5vw, 64px)' }}
            >
              Plan your legacy,<br />
              <span className="text-[#a42025]">protect</span> what matters most.
            </h1>

            {/* INTRO SUBTITLE */}
            <p className="mt-3 max-w-[560px] text-[15px] sm:text-[16px] leading-[1.65] text-[#555555]">
              SmartWills.ai gives you country-aware guidance, step-by-step support, and instant peace of mind.
            </p>

            {/* ACTION STACK (SCROLL PROMPT + GET STARTED BUTTON) */}
            <div className="mt-5 flex flex-col items-center gap-3.5">
              <div
                onClick={triggerTransition}
                className="flex flex-col items-center gap-1 cursor-pointer text-[#555555] hover:text-[#a42025] transition-colors"
              >
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-500">
                  SCROLL DOWN TO EXPLORE
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm animate-bounce">
                  <ChevronDown size={14} className="text-[#a42025]" />
                </div>
              </div>

              <button
                type="button"
                onClick={triggerTransition}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#a42025] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(164,32,37,0.32)] hover:bg-[#891b1f] hover:shadow-[0_14px_40px_rgba(164,32,37,0.45)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MAIN HERO CONTAINER (TWO-COLUMN LAYOUT)
      ========================================= */}
      <div
        className="
          relative
          mx-auto
          grid
          min-h-[520px]
          max-w-[1120px]
          grid-cols-1
          items-center
          gap-10
          px-4
          py-14
          sm:px-6
          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-12
          lg:px-0
          lg:py-16
        "
      >
        {/* LEFT HERO COLUMN */}
        <div
          ref={heroLeftRef}
          className={`relative z-10 transition-opacity duration-300 ${
            isIntroActive && !isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* BADGE */}
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-3 py-1.5 shadow-[0_3px_12px_rgba(0,0,0,0.04)]">
              <Sparkles size={13} strokeWidth={1.8} className="text-[#a42025]" />
              <span className="text-[10px] font-semibold tracking-[0.08em] text-[#343434]">
                AI-POWERED • HUMAN GUIDED
              </span>
            </div>
          </Reveal>

          {/* HEADING */}
          <Reveal delay={80}>
            <h1
              className="m-0 max-w-[570px] font-serif font-medium leading-[0.98] tracking-[-0.045em] text-[#161616]"
              style={{ fontSize: 'clamp(48px, 5vw, 68px)' }}
            >
              Plan your will,<br />
              <span className="text-[#a42025]">protect</span> your family.
            </h1>
          </Reveal>

          {/* DESCRIPTION */}
          <Reveal delay={160}>
            <p className="mt-6 max-w-[510px] text-[15px] leading-[1.7] text-[#555555] sm:text-[16px]">
              SmartWills.ai gives you country-aware guidance, step-by-step support, and a clear summary of your will. So you can plan with confidence and peace of mind.
            </p>
          </Reveal>

          {/* CTA BUTTONS */}
          <Reveal delay={240}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-5 rounded-[7px] bg-[#a42025] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(164,32,37,0.16)] transition-all hover:-translate-y-[1px] hover:bg-[#891b1f]"
              >
                Start for free
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>

              <Link
                href="#how"
                className="inline-flex items-center gap-3 rounded-[7px] border border-[#dedede] bg-white px-5 py-3 text-[13px] font-semibold text-[#252525] transition-all hover:border-[#a42025]/20 hover:bg-[#a42025]/[0.025]"
              >
                See how it works
                <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full border border-[#555555]">
                  <Play size={8} fill="currentColor" />
                </span>
              </Link>
            </div>
          </Reveal>

          {/* STATS */}
          <Reveal delay={320}>
            <div className="mt-9 grid max-w-[520px] grid-cols-2 gap-x-7 gap-y-5 sm:grid-cols-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.value} className="flex items-start gap-2.5">
                    <Icon size={23} strokeWidth={1.7} className="mt-[2px] shrink-0 text-[#a42025]" />
                    <div className="flex flex-col">
                      <span className="text-[16px] font-semibold leading-none text-[#202020]">
                        {stat.value}
                      </span>
                      <span className="mt-1 text-[10px] leading-[1.3] text-[#787878]">
                        {stat.line1}<br />{stat.line2}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* RIGHT HERO SLOT (FINAL RESTING TARGET FOR GLOBE) */}
        <div
          ref={heroRightSlotRef}
          className="relative mx-auto min-h-[430px] w-full max-w-[570px] flex items-center justify-center z-10"
        >
          {/* =========================================================
              GLOBE CONTAINER
              - In Intro State: Fixed at bottom-center horizon (50% left, 0 bottom, translate -50% 50%)
              - In Final Hero State: Sits naturally inside hero right slot
          ========================================================= */}
          <div
            ref={globeWrapperRef}
            className={`
              ${
                isIntroActive
                  ? 'fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 scale-[1.4] w-[460px] sm:w-[540px] lg:w-[620px] h-[460px] sm:h-[540px] lg:h-[620px] z-30'
                  : 'relative w-full h-full'
              }
            `}
            style={{
              transformOrigin: 'center center',
            }}
          >
            {/* ATMOSPHERIC RED GLOW (INTRO DOME ONLY) */}
            {isIntroActive && (
              <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[700px] max-w-[95vw] h-[220px] rounded-[50%] bg-[#a42025]/25 blur-3xl z-0" />
            )}

            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a42025]/[0.025] blur-3xl" />

            {/* 3D APAC GLOBE */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[370px] max-w-[78vw] opacity-95">
                <ApacGlobe showPins={showPins || (!isIntroActive && !isTransitioning)} />
              </div>
            </div>

            {/* ORBIT LINES */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[440px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-[50%] border border-[#a42025]/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[290px] w-[400px] max-w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-[50%] border border-[#a42025]/10" />

            {/* FLOATING BADGES & SAVY AVATAR (ONLY VISIBLE IN FINAL HERO STATE) */}
            <div
              ref={heroBadgesRef}
              className={`transition-opacity duration-300 ${
                isIntroActive && !isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* PRIVATE CARD */}
              <div className="absolute left-[3%] top-[12%] z-10 flex w-[175px] gap-3 rounded-[10px] border border-[#e8e8e8] bg-white/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a42025]/[0.07] text-[#a42025]">
                  <LockKeyhole size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="m-0 text-[10px] font-semibold text-[#222222]">Private & secure</p>
                  <p className="mt-1 text-[8px] leading-[1.5] text-[#707070]">
                    Your data is encrypted and never shared.
                  </p>
                </div>
              </div>

              {/* SAVY VIDEO AVATAR CARD */}
              <div className="absolute right-[2%] top-[18%] z-20 flex items-center gap-3 rounded-[14px] border border-[#a42025]/20 bg-white/95 p-2.5 pr-4 shadow-[0_12px_35px_rgba(164,32,37,0.12)] backdrop-blur-md animate-bounce-subtle">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#a42025]/30 bg-red-50">
                  <video
                    src="/flags/savy_vd.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover scale-110"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="m-0 text-[11px] font-bold text-[#1f1f1f]">Savy AI Assistant</p>
                    <span className="rounded-full bg-[#a42025]/10 px-1.5 py-0.5 text-[8px] font-bold text-[#a42025]">
                      LIVE
                    </span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-tight text-[#666666]">
                    Ready to guide your will planning
                  </p>
                </div>
              </div>

              {/* WILL READY CARD */}
              <div className="absolute bottom-[12%] left-[12%] z-10 flex w-[175px] gap-3 rounded-[10px] border border-[#e8e8e8] bg-white/95 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a42025]/[0.07] text-[#a42025]">
                  <FileText size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="m-0 text-[10px] font-semibold text-[#222222]">Will ready</p>
                  <p className="mt-1 text-[8px] leading-[1.5] text-[#707070]">
                    Get a clear summary of your will information.
                  </p>
                </div>
              </div>

              {/* SHIELD */}
              <div className="absolute bottom-[8%] left-[54%] z-10 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#a42025] text-white shadow-[0_8px_25px_rgba(164,32,37,0.25)]">
                <ShieldCheck size={23} strokeWidth={2} />
              </div>

              {/* DECORATIVE DOTS */}
              <span className="absolute left-[27%] top-[7%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute left-[2%] top-[49%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute right-[8%] top-[15%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute bottom-[16%] right-[11%] h-3 w-3 rounded-full bg-[#a42025] shadow-[0_0_12px_rgba(164,32,37,0.65)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
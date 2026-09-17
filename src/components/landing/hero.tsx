'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const lenis = useLenis();

  const handleStartTransition = useCallback(() => {
    if (isTransitioning || !isIntroActive) return;
    setIsTransitioning(true);

    const tl = createTimeline({
      ease: 'cubicBezier(0.25, 1, 0.5, 1)',
      onComplete: () => {
        // 1. Buang intro overlay sepenuhnya
        setIsIntroActive(false);
        setIsTransitioning(false);
        setShowPins(true);
        // 2. Buka semula vertical scroll page
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (lenis) {
          lenis.start();
          lenis.resize();
        }
      },
    });

    // 1. Text & Button Intro Fade Out cepat (0ms - 250ms)
    tl.add(
      '#intro-text-group, #intro-get-started-btn, #intro-scroll-indicator',
      {
        opacity: [1, 0],
        translateY: [0, -25],
        duration: 250,
        ease: 'inQuad',
      },
      0
    )
      // 2. Smooth Zoom-In Transition pada Intro Globe (100ms - 700ms)
      // Tidak perlu gerak kiri-kanan (translateX), cuma scale ke depan dan fade
      .add(
        '#intro-globe-wrapper',
        {
          scale: [1, 1.35],
          opacity: [1, 0],
          duration: 600,
          ease: 'cubicBezier(0.4, 0, 0.2, 1)',
        },
        100
      )
      // 3. Final Hero Layout (Image 2) Muncul Serentak (Direct Fade & Subtle Settle)
      .add(
        '#final-hero-container',
        {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 600,
          ease: 'outCubic',
        },
        200
      )
      // 4. Stagger Masuk untuk Floating Cards & Flag Badges (Hero Kedua)
      .add(
        '.hero-floating-card, .hero-flag-badge, .hero-shield-icon, .hero-metric-item',
        {
          opacity: [0, 1],
          scale: [0.85, 1],
          duration: 450,
          delay: stagger(60),
          ease: 'outBack',
        },
        300
      );
  }, [isTransitioning, isIntroActive, lenis]);

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
        handleStartTransition();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleStartTransition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        handleStartTransition();
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
  }, [isIntroActive, isTransitioning, lenis, handleStartTransition]);

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
          INTRO OVERLAY (TOP CONTENT, CTA & ZOOM GLOBE)
      ========================================= */}
      {isIntroActive && (
        <div
          id="intro-overlay"
          className={`fixed inset-x-0 bottom-0 z-40 flex flex-col items-center select-none ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
          style={{
            top: '82px',
          }}
        >
          {/* TOP INTRO CONTENT */}
          <div
            className="flex flex-col items-center text-center max-w-4xl px-4 z-50 overflow-visible"
            style={{
              paddingTop: 'clamp(30px, 9vh, 110px)',
            }}
          >
            {/* INTRO TEXT GROUP */}
            <div id="intro-text-group" className="flex flex-col items-center">
              <h1
                className="m-1 font-serif font-medium leading-[1.18] tracking-[-0.03em] text-[#161616] pb-1 overflow-visible"
                style={{
                  fontSize: 'clamp(32px, 5vw, 60px)', paddingTop: '20px'
                }}
              >
                Plan your legacy,<br className="hidden sm:inline" />{' '}
                <span className="text-[#a42025]">protect</span> what matters most.
              </h1>


            </div>

            {/* ACTION STACK (SCROLL PROMPT + GET STARTED BUTTON) */}
            <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3.5">
              <div
                id="intro-scroll-indicator"
                onClick={handleStartTransition}
                className="flex flex-col items-center gap-1.5 cursor-pointer text-[#555555] hover:text-[#a42025] transition-colors"
              >
                <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-gray-500">
                  SCROLL DOWN TO EXPLORE
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm animate-bounce">
                  <ChevronDown size={14} className="text-[#a42025]" />
                </div>
              </div>

              <button
                id="intro-get-started-btn"
                type="button"
                onClick={handleStartTransition}
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#a42025] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(164,32,37,0.32)] hover:bg-[#891b1f] hover:shadow-[0_14px_40px_rgba(164,32,37,0.45)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>GET STARTED</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* INTRO GLOBE (BOTTOM HORIZON) */}
          <div
            id="intro-globe-wrapper"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 scale-[1.38] w-[460px] sm:w-[540px] lg:w-[600px] h-[460px] sm:h-[540px] lg:h-[600px] z-30 pointer-events-none"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {/* ATMOSPHERIC RED GLOW (INTRO DOME ONLY) */}
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[700px] max-w-[95vw] h-[220px] rounded-[50%] bg-[#a42025]/25 blur-3xl z-0" />

            {/* 3D APAC GLOBE */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[370px] sm:w-[400px] lg:w-[430px] max-w-[85vw] opacity-95 aspect-square">
                <ApacGlobe showPins={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MAIN HERO CONTAINER (TWO-COLUMN BALANCED LAYOUT)
      ========================================= */}
      <div
        id="final-hero-container"
        className="
          relative
          mx-auto
          grid
          min-h-[540px]
          max-w-[1180px]
          grid-cols-1
          items-center
          gap-8
          px-4
          py-12
          sm:px-6
          lg:grid-cols-[1fr_1.05fr]
          lg:gap-10
          lg:px-6
          lg:py-16
        "
        style={{
          opacity: isIntroActive ? 0 : 1,
          transform: isIntroActive ? 'scale(0.96)' : 'none',
          pointerEvents: isIntroActive && !isTransitioning ? 'none' : 'auto',
        }}
      >
        {/* LEFT HERO COLUMN */}
        <div className="relative z-10 flex flex-col justify-center">
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
              className="m-0 max-w-[570px] font-serif font-medium leading-[1.12] tracking-[-0.035em] text-[#161616] pb-1 overflow-visible"
              style={{ fontSize: 'clamp(42px, 4.6vw, 64px)' }}
            >
              Plan your will,<br />
              <span className="text-[#a42025]">protect</span> your family.
            </h1>
          </Reveal>

          {/* DESCRIPTION */}
          <Reveal delay={160}>
            <p className="mt-5 max-w-[510px] text-[15px] leading-[1.7] text-[#555555] sm:text-[16px]">
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
                  <div key={stat.value} className="hero-metric-item flex items-start gap-2.5">
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

        {/* RIGHT HERO SLOT - FITS PERFECTLY IN THE RIGHT-HAND SPACE */}
        <div
          className="relative min-h-[460px] w-full max-w-[560px] mx-auto flex items-center justify-center z-10 overflow-visible"
        >
          <div
            className="relative w-full h-[460px] flex items-center justify-center overflow-visible"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a42025]/[0.03] blur-3xl" />

            {/* 3D APAC GLOBE */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[370px] sm:w-[400px] lg:w-[430px] max-w-[85vw] opacity-95 aspect-square">
                <ApacGlobe showPins={showPins || !isIntroActive} />
              </div>
            </div>

            {/* ORBIT LINES */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[230px] w-[450px] max-w-[95%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-[50%] border border-[#a42025]/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[410px] max-w-[85%] -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-[50%] border border-[#a42025]/10" />

            {/* FLOATING BADGES & SAVY AVATAR (WELL-BALANCED AROUND THE GLOBE) */}
            <div>
              {/* PRIVATE CARD (TOP LEFT OF GLOBE) */}
              <div className="hero-floating-card absolute left-[0%] sm:left-[2%] top-[10%] z-10 flex w-[172px] gap-2.5 rounded-[10px] border border-[#e8e8e8] bg-white/95 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a42025]/[0.07] text-[#a42025]">
                  <LockKeyhole size={16} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="m-0 text-[10px] font-semibold text-[#222222]">Private & secure</p>
                  <p className="mt-0.5 text-[8px] leading-[1.4] text-[#707070]">
                    Your data is encrypted and never shared.
                  </p>
                </div>
              </div>



              {/* WILL READY CARD (BOTTOM LEFT OF GLOBE) */}
              <div className="hero-floating-card absolute bottom-[10%] left-[4%] sm:left-[6%] z-10 flex w-[172px] gap-2.5 rounded-[10px] border border-[#e8e8e8] bg-white/95 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a42025]/[0.07] text-[#a42025]">
                  <FileText size={16} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="m-0 text-[10px] font-semibold text-[#222222]">Will ready</p>
                  <p className="mt-0.5 text-[8px] leading-[1.4] text-[#707070]">
                    Get a clear summary of your will.
                  </p>
                </div>
              </div>

              {/* SHIELD (BOTTOM CENTER OF GLOBE) */}
              <div className="hero-shield-icon absolute bottom-[6%] left-[50%] z-10 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#a42025] text-white shadow-[0_8px_25px_rgba(164,32,37,0.25)]">
                <ShieldCheck size={20} strokeWidth={2} />
              </div>

              {/* DECORATIVE DOTS */}
              <span className="absolute left-[25%] top-[6%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute left-[0%] top-[48%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute right-[6%] top-[12%] h-2 w-2 rounded-full bg-[#a42025] shadow-[0_0_9px_rgba(164,32,37,0.6)]" />
              <span className="absolute bottom-[14%] right-[10%] h-2.5 w-2.5 rounded-full bg-[#a42025] shadow-[0_0_12px_rgba(164,32,37,0.65)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
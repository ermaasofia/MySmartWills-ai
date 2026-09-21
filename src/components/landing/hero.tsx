'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createTimeline, stagger } from 'animejs';
import {
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  FileText,
  Shield,
  Users,
  FileCheck2,
  Clock,
} from 'lucide-react';

import { ApacGlobe } from './apac-globe';
import { useLenis } from '../providers/lenis-provider';

export function Hero() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPins, setShowPins] = useState(false);

  const lenis = useLenis();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleStartTransition = useCallback(() => {
    if (isTransitioning || !isIntroActive) return;
    setIsTransitioning(true);

    const tl = createTimeline({
      defaults: {
        ease: 'cubicBezier(0.25, 1, 0.5, 1)',
      },
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

    // 1. Fade out intro text group & right side feature items
    tl.add(
      '#intro-text-group, #intro-features-list, #intro-scroll-indicator',
      {
        opacity: [1, 0],
        translateY: [0, -15],
        duration: 250,
        ease: 'inQuad',
      },
      0
    )
      // 2. Smooth zoom & fade out of bottom half-globe
      .add(
        '#intro-globe-wrapper',
        {
          scale: [1, 1.3],
          opacity: [1, 0],
          duration: 550,
          ease: 'cubicBezier(0.4, 0, 0.2, 1)',
        },
        80
      )
      // 3. Final hero 2-column layout fades in
      .add(
        '#final-hero-container',
        {
          opacity: [0, 1],
          scale: [0.97, 1],
          duration: 550,
          ease: 'outCubic',
        },
        160
      )
      // 4. Stagger in floating cards & badges
      .add(
        '.hero-floating-card, .hero-action-feature-item',
        {
          opacity: [0, 1],
          scale: [0.92, 1],
          translateY: [10, 0],
          duration: 400,
          delay: stagger(60),
          ease: 'outBack',
        },
        240
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
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#050508] h-[calc(100vh-82px)] max-h-[calc(100vh-82px)] flex flex-col justify-between text-white select-none"
    >
      {/* =========================================
          BACKGROUND SPACE & NEBULA LIGHT EFFECTS
      ========================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 60% 55%, rgba(210, 25, 45, 0.18) 0%, rgba(130, 10, 20, 0.07) 38%, transparent 70%)',
        }}
      />

      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[220px] bg-[#d11a2a]/12 blur-[100px] z-0" />

      {/* Decorative Red Particle Light Trails */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[16%] left-[6%] w-[340px] h-[1px] bg-gradient-to-r from-transparent via-[#ff3b47]/60 to-transparent rotate-[-16deg] blur-[0.5px]" />
        <div className="absolute top-[30%] right-[10%] w-[420px] h-[1px] bg-gradient-to-r from-transparent via-[#ff3b47]/70 to-transparent rotate-[14deg] blur-[0.5px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[380px] h-[1px] bg-gradient-to-r from-transparent via-[#ff3b47]/50 to-transparent rotate-[-10deg] blur-[0.5px]" />
        <div className="absolute bottom-[24%] right-[8%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#ff3b47]/60 to-transparent rotate-[22deg] blur-[0.5px]" />
      </div>

      {/* Dense White Sparkle Particle Dust Cloud (Bintik Putih) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic Starfield Cluster around Globe */}
        <div className="absolute right-[5%] sm:right-[15%] top-[10%] sm:top-[20%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] opacity-75">
          {[
            { top: '8%', left: '42%', size: 1.5, opacity: 0.9, delay: '0.2s' },
            { top: '14%', left: '68%', size: 2, opacity: 1, delay: '1.1s' },
            { top: '22%', left: '15%', size: 1, opacity: 0.7, delay: '0.7s' },
            { top: '28%', left: '82%', size: 2.5, opacity: 0.95, delay: '1.8s' },
            { top: '35%', left: '38%', size: 1, opacity: 0.6, delay: '0.4s' },
            { top: '42%', left: '92%', size: 1.5, opacity: 0.85, delay: '2.1s' },
            { top: '48%', left: '8%', size: 2, opacity: 0.9, delay: '0.9s' },
            { top: '56%', left: '74%', size: 1.5, opacity: 0.75, delay: '1.4s' },
            { top: '65%', left: '22%', size: 1, opacity: 0.6, delay: '0.3s' },
            { top: '72%', left: '88%', size: 2, opacity: 0.95, delay: '1.6s' },
            { top: '78%', left: '45%', size: 1.5, opacity: 0.8, delay: '2.4s' },
            { top: '85%', left: '12%', size: 2, opacity: 0.85, delay: '0.5s' },
            { top: '90%', left: '65%', size: 1, opacity: 0.7, delay: '1.9s' },
            { top: '18%', left: '52%', size: 1, opacity: 0.6, delay: '1.3s' },
            { top: '32%', left: '26%', size: 1.5, opacity: 0.75, delay: '0.8s' },
            { top: '60%', left: '60%', size: 1.2, opacity: 0.8, delay: '2.0s' },
            { top: '80%', left: '30%', size: 1.8, opacity: 0.9, delay: '1.5s' },
          ].map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                boxShadow: '0 0 6px rgba(255,255,255,0.9)',
                animationDuration: `${2 + (i % 3)}s`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        {/* Ambient Left & Center Floating Sparkles */}
        {[
          { top: '15%', left: '8%', size: 1.5, delay: '0.3s' },
          { top: '24%', left: '28%', size: 2, delay: '1.2s' },
          { top: '45%', left: '14%', size: 1.2, delay: '0.8s' },
          { top: '62%', left: '22%', size: 1.8, delay: '2.2s' },
          { top: '75%', left: '6%', size: 1.4, delay: '1.0s' },
          { top: '82%', left: '32%', size: 1, delay: '1.7s' },
        ].map((star, i) => (
          <span
            key={`amb-${i}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: '0 0 5px rgba(255,255,255,0.8)',
              animationDelay: star.delay,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      {/* Floating Sparkle Dots */}
      <span className="pointer-events-none absolute left-[12%] top-[22%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_10px_#ff3b47] animate-pulse" />
      <span className="pointer-events-none absolute left-[26%] top-[14%] h-1 w-1 rounded-full bg-white shadow-[0_0_8px_white] opacity-75" />
      <span className="pointer-events-none absolute right-[18%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_12px_#ff3b47] animate-pulse" />
      <span className="pointer-events-none absolute right-[8%] top-[34%] h-1 w-1 rounded-full bg-white shadow-[0_0_8px_white] opacity-60" />
      <span className="pointer-events-none absolute left-[14%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_10px_#ff3b47]" />

      {/* =========================================================
          STAGE 1: INTRO OVERLAY (FIRST PICTURE - HALF GLOBE)
      ========================================================= */}
      {isIntroActive && (
        <div
          id="intro-overlay"
          className={`fixed inset-x-0 bottom-0 z-40 flex flex-col justify-between select-none ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
          style={{
            top: '82px',
          }}
        >
          {/* Top Intro Group */}
          <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-8 pt-4 sm:pt-6 flex-1 flex flex-col items-center">

            {/* Center Content */}
            <div id="intro-text-group" className="flex flex-col items-center text-center max-w-3xl z-50">
              {/* Badge */}
              <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#12131c]/80 px-3.5 py-1 shadow-[0_0_20px_rgba(209,26,42,0.18)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47]" />
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#e2e2ec]">
                  AI-POWERED ESTATE PLANNING
                </span>
              </div>

              {/* Headline */}
              <h1
                className="m-0 font-serif font-normal leading-[1.12] tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(32px, 4.2vw, 56px)' }}
              >
                Plan your legacy,<br />
                <span className="font-serif italic text-[#ff3847] drop-shadow-[0_0_35px_rgba(255,56,71,0.9)]">
                  protect
                </span>{' '}
                what matters most.
              </h1>

              {/* Sub-headline */}
              <p className="mt-3 max-w-[560px] text-[14px] sm:text-[15px] leading-[1.55] text-[#b0b0be]">
                A smarter, simpler way to create your will, manage your assets, and protect the people you love — across borders.
              </p>

              {/* Get Started Button */}
              <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartTransition}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    rounded-xl
                    bg-gradient-to-r
                    from-[#e01a2c]
                    via-[#c91424]
                    to-[#960d17]
                    px-8
                    py-3
                    text-[14px]
                    font-bold
                    tracking-wide
                    text-white
                    shadow-[0_0_30px_rgba(224,26,44,0.6)]
                    transition-all
                    duration-300
                    hover:scale-105
                    hover:shadow-[0_0_45px_rgba(240,30,50,0.85)]
                    active:scale-95
                    cursor-pointer
                  "
                >
                  <span>GET STARTED</span>
                  <ArrowRight size={16} strokeWidth={2.4} className="transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center gap-1.5 text-[11.5px] text-[#8e8e9c]">
                  <Clock size={12} className="text-[#a4a4b8]" />
                  <span>Takes less than 10 minutes</span>
                </div>
              </div>
            </div>

            {/* Right Side Feature List (From Image 0) */}
            <div
              id="intro-features-list"
              className="hidden lg:flex absolute right-8 top-10 flex-col gap-4 w-[190px] text-right z-30"
            >
              <div className="flex items-center justify-end gap-2.5">
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-white">SECURE</h4>
                  <p className="text-[10px] text-gray-400">Your information stays private</p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                  <Lock size={13} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-white">SMART</h4>
                  <p className="text-[10px] text-gray-400">AI-guided planning made simple</p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                  <Sparkles size={13} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-white">GLOBAL</h4>
                  <p className="text-[10px] text-gray-400">Plan across countries</p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                  <Globe size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* INTRO HALF GLOBE (BOTTOM HORIZON) */}
          <div
            id="intro-globe-wrapper"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-[52%] scale-[1.3] w-[440px] sm:w-[520px] lg:w-[600px] h-[440px] sm:h-[520px] lg:h-[600px] z-30 pointer-events-none"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {/* ATMOSPHERIC RED GLOW DOME */}
            <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-[750px] max-w-[95vw] h-[220px] rounded-[50%] bg-[#d11a2a]/30 blur-[90px] z-0" />

            {/* 3D APAC GLOBE */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[380px] sm:w-[440px] lg:w-[490px] max-w-[85vw] aspect-square">
                <ApacGlobe showPins={false} />
              </div>
            </div>
          </div>

          {/* INTRO FOOTER: CHAT WIDGET & SCROLL EXPLORE */}
          <div
            id="intro-scroll-indicator"
            className="relative z-50 mx-auto w-full max-w-[1240px] px-4 sm:px-8 pb-3.5 flex items-center justify-between"
          >
            {/* Chat Widget */}
            <Link
              href="/chat"
              className="
                group
                inline-flex
                items-center
                gap-2.5
                rounded-full
                border
                border-white/[0.14]
                bg-[#0e0f17]/90
                py-1.5
                px-3
                shadow-[0_10px_25px_rgba(0,0,0,0.6)]
                backdrop-blur-xl
                transition-all
                hover:border-[#ff3b47]/40
                hover:shadow-[0_0_20px_rgba(209,26,42,0.3)]
              "
            >
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1d28] font-semibold text-[10px] text-white">
                N
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#ff3b47] ring-2 ring-[#0e0f17] shadow-[0_0_6px_#ff3b47]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-gray-400 leading-tight">Need help?</span>
                <span className="text-[11px] font-medium text-white leading-tight">Ask SmartWills AI</span>
              </div>
            </Link>

            {/* Scroll Down Button */}
            <div
              onClick={handleStartTransition}
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400">
                SCROLL DOWN TO EXPLORE
              </span>
              <div className="flex h-6 w-3.5 items-start justify-center rounded-full border border-gray-500/60 p-0.5">
                <div className="h-1.5 w-1 rounded-full bg-[#ff3b47] animate-bounce" />
              </div>
            </div>

            <div className="hidden sm:block w-[160px]" />
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 2: FINAL HERO (SECOND PICTURE - COMPACT FULL SCREEN)
      ========================================================= */}
      <div
        id="final-hero-container"
        className="
          relative
          z-10
          mx-auto
          grid
          h-full
          w-full
          max-w-[1240px]
          grid-cols-1
          items-center
          gap-6
          px-4
          py-2
          sm:px-8
          lg:grid-cols-[1fr_1.15fr]
          lg:gap-8
        "
        style={{
          opacity: isIntroActive ? 0 : 1,
          transform: isIntroActive ? 'scale(0.97)' : 'none',
          pointerEvents: isIntroActive && !isTransitioning ? 'none' : 'auto',
        }}
      >
        {/* LEFT COLUMN: AI IN ACTION */}
        <div className="relative z-10 flex flex-col justify-center">
          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#12131c]/80 px-3 py-1 shadow-[0_0_20px_rgba(209,26,42,0.18)] backdrop-blur-md w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b47] shadow-[0_0_6px_#ff3b47]" />
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#e2e2ec]">
              AI IN ACTION
            </span>
          </div>

          {/* Heading */}
          <h1
            className="m-0 max-w-[500px] font-serif font-normal leading-[1.1] tracking-[-0.03em] text-white pb-0.5"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Your wishes,<br />
            intelligently{' '}
            <span className="font-serif italic text-[#ff3847] drop-shadow-[0_0_35px_rgba(255,56,71,0.9)]">
              protected.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-2.5 max-w-[460px] text-[13.5px] sm:text-[14px] leading-[1.55] text-[#a8a8b8]">
            See how SmartWills.Ai uses AI to make estate planning simpler, faster and more accessible — across borders.
          </p>

          {/* Feature List (3 Items from Image 1) */}
          <div className="mt-4 space-y-2.5 max-w-[460px]">
            {/* Feature 1 */}
            <div className="hero-action-feature-item flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                <FileText size={14} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[12.5px] font-bold text-white leading-tight">Guided by AI</h4>
                <p className="mt-0.5 text-[11px] text-gray-400 leading-snug">
                  Answer a few simple questions, our AI helps draft your will.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="hero-action-feature-item flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                <Shield size={14} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[12.5px] font-bold text-white leading-tight">Legally Aligned</h4>
                <p className="mt-0.5 text-[11px] text-gray-400 leading-snug">
                  Structured to meet local legal requirements in each country.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="hero-action-feature-item flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d11a2a]/15 text-[#ff4d5a] border border-[#d11a2a]/30">
                <Users size={14} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[12.5px] font-bold text-white leading-tight">Across Borders</h4>
                <p className="mt-0.5 text-[11px] text-gray-400 leading-snug">
                  Manage your assets and loved ones, wherever you are.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-5 flex items-center gap-4">
            <Link
              href="/signup"
              className="
                group
                inline-flex
                items-center
                gap-2.5
                rounded-xl
                bg-gradient-to-r
                from-[#e01a2c]
                via-[#c91424]
                to-[#960d17]
                px-6
                py-2.5
                text-[13px]
                font-bold
                tracking-wide
                text-white
                shadow-[0_0_25px_rgba(224,26,44,0.5)]
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-[0_0_40px_rgba(240,30,50,0.75)]
                active:scale-95
              "
            >
              <span>See it in action</span>
              <ArrowRight size={15} strokeWidth={2.4} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D GLOBE WITH GLOWING ORBITAL RINGS & TESTIMONIAL BOX */}
        <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] w-full max-w-[540px] mx-auto flex items-center justify-center z-10 overflow-visible">

          {/* Central atmospheric glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d11a2a]/22 blur-[80px]" />

          {/* =========================================================
              LUMINOUS RED ORBITAL RINGS & CONCENTRIC GLOW (LIKE PICTURE 2)
          ========================================================= */}
          {/* Outer glowing red rim ring encircling the globe */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[330px] sm:h-[390px] lg:h-[420px] w-[330px] sm:w-[390px] lg:w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#ff3847]/45 shadow-[0_0_30px_rgba(255,56,71,0.5),inset_0_0_20px_rgba(255,56,71,0.2)]" />

          {/* Secondary thin atmospheric halo */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] sm:h-[415px] lg:h-[445px] w-[350px] sm:w-[415px] lg:w-[445px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff3847]/20 shadow-[0_0_15px_rgba(255,56,71,0.25)]" />

          {/* Diagonal Tilted Ellipse Orbit 1 */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] sm:h-[260px] lg:h-[280px] w-[400px] sm:w-[480px] lg:w-[510px] -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] rounded-[50%] border border-[#ff3847]/40 shadow-[0_0_12px_rgba(255,56,71,0.35)]" />

          {/* Diagonal Tilted Ellipse Orbit 2 */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[270px] sm:h-[320px] lg:h-[340px] w-[370px] sm:w-[440px] lg:w-[470px] -translate-x-1/2 -translate-y-1/2 rotate-[32deg] rounded-[50%] border border-[#ff3847]/30" />

          {/* Diagonal Tilted Ellipse Orbit 3 */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] sm:h-[350px] lg:h-[370px] w-[340px] sm:w-[400px] lg:w-[430px] -translate-x-1/2 -translate-y-1/2 rotate-[75deg] rounded-[50%] border border-[#ff3847]/20" />

          {/* 3D APAC Globe */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-[320px] sm:w-[380px] lg:w-[410px] max-w-[85vw] aspect-square">
              <ApacGlobe showPins={showPins || !isIntroActive} />
            </div>
          </div>

          {/* SMARTER WAY TESTIMONIAL BOX (BOTTOM RIGHT OF GLOBE) */}
          <div className="hero-floating-card absolute -right-2 sm:-right-4 bottom-[2%] sm:bottom-[6%] z-20 flex w-[210px] sm:w-[230px] items-center gap-3 rounded-2xl border border-white/[0.14] bg-[#0c0d14]/85 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl pointer-events-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#d11a2a]/20 text-[#ff4d5a] border border-[#d11a2a]/30">
              <FileCheck2 size={16} strokeWidth={2} />
            </div>
            <div>
              <p className="m-0 font-serif text-[11px] italic leading-[1.35] text-gray-200">
                &ldquo;A smarter, simpler way to secure tomorrow.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION FOR STAGE 2 */}
        <div className="lg:col-span-2 flex items-center justify-between z-30 pb-2">
          {/* Chat Widget */}
          <Link
            href="/chat"
            className="
              group
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-white/[0.14]
              bg-[#0e0f17]/90
              py-1.5
              px-3
              shadow-[0_10px_25px_rgba(0,0,0,0.6)]
              backdrop-blur-xl
              transition-all
              hover:border-[#ff3b47]/40
            "
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1d28] font-semibold text-[10px] text-white">
              N
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#ff3b47] ring-2 ring-[#0e0f17] shadow-[0_0_6px_#ff3b47]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-gray-400 leading-tight">Need help?</span>
              <span className="text-[11px] font-medium text-white leading-tight">Ask SmartWills AI</span>
            </div>
          </Link>

          {/* Scroll Down */}
          <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400">
              SCROLL TO DISCOVER MORE
            </span>
            <div className="flex h-6 w-3.5 items-start justify-center rounded-full border border-gray-500/60 p-0.5">
              <div className="h-1.5 w-1 rounded-full bg-[#ff3b47] animate-bounce" />
            </div>
          </div>

          <div className="hidden sm:block w-[160px]" />
        </div>
      </div>
    </section>
  );
}
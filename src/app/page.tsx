"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Lock,
  MessageSquareText,
  RefreshCw,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Users,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import dynamic from "next/dynamic";

const DarkVeil = dynamic(() => import("@/components/ui/DarkVeil"), {
  ssr: false,
});

/* ───────────────────────── Data ───────────────────────── */

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Advanced AI creates personalized legal wills in minutes, not months. Get instant clarity on complex estate matters.",
    span: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Legally Compliant",
    description:
      "Every document follows your jurisdiction's legal requirements across 12 Asia-Pacific countries.",
    span: "lg:col-span-2",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description:
      "256-bit encryption protects your sensitive information at every step.",
    span: "lg:col-span-1",
  },
  {
    icon: MessageSquareText,
    title: "24/7 AI Assistant",
    description:
      "Get instant answers to your estate planning questions anytime.",
    span: "lg:col-span-2",
  },
  {
    icon: RefreshCw,
    title: "Easy Updates",
    description:
      "Modify your will anytime as your life changes — no extra cost.",
    span: "lg:col-span-1",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Select Your Country",
    description:
      "Choose your jurisdiction and the AI instantly adapts to your local inheritance and will laws.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Ask Your Questions",
    description:
      "Chat naturally about wills, executors, beneficiaries, religious considerations and more.",
    icon: MessageSquareText,
  },
  {
    step: "03",
    title: "Get Step-by-Step Guidance",
    description:
      "Receive clear, actionable answers so you know exactly what to prepare and what steps to take next.",
    icon: CheckCircle2,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah L.",
    country: "Malaysia",
    text: "AI SmartWills made the whole will planning process so much less intimidating. I finally understood what I needed to do.",
    rating: 5,
  },
  {
    name: "David T.",
    country: "Singapore",
    text: "The country-specific guidance was incredibly helpful. It saved me hours of research and gave me confidence to proceed.",
    rating: 5,
  },
  {
    name: "Mei Yin C.",
    country: "Hong Kong",
    text: "I love that it understands both English and Chinese. The answers were clear and I could consult a lawyer much more prepared.",
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: "Is the guidance provided by AI SmartWills considered legal advice?",
    a: "No. AI SmartWills provides general educational information to help you understand the will planning process. We always recommend consulting a qualified legal professional for your specific situation.",
  },
  {
    q: "Which countries are supported?",
    a: "We currently support 12 Asia-Pacific jurisdictions: Malaysia, Singapore, Hong Kong, China, Taiwan, Indonesia, Thailand, Australia, New Zealand, Brunei, Vietnam and the Philippines.",
  },
  {
    q: "Is my conversation private and secure?",
    a: "Yes. All conversations are encrypted, and we follow strict data-protection practices compliant with PDPA and other regional privacy regulations.",
  },
  {
    q: "Can I use AI SmartWills for Islamic wills (Wasiat)?",
    a: "Absolutely. Our AI understands Syariah law, Faraid distribution and Islamic estate requirements — especially for Malaysia and Brunei.",
  },
  {
    q: "Is AI SmartWills free to use?",
    a: "Yes, our AI assistant is free. For professional online will writing services, visit the SmartWills platform for your country.",
  },
];

const COUNTRIES = [
  { name: "Malaysia", code: "MY", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Hong Kong", code: "HK", flag: "🇭🇰" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "Taiwan", code: "TW", flag: "🇹🇼" },
  { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { name: "Brunei", code: "BN", flag: "🇧🇳" },
  { name: "Vietnam", code: "VN", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", flag: "🇵🇭" },
];

const ECOSYSTEM = [
  {
    name: "SmartWills Malaysia",
    domain: "smartwills.com.my",
    description: "Professional online will writing for Malaysians",
  },
  {
    name: "SmartWills Singapore",
    domain: "smartwills.com.sg",
    description: "Estate planning solutions for Singapore residents",
  },
  {
    name: "SmartWills Hong Kong",
    domain: "smartwills.com.hk",
    description: "Will preparation services for Hong Kong",
  },
  {
    name: "MySmartwills",
    domain: "mysmartwills.com",
    description: "Global platform for will management",
  },
  {
    name: "WasiatKu",
    domain: "wasiatku.com.my",
    description: "Islamic will (Wasiat) services for Malaysian Muslims",
  },
];

const TRUST_METRICS = [
  { value: 10000, suffix: "+", label: "Wills Created", countUp: true, decimals: 0 },
  { value: 4.9, suffix: "★", label: "Rating", countUp: true, decimals: 1 },
  { value: 0, suffix: "", label: "Security", countUp: false, decimals: 0, staticText: "Bank-Level" },
];

/* ───────────────────── Helpers ───────────────────── */

const sectionFade = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
} as const;

function useCountUp(target: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration, decimals]);

  return { count, ref };
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-sm sm:text-base hover:bg-accent/50 transition-colors"
      >
        {q}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrustMetric({ metric }: { metric: typeof TRUST_METRICS[number] }) {
  const { count, ref } = useCountUp(metric.value, 2000, metric.decimals);

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white">
        {metric.countUp ? (
          <>
            {metric.decimals ? count.toFixed(metric.decimals) : count.toLocaleString()}
            {metric.suffix}
          </>
        ) : (
          metric.staticText
        )}
      </p>
      <p className="text-xs sm:text-sm text-white/60 mt-1">{metric.label}</p>
    </div>
  );
}

/* ═══════════════════ Page Component ═══════════════════ */

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════════ Header ═══════════════ */}
      <Header isLoggedIn={isLoggedIn} />

      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* DarkVeil WebGL Background */}
        <div className="absolute inset-0">
          <DarkVeil
            hueShift={240}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs sm:text-sm font-medium text-white/70 bg-white/5 backdrop-blur-sm"
            >
              <ShieldCheck className="h-4 w-4 text-white/70" />
              Trusted by thousands across Asia-Pacific
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]"
            >
              Create Your Legal Will
              <br />
              with AI —{" "}
              <span className="text-white/80">
                In Minutes
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              AI SmartWills uses advanced AI to generate legally-compliant wills
              tailored to your country&apos;s laws. No lawyers needed.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href={isLoggedIn ? "/chat" : "/signup"}>
                <button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2">
                  Start Free Now
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <button className="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2">
                  See How It Works
                </button>
              </a>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 flex flex-wrap justify-center gap-12 sm:gap-16"
            >
              {TRUST_METRICS.map((metric) => (
                <TrustMetric key={metric.label} metric={metric} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade — always dark since hero uses DarkVeil */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ═══════════════ Features — Bento Grid ═══════════════ */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6">
        <motion.div {...sectionFade} className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Why Choose AI SmartWills?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              We take the confusion out of will planning so you can focus on
              what matters most — your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`card-shine group relative p-8 rounded-2xl border border-border/50 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-foreground/30 ${feature.span}`}
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-foreground/10 mb-5">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ How It Works ═══════════════ */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30"
      >
        <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Three simple steps to clarity and confidence in your will planning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((h, i) => (
              <motion.div
                key={h.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative p-6 border border-border rounded-2xl bg-background/60 text-center"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold bg-foreground text-background rounded-full px-3 py-1">
                  STEP {h.step}
                </span>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-border mb-4 mt-2">
                  <h.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {h.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ Social Proof ═══════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Thousands of families across Asia-Pacific trust AI SmartWills to guide
              them through estate planning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 border border-border rounded-2xl bg-background/60"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ Countries ═══════════════ */}
      <section
        id="countries"
        className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30"
      >
        <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              12 Countries Supported
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Localized AI guidance for will planning across the Asia-Pacific region.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COUNTRIES.map((c, i) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 sm:p-4 border border-border rounded-xl hover:bg-accent transition-colors bg-background/50"
              >
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <p className="text-sm sm:text-base font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.code}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <motion.div {...sectionFade} className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ SmartWills Ecosystem ═══════════════ */}
      <section
        id="smartwills"
        className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30"
      >
        <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              The SmartWills Ecosystem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              AI SmartWills is part of the SmartWills family — online will
              writing services trusted across multiple countries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ECOSYSTEM.map((site, i) => (
              <motion.a
                key={site.domain}
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group block p-6 border border-border rounded-2xl hover:bg-accent transition-colors bg-background/50"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {site.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {site.description}
                </p>
                <span className="text-xs sm:text-sm underline underline-offset-4 text-muted-foreground group-hover:text-foreground transition-colors">
                  {site.domain}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ Footer ═══════════════ */}
      <footer className="border-t border-border py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/logo.png"
                  alt="AI SmartWills"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <span className="font-bold text-lg">AI SmartWills</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your intelligent will planning assistant — powered by AI,
                built on the trusted SmartWills ecosystem.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#countries" className="hover:text-foreground transition-colors">
                    Supported Countries
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#smartwills" className="hover:text-foreground transition-colors">
                    SmartWills Ecosystem
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://www.facebook.com/smartwillsmalaysia" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/smartwills" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/smartwills" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@smartwills" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@mysmartwills.com" className="hover:text-foreground transition-colors">
                  support@mysmartwills.com
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
            <p className="text-xs">PDPA &amp; GDPR Compliant</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Menu,
  X,
  Brain,
  Globe,
  MessageSquareText,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ───────────────────────── Data ───────────────────────── */

const VALUE_PROPS = [
  {
    icon: Brain,
    title: "AI-Powered Legal Guidance",
    description:
      "Cuts through the complexity of will planning — get clear, personalized answers in minutes.",
  },
  {
    icon: Globe,
    title: "Localized & Law-Specific",
    description:
      "Support for Malaysia, Singapore, Hong Kong and 9 more Asia-Pacific jurisdictions.",
  },
  {
    icon: MessageSquareText,
    title: "No Legal Jargon",
    description:
      "Plain-language guidance in English and local languages so everyone can understand.",
  },
  {
    icon: Zap,
    title: "Fast & Trusted",
    description:
      "Backed by the SmartWills ecosystem — trusted by thousands of users across the region.",
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

/* ───────────────────── Helpers ───────────────────── */

const sectionFade = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
} as const;

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-sm sm:text-base dark:text-white hover:bg-accent/50 transition-colors"
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
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed dark:text-neutral-300">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════ Page Component ═══════════════════ */

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  /* ──── shared button styles ──── */
  const btnPrimary =
    "bg-black dark:bg-white rounded-full text-white dark:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors";
  const btnOutline =
    "bg-transparent border border-black dark:border-white rounded-full text-black dark:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors";
  const btnPrimarySm =
    "bg-black dark:bg-white rounded-full text-white dark:text-black px-4 py-2 text-sm font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors";
  const btnOutlineSm =
    "bg-transparent border border-black dark:border-white rounded-full text-black dark:text-white px-4 py-2 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors";

  return (
    <AuroraBackground className="h-auto min-h-screen">
      <div className="relative z-10 min-h-screen flex flex-col w-full">
        {/* ═══════════════ Header ═══════════════ */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight dark:text-white"
            >
              <Image
                src="/logo.png"
                alt="SmartWills"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
              />
              AI SmartWills
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {["How It Works", "Countries", "FAQ", "SmartWills"].map((label) => (
                <Link
                  key={label}
                  href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium hover:underline underline-offset-4 dark:text-white"
                >
                  {label}
                </Link>
              ))}
              <ThemeToggle />
              {isLoggedIn ? (
                <Link href="/chat">
                  <button className={btnPrimarySm}>Chat with AI</button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <button className={btnOutlineSm}>Sign In</button>
                  </Link>
                  <Link href="/signup">
                    <button className={btnPrimarySm}>Get Started</button>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-border overflow-hidden bg-background/95 backdrop-blur-xl"
              >
                <nav className="flex flex-col px-4 py-4 gap-3">
                  {["How It Works", "Countries", "FAQ", "SmartWills"].map((label) => (
                    <Link
                      key={label}
                      href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium py-2 hover:underline underline-offset-4 dark:text-white"
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="flex gap-3 pt-2">
                    {isLoggedIn ? (
                      <Link href="/chat" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                        <button className={`w-full ${btnPrimarySm}`}>Chat with AI</button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                          <button className={`w-full ${btnOutlineSm}`}>Sign In</button>
                        </Link>
                        <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                          <button className={`w-full ${btnPrimarySm}`}>Get Started</button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ═══════════════ Hero ═══════════════ */}
        <section className="flex-1 flex items-center justify-center py-16 sm:py-20 md:py-28 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            className="container mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-6 text-xs sm:text-sm font-medium text-muted-foreground dark:text-neutral-300 bg-background/60 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Trusted by thousands across Asia-Pacific
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-5 sm:mb-6 dark:text-white leading-[1.1]">
              Plan Your Will with{" "}
              <span className="underline decoration-2 underline-offset-4">
                Smart AI Guidance
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto dark:text-neutral-200 leading-relaxed">
              AI-driven guidance tailored to your country&apos;s legal framework
              — get clarity and confidence in planning your estate.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href={isLoggedIn ? "/chat" : "/signup"}>
                <button className={`w-full sm:w-auto ${btnPrimary} group`}>
                  Begin Your Will Plan Today
                  <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className={`w-full sm:w-auto ${btnOutline}`}>
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Trust micro-stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
              {[
                { value: "12", label: "Countries" },
                { value: "24/7", label: "AI Available" },
                { value: "Free", label: "To Use" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl font-bold dark:text-white">{s.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-neutral-300">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ Value Propositions ═══════════════ */}
        <section
          id="about"
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-background/80 backdrop-blur-sm"
        >
          <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              Why Choose AI SmartWills?
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              We take the confusion out of will planning so you can focus on
              what matters most — your family.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUE_PROPS.map((v) => (
                <div
                  key={v.title}
                  className="p-6 border border-border rounded-2xl bg-background/60 hover:bg-accent/60 transition-colors text-center"
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-black dark:bg-white text-white dark:text-black mb-4">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 dark:text-white">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed dark:text-neutral-300">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ How It Works ═══════════════ */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30 backdrop-blur-sm"
        >
          <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              How It Works
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              Three simple steps to clarity and confidence in your will planning.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((h) => (
                <div
                  key={h.step}
                  className="relative p-6 sm:p-8 border border-border rounded-2xl bg-background/60 text-center"
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold bg-black dark:bg-white text-white dark:text-black rounded-full px-3 py-1">
                    STEP {h.step}
                  </span>
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-border mb-4 mt-2">
                    <h.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">{h.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed dark:text-neutral-300">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ Social Proof ═══════════════ */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-background/80 backdrop-blur-sm">
          <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              What Our Users Say
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              Thousands of families across Asia-Pacific trust AI SmartWills to guide
              them through estate planning.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="p-6 border border-border rounded-2xl bg-background/60"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 dark:text-neutral-200">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold dark:text-white">{t.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-neutral-400">
                        {t.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ Countries ═══════════════ */}
        <section
          id="countries"
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30 backdrop-blur-sm"
        >
          <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              12 Countries Supported
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              Localized AI guidance for will planning across the Asia-Pacific region.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {COUNTRIES.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center gap-3 p-3 sm:p-4 border border-border rounded-xl hover:bg-accent transition-colors bg-background/50"
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <p className="text-sm sm:text-base font-semibold dark:text-white">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-neutral-400">
                      {c.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section
          id="faq"
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-background/80 backdrop-blur-sm"
        >
          <motion.div {...sectionFade} className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              Everything you need to know before getting started.
            </p>

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
          className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-secondary/30 backdrop-blur-sm"
        >
          <motion.div {...sectionFade} className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
              The SmartWills Ecosystem
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-12 max-w-xl mx-auto dark:text-neutral-200">
              AI SmartWills is part of the SmartWills family — online will
              writing services trusted across multiple countries.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {ECOSYSTEM.map((site) => (
                <a
                  key={site.domain}
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 sm:p-6 border border-border rounded-2xl hover:bg-accent transition-colors bg-background/50"
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 dark:text-white">
                    {site.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 dark:text-neutral-200">
                    {site.description}
                  </p>
                  <span className="text-xs sm:text-sm underline underline-offset-4 dark:text-neutral-300 group-hover:text-foreground transition-colors">
                    {site.domain}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ Final CTA ═══════════════ */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 border-t border-border bg-black dark:bg-white text-white dark:text-black">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Start Planning Your Will Today
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 leading-relaxed">
              Don&apos;t leave your family&apos;s future to chance. Get personalized,
              AI-powered will planning guidance — free and available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href={isLoggedIn ? "/chat" : "/signup"}>
                <button className="w-full sm:w-auto bg-white dark:bg-black rounded-full text-black dark:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-white/80 dark:hover:bg-black/80 transition-colors group">
                  Begin Your Will Plan
                  <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a
                href="https://wa.me/60123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full sm:w-auto bg-transparent border border-white dark:border-black rounded-full text-white dark:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                  Talk to an Expert
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════ Footer ═══════════════ */}
        <footer className="border-t border-border py-12 sm:py-16 px-4 sm:px-6 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    src="/logo.png"
                    alt="SmartWills"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                  <span className="font-bold text-lg dark:text-white">AI SmartWills</span>
                </div>
                <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed">
                  Your intelligent will planning assistant — powered by AI,
                  built on the trusted SmartWills ecosystem.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-sm mb-3 dark:text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-neutral-300">
                  <li>
                    <Link href="#how-it-works" className="hover:underline underline-offset-4">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#countries" className="hover:underline underline-offset-4">
                      Supported Countries
                    </Link>
                  </li>
                  <li>
                    <Link href="#faq" className="hover:underline underline-offset-4">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#smartwills" className="hover:underline underline-offset-4">
                      SmartWills Ecosystem
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-sm mb-3 dark:text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-neutral-300">
                  <li>
                    <Link href="/privacy" className="hover:underline underline-offset-4">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline underline-offset-4">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="font-semibold text-sm mb-3 dark:text-white">Connect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-neutral-300">
                  <li>
                    <a
                      href="https://www.facebook.com/smartwillsmalaysia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/smartwills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/smartwills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@smartwills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4"
                    >
                      YouTube
                    </a>
                  </li>
                </ul>

                {/* Contact */}
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground dark:text-neutral-300">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:support@mysmartwills.com"
                    className="hover:underline underline-offset-4"
                  >
                    support@mysmartwills.com
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground dark:text-neutral-300">
              <p>&copy; 2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
              <p className="text-xs">PDPA &amp; GDPR Compliant</p>
            </div>
          </div>
        </footer>
      </div>
    </AuroraBackground>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function HomePage() {
  return (
    <AuroraBackground className="h-auto min-h-screen">
      <div className="relative z-10 min-h-screen flex flex-col w-full">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            AI SmartWills
          </Link>
          <nav className="flex items-center gap-6">
            <Link 
              href="#about" 
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link 
              href="#countries" 
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Countries
            </Link>
            <Link 
              href="#smartwills" 
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              SmartWills
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <button className="bg-transparent border border-black dark:border-white rounded-full w-fit text-black dark:text-white px-4 py-2 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/chat">
              <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 text-sm font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors">
                Start Chat
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-24 px-6">
        <motion.div 
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="container mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 dark:text-white">
            Your Intelligent Will Planning Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-neutral-200">
            Navigate the complexities of legal will planning with AI-powered guidance 
            tailored to your country&apos;s laws and requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-8 py-4 text-lg font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors">
                Start Planning Your Will
              </button>
            </Link>
            <Link href="#about">
              <button className="bg-transparent border border-black dark:border-white rounded-full w-fit text-black dark:text-white px-8 py-4 text-lg font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">
            About AI SmartWills
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                What We Do
              </h3>
              <p className="text-muted-foreground leading-relaxed dark:text-neutral-200">
                AI SmartWills is an intelligent assistant that helps you understand 
                the will planning process in your country. Our AI is trained on 
                country-specific legal requirements, making it easier for you to 
                prepare for one of life&apos;s most important decisions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                How It Works
              </h3>
              <p className="text-muted-foreground leading-relaxed dark:text-neutral-200">
                Simply select your country, and our AI will provide guidance based 
                on your jurisdiction&apos;s legal framework. Ask questions about estate 
                planning, beneficiaries, executors, and more. The AI understands 
                both English and local languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section id="countries" className="py-24 px-6 border-t border-border bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">
            Supported Countries
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto dark:text-neutral-200">
            We provide localized AI assistance for will planning across 12 countries 
            in the Asia-Pacific region.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Malaysia", code: "MY" },
              { name: "Singapore", code: "SG" },
              { name: "Hong Kong", code: "HK" },
              { name: "China", code: "CN" },
              { name: "Taiwan", code: "TW" },
              { name: "Indonesia", code: "ID" },
              { name: "Thailand", code: "TH" },
              { name: "Australia", code: "AU" },
              { name: "New Zealand", code: "NZ" },
              { name: "Brunei", code: "BN" },
              { name: "Vietnam", code: "VN" },
              { name: "Philippines", code: "PH" },
            ].map((country) => (
              <div
                key={country.code}
                className="p-4 border border-border rounded-lg text-center hover:bg-accent transition-colors bg-background/50"
              >
                <p className="font-semibold dark:text-white">{country.name}</p>
                <p className="text-sm text-muted-foreground dark:text-neutral-300">{country.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SmartWills Ecosystem Section */}
      <section id="smartwills" className="py-24 px-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">
            The SmartWills Ecosystem
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto dark:text-neutral-200">
            AI SmartWills is part of the SmartWills family, providing online will 
            writing services across multiple countries.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
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
            ].map((site) => (
              <a
                key={site.domain}
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 border border-border rounded-lg hover:bg-accent transition-colors bg-background/50"
              >
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{site.name}</h3>
                <p className="text-muted-foreground mb-2 dark:text-neutral-200">{site.description}</p>
                <p className="text-sm underline underline-offset-4 dark:text-neutral-300">{site.domain}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Begin your will planning journey today with our AI assistant.
          </p>
          <Link href="/chat">
            <button className="bg-white dark:bg-black rounded-full w-fit text-black dark:text-white px-8 py-4 text-lg font-medium hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
              Chat with AI SmartWills
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-bold text-lg dark:text-white">AI SmartWills</p>
              <p className="text-sm text-muted-foreground dark:text-neutral-300">
                Intelligent legal will planning assistant
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground dark:text-neutral-300">
              <Link href="/privacy" className="hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline underline-offset-4">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground dark:text-neutral-300">
            <p>2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
    </AuroraBackground>
  );
}

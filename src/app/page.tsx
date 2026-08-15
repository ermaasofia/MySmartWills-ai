import { LandingShell } from '@/components/landing/landing-shell';
import { LandingNav } from '@/components/landing/landing-nav';
import { Hero } from '@/components/landing/hero';
import { EcosystemStrip } from '@/components/landing/ecosystem-strip';
import { AboutSection } from '@/components/landing/about-section';
import { FeaturesMatrix } from '@/components/landing/features-matrix';
import { ServicesGrid } from '@/components/landing/services-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { CountriesGrid } from '@/components/landing/countries-grid';
import { Testimonial } from '@/components/landing/testimonial';
import { FaqAccordion } from '@/components/landing/faq-accordion';
import { LandingCTA } from '@/components/landing/landing-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function Home() {
  return (
    <LandingShell>
      <div
        className="min-h-screen bg-white text-[#171717]"
        style={{
          fontFeatureSettings: '"ss01", "cv11", "tnum"',
        }}
      >
        <LandingNav />
        <Hero />
        <EcosystemStrip />
        <AboutSection />
        <FeaturesMatrix />
        <ServicesGrid />
        <HowItWorks />
        <CountriesGrid />
        <Testimonial />
        <FaqAccordion />
        <LandingCTA />
        <LandingFooter />
      </div>
    </LandingShell>
  );
}
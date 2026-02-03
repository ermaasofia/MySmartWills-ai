import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
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
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="sm">
                Start Chat
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Intelligent Will Planning Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Navigate the complexities of legal will planning with AI-powered guidance 
            tailored to your country's laws and requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Planning Your Will
              </Button>
            </Link>
            <Link href="#about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            About AI SmartWills
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                What We Do
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                AI SmartWills is an intelligent assistant that helps you understand 
                the will planning process in your country. Our AI is trained on 
                country-specific legal requirements, making it easier for you to 
                prepare for one of life's most important decisions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                How It Works
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply select your country, and our AI will provide guidance based 
                on your jurisdiction's legal framework. Ask questions about estate 
                planning, beneficiaries, executors, and more. The AI understands 
                both English and local languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section id="countries" className="py-24 px-6 border-t border-border bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Supported Countries
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
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
                className="p-4 border border-border rounded-lg text-center hover:bg-accent transition-colors"
              >
                <p className="font-semibold">{country.name}</p>
                <p className="text-sm text-muted-foreground">{country.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SmartWills Ecosystem Section */}
      <section id="smartwills" className="py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            The SmartWills Ecosystem
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
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
                className="block p-6 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{site.name}</h3>
                <p className="text-muted-foreground mb-2">{site.description}</p>
                <p className="text-sm underline underline-offset-4">{site.domain}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Begin your will planning journey today with our AI assistant.
          </p>
          <Link href="/chat">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6"
            >
              Chat with AI SmartWills
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-bold text-lg">AI SmartWills</p>
              <p className="text-sm text-muted-foreground">
                Intelligent legal will planning assistant
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline underline-offset-4">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>2026 AI SmartWills. Part of the SmartWills ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

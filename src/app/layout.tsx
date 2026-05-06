import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AuthHandler } from "@/components/auth/auth-handler";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smartwills.ai'),
  title: {
    default: 'AI SmartWills - Intelligent Legal Will Planning Assistant',
    template: '%s | AI SmartWills',
  },
  description: 'Your AI-powered assistant for legal will planning across 12 countries in Asia-Pacific. Get personalized guidance for Malaysia, Singapore, Hong Kong, and more.',
  keywords: ['will planning', 'legal will', 'estate planning', 'AI assistant', 'SmartWills', 'Malaysia', 'Singapore', 'Asia-Pacific'],
  authors: [{ name: 'SmartWills' }],
  creator: 'SmartWills',
  publisher: 'SmartWills',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartwills.ai',
    title: 'AI SmartWills - Intelligent Legal Will Planning Assistant',
    description: 'Your AI-powered assistant for legal will planning across 12 countries in Asia-Pacific.',
    siteName: 'AI SmartWills',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'AI SmartWills Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI SmartWills - Intelligent Legal Will Planning Assistant',
    description: 'Your AI-powered assistant for legal will planning across 12 countries in Asia-Pacific.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'AI SmartWills',
        url: 'https://smartwills.ai',
        logo: 'https://smartwills.ai/logo.png',
        description: 'AI-powered will planning assistant for Asia-Pacific.',
        sameAs: [
          'https://www.facebook.com/smartwillsmalaysia',
          'https://www.instagram.com/smartwills',
          'https://www.linkedin.com/company/smartwills',
          'https://www.youtube.com/@smartwills',
        ],
      },
      {
        '@type': 'WebSite',
        name: 'AI SmartWills',
        url: 'https://smartwills.ai',
        description: 'Your AI-powered assistant for legal will planning across 12 countries in Asia-Pacific.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://smartwills.ai/chat?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'AI SmartWills',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://smartwills.ai',
        description: 'AI-powered will planning assistant for 12 Asia-Pacific countries.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '1200',
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          nonce={nonce}
        >
          <AuthHandler />
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

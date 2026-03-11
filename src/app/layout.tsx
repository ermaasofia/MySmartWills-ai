import type { Metadata } from "next";
import { Crimson_Text, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AuthHandler } from "@/components/auth/auth-handler";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aismartwills.me'),
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
    url: 'https://aismartwills.me',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'AI SmartWills',
        url: 'https://aismartwills.me',
        logo: 'https://aismartwills.me/logo.png',
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
        url: 'https://aismartwills.me',
        description: 'Your AI-powered assistant for legal will planning across 12 countries in Asia-Pacific.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://aismartwills.me/chat?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'AI SmartWills',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://aismartwills.me',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${crimsonText.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
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

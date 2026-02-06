import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${crimsonText.variable} font-serif antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

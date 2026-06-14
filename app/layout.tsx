import type { Metadata } from "next";
import { Space_Grotesk, Fraunces } from "next/font/google";
import { StructuredData } from "@/components/structured-data";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { PortfolioShell } from "@/components/portfolio-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jamalakbara.com'),
  title: {
    default: "Jamal Akbar Alam - Creative Developer",
    template: "%s | Jamal Akbar Alam"
  },
  description: "Portfolio of Jamal Akbar Alam - Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy. Based in Bandung, Indonesia with 5+ years of experience building exceptional digital experiences with React, Next.js, and Python technologies.",
  keywords: ["portfolio akbar", "portfolio jamal akbar alam", "Jamal Akbar Alam", "creative developer", "backend developer", "mobile developer", "web designer", "UI/UX design", "frontend development", "backend development", "mobile development", "Python developer", "React developer", "Next.js developer", "React Native", "Flutter developer", "Shopify developer", "portfolio", "web developer Bandung", "Indonesia", "freelance developer", "full-stack developer", "jamal akbar portfolio", "jamalakbara", "web development portfolio", "designer portfolio"],
  authors: [{ name: "Jamal Akbar Alam", url: "https://jamalakbara.com" }],
  creator: "Jamal Akbar Alam",
  publisher: "Jamal Akbar Alam",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jamalakbara.com",
    siteName: "Jamal Akbar Alam",
    title: "Jamal Akbar Alam - Creative Developer",
    description: "Portfolio of Jamal Akbar Alam - Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy. Based in Bandung, Indonesia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jamal Akbar Alam - Creative Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamal Akbar Alam - Creative Developer",
    description: "Portfolio of Jamal Akbar Alam - Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy.",
    images: ["/twitter-image.jpg"],
    creator: "@jamalakbara",
    site: "@jamalakbara",
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/logo.png', color: '#000000' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://jamalakbara.com',
  },
  category: "technology",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT || '',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console Verification */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT}
          />
        )}

        <StructuredData type="WebSite" />
        <StructuredData type="Person" />
        <StructuredData type="LocalBusiness" />
        <StructuredData type="FAQ" />
      </head>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning>
        <PortfolioShell>{children}</PortfolioShell>

        {/* Analytics & Consent */}
        <GoogleAnalytics />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

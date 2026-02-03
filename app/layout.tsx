import type { Metadata } from "next";
import { Inter, Space_Mono, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/structured-data";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
// LenisProvider removed - using scroll-jacking instead of smooth scroll
import { Preloader } from "@/components/preloader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false, // Load on-demand since it's used for accent text
  fallback: ["Courier New", "monospace"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["serif", "Georgia"],
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
      <body
        className={`${inter.variable} ${spaceMono.variable} ${dmSerifDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Preloader />
          {children}
        </ThemeProvider>

        {/* Analytics & Consent */}
        <GoogleAnalytics />
        <CookieConsentBanner />
      </body>
    </html>
  );
}

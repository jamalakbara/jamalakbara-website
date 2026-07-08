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
    default: "Jamal Akbar Alam — Developer & Designer",
    template: "%s | Jamal Akbar Alam"
  },
  description: "Akbar (Jamal Akbar Alam) is a developer and designer with a love for building things on the web. He works across design and development, turning ideas into clean, fast, easy-to-use products. From the interface to the code behind it, he cares about the details that make something feel right, and he's always drawn to projects worth building well.",
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
    title: "Jamal Akbar Alam — Developer & Designer",
    description: "Akbar (Jamal Akbar Alam) is a developer and designer with a love for building things on the web. He works across design and development, turning ideas into clean, fast, easy-to-use products. From the interface to the code behind it, he cares about the details that make something feel right, and he's always drawn to projects worth building well.",
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
    title: "Jamal Akbar Alam — Developer & Designer",
    description: "Akbar (Jamal Akbar Alam) is a developer and designer with a love for building things on the web. He works across design and development, turning ideas into clean, fast, easy-to-use products. From the interface to the code behind it, he cares about the details that make something feel right, and he's always drawn to projects worth building well.",
    images: ["/twitter-image.jpg"],
    creator: "@jamalakbara",
    site: "@jamalakbara",
  },
  icons: {
    // Legacy favicon.ico kept as THE favicon by owner preference — do not
    // add an icon.svg entry above it (browsers would prefer the SVG).
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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

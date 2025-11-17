import type { Metadata } from "next";
import { Inter, Space_Mono, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/contexts/loading-context";
import { StructuredData } from "@/components/structured-data";
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
    default: "Portfolio Jamal Akbar Alam - Creative Developer & Designer",
    template: "%s | Portfolio Jamal Akbar Alam"
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
    siteName: "Portfolio Jamal Akbar Alam",
    title: "Portfolio Jamal Akbar Alam - Creative Developer & Designer",
    description: "Portfolio of Jamal Akbar Alam - Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy. Based in Bandung, Indonesia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Jamal Akbar Alam - Creative Developer & Designer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Jamal Akbar Alam - Creative Developer & Designer",
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
        <StructuredData type="WebSite" />
        <StructuredData type="Person" />
        <StructuredData type="LocalBusiness" />
        <StructuredData type="FAQ" />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${dmSerifDisplay.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Space_Mono, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/structured-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jamalakbara.com'),
  title: {
    default: "jamalakbara. - Creative Developer",
    template: "%s | jamalakbara."
  },
  description: "Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy. Based in Bandung, Indonesia with 5+ years of experience delivering exceptional digital experiences.",
  keywords: ["creative developer", "web designer", "UI/UX design", "frontend development", "brand strategy", "portfolio", "web developer Bandung", "Indonesia", "React developer", "Next.js developer", "Shopify developer"],
  authors: [{ name: "Jamal Akbar", url: "https://jamalakbara.com" }],
  creator: "Jamal Akbar",
  publisher: "Jamal Akbar",
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
    siteName: "jamalakbara.",
    title: "jamalakbara. - Creative Developer",
    description: "Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy. Based in Bandung, Indonesia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jamal Akbar - Creative Developer & Designer Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "jamalakbara. - Creative Developer",
    description: "Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy.",
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
        <StructuredData type="Person" />
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

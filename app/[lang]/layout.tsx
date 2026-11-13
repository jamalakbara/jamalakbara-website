import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { PortfolioShell } from "@/components/portfolio-shell";
import { Splash } from "@/components/site/splash";
import { fontClasses } from "@/lib/fonts";
import { getSite } from "@/lib/i18n";
import { LANGS, isLang, type Lang } from "@/lib/i18n/config";
import { LangProvider } from "@/lib/i18n/context";
import { languageTargets } from "@/lib/i18n/targets";
import { alternatesFor } from "@/lib/seo";
import "../globals.css";
import "./site.css";

// Root layout for the public site, one per language. Home SEO is admin-editable
// (Site → Home → SEO): that title is the full homepage title and the site-wide
// default, with no "%s | …" suffix. Blank falls back to the shipped copy.
const HOME_TITLE_FALLBACK = "Jamal Akbar Alam — Developer & Designer";
const HOME_DESC_FALLBACK =
  "Jamal Akbar Alam is a developer and designer in Bandung, Indonesia, building clean, fast websites, web apps, and Shopify stores, from interface to code.";

// Splash gate, run before the page paints: once per session, never under
// reduced motion or on /preview/ draft links (no JS → no attribute → no overlay).
// See components/site/splash.tsx.
const SPLASH_GATE = `try{var s=sessionStorage.getItem("f-splash")||matchMedia("(prefers-reduced-motion: reduce)").matches||location.pathname.indexOf("/preview/")===0;document.documentElement.dataset.splash=s?"off":"run"}catch(e){document.documentElement.dataset.splash="off"}`;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const language: Lang = isLang(lang) ? lang : "en";
  const { page } = getSite(language);
  const homeTitle = page.home.seo?.title?.trim() || HOME_TITLE_FALLBACK;
  const homeDescription = page.home.seo?.description?.trim() || HOME_DESC_FALLBACK;
  const alternates = alternatesFor(language, "/");

  return {
    metadataBase: new URL("https://jamalakbara.com"),
    title: {
      default: homeTitle,
      template: "%s | Jamal Akbar Alam",
    },
    description: homeDescription,
    keywords: ["jamalakbara", "portfolio jamal akbar alam", "Jamal Akbar Alam", "creative developer", "backend developer", "mobile developer", "web designer", "UI/UX design", "frontend development", "backend development", "mobile development", "Python developer", "React developer", "Next.js developer", "React Native", "Flutter developer", "Shopify developer", "portfolio", "web developer Bandung", "Indonesia", "freelance developer", "full-stack developer", "jamal akbar portfolio", "jamalakbara", "web development portfolio", "designer portfolio"],
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
      locale: language === "id" ? "id_ID" : "en_US",
      url: alternates.canonical,
      siteName: "Jamal Akbar Alam",
      title: homeTitle,
      description: homeDescription,
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
      title: homeTitle,
      description: homeDescription,
      images: ["/twitter-image.jpg"],
      creator: "@jamalakbara",
      site: "@jamalakbara",
    },
    icons: {
      // favicon.ico (stamp portrait) is THE favicon — do not add an icon.svg
      // entry above it (browsers would prefer the SVG).
      icon: [{ url: "/favicon.ico", sizes: "any" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.json",
    alternates,
    category: "technology",
    classification: "Portfolio",
    referrer: "origin-when-cross-origin",
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT || "",
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Google Search Console Verification */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION_CONTENT} />
        )}
      </head>
      <body className={fontClasses} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_GATE }} />
        <LangProvider lang={lang} targets={languageTargets()}>
          <Splash />
          <PortfolioShell>{children}</PortfolioShell>

          <GoogleAnalytics />
          <CookieConsentBanner />
        </LangProvider>
      </body>
    </html>
  );
}

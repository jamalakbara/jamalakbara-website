import { StructuredData } from "@/components/structured-data";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { PortfolioShell } from "@/components/portfolio-shell";
import { Splash } from "@/components/site/splash";
import "./site.css";

// Splash gate, run before the page paints: once per session, never under
// reduced motion or on /preview/ draft links (no JS → no attribute → no overlay).
// See components/site/splash.tsx.
const SPLASH_GATE = `try{var s=sessionStorage.getItem("f-splash")||matchMedia("(prefers-reduced-motion: reduce)").matches||location.pathname.indexOf("/preview/")===0;document.documentElement.dataset.splash=s?"off":"run"}catch(e){document.documentElement.dataset.splash="off"}`;

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SPLASH_GATE }} />
      <StructuredData type="WebSite" />
      <StructuredData type="Person" />
      <StructuredData type="LocalBusiness" />
      <StructuredData type="FAQ" />

      <Splash />
      <PortfolioShell>{children}</PortfolioShell>

      <GoogleAnalytics />
      <CookieConsentBanner />
    </>
  );
}

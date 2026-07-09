import { StructuredData } from "@/components/structured-data";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsentBanner } from "@/components/analytics/CookieConsent";
import { PortfolioShell } from "@/components/portfolio-shell";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StructuredData type="WebSite" />
      <StructuredData type="Person" />
      <StructuredData type="LocalBusiness" />
      <StructuredData type="FAQ" />

      <PortfolioShell>{children}</PortfolioShell>

      <GoogleAnalytics />
      <CookieConsentBanner />
    </>
  );
}

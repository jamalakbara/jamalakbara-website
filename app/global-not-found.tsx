import type { Metadata } from "next";
import { PortfolioShell } from "@/components/portfolio-shell";
import { NotFoundView } from "@/components/site/not-found-view";
import { fontClasses } from "@/lib/fonts";
import "./globals.css";
import "./[lang]/site.css";

// Anything outside app/[lang] (the proxy sends public URLs there, so mostly
// unknown /admin paths).
export const metadata: Metadata = { title: "Page not found" };

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontClasses} suppressHydrationWarning>
        <PortfolioShell>
          <NotFoundView />
        </PortfolioShell>
      </body>
    </html>
  );
}

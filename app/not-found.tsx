import Link from "next/link";
import { PortfolioShell } from "@/components/portfolio-shell";
import { EmptyState } from "@/components/site/empty-state";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowLeft, ArrowUpRight } from "@/components/site/icons";
import "./(site)/site.css";

// 404 — canvas 20 (Y57IP / huATr). Lives at the app root so every unknown URL
// (and notFound() from post pages) gets it; Next returns HTTP 404 + noindex.
export default function NotFound() {
  return (
    <PortfolioShell>
      <section className="f-folder" aria-label="Page not found">
        <div className="f-panel f-index">
        <EmptyState
          bordered={false}
          headingAs="h1"
          label="404 / PAGE NOT FOUND"
          heading={"This page is\noff the map."}
          body="The link may have changed, or this page no longer exists. Let’s get you somewhere familiar."
          actions={
            <>
              <Link href="/" className="f-btn f-btn--primary">
                <ArrowLeft size={16} />
                Back to home
              </Link>
              <Link href="/work" className="f-act f-caps" style={{ gap: 12 }}>
                Explore the work
                <ArrowUpRight size={16} />
              </Link>
            </>
          }
        />
        </div>
      </section>
      <ContactStrip />
    </PortfolioShell>
  );
}

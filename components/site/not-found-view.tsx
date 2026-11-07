"use client";

import Link from "next/link";
import { EmptyState } from "@/components/site/empty-state";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowLeft, ArrowUpRight } from "@/components/site/icons";
import { useSite } from "@/lib/i18n/context";

// 404 — canvas 20 (Y57IP / huATr).
export function NotFoundView() {
  const { path, ui } = useSite();
  const t = ui.notFound;
  return (
    <>
      <section className="f-folder" aria-label={t.ariaLabel}>
        <div className="f-panel f-index">
        <EmptyState
          bordered={false}
          headingAs="h1"
          label={t.label}
          heading={t.heading}
          body={t.body}
          actions={
            <>
              <Link href={path("/")} className="f-btn f-btn--primary">
                <ArrowLeft size={16} />
                {ui.common.backHome}
              </Link>
              <Link href={path("/work")} className="f-act f-caps" style={{ gap: 12 }}>
                {t.exploreWork}
                <ArrowUpRight size={16} />
              </Link>
            </>
          }
        />
        </div>
      </section>
      <ContactStrip />
    </>
  );
}

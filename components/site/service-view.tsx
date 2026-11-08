import Link from "next/link";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import { ArrowDown, ArrowRight, MapPin } from "@/components/site/icons";
import { StructuredData } from "@/components/structured-data";
import { sentenceLines } from "@/lib/site-format";
import type { Site } from "@/lib/i18n";
import type { ServicePage } from "@/lib/content-types";

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ServiceView({ site, page, preview = false }: { site: Site; page: ServicePage; preview?: boolean }) {
  const language = site.lang;
  const t = site.ui.services;
  const toc = [
    ...page.sections.map((s) => ({ label: s.heading, id: anchor(s.heading) })),
    ...(page.faq.length > 0 ? [{ label: t.faq, id: "faq" }] : []),
  ];

  return (
    <article className="f-main" style={{ outline: "none" }}>
      {!preview && (
        <>
          <StructuredData lang={language} type="LocalBusiness" />
          <StructuredData lang={language} type="FAQ" data={page.faq} />
        </>
      )}

      <header className="f-panel f-svc-head">
        <div className="f-svc-head__top">
          <span className="f-tabtext">{page.eyebrow}</span>
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            {site.ui.common.location}
          </span>
        </div>
        <div className="f-svc-hero">
          <h1 className="f-display f-display--caps f-svc-title">{sentenceLines(page.title)}</h1>
          <div className="f-svc-intro">
            <p className="f-body">{page.intro}</p>
            <Link href={site.path("/contact")} className="f-btn f-btn--primary">
              <ArrowRight size={16} />
              {page.cta.label}
            </Link>
          </div>
        </div>
      </header>

      <Folder tab={t.tab} n="01" bodyClassName="f-art-surface">
        <nav className="f-case-side" aria-label={t.toc}>
          <span className="f-meta">{t.toc}</span>
          <div className="f-svc-toc">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="f-act">
                {item.label}
                <ArrowDown size={16} />
              </a>
            ))}
          </div>
        </nav>

        <div className="f-case-col">
          {page.sections.map((section) => (
            <section key={section.heading} id={anchor(section.heading)} className="f-case-sec">
              <h2 className="f-case-h">{section.heading}</h2>
              <p className="f-body f-pre">{section.body}</p>
            </section>
          ))}
          {page.faq.length > 0 && (
            <section id="faq" className="f-case-sec">
              <h2 className="f-case-h">{t.faq}</h2>
              <div className="f-svc-faq">
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="f-body">{item.question}</h3>
                    <p className="f-action f-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </Folder>

      <ContactStrip heading={page.cta.heading} label={page.cta.label} />
    </article>
  );
}

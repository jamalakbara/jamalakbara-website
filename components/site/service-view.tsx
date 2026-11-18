import { ButtonLink } from "@/components/site/button";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "@/components/site/icons";
import { TocRail } from "@/components/site/toc-rail";
import { RelatedPosts, type RelatedItem } from "@/components/site/related-posts";
import { StructuredData } from "@/components/structured-data";
import { sentenceLines } from "@/lib/site-format";
import { fill, type Site } from "@/lib/i18n";
import type { ServicePage } from "@/lib/content-types";

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ServiceView({
  site,
  page,
  preview = false,
  related,
}: {
  site: Site;
  page: ServicePage;
  preview?: boolean;
  related?: RelatedItem[];
}) {
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
          <div className="f-crumb">
            <Link href={site.path("/services")} className="f-act">
              <ArrowLeft size={16} />
              {t.back}
            </Link>
            <span className="f-crumb__sep" aria-hidden="true" />
            <span className="f-tabtext">{page.eyebrow}</span>
          </div>
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            {site.ui.common.location}
          </span>
        </div>
        <div className="f-svc-hero">
          <h1 className="f-display f-display--caps f-svc-title">{sentenceLines(page.title)}</h1>
          <div className="f-svc-intro">
            <p className="f-body">{page.intro}</p>
            <ButtonLink href={site.path("/contact")}>
              <ArrowRight size={16} />
              {page.cta.label}
            </ButtonLink>
          </div>
        </div>
      </header>

      <Folder tab={t.tab} n="01" bodyClassName="f-art-surface">
        <nav className="f-case-side" aria-label={t.toc}>
          <TocRail
            label={t.toc}
            count={fill(site.ui.common.sectionCount, { n: toc.length })}
            items={toc}
          />
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
          {related && <RelatedPosts heading={site.ui.article.keepReading} items={related} />}
        </div>
      </Folder>

      <ContactStrip heading={page.cta.heading} label={page.cta.label} />
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import { ArrowDown, ArrowRight, MapPin } from "@/components/site/icons";
import { StructuredData } from "@/components/structured-data";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { sentenceLines } from "@/lib/site-format";

// Service landing page: canvas 34. Copy comes from content/service-pages.json
// (/admin/service-pages). Drafts have no route and stay out of the sitemap.

type Params = { lang: string; slug: string };

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSite(params.lang as Lang).services.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const page = getSite(language).services.find((p) => p.slug === slug);
  if (!page) return {};
  const title = page.seo.title.trim() || page.title;
  const description = page.seo.description.trim() || page.intro;
  const twin = getSite(language === "en" ? "id" : "en").services.find((p) => p.slug === page.alternate);
  const alternates = alternatesFor(language, `/services/${page.slug}`, twin ? `/services/${twin.slug}` : null);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      ...(language === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title, description },
  };
}

export default async function ServicePageRoute({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const site = getSite(language);
  const page = site.services.find((p) => p.slug === slug);
  if (!page) notFound();

  const t = site.ui.services;
  const toc = [
    ...page.sections.map((s) => ({ label: s.heading, id: anchor(s.heading) })),
    ...(page.faq.length > 0 ? [{ label: t.faq, id: "faq" }] : []),
  ];

  return (
    <article className="f-main" style={{ outline: "none" }}>
      <StructuredData lang={language} type="LocalBusiness" />
      <StructuredData lang={language} type="FAQ" data={page.faq} />

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

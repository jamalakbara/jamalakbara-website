import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Folder } from "@/components/site/folder";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowRight } from "@/components/site/icons";
import { Stickers } from "@/components/site/sticker";
import { getSite } from "@/lib/i18n";
import { isLang, type Lang } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

// Services overview. Row copy comes from each page's `summary` in
// content/service-pages.json (/admin/service-pages); the rest from ui.services.

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const site = getSite(lang);
  if (!site.services.length) return {};
  const t = site.ui.services;
  const other: Lang = lang === "en" ? "id" : "en";
  const alternates = alternatesFor(lang, "/services", getSite(other).services.length ? "/services" : null);
  return {
    title: t.seoTitle,
    description: t.seoDescription,
    alternates,
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: alternates.canonical,
      ...(lang === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title: t.seoTitle, description: t.seoDescription },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = getSite(lang);
  if (!site.services.length) notFound();
  const t = site.ui.services;

  return (
    <div className="f-services">
      <header className="f-panel f-services-hero">
        <p className="f-meta f-muted">{t.eyebrow}</p>
        <div className="f-services-intro">
          <h1 className="f-display f-display--caps">{t.overviewTitle}</h1>
          <p className="f-body">{t.overviewDescription}</p>
        </div>
        <Stickers
          className="f-stickers f-services-stickers"
          spots={[
            { name: "dev-laptop", x: 0, y: 43, w: 104, h: 94.4, r: -10 },
            { name: "build-with-care", x: 85, y: 65, w: 92, h: 75.7, r: 9 },
          ]}
        />
        <Stickers
          className="f-stickers f-services-stickers--compact"
          spots={[{ name: "dev-laptop", x: 0, y: 25, w: 72, h: 65.4, r: -10 }]}
        />
      </header>
      <Folder tab={t.listHeading} n="01" bodyClassName="f-services-index" labelledBy="service-index-heading">
        <h2 id="service-index-heading" className="sr-only">{t.listHeading}</h2>
        <div className="f-services-index__head">
          <span className="f-meta f-muted">
            {String(site.services.length).padStart(2, "0")} {t.countLabel}
          </span>
        </div>
        <ol className="f-services-list" role="list">
          {site.services.map((page, index) => {
            const summary = page.summary;
            return (
              <li key={page.slug}>
                <Link href={site.path(`/services/${page.slug}`)} className="f-services-row">
                  <span className="f-meta f-services-row__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="f-services-row__info">
                    <h3 className="f-title">{summary?.label.trim() || page.title}</h3>
                    <p className="f-body">{summary?.description.trim() || page.intro}</p>
                    <span className="f-action">{summary?.price.trim() || t.detail}</span>
                  </div>
                  <ArrowRight size={20} />
                </Link>
              </li>
            );
          })}
        </ol>
      </Folder>
      <ContactStrip heading={t.contactHeading} label={t.contactCta} />
    </div>
  );
}

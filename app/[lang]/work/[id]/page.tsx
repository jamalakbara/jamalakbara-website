import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import { ArrowLeft, ArrowUpRight } from "@/components/site/icons";
import { Stamp } from "@/components/site/stamp";
import { StructuredData } from "@/components/structured-data";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";
import { mediaAlt } from "@/lib/media-meta";
import { alternatesFor } from "@/lib/seo";
import { pad2, sentenceCase } from "@/lib/site-format";

// Case study: canvas 33. Only projects with the admin "Publish case study page"
// toggle get a route; everything else 404s and stays out of the sitemap.

type Params = { lang: string; id: string };

const mediaOf = (p: { gallery?: string[]; image: string }) => (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean);
const summaryOf = (p: { summary?: string; description: string }) => p.summary?.trim() || p.description;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSite(params.lang as Lang).caseStudies.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, id } = await params;
  const language = lang as Lang;
  const project = getSite(language).caseStudies.find((p) => p.id === id);
  if (!project) return {};
  const title = project.seo?.title?.trim() || project.title;
  const description = project.seo?.description?.trim() || summaryOf(project);
  const path = `/work/${project.id}`;
  const hasTwin = getSite(language === "en" ? "id" : "en").caseStudies.some((p) => p.id === id);
  const alternates = alternatesFor(language, path, hasTwin ? path : null);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      images: mediaOf(project).slice(0, 1),
      ...(language === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title, description },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { lang, id } = await params;
  const language = lang as Lang;
  requireLive(language);
  const site = getSite(language);
  const project = site.caseStudies.find((p) => p.id === id);
  if (!project) notFound();

  const t = site.ui.caseStudy;
  const position = site.works.findIndex((w) => w.id === project.id) + 1;
  const media = mediaOf(project);
  const [cover, ...gallery] = media;
  const alt = (src: string) => mediaAlt(src, language) ?? `${project.title} ${site.ui.work.imageAlt}`;
  const liveUrl = project.livePreview || project.url;
  const category = sentenceCase(project.category);
  const summary = summaryOf(project);

  return (
    <article className="f-main" style={{ outline: "none" }}>
      <StructuredData
        lang={language}
        type="Project"
        data={{ ...project, description: summary, image: cover ?? project.image }}
      />
      <StructuredData
        lang={language}
        type="Breadcrumb"
        data={[
          { name: site.nav.find((n) => n.href === site.path("/work"))?.label ?? "Work", path: "/work" },
          { name: project.title, path: `/work/${project.id}` },
        ]}
      />

      <header className="f-panel f-art-head">
        <div>
          <Link href={site.path("/work")} className="f-act">
            <ArrowLeft size={16} />
            {t.back}
          </Link>
        </div>
        <div className="f-art-id">
          <div className="f-case-sig">
            <Stamp size={44} />
            <span className="f-case-sig__text">
              <span className="f-meta f-muted">
                {t.label} {pad2(position)}
              </span>
              <span className="f-action">
                {category} · {project.year}
              </span>
            </span>
          </div>
          <div className="f-art-titlecol">
            <h1 className="f-display f-display--caps f-case-title">{project.title}</h1>
            <p className="f-body">{summary}</p>
          </div>
        </div>
      </header>

      <Folder tab={t.tab} n={`${pad2(position)} / ${pad2(site.works.length)}`} bodyClassName="f-art-surface">
        <aside className="f-case-side" aria-label={t.notesLabel}>
          <span className="f-meta">{t.notes}</span>
          <dl className="f-case-facts">
            <div>
              <dt className="f-meta f-muted">{t.category}</dt>
              <dd className="f-action">{category}</dd>
            </div>
            <div>
              <dt className="f-meta f-muted">{t.year}</dt>
              <dd className="f-action">{project.year}</dd>
            </div>
            {project.tech.length > 0 && (
              <div>
                <dt className="f-meta f-muted">{t.stack}</dt>
                <dd className="f-action">{project.tech.join(", ")}</dd>
              </div>
            )}
          </dl>
          {liveUrl && (
            <a href={liveUrl} className="f-act f-accent" target="_blank" rel="noopener noreferrer">
              {t.visit}
              <ArrowUpRight size={16} />
              <span className="f-sr">{site.ui.common.opensNewTab}</span>
            </a>
          )}
        </aside>

        <div className="f-case-col">
          {cover && (
            <span className="f-case-img f-case-img--cover">
              <Image src={cover} alt={alt(cover)} fill sizes="(min-width: 1024px) 640px, 100vw" priority />
            </span>
          )}
          {project.challenge && (
            <section className="f-case-sec">
              <h2 className="f-case-h">{t.challenge}</h2>
              <p className="f-body">{project.challenge}</p>
            </section>
          )}
          {project.solution && (
            <section className="f-case-sec">
              <h2 className="f-case-h">{t.solution}</h2>
              <p className="f-body">{project.solution}</p>
            </section>
          )}
          {project.features && project.features.length > 0 && (
            <section className="f-case-sec">
              <h2 className="f-case-h">{t.built}</h2>
              <ul className="f-case-list">
                {project.features.map((feature) => (
                  <li key={feature} className="f-action">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.metrics && project.metrics.length > 0 && (
            <dl className="f-case-metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="f-case-metric">{metric.value}</dd>
                  <dt className="f-meta f-muted">{metric.label}</dt>
                </div>
              ))}
            </dl>
          )}
          {project.testimonial?.quote && (
            <figure className="f-case-quote">
              <blockquote className="f-body">{project.testimonial.quote}</blockquote>
              <figcaption className="f-meta f-muted">
                {project.testimonial.author}
                {project.testimonial.role ? `, ${project.testimonial.role}` : ""}
              </figcaption>
            </figure>
          )}
          {gallery.length > 0 && (
            <div className="f-case-gallery">
              {gallery.map((src, i) => (
                <span key={src} className={`f-case-img f-case-img--g${i % 2}`}>
                  <Image src={src} alt={alt(src)} fill sizes="(min-width: 1024px) 400px, 100vw" />
                </span>
              ))}
            </div>
          )}
        </div>
      </Folder>

      <ContactStrip />
    </article>
  );
}

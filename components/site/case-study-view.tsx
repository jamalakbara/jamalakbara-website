import Image from "next/image";
import Link from "next/link";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import { ArrowLeft, ArrowUpRight } from "@/components/site/icons";
import { Stamp } from "@/components/site/stamp";
import { StructuredData } from "@/components/structured-data";
import { mediaAlt } from "@/lib/media-meta";
import { pad2, sentenceCase } from "@/lib/site-format";
import type { Site } from "@/lib/i18n";
import type { Project } from "@/lib/content-types";

const mediaOf = (p: { gallery?: string[]; image: string }) => (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean);
const summaryOf = (p: { summary?: string; description: string }) => p.summary?.trim() || p.description;

export function CaseStudyView({ site, project, preview = false }: { site: Site; project: Project; preview?: boolean }) {
  const language = site.lang;
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
      {!preview && (
        <>
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
        </>
      )}

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

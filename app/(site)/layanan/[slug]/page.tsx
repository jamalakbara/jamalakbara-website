import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactStrip } from "@/components/site/contact-strip";
import { Folder } from "@/components/site/folder";
import { ArrowDown, ArrowRight, MapPin } from "@/components/site/icons";
import { StructuredData } from "@/components/structured-data";
import { publishedServicePages } from "@/lib/site-data";
import { sentenceLines } from "@/lib/site-format";

// Service landing page: canvas 34. Copy comes from content/service-pages.json
// (/admin/service-pages). Drafts have no route and stay out of the sitemap.

type Params = { slug: string };

const findPage = (slug: string) => publishedServicePages.find((p) => p.slug === slug);
const anchor = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams(): Params[] {
  return publishedServicePages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  const title = page.seo.title.trim() || page.title;
  const description = page.seo.description.trim() || page.intro;
  const url = `https://jamalakbara.com/layanan/${page.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: "id_ID" },
    twitter: { title, description },
  };
}

export default async function ServicePageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  const toc = [
    ...page.sections.map((s) => ({ label: s.heading, id: anchor(s.heading) })),
    ...(page.faq.length > 0 ? [{ label: "Pertanyaan", id: "pertanyaan" }] : []),
  ];

  return (
    <article lang="id" className="f-main" style={{ outline: "none" }}>
      <StructuredData type="LocalBusiness" />
      <StructuredData type="FAQ" data={page.faq} />

      <header className="f-panel f-svc-head">
        <div className="f-svc-head__top">
          <span className="f-tabtext">{page.eyebrow}</span>
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            Bandung, Indonesia
          </span>
        </div>
        <div className="f-svc-hero">
          <h1 className="f-display f-display--caps f-svc-title">{sentenceLines(page.title)}</h1>
          <div className="f-svc-intro">
            <p className="f-body">{page.intro}</p>
            <Link href="/kontak" className="f-btn f-btn--primary">
              <ArrowRight size={16} />
              {page.cta.label}
            </Link>
          </div>
        </div>
      </header>

      <Folder tab="LAYANAN" n="01" bodyClassName="f-art-surface">
        <nav className="f-case-side" aria-label="Di halaman ini">
          <span className="f-meta">DI HALAMAN INI</span>
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
            <section id="pertanyaan" className="f-case-sec">
              <h2 className="f-case-h">Pertanyaan</h2>
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

      <ContactStrip heading={page.cta.heading} label={page.cta.label} href="/kontak" />
    </article>
  );
}

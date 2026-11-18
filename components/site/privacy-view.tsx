import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Folder } from "@/components/site/folder";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowLeft, ArrowUp } from "@/components/site/icons";
import { TocRail } from "@/components/site/toc-rail";
import { getPrivacy } from "@/lib/privacy";
import { fill, type Site } from "@/lib/i18n";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const components = {
  h2: ({ children }: { children?: React.ReactNode }) => <h2 id={slugify(String(children))}>{children}</h2>,
  a: ({ href = "", children }: { href?: string; children?: React.ReactNode }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
};

export function PrivacyView({ site }: { site: Site }) {
  const { lang, path, ui } = site;
  const t = ui.privacy;
  const { updated, content } = getPrivacy(lang);
  const sections = [...content.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => ({ id: slugify(m[1]), label: m[1] }));
  const date = new Date(`${updated}T00:00:00`).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="f-panel f-art-head">
        <div className="f-crumb">
          <Link href={path("/")} className="f-act">
            <ArrowLeft size={16} />
            {ui.common.backHome}
          </Link>
          <span className="f-crumb__sep" aria-hidden="true" />
          <span className="f-tabtext">{t.label}</span>
        </div>
        <div className="f-art-id">
          <div className="f-art-sig" aria-hidden="true" />
          <div className="f-art-titlecol">
            <span className="f-meta f-muted">
              {t.updated} <time dateTime={updated}>{date}</time>
            </span>
            <h1 className="f-display f-display--caps">{t.title}</h1>
          </div>
        </div>
      </header>

      <Folder tab={t.tab} n="01" bodyClassName="f-art-surface">
        <nav className="f-art-toc" aria-label={t.toc}>
          <TocRail
            label={t.toc}
            count={fill(ui.common.sectionCount, { n: sections.length })}
            items={sections}
          />
        </nav>
        <div className="f-art-col">
          <div className="f-prose">
            <MDXRemote source={content} components={components} />
          </div>
          <div className="f-art-end">
            <Link href={path("/")} className="f-act">
              <ArrowLeft size={16} />
              {ui.common.backHome}
            </Link>
            <a href="#main" className="f-act">
              {ui.common.backToTop}
              <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </Folder>

      <ContactStrip />
    </>
  );
}

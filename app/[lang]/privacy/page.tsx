import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Folder } from "@/components/site/folder";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowDown, ArrowLeft, ArrowUp } from "@/components/site/icons";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";
import { getPrivacy } from "@/lib/privacy";

// Privacy policy — server component in the article layout (head panel + one
// folder with an in-page index). Text lives in content/privacy/<lang>.mdx;
// change its `updated` date when the policy changes.

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

type Props = { params: Promise<{ lang: string }> };

export default async function PrivacyPage({ params }: Props) {
  const lang = (await params).lang as Lang;
  requireLive(lang);
  const { path, ui } = getSite(lang);
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
        <div>
          <Link href={path("/")} className="f-act">
            <ArrowLeft size={16} />
            {ui.common.backHome}
          </Link>
        </div>
        <div className="f-art-id">
          <div className="f-art-sig">
            <span className="f-tabtext">{t.label}</span>
          </div>
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
          <div className="f-art-toc__list">
            <span className="f-tabtext">{t.toc}</span>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="f-act">
                {s.label}
                <ArrowDown size={16} />
              </a>
            ))}
          </div>
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

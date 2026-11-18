import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Stamp } from "@/components/site/stamp";
import { ContactStrip } from "@/components/site/contact-strip";
import { RelatedPosts, type RelatedItem } from "@/components/site/related-posts";
import { getSite, fill, type Ui } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { contentHref, localePath } from "@/lib/i18n/routes";
import { pad2 } from "@/lib/site-format";
import { ArrowLeft, ArrowUp } from "@/components/site/icons";
import { TocRail } from "@/components/site/toc-rail";

// Article — canvas 16 (m54Zq / c73NeH). Server component shared by
// journal posts in both languages; metadata + JSON-LD stay in the page.
// "In this entry" anchors come from the post's own `##` headings.

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

const textOf = (node: React.ReactNode): string =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : Array.isArray(node)
      ? node.map(textOf).join("")
      : node && typeof node === "object" && "props" in node
        ? textOf((node as { props: { children?: React.ReactNode } }).props.children)
        : "";

export function ArticleView({
  post,
  position,
  total,
  language,
  date,
  lang,
  related,
  ui = getSite(language).ui,
}: {
  post: { title: string; content: string; date: string; readingMinutes: number };
  position: number; // 1-based index in the list
  total: number;
  language: Lang;
  date: string;
  /** linked post in the other language (/journal ↔ /jurnal), set in admin */
  lang?: { href: string; label: string; hrefLang: "en" | "id" };
  /** "Keep reading" block at the end of the article */
  related?: RelatedItem[];
  ui?: Ui;
}) {
  const copy = ui.article;
  const basePath = localePath(language, "/journal");
  const sections = [...post.content.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)].map((m) => {
    const label = m[1].replace(/[`*_]/g, "");
    return { label, id: slugify(label) };
  });

  const components = {
    h2: ({ children }: { children?: React.ReactNode }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
    a: ({ href = "", children }: { href?: string; children?: React.ReactNode }) => <a href={contentHref(language, href)}>{children}</a>,
  };

  return (
    <article className="f-main" style={{ outline: "none" }}>
      <header className="f-panel f-art-head">
        <div style={lang ? { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" } : undefined}>
          <Link href={basePath} className="f-act">
            <ArrowLeft size={16} />
            {copy.back}
          </Link>
          {lang && (
            <Link href={lang.href} hrefLang={lang.hrefLang} lang={lang.hrefLang} className="f-act">
              {lang.label}
            </Link>
          )}
        </div>
        <div className="f-art-id">
          <div className="f-art-sig">
            <Stamp size={44} />
            <span className="f-meta f-muted f-art-sig__by">{copy.writtenBy}</span>
            <span className="f-action">Jamal Akbar Alam</span>
          </div>
          <div className="f-art-titlecol">
            <span className="f-meta f-muted" style={{ whiteSpace: "pre" }}>
              <time dateTime={post.date}>{date}</time>
              {"  ·  "}
              {fill(copy.minRead, { n: post.readingMinutes })}
            </span>
            <h1 className="f-display f-display--caps">{post.title}</h1>
          </div>
        </div>
      </header>

      <section className="f-folder" aria-label={copy.tab}>
        <div className="f-tab">
          <span className="f-tabtext">{copy.tab}</span>
          <span className="f-tab__n f-muted">
            {pad2(position)} / {pad2(total)}
          </span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-art-surface">
          <nav className="f-art-toc" aria-label={copy.toc}>
            <TocRail
              label={copy.toc}
              count={fill(ui.common.sectionCount, { n: sections.length })}
              items={sections}
            />
          </nav>
          <div className="f-art-col">
            <div className="f-prose">
              <MDXRemote source={post.content} components={components} />
            </div>
            {related && <RelatedPosts heading={copy.keepReading} items={related} />}
            <div className="f-art-end">
              <Link href={basePath} className="f-act">
                <ArrowLeft size={16} />
                {copy.backEnd}
              </Link>
              <a href="#main" className="f-act">
                {ui.common.backToTop}
                <ArrowUp size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactStrip />
    </article>
  );
}

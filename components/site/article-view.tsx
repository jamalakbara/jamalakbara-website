import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Stamp } from "@/components/site/stamp";
import { Stickers, type StickerSpot } from "@/components/site/sticker";
import { ContactStrip } from "@/components/site/contact-strip";
import { pad2 } from "@/lib/site-format";
import { ArrowDown, ArrowLeft, ArrowUp } from "@/components/site/icons";

// Article — canvas 16 (m54Zq / c73NeH). Server component shared by
// /journal/[slug] and /jurnal/[slug]; metadata + JSON-LD stay in the pages.
// "In this entry" anchors come from the post's own `##` headings.

export type ArticleCopy = {
  back: string; // "All journal entries"
  backEnd: string; // "Back to journal"
  writtenBy: string;
  minRead: (n: number) => string;
  tab: string; // "READING NOTES"
  toc: string; // "IN THIS ENTRY"
  backToTop: string;
};

const MARGIN: StickerSpot[] = [
  { name: "dev-laptop", x: 86, y: 464, w: 156, h: 141.625, r: -8 },
  { name: "dev-mode", x: 250, y: 408, w: 112, h: 114.303, r: 11 },
  { name: "debug-duck", x: 188, y: 720, w: 128, h: 144.314, r: 6 },
  { name: "build-with-care", x: 106, y: 1120, w: 152, h: 125.059, r: 9 },
  { name: "pen-tool", x: 288, y: 1254, w: 88, h: 103.76, r: -14 },
  { name: "make-it-useful", x: 116, y: 1700, w: 144, h: 136.323, r: -7 },
  { name: "kopi-susu", x: 286, y: 1880, w: 64, h: 129.457, r: 8 },
];

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
  basePath,
  date,
  copy,
}: {
  post: { title: string; content: string; date: string; readingMinutes: number };
  position: number; // 1-based index in the list
  total: number;
  basePath: string;
  date: string;
  copy: ArticleCopy;
}) {
  const sections = [...post.content.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)].map((m) => {
    const label = m[1].replace(/[`*_]/g, "");
    return { label, id: slugify(label) };
  });

  const components = {
    h2: ({ children }: { children?: React.ReactNode }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  };

  return (
    <article className="f-main" style={{ outline: "none" }}>
      <header className="f-panel f-art-head">
        <div>
          <Link href={basePath} className="f-act">
            <ArrowLeft size={16} />
            {copy.back}
          </Link>
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
              {copy.minRead(post.readingMinutes)}
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
            {sections.length > 0 && (
              <div className="f-art-toc__list">
                <span className="f-tabtext">{copy.toc}</span>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="f-act">
                    {s.label}
                    <ArrowDown size={16} />
                  </a>
                ))}
              </div>
            )}
          </nav>
          <div className="f-art-col">
            <div className="f-prose">
              <MDXRemote source={post.content} components={components} />
            </div>
            <div className="f-art-end">
              <Link href={basePath} className="f-act">
                <ArrowLeft size={16} />
                {copy.backEnd}
              </Link>
              <a href="#main" className="f-act">
                {copy.backToTop}
                <ArrowUp size={16} />
              </a>
            </div>
          </div>
          <Stickers spots={MARGIN} className="f-art-margin" base={1416} />
        </div>
      </section>

      <ContactStrip />
    </article>
  );
}

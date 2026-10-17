import Link from "next/link";
import { TitlePanel } from "@/components/site/title-panel";
import { ContactStrip } from "@/components/site/contact-strip";
import { EmptyState } from "@/components/site/empty-state";
import type { StickerSpot } from "@/components/site/sticker";
import { pad2, sentenceLines } from "@/lib/site-format";
import { ArrowRight, ArrowUp } from "@/components/site/icons";

// Journal index — canvas 15 (NDBsB / b7j55z), empty 15A. Server component:
// rows render as static HTML for crawlers. Shared by /journal and /jurnal.

export type IndexPost = { slug: string; title: string; description: string; date: string };

export type IndexCopy = {
  label: string;
  heading: string;
  intro: string;
  lang: { href: string; label: string; hrefLang: string };
  tab: string;
  entries: (n: number) => string;
  newest: string;
  latest: string;
  end: string;
  backToTop: string;
  emptyLabel: string;
  emptyHeading: string;
  emptyBody: string;
};

const STICKERS: StickerSpot[] = [
  { name: "dev-mode", x: 398, y: 78, w: 96, h: 97.974, r: -9 },
  { name: "builder-cursor", x: 540, y: 174, w: 76, h: 105.52, r: 10 },
  { name: "less-noise-more-craft", x: 658, y: 104, w: 160, h: 128.436, r: 7 },
  { name: "make-it-useful", x: 888, y: 70, w: 104, h: 98.455, r: 12 },
  { name: "dev-laptop", x: 762, y: 192, w: 116, h: 105.311, r: -7 },
  { name: "kopi-susu", x: 1014, y: 157, w: 56, h: 113.275, r: -5 },
];

export function JournalIndex({
  posts,
  basePath,
  copy,
  formatDate,
}: {
  posts: IndexPost[];
  basePath: string;
  copy: IndexCopy;
  formatDate: (iso: string) => string;
}) {
  return (
    <>
      <TitlePanel
        label={copy.label}
        aside={
          <Link href={copy.lang.href} hrefLang={copy.lang.hrefLang} className="f-act">
            {copy.lang.label}
            <ArrowRight size={16} />
          </Link>
        }
        heading={<h1 className="f-display f-display--caps">{sentenceLines(copy.heading)}</h1>}
        intro={<p className="f-body f-pre f-journal-intro">{copy.intro}</p>}
        stickers={STICKERS}
      />

      <section className="f-folder" aria-label={copy.tab}>
        <div className="f-tab">
          <span className="f-tabtext">{copy.tab}</span>
          <span className="f-tab__n f-muted">{copy.entries(posts.length)}</span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-index">
          {posts.length === 0 ? (
            <EmptyState label={copy.emptyLabel} heading={copy.emptyHeading} body={copy.emptyBody} />
          ) : (
            <>
              <div className="f-archive f-meta f-muted">
                <span>{copy.newest}</span>
                <span>{copy.entries(posts.length)}</span>
              </div>
              <ol className="f-jlist">
                {posts.map((p, i) => (
                  <li key={p.slug}>
                    <Link href={`${basePath}/${p.slug}`} className="f-jrow">
                      <span className="f-jrow__date">
                        <time className="f-meta f-muted" dateTime={p.date}>
                          {formatDate(p.date)}
                        </time>
                        {i === 0 && <span className="f-meta f-accent">{copy.latest}</span>}
                        <ArrowRight size={16} className="f-jrow__go-m" />
                      </span>
                      <span className="f-jrow__main">
                        <span className="f-title">{p.title}</span>
                        <span className="f-body">{p.description}</span>
                      </span>
                      <span className="f-jrow__go" aria-hidden="true">
                        <ArrowRight size={16} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="f-end f-end--tall">
                <span className="f-action f-muted">{copy.end}</span>
                <a href="#main" className="f-act">
                  {copy.backToTop}
                  <ArrowUp size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}

export const entriesEn = (n: number) => `${pad2(n)} ${n === 1 ? "entry" : "entries"}`;
export const entriesId = (n: number) => `${pad2(n)} tulisan`;

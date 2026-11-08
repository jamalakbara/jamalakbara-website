import Link from "next/link";
import { TitlePanel } from "@/components/site/title-panel";
import { ContactStrip } from "@/components/site/contact-strip";
import { EmptyState } from "@/components/site/empty-state";
import type { StickerSpot } from "@/components/site/sticker";
import { getSite, type Site } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routes";
import { formatDate } from "@/lib/posts";
import { pad2, sentenceLines } from "@/lib/site-format";
import { ArrowRight, ArrowUp } from "@/components/site/icons";

// Journal index — canvas 15 (NDBsB / b7j55z), empty 15A. Server component:
// rows render as static HTML for crawlers. Shared by both languages.

export type IndexPost = { slug: string; title: string; description: string; date: string };

const STICKERS: StickerSpot[] = [
  { name: "dev-mode", x: 470, y: 60, w: 96, h: 97.974, r: -9 },
  { name: "less-noise-more-craft", x: 704, y: 58, w: 160, h: 128.436, r: 7 },
  { name: "kopi-susu", x: 940, y: 82, w: 56, h: 113.275, r: -5 },
];

export function JournalIndex({
  posts,
  language,
  site = getSite(language),
}: {
  posts: IndexPost[];
  language: Lang;
  site?: Site;
}) {
  const copy = site.ui.journal;
  const other: Lang = language === "en" ? "id" : "en";
  const basePath = localePath(language, "/journal");
  const entries = (n: number) => `${pad2(n)} ${n === 1 ? copy.entry : copy.entries}`;
  return (
    <>
      <TitlePanel
        label={copy.label}
        aside={
          <Link href={localePath(other, "/journal")} hrefLang={other} className="f-act">
            {copy.otherLanguage}
            <ArrowRight size={16} />
          </Link>
        }
        heading={<h1 className="f-display f-display--caps">{sentenceLines(site.journal.heading)}</h1>}
        intro={<p className="f-body f-pre f-journal-intro">{copy.intro}</p>}
        stickers={STICKERS}
      />

      <section className="f-folder" aria-label={copy.tab}>
        <div className="f-tab">
          <span className="f-tabtext">{copy.tab}</span>
          <span className="f-tab__n f-muted">{entries(posts.length)}</span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-index">
          {posts.length === 0 ? (
            <EmptyState label={copy.emptyLabel} heading={copy.emptyHeading} body={copy.emptyBody} />
          ) : (
            <>
              <div className="f-archive f-meta f-muted">
                <span>{copy.newest}</span>
                <span>{entries(posts.length)}</span>
              </div>
              <ol className="f-jlist">
                {posts.map((p, i) => (
                  <li key={p.slug}>
                    <Link href={`${basePath}/${p.slug}`} className="f-jrow">
                      <span className="f-jrow__date">
                        <time className="f-meta f-muted" dateTime={p.date}>
                          {formatDate(language, p.date)}
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
                  {site.ui.common.backToTop}
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


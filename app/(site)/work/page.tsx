"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { works, work } from "@/lib/site-data";
import { pad2, sentenceCase } from "@/lib/site-format";
import { sentenceLines } from "@/lib/site-format";
import { TitlePanel } from "@/components/site/title-panel";
import { ProjectRow } from "@/components/site/project-row";
import { ContactStrip } from "@/components/site/contact-strip";
import { EmptyState } from "@/components/site/empty-state";
import type { StickerSpot } from "@/components/site/sticker";
import { ArrowRight } from "@/components/site/icons";

// Work — canvas 17 (Pb8Dp / vs4kI), empty state 17A.
// Filters are built from the projects' real categories (case-normalised).

const STICKERS: StickerSpot[] = [
  { name: "pen-tool", x: 404, y: 70, w: 88.204, h: 104, r: -9 },
  { name: "shopping-bag-cursor", x: 522, y: 176, w: 105.158, h: 108, r: 8 },
  { name: "build-with-care", x: 656, y: 96, w: 160.436, h: 132, r: 6 },
  { name: "debug-duck", x: 776, y: 186, w: 88.695, h: 100, r: -7 },
  { name: "browser-rocket", x: 866, y: 62, w: 105.823, h: 124, r: 11 },
];

const ALL = "all";
const count = (n: number) => `${pad2(n)} project${n === 1 ? "" : "s"}`;

export default function WorkPage() {
  const [filter, setFilter] = useState(ALL);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const w of works) {
      const label = sentenceCase(w.category);
      if (!seen.has(label.toLowerCase())) seen.set(label.toLowerCase(), label);
    }
    return [...seen.entries()].map(([key, label]) => ({ key, label }));
  }, []);

  const rows = works
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => filter === ALL || row.category.trim().toLowerCase() === filter);

  return (
    <>
      <TitlePanel
        label="WORK / PROJECT INDEX"
        aside={<span className="f-meta f-muted">{count(works.length)}</span>}
        heading={<h2 className="f-display f-display--caps">{sentenceLines(work.heading)}</h2>}
        intro={<p className="f-body">Websites and digital storefronts. A closer look at the things I design and build.</p>}
        stickers={STICKERS}
      />

      <section className="f-folder" aria-label="All projects">
        <div className="f-tab">
          <span className="f-tabtext">ALL PROJECTS</span>
          <span className="f-tab__n f-muted">{count(works.length)}</span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-index">
          {works.length === 0 ? (
            <EmptyState
              label="NO PROJECTS YET"
              heading="STILL BREWING."
              body="There’s no work to show here yet. New projects are on the bench. Check back soon, or start one with me."
              actions={
                <Link href="/contact" className="f-btn f-btn--primary">
                  <ArrowRight size={16} />
                  Start a project
                </Link>
              }
            />
          ) : (
            <>
              {categories.length > 1 && (
                <div className="f-filters" role="group" aria-label="Filter projects by category">
                  <button
                    type="button"
                    className="f-filter"
                    aria-pressed={filter === ALL}
                    onClick={() => setFilter(ALL)}
                  >
                    All work
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className="f-filter"
                      aria-pressed={filter === c.key}
                      onClick={() => setFilter(c.key)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="f-sr" aria-live="polite">
                {count(rows.length)} shown
              </p>
              {rows.map(({ row, index }, i) => (
                <ProjectRow
                  key={row.id}
                  row={row}
                  index={index}
                  variant={rows.slice(0, i).filter((r) => r.row.media.length >= 3).length}
                />
              ))}
              <div className="f-end">
                <span className="f-action f-muted">That’s the collection so far. More good work to come.</span>
              </div>
            </>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}

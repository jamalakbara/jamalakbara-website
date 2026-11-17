"use client";

import { useEffect, useState } from "react";

// Progress rail — canvas "Privacy / Article / Service contents / Progress rail".
// In-page anchors on a 1px rule; the section in view gets the 2px cobalt
// marker (aria-current="location"). Server-rendered with the first section
// current, then a scroll listener keeps it in sync.

export type TocItem = { id: string; label: string };

// A heading counts as "reached" once its top passes this far down the viewport.
const LINE = 0.3;

export function TocRail({
  label,
  count,
  items,
}: {
  label: string;
  count: string;
  items: TocItem[];
}) {
  const [current, setCurrent] = useState(items[0]?.id);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * LINE;
      let next = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) next = item.id;
      }
      setCurrent(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // The page scrolls inside .f-scroll, and scroll events don't bubble: listen in capture.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="f-art-toc__list f-rail">
      <div className="f-rail__head">
        <span className="f-tabtext">{label}</span>
        <span className="f-tabtext f-muted">{count}</span>
      </div>
      <ol className="f-rail__list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="f-rail__link"
              aria-current={item.id === current ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { ArrowUpRight } from "@/components/site/icons";
import { useSite } from "@/lib/i18n/context";

// Services receipt (canvas "About / Perforated receipt paper"). Copy is the
// approved canvas copy; perforation (35 dashes), barcode (57 bars, every 4th
// is 3px) and the 6px zig-zag torn edges reproduce the canvas geometry.

const zig = (down: boolean) => {
  let d = down ? "M0 0" : "M0 8";
  for (let i = 0; i < 36; i++) d += down ? "l6 8 6-8" : "l6-8 6 8";
  return d + (down ? "V0z" : "V8z");
};
const TOP = zig(false);
const BOTTOM = zig(true);

function Edge({ d }: { d: string }) {
  return (
    <svg className="f-receipt__edge" viewBox="0 0 432 8" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="#FFFEFA" />
    </svg>
  );
}

const Perf = () => (
  <div className="f-perf" aria-hidden="true">
    {Array.from({ length: 35 }, (_, i) => (
      <i key={i} />
    ))}
  </div>
);

export function Receipt() {
  const { receipt: t } = useSite().ui;
  return (
    <div className="f-receipt">
      <Edge d={TOP} />
      <div className="f-receipt__body">
        <p className="f-receipt__name">JAMAL AKBAR ALAM</p>
        <p className="f-receipt__sub">{t.sub}</p>
        <Perf />
        <div className="f-receipt__pair f-meta">
          <span>{t.whatICanDo}</span>
          <span>{t.forYou}</span>
        </div>
        <ul style={{ display: "contents", listStyle: "none" }}>
          {t.entries.map((entry) => (
            <li key={entry.name} className="f-receipt__entry f-meta">
              <span className="f-receipt__entry-h">
                {entry.name}
                <ArrowUpRight size={14} />
              </span>
              <span>{entry.desc}</span>
            </li>
          ))}
        </ul>
        <Perf />
        <div className="f-receipt__pair f-receipt__total">
          <span>{t.letsBuild}</span>
          <span>{t.together}</span>
        </div>
        <div className="f-receipt__pair f-meta">
          <span>{t.scope}</span>
          <span>{t.tailored}</span>
        </div>
        <div className="f-receipt__pair f-receipt__approach">
          <span>{t.madeWith}</span>
          <span>{t.care}</span>
        </div>
        <div className="f-barcode" aria-hidden="true">
          {Array.from({ length: 57 }, (_, i) => (
            <i key={i} className={i % 4 === 0 ? "w" : undefined} />
          ))}
        </div>
        <p className="f-receipt__foot">{t.foot}</p>
      </div>
      <Edge d={BOTTOM} />
    </div>
  );
}

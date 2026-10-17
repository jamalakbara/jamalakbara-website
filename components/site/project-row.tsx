import Image from "next/image";
import type { WorkRow } from "@/lib/site-data";
import { sentenceCase } from "@/lib/site-format";
import { NumberTile } from "@/components/site/number-tile";

// Editorial project row (canvas "Project / Editorial row"): 400px details
// column beside a right-aligned media strip. Three strip compositions from the
// canvas rotate by row (A Withavelle, B Adana, C Sonderlab); rows with fewer
// images collapse gracefully. Desktop and mobile strips are separate DOM so
// each matches its frame exactly; the hidden one is display:none (lazy images
// inside it never load).

type Box = { w?: number; h: number; grow?: boolean; bg?: string };

const DESKTOP: Record<"A" | "B" | "C", Box[]> = {
  A: [{ grow: true, h: 360 }, { w: 180, h: 240 }, { w: 220, h: 294 }],
  B: [{ w: 360, h: 400 }, { w: 260, h: 285 }, { grow: true, h: 190, bg: "#101216" }],
  C: [{ grow: true, h: 240 }, { w: 210, h: 310 }, { w: 190, h: 190 }],
};

const PATTERNS = ["A", "B", "C"] as const;

function Img({ src, alt, box, sizes }: { src: string; alt: string; box: Box; sizes: string }) {
  return (
    <span
      className={box.grow ? "f-row__img f-row__img--grow" : "f-row__img"}
      style={{ width: box.grow ? undefined : box.w, height: box.h, background: box.bg }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} />
    </span>
  );
}

function DesktopStrip({ media, pattern, title }: { media: string[]; pattern: "A" | "B" | "C"; title: string }) {
  let boxes: Box[];
  if (media.length >= 3) boxes = DESKTOP[pattern];
  else if (media.length === 2) boxes = [{ grow: true, h: 360 }, { w: 220, h: 294 }];
  else boxes = [{ grow: true, h: 360 }];
  return (
    <span className="f-row__strip f-strip-d">
      {boxes.map((b, i) => (
        <Img key={i} src={media[i]} alt={i === 0 ? `${title} — project image` : ""} box={b} sizes="(min-width: 1024px) 40vw, 1px" />
      ))}
    </span>
  );
}

function MobileStrip({ media, pattern, title }: { media: string[]; pattern: "A" | "B" | "C"; title: string }) {
  const sizes = "(max-width: 1023px) 100vw, 1px";
  const alt = (i: number) => (i === 0 ? `${title} — project image` : "");
  if (media.length === 1) {
    return (
      <span className="f-row__strip f-strip-m">
        <Img src={media[0]} alt={alt(0)} box={{ grow: true, h: 220 }} sizes={sizes} />
      </span>
    );
  }
  if (media.length >= 3 && pattern === "C") {
    return (
      <span className="f-row__strip f-strip-m" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
        <Img src={media[0]} alt={alt(0)} box={{ h: 150 }} sizes={sizes} />
        <span style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 12 }}>
          <Img src={media[1]} alt="" box={{ w: 156, h: 200 }} sizes={sizes} />
          <Img src={media[2]} alt="" box={{ w: 126, h: 126 }} sizes={sizes} />
        </span>
      </span>
    );
  }
  const b = pattern === "B";
  const col = b ? { w: 112, a: 148, c: 100, h: 230 } : { w: 106, a: 142, c: 106, h: 280 };
  return (
    <span className="f-row__strip f-strip-m" style={{ height: b ? 260 : 280 }}>
      <Img src={media[0]} alt={alt(0)} box={{ grow: true, h: col.h }} sizes={sizes} />
      <span className="f-row__col" style={{ width: col.w }}>
        <Img src={media[1]} alt="" box={{ h: col.a }} sizes={sizes} />
        {media[2] && <Img src={media[2]} alt="" box={{ h: col.c, bg: b ? "#101216" : undefined }} sizes={sizes} />}
      </span>
    </span>
  );
}

export function ProjectRow({
  row,
  index,
  variant = index,
  headingLevel = 3,
}: {
  row: WorkRow;
  /** position in the full ordered list → number tile */
  index: number;
  /** strip composition (A/B/C rotate) — defaults to index */
  variant?: number;
  headingLevel?: 2 | 3;
}) {
  const pattern = PATTERNS[variant % 3];
  const external = row.href && row.href !== "#";
  const H = headingLevel === 2 ? "h2" : "h3";
  const inner = (
    <>
      <span className="f-row__details">
        <span className="f-row__id">
          <NumberTile n={index + 1} />
          <span className="f-row__namecat">
            <H className="f-title f-row__title">{row.title}</H>
            <span className="f-meta">
              {sentenceCase(row.category)}
            </span>
          </span>
        </span>
        <span className="f-body f-row__desc">{row.description}</span>
      </span>
      <DesktopStrip media={row.media} pattern={pattern} title={row.title} />
      <MobileStrip media={row.media} pattern={pattern} title={row.title} />
      {external && <span className="f-sr">(opens in a new tab)</span>}
    </>
  );
  return external ? (
    <a className="f-row" href={row.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="f-row">{inner}</div>
  );
}

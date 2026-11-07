import { Stickers, type StickerSpot } from "@/components/site/sticker";

// Opening panel for index pages (Work / About / Contact / Journal): 308px,
// label row on top, display heading + intro at the bottom, stickers in the margin.
export function TitlePanel({
  label,
  aside,
  heading,
  intro,
  stickers = [],
  mobileStickers = [],
}: {
  label: React.ReactNode;
  aside?: React.ReactNode;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  stickers?: StickerSpot[];
  /** canvas mobile title-panel stickers (378px-wide panel) */
  mobileStickers?: StickerSpot[];
}) {
  return (
    <section className={mobileStickers.length ? "f-title-panel f-title-panel--msticker" : "f-title-panel"}>
      <div className="f-title-panel__label">
        <span className="f-tabtext">{label}</span>
        {aside}
      </div>
      <div className="f-title-panel__row">
        <div className="f-title-panel__h">{heading}</div>
        {intro && <div className="f-title-panel__intro">{intro}</div>}
      </div>
      {stickers.length > 0 && <Stickers spots={stickers} className="f-stickers f-stickers--margin" base={1416} />}
      {mobileStickers.length > 0 && <Stickers spots={mobileStickers} className="f-stickers f-stickers--mobile" base={378} />}
    </section>
  );
}

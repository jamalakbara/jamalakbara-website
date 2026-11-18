import { StickerCluster, type StickerName } from "@/components/site/sticker";

// Opening panel for index pages (Work / About / Contact / Journal): 308px,
// label row on top, display heading + intro at the bottom, and the shared
// sticker cluster (1–3) (same size and placement as the Services overview).
export function TitlePanel({
  label,
  aside,
  heading,
  intro,
  stickers,
}: {
  label: React.ReactNode;
  aside?: React.ReactNode;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  /** cluster stickers, lead first (1–3; the lead alone shows below 1024px) */
  stickers?: StickerName[];
}) {
  return (
    <section className={stickers?.length ? "f-title-panel f-title-panel--cluster" : "f-title-panel"}>
      <div className="f-title-panel__label">
        <span className="f-tabtext">{label}</span>
        {aside}
      </div>
      <div className="f-title-panel__row">
        <div className="f-title-panel__h">{heading}</div>
        {intro && <div className="f-title-panel__intro">{intro}</div>}
      </div>
      {stickers?.length ? <StickerCluster names={stickers} /> : null}
    </section>
  );
}

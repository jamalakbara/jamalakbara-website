// One of the twelve supplied stickers, placed with the canvas geometry
// (top-left origin rotation, exactly as exported from the Pencil frames).
export type StickerName =
  | "dev-mode"
  | "debug-duck"
  | "make-it-useful"
  | "browser-rocket"
  | "build-with-care"
  | "kopi-susu"
  | "pen-tool"
  | "less-noise-more-craft"
  | "builder-cursor"
  | "bandung-volcano"
  | "shopping-bag-cursor"
  | "dev-laptop";

export type StickerSpot = { name: StickerName; x: number; y: number; w: number; h: number; r: number };

// With `base` (the canvas width of the sticker field) positions and sizes are
// expressed in container-query units, so the composition scales with its
// container and is exact at the reference width.
export const cqw = (v: number, base: number) => `${((v / base) * 100).toFixed(4)}cqw`;

export function Sticker({ name, x, y, w, h, r, z, base }: StickerSpot & { z?: number; base?: number }) {
  const u = (v: number) => (base ? cqw(v, base) : v);
  return (
    <span
      className="f-sticker"
      style={{ left: u(x), top: u(y), width: u(w), height: u(h), transform: `rotate(${r}deg)`, zIndex: z }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brand/stickers/${name}.svg`} alt="" aria-hidden="true" draggable={false} loading="lazy" />
    </span>
  );
}

export function Stickers({
  spots,
  className = "f-stickers",
  base,
  style,
}: {
  spots: StickerSpot[];
  className?: string;
  base?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={base ? { containerType: "inline-size", ...style } : style}
    >
      {spots.map((s, i) => (
        <Sticker key={`${s.name}-${i}`} {...s} z={i + 2} base={base} />
      ))}
    </div>
  );
}

// Title-panel sticker cluster (canvas 42 — Services overview): one to three
// stickers overlapping in a small box centred in the panel. The lead is 104px,
// the second 92px, the third 72px, at fixed offsets; below 1024px only the lead
// shows, 72px wide, in the top-right corner.
export const STICKER_RATIO: Record<StickerName, number> = {
  "dev-mode": 97.974 / 96,
  "debug-duck": 100 / 88.695,
  "make-it-useful": 119.283 / 126,
  "browser-rocket": 124 / 105.823,
  "build-with-care": 75.7 / 92,
  "kopi-susu": 113.275 / 56,
  "pen-tool": 104 / 88.204,
  "less-noise-more-craft": 128.436 / 160,
  "builder-cursor": 1,
  "bandung-volcano": 131 / 126.827,
  "shopping-bag-cursor": 108 / 105.158,
  "dev-laptop": 94.4 / 104,
};
const spot = (name: StickerName, x: number, y: number, w: number, r: number): StickerSpot => ({
  name,
  x,
  y,
  w,
  h: Math.round(w * STICKER_RATIO[name] * 10) / 10,
  r,
});
// [x, y, width, rotation] per slot, and the box width per sticker count.
const SLOTS: [number, number, number, number][] = [
  [0, 43, 104, -10],
  [85, 65, 92, 9],
  [164, 26, 72, -6],
];
const BOX_W = [104, 184, 236]; // 184: keeps the Services pair at canvas x 616

export function StickerCluster({ names }: { names: StickerName[] }) {
  const picks = names.slice(0, SLOTS.length);
  if (!picks.length) return null;
  return (
    <>
      <Stickers
        className="f-stickers f-cluster"
        spots={picks.map((name, i) => spot(name, ...SLOTS[i]))}
        style={{ "--cluster-w": `${BOX_W[picks.length - 1]}px` } as React.CSSProperties}
      />
      <Stickers className="f-stickers f-cluster--compact" spots={[spot(picks[0], 0, 25, 72, -10)]} />
    </>
  );
}

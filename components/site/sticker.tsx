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
export function Sticker({ name, x, y, w, h, r, z, base }: StickerSpot & { z?: number; base?: number }) {
  const u = (v: number) => (base ? `${((v / base) * 100).toFixed(4)}cqw` : v);
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
}: {
  spots: StickerSpot[];
  className?: string;
  base?: number;
}) {
  return (
    <div className={className} aria-hidden="true" style={base ? { containerType: "inline-size" } : undefined}>
      {spots.map((s, i) => (
        <Sticker key={`${s.name}-${i}`} {...s} z={i + 2} base={base} />
      ))}
    </div>
  );
}

// Illustrated number tiles: the blank tile artwork (cycling its colours) with
// the numerals set in Comico, so every number reads the same.
const BLANKS = ["yellow", "lilac", "mint", "peach"] as const;

export function NumberTile({ n }: { n: number }) {
  const label = String(n).padStart(2, "0");
  return (
    <span className="f-tile" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brand/numbers/tile-${BLANKS[(((n - 1) % 4) + 4) % 4]}.svg`} alt="" draggable={false} />
      <span className="f-tile__n">{label}</span>
    </span>
  );
}

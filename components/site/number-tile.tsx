// Illustrated number tiles. 01–09 are the supplied artwork; from 10 the blank
// tile artwork is reused (cycling its colours) with the numerals set in Comico.
const BLANKS = ["yellow", "lilac", "mint", "peach"] as const;

export function NumberTile({ n }: { n: number }) {
  const label = String(n).padStart(2, "0");
  if (n >= 1 && n <= 9) {
    return (
      <span className="f-tile" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/brand/numbers/${label}.svg`} alt="" draggable={false} />
      </span>
    );
  }
  return (
    <span className="f-tile" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brand/numbers/tile-${BLANKS[(n - 10 + 4) % 4]}.svg`} alt="" draggable={false} />
      <span className="f-tile__n">{label}</span>
    </span>
  );
}

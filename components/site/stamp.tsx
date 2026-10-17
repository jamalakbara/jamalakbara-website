// Supplied blue logo stamp (logo_stamp.svg), unchanged artwork.
// `loop` = hero 3-second press-and-settle loop (static under reduced motion).
export function Stamp({ size = 44, loop = false }: { size?: number; loop?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/stamp.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={loop ? "f-stamp f-stamp--loop" : "f-stamp"}
      draggable={false}
    />
  );
}

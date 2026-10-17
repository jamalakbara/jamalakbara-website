// Folder = 12px lead-in + 36px tab rail + paper body. The tab can sit at an
// offset (canvas: 0 / 180 / 360 desktop, 0 / 88 / 176 mobile); the body's
// top-left corner is square only when the tab sits flush left.
export function Folder({
  tab,
  n,
  offset = [0, 0],
  id,
  bodyClassName = "",
  bodyStyle,
  children,
  labelledBy,
}: {
  tab: string;
  n: string;
  offset?: [desktop: number, mobile: number];
  id?: string;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const flush = offset[0] === 0;
  return (
    <section className="f-folder" id={id} aria-labelledby={labelledBy}>
      <div className="f-tabrail">
        {!flush && (
          <span
            className="f-tab-offset"
            style={{ "--od": `${offset[0]}px`, "--om": `${offset[1]}px` } as React.CSSProperties}
            aria-hidden="true"
          />
        )}
        <div className="f-tab">
          <span className="f-tabtext">{tab}</span>
          <span className="f-tab__n">{n}</span>
        </div>
      </div>
      <div className={`f-folder__body${flush ? " f-folder__body--flush" : ""} ${bodyClassName}`} style={bodyStyle}>
        {children}
      </div>
    </section>
  );
}

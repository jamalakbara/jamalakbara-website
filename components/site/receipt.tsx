import { ArrowUpRight } from "@/components/site/icons";

// Services receipt (canvas "About / Perforated receipt paper"). Copy is the
// approved canvas copy; perforation (35 dashes), barcode (57 bars, every 4th
// is 3px) and the 6px zig-zag torn edges reproduce the canvas geometry.

const ENTRIES = [
  ["01  WEB APP DEVELOPMENT", "Fast, useful apps for the browser."],
  ["02  MOBILE APP DEVELOPMENT", "iOS & Android, from one codebase."],
  ["03  DESKTOP APP DEVELOPMENT", "Apps that live on your computer."],
  ["04  UI/UX DESIGN", "Layouts & interfaces that are easy to use."],
] as const;

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
  return (
    <div className="f-receipt">
      <Edge d={TOP} />
      <div className="f-receipt__body">
        <p className="f-receipt__name">JAMAL AKBAR ALAM</p>
        <p className="f-receipt__sub">{"SERVICES MENU\nDESIGN · DEVELOPMENT · SHIP"}</p>
        <Perf />
        <div className="f-receipt__pair f-meta">
          <span>WHAT I CAN DO</span>
          <span>FOR YOU</span>
        </div>
        <ul style={{ display: "contents", listStyle: "none" }}>
          {ENTRIES.map(([h, d]) => (
            <li key={h} className="f-receipt__entry f-meta">
              <span className="f-receipt__entry-h">
                {h}
                <ArrowUpRight size={14} />
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <Perf />
        <div className="f-receipt__pair f-receipt__total">
          <span>LET’S BUILD</span>
          <span>TOGETHER</span>
        </div>
        <div className="f-receipt__pair f-meta">
          <span>SCOPE</span>
          <span>TAILORED TO YOU</span>
        </div>
        <div className="f-receipt__pair f-receipt__approach">
          <span>MADE WITH</span>
          <span>CARE</span>
        </div>
        <div className="f-barcode" aria-hidden="true">
          {Array.from({ length: 57 }, (_, i) => (
            <i key={i} className={i % 4 === 0 ? "w" : undefined} />
          ))}
        </div>
        <p className="f-receipt__foot">{"HAVE A PROJECT IN MIND?\nLET’S MAKE IT USEFUL."}</p>
      </div>
      <Edge d={BOTTOM} />
    </div>
  );
}

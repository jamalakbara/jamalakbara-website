import { Sticker } from "@/components/site/sticker";

// Canvas "Empty state" (17A / 15A / 20): message + Kopi Susu on a surface stage.
export function EmptyState({
  label,
  heading,
  body,
  actions,
  bordered = true,
  headingAs = "h2",
}: {
  label: string;
  heading: string;
  body: string;
  actions?: React.ReactNode;
  bordered?: boolean;
  headingAs?: "h1" | "h2";
}) {
  const H = headingAs;
  return (
    <div className={bordered ? "f-empty f-empty--bordered" : "f-empty f-empty--page"}>
      <div className="f-empty__msg" style={{ gap: bordered ? 16 : 20 }}>
        <span className={bordered ? "f-tabtext" : "f-tabtext f-muted"}>{label}</span>
        <H className={bordered ? "f-empty__h" : "f-display f-display--caps f-pre"} style={bordered ? undefined : { lineHeight: 1.49 }}>
          {heading}
        </H>
        <p className="f-body" style={bordered ? undefined : { color: "var(--f-muted)", fontSize: 18, lineHeight: 1.49 }}>
          {body}
        </p>
        {actions && (
          <div
            className="f-empty__actions"
            style={bordered ? { paddingTop: 8 } : { flexDirection: "column", alignItems: "flex-start", gap: 20, alignSelf: "stretch" }}
          >
            {actions}
          </div>
        )}
      </div>
      <div className="f-empty__stage" aria-hidden="true">
        <span className="f-empty__sticker">
          <Sticker name="kopi-susu" x={21.951} y={0} w={103.818} h={210} r={6} />
        </span>
      </div>
    </div>
  );
}

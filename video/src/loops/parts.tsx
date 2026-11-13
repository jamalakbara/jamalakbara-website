import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

/** Aurora shell (`.f-shell`): the 160° gradient, breathing once per loop. */
export const Aurora: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.sin((frame / durationInFrames) * Math.PI * 2);
  const [blue, lilac, mint, peach] = C.aurora;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(160deg, ${blue}, ${lilac} 35%, ${mint} 65%, ${peach})`,
        backgroundSize: "140% 140%",
        backgroundPosition: `${50 + t * 30}% ${50 - t * 30}%`,
      }}
    />
  );
};

/** Folder chrome in canvas px (`components/site/folder.tsx`); multiply by the loop's unit. */
export const FOLDER = { leadIn: 12, tab: 36, inset: 16, gap: 12 };

/** Folder: lead-in, flush-left tab, paper body; content is square-edged. */
export const Folder: React.FC<{
  tab: string;
  /** canvas px → video px */
  u: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}> = ({ tab, u, style, children }) => (
  <div style={{ position: "absolute", paddingTop: FOLDER.leadIn * u, display: "flex", flexDirection: "column", ...style }}>
    <div
      style={{
        alignSelf: "flex-start",
        height: FOLDER.tab * u,
        flexShrink: 0,
        padding: `0 ${16 * u}px`,
        display: "flex",
        alignItems: "center",
        borderRadius: `${10 * u}px ${10 * u}px 0 0`,
        backgroundColor: C.paper,
        color: C.ink,
      }}
    >
      <span style={{ fontFamily: FONT.display, fontSize: 12 * u, lineHeight: 1.49 }}>{tab}</span>
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: FOLDER.inset * u,
        backgroundColor: C.paper,
        borderRadius: 12 * u,
        borderTopLeftRadius: 0,
        display: "flex",
      }}
    >
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>{children}</div>
    </div>
  </div>
);

import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, clamp } from "../theme";
import { Aurora, FOLDER, Folder } from "./parts";

// Seamless, text-free loop for a /work row's first media slot. Working Folder
// styling from jamalakbara.pen: aurora shell, paper folders with tabs, real
// screenshots or recordings only, text kept outside the media, quiet motion.
//
// The row crops the video with object-fit: cover into a different slot on
// desktop and on mobile, so the folders sit inside `safeBox`, the area both
// crops keep.

/** A full-page capture that scrolls between section stops. */
export type PageMedia = {
  kind: "page";
  src: string;
  /** CSS size of the captured page (the image may be @1.5x) */
  w: number;
  h: number;
  /** section tops in page CSS px (after any cut); the loop rests on each, then glides back to the top */
  stops: number[];
  /** a band [from, to] in page CSS px to skip, e.g. a section that renders blank in captures */
  cut?: [number, number];
};

/** A screen recording, cropped below the browser bar and crossfaded at the seam. */
export type RecordingMedia = {
  kind: "recording";
  src: string;
  /** fraction of the recording's height taken by browser chrome */
  cropTop: number;
  aspect: number;
};

export type Slot = { w: number; h: number };

// Folder tabs name the device (DESKTOP / MOBILE); the brand is already in the row heading.
export type LoopProps = {
  desktop: PageMedia | RecordingMedia;
  mobile?: PageMedia;
  /** first media slot at 1440 and at 390 (measured on /work) */
  slots: { desktop: Slot; mobile: Slot };
};

export const LOOP_FPS = 30;
export const LOOP_DURATION = 10 * LOOP_FPS;
const SEAM = 15;

/**
 * Canvas size for a loop: aspect between both slots, ~2.6× the desktop slot,
 * at most 1600 wide. Both sides snap to multiples of 16 (the H.264 macroblock):
 * at 1600×798 Chrome's hardware decoder flashed tiled, shrunken copies of the
 * frame on macOS.
 */
export function loopSize(slots: LoopProps["slots"]) {
  const a = Math.sqrt((slots.desktop.w / slots.desktop.h) * (slots.mobile.w / slots.mobile.h));
  const snap = (v: number) => Math.round(v / 16) * 16;
  const width = snap(Math.min(slots.desktop.w * 2.6, 1600));
  return { width, height: snap(width / a) };
}

/** Intersection of the centred cover-crops for both slot aspects. */
function safeBox(W: number, H: number, slots: LoopProps["slots"]) {
  let w = W;
  let h = H;
  for (const s of [slots.desktop, slots.mobile]) {
    const a = s.w / s.h;
    if (a > W / H) h = Math.min(h, W / a);
    else w = Math.min(w, H * a);
  }
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

/** Scroll position (page px) at frame f: rest for `hold` of each segment, then glide. */
function scrollAt(f: number, total: number, stops: number[], hold: number) {
  const seg = total / stops.length;
  const input = stops.flatMap((_, i) => [i * seg, i * seg + seg * hold]).concat(total);
  const output = stops.flatMap((s) => [s, s]).concat(0);
  return interpolate(f, input, output, { ...clamp, easing: EASE_IN_OUT });
}

const Page: React.FC<{ media: PageMedia; width: number; height: number; hold: number }> = ({ media, width, height, hold }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = width / media.w;
  const [from, to] = media.cut ?? [media.h, media.h];
  const max = (media.h - (to - from)) * scale - height;
  const y = Math.min(scrollAt(frame, durationInFrames, media.stops, hold) * scale, max);
  const img = <Img src={staticFile(media.src)} style={{ width, display: "block" }} />;
  return (
    <div style={{ translate: `0px ${-y}px` }}>
      <div style={{ height: from * scale, overflow: "hidden" }}>{img}</div>
      {media.cut && <div style={{ height: (media.h - to) * scale, overflow: "hidden" }}><div style={{ marginTop: -to * scale }}>{img}</div></div>}
    </div>
  );
};

const Recording: React.FC<{ media: RecordingMedia; width: number; height: number }> = ({ media, width, height }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Cover the folder with the recording minus its browser bar.
  const shown = 1 - media.cropTop;
  const vh = Math.max(width / media.aspect, height / shown);
  const vw = vh * media.aspect;
  const style: React.CSSProperties = {
    position: "absolute",
    width: vw,
    height: vh,
    left: (width - vw) / 2,
    top: -media.cropTop * vh + (height - shown * vh) / 2,
  };
  // The main layer starts SEAM frames in; over the last SEAM frames the
  // source's opening fades in on top, so the last frame flows into frame 0.
  const tail = durationInFrames - SEAM;
  return (
    <>
      <Video src={staticFile(media.src)} trimBefore={SEAM} muted style={style} />
      <Sequence from={tail} layout="none">
        <Video
          src={staticFile(media.src)}
          muted
          style={{ ...style, opacity: interpolate(frame, [tail, durationInFrames], [0, 1], clamp) }}
        />
      </Sequence>
    </>
  );
};

export const ProjectLoop: React.FC<LoopProps> = ({ desktop, mobile, slots }) => {
  const { width: W, height: H } = useVideoConfig();
  // Canvas px → video px: the desktop slot shows the video at W / slot width.
  const u = W / slots.desktop.w;
  const box = safeBox(W, H, slots);
  const pad = Math.min(box.w, box.h) * 0.05;
  const gap = FOLDER.gap * u;
  const inner = box.w - pad * 2;
  const top = box.y + pad;
  const height = box.h - pad * 2;
  const chrome = (FOLDER.leadIn + FOLDER.tab + FOLDER.inset * 2) * u;
  const viewH = height - chrome;
  const side = FOLDER.inset * 2 * u;
  // A lone recording keeps its own shape (whole page visible), centred.
  const fit = desktop.kind === "recording" && !mobile ? viewH * (desktop.aspect / (1 - desktop.cropTop)) + side : inner;
  const dW = mobile ? (inner - gap) / 1.3 : Math.min(inner, fit);
  const mW = inner - gap - dW;
  const left = box.x + pad + (mobile ? 0 : (inner - dW) / 2);

  return (
    <AbsoluteFill>
      <Aurora />
      <Folder tab="DESKTOP" u={u} style={{ left, top, width: dW, height }}>
        {desktop.kind === "page" ? (
          <Page media={desktop} width={dW - side} height={viewH} hold={0.3} />
        ) : (
          <Recording media={desktop} width={dW - side} height={viewH} />
        )}
      </Folder>
      {mobile && (
        <Folder tab="MOBILE" u={u} style={{ left: box.x + pad + dW + gap, top, width: mW, height }}>
          <Page media={mobile} width={mW - side} height={viewH} hold={0.6} />
        </Folder>
      )}
    </AbsoluteFill>
  );
};

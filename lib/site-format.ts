import React from "react";

// Presentation helpers for the Working Folder pages (display-only; content is untouched).

/** "E-Commerce Development" → "E-commerce development" (canvas sentence case). */
export function sentenceCase(s: string): string {
  const lower = s.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** 7 → "07" */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Break a heading the way the canvas does: after each sentence ("Got an
 * idea?⏎Let's talk."), or balanced over two lines for one long sentence.
 * The space is kept before each <br/> so the heading's text content is unchanged.
 */
export function sentenceLines(text: string): React.ReactNode {
  let parts = text.split(/(?<=[.?!])\s+(?=\S)/);
  if (parts.length < 2) {
    // single sentence: balance it over two lines (canvas: "NOTES FROM / THE BUILD.")
    const words = text.split(/\s+/);
    if (text.length <= 18 || words.length < 3) return text;
    let best = 1;
    for (let i = 1; i < words.length; i++) {
      const left = words.slice(0, i).join(" ").length;
      const prev = words.slice(0, best).join(" ").length;
      if (Math.abs(text.length / 2 - left) < Math.abs(text.length / 2 - prev)) best = i;
    }
    parts = [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  }
  return parts.flatMap((p, i) => (i === 0 ? [p] : [" ", React.createElement("br", { key: i }), p]));
}

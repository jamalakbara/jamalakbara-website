import localFont from "next/font/local";

// Working Folder type (public site). Fontshare faces, self-hosted + subset.
// Comico is subset to the hero-name glyphs + digits (identity + number tiles only).
const tanker = localFont({
  src: "../app/fonts/Tanker-400.woff2",
  variable: "--font-tanker",
  weight: "400",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

const erode = localFont({
  src: "../app/fonts/Erode-400.woff2",
  variable: "--font-erode",
  weight: "400",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const comico = localFont({
  src: "../app/fonts/Comico-400.woff2",
  variable: "--font-comico",
  weight: "400",
  display: "swap",
  fallback: ["Comic Sans MS", "cursive"],
});

/** Font variables for a root layout's <body>. */
export const fontClasses = `${tanker.variable} ${erode.variable} ${comico.variable} antialiased`;

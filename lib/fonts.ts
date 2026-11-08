import { Fraunces, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

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
export const fontClasses = `${spaceGrotesk.variable} ${fraunces.variable} ${tanker.variable} ${erode.variable} ${comico.variable} antialiased`;

import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Working Folder v2 tokens (app/folder-tokens.css, docs/design/jamalakbara.pen).
export const C = {
  paper: "#F8F6F0",
  ink: "#201E19",
  aurora: ["#AFBDE2", "#CDC1DD", "#BFD4C8", "#DDC9B8"],
};

export const FONT = {
  display: "Tanker",
  body: "Erode",
};

loadFont({ family: FONT.display, url: staticFile("Tanker-400.woff2"), weight: "400" });
loadFont({ family: FONT.body, url: staticFile("Erode-400.woff2"), weight: "400" });

export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

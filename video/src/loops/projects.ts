import type { LoopProps } from "./ProjectLoop";

// One entry per /work row with a loop. A row with a
// video shows only that video, in the single wide slot (measured on /work at
// 1440 and 390 wide). Captures live in public/<id>/ (desktop at 1440 CSS px,
// mobile at 390 CSS px @1.5x).
const WIDE_SLOT = { desktop: { w: 920, h: 360 }, mobile: { w: 346, h: 220 } };

export const LOOPS: Record<string, LoopProps> = {
  withavelle: {
    slots: WIDE_SLOT,
    // Desktop cuts the Editor's Picks band, which renders blank in captures.
    desktop: { kind: "page", src: "withavelle/desktop.jpg", w: 1440, h: 4099, cut: [2190, 3290], stops: [0, 900, 1600, 2000] },
    mobile: { kind: "page", src: "withavelle/mobile.jpg", w: 390, h: 3704, stops: [0, 936, 1627, 2203] },
  },
  adana: {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "adana/full.png", w: 1440, h: 5972, stops: [0, 1100, 1960, 3200, 4300] },
    mobile: { kind: "page", src: "adana/mobile-full.jpg", w: 390, h: 6301, stops: [0, 1000, 2100, 3400, 4500] },
  },
  duma: {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "duma/desktop.jpg", w: 1440, h: 5469, stops: [0, 870, 1463, 2311, 3328] },
    mobile: { kind: "page", src: "duma/mobile.jpg", w: 390, h: 3789, stops: [0, 736, 1296, 1723, 2210] },
  },
  // sonderlab.co is offline (Nov 2026), so this uses the store's own earlier
  // desktop screen recording with the Safari bar cropped off. No mobile folder:
  // there is no real mobile source (Wayback snapshots lack its media and CSS). Not in git (20 MB):
  // curl -o public/sonderlab/recording.mp4 https://res.cloudinary.com/dh0spkwh3/video/upload/v1768708989/sonderlab_w9ag7c.mp4
  sonderlab: {
    slots: WIDE_SLOT,
    desktop: { kind: "recording", src: "sonderlab/recording.mp4", cropTop: 0.082, aspect: 1.6 },
  },
  "rawtype-riot": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "rawtype-riot/desktop.jpg", w: 1440, h: 2740, stops: [0, 806, 1765] },
    mobile: { kind: "page", src: "rawtype-riot/mobile.jpg", w: 390, h: 1841, stops: [0, 849, 1076] },
  },
  // nawaclo.com's homepage is a single hero, so this scrolls its all-products page.
  nawaclo: {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "nawaclo/desktop.jpg", w: 1440, h: 3067, stops: [0, 655, 1089, 1523, 1975] },
    mobile: { kind: "page", src: "nawaclo/mobile.jpg", w: 390, h: 4604, stops: [0, 902, 1617, 2296, 2993] },
  },
  "lakon-indonesia": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "lakon-indonesia/desktop.jpg", w: 1440, h: 4194, stops: [0, 1255, 1760, 2453, 2967] },
    mobile: { kind: "page", src: "lakon-indonesia/mobile.jpg", w: 390, h: 2079, stops: [0, 476, 819, 1200] },
  },
  combo: {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "combo/desktop.jpg", w: 1440, h: 8596, stops: [0, 1632, 2531, 3663, 4729] },
    mobile: { kind: "page", src: "combo/mobile.jpg", w: 390, h: 9596, stops: [0, 1300, 2116, 3769, 4864] },
  },
  // Cuts the scroll-animated band under "Performance Marketing Reports", which renders blank in captures.
  "base-data-dashboard": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "base-data-dashboard/desktop.jpg", w: 1440, h: 5321, cut: [1500, 2190], stops: [0, 1320, 2208, 3202] },
    mobile: { kind: "page", src: "base-data-dashboard/mobile.jpg", w: 390, h: 6347, cut: [1702, 3108], stops: [0, 1085, 1764, 2294, 3232] },
  },
  "bions-bni": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "bions-bni/desktop.jpg", w: 1440, h: 3683, stops: [0, 800, 1173, 1945] },
    mobile: { kind: "page", src: "bions-bni/mobile.jpg", w: 390, h: 5085, stops: [0, 964, 1613, 2754] },
  },
  "green-rebel-foods": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "green-rebel-foods/desktop.jpg", w: 1440, h: 6649, stops: [0, 800, 1393, 2038, 2967] },
    mobile: { kind: "page", src: "green-rebel-foods/mobile.jpg", w: 390, h: 8342, stops: [0, 1106, 1854, 3025, 4749] },
  },
  // The mobile page overflows to 402 CSS px wide.
  "aza-wear": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "aza-wear/desktop.jpg", w: 1440, h: 5290, stops: [0, 758, 1312, 1845, 2870] },
    mobile: { kind: "page", src: "aza-wear/mobile.jpg", w: 402, h: 7946, stops: [0, 758, 1237, 2273, 3340] },
  },
  "state-medical-equipment": {
    slots: WIDE_SLOT,
    desktop: { kind: "page", src: "state-medical-equipment/desktop.jpg", w: 1440, h: 5144, stops: [0, 870, 1400, 2580, 3140] },
    mobile: { kind: "page", src: "state-medical-equipment/mobile.jpg", w: 390, h: 9756, stops: [0, 549, 1098, 2310, 5075] },
  },
};

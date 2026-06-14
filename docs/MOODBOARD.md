# Moodboard — jamalakbara.

**Last updated:** 2026-06-14
Visual direction reference. Text + swatches + links (markdown only — no generated image collages). Pairs with `docs/DESIGN_SYSTEM.md` (exact tokens) and `docs/BRAND_GUIDELINES.md` (identity).

---

## 1. Direction in one line
**Cinematic warm-dark.** A filmic, glassmorphic portfolio: near-black warm canvas, looping background video under grain + vignette, cream typography, one warm-orange accent, motion that has weight and settles.

**Keywords:** cinematic · warm-dark · filmic grain · glassmorphism · editorial typography · slow & weighted motion · Indonesian-grounded · premium-minimal.

---

## 2. Color mood

| Swatch | Hex | Feeling / role |
| --- | --- | --- |
| ⬛ | `#0c0908` | Warm near-black — the room lights are off; everything sits on this. |
| ⬜ | `#f4ede3` | Warm cream — paper-like text, never pure white. |
| 🟫 | `#d8cdbf` / `#b3a596` / `#a99c8d` / `#7d7163` | Muted sand ramp — quiet hierarchy, captions, borders. |
| 🟧 | `#e0875a` | Warm orange — the single spark: links, focus, highlights. |
| 🟧 | `#eab38a` | Lighter orange — hover glow only. |
| 🟩 | `#6ee787` | Status green — "available" pulse, functional not decorative. |

**Mood:** candle-lit, analog warmth, never cold blue. Selection highlight is translucent orange (`rgba(224,135,91,0.3)`).

---

## 3. Typography mood
- **Inter**, everything. Editorial impact comes from **size + tight tracking**, not from a display face.
- Headlines feel large and confident with negative letter-spacing (`-0.035em` to `-0.045em`) and near-1.0 line-height.
- Body is calm and readable (~1.55–1.65 line-height), muted tone.
- Eyebrows/labels: small, uppercase, wide tracking (`0.18em`), weight 500.

Sample feel:
```
SELECTED WORK            ← eyebrow: small, uppercase, wide-tracked
Building fast, thoughtful ← H1: huge, tight, cream
products for the web.
I'm Akbar — a developer & ← intro: muted cream, relaxed
designer from Bandung…
```

---

## 4. Texture & surface mood
- **Film grain**: `public/noise.png` overlaid site-wide — removes digital flatness.
- **Vignette**: edges fall off into the dark to focus the center, like a film frame.
- **Liquid-glass**: translucent panels (`rgba(246,243,240,0.04)`) with a hairline rim catch-light and stacked soft shadows — surfaces feel lit, not blurred.
- **Background video**: a different looping clip per route, crossfading on navigation — the site breathes and never feels static.

---

## 5. Motion mood
- **Entrances** (`blurFadeUp`): elements rise 40px from blur into focus over ~1s, staggered — content "develops" like film.
- **Pulse** (`softPulse`): the availability dot breathes (scale 1 → 0.7, opacity 1 → 0.35).
- **Cursor preview**: project media floats to the cursor on a spring with velocity-driven tilt — playful, physical, Awwwards-style.
- **Press**: buttons/glass press down to `scale(0.95)` then spring back (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — tactile.
- Overall tempo: unhurried, weighted, everything settles. Honors `prefers-reduced-motion`.

---

## 6. Reference touchstones (aesthetic, not literal)
- Awwwards "creative developer" portfolios: full-bleed video, oversized type, custom cursor.
- Film color grading: warm shadows, crushed-but-warm blacks, single accent pop.
- Editorial print: generous whitespace (here, dark-space), wide-tracked eyebrows, restrained palette.
- Apple-style glass UI: rim light + soft shadow stack rather than heavy blur.

---

## 7. In-repo references
- Background video crossfade + grain/vignette: `components/portfolio-shell.tsx`
- Glass surfaces, keyframes, hover states: `app/globals.css` (`.liquid-glass`, `blurFadeUp`, `softPulse`)
- Cursor-follow preview: `components/work-preview.tsx`
- Grain texture: `public/noise.png`
- Share/preview imagery: `public/og-image.jpg`, `public/screenshot-desktop.png`
- Background clips (Cloudinary `dh0spkwh3`): `bg-home`, `bg-work`, `bg-about`, `bg-contact`

# Design System — jamalakbara.

**Last updated:** 2026-06-14 (fonts updated: Inter → Space Grotesk + Fraunces italic)
Technical styling spec. Source of truth: `app/globals.css` (tokens + classes) and inline styles in page components. Tailwind v4 has **no config file** — the theme is CSS custom properties.

---

## 1. Color tokens (`:root` in `app/globals.css`)

| Token | Hex | Role |
| --- | --- | --- |
| `--bg` | `#0c0908` | Page background — warm near-black |
| `--ink` | `#f4ede3` | Primary text — warm cream |
| `--m1` | `#d8cdbf` | Muted ramp 1 (brightest) |
| `--m2` | `#b3a596` | Muted ramp 2 |
| `--m3` | `#a99c8d` | Muted ramp 3 |
| `--m4` | `#7d7163` | Muted ramp 4 (placeholders, faint) |
| `--accent` | `#e0875a` | Warm orange — links, focus, active |
| `--accent-hi` | `#eab38a` | Hover orange |
| `--green` | `#6ee787` | Availability / status only |

**Functional rgba values used inline / in classes:**
- Selection: `background: rgba(224,135,91,0.3)`, `color: #fff`
- Glass fill: `rgba(246,243,240,0.04)` → hover `0.07`; rim light `rgba(246,243,240,0.08)`
- Glass border: `rgba(246,243,240,0.04)` → hover `0.10`; focus outline `rgba(246,243,240,0.24)`
- Shadow base: `rgba(1,0,8, …)` (deep warm-black)
- Work-row hover bg: `rgba(255,244,232,0.04)`
- Field bg: `rgba(255,250,244,0.02)` → focus `0.04`; field border `rgba(255,244,232,0.12)`
- `btn-solid` hover bg: `#fff`

Single dark theme. No light variant ships (`next-themes` installed but no toggle).

---

## 2. Typography

**Primary — Space Grotesk** via `next/font/google` (variable `--font-space-grotesk`), weights **300 / 400 / 500**, `display: swap`. Stack: `var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif`. Used for all headlines, body, nav, and UI elements.

**Accent — Fraunces** via `next/font/google` (variable `--font-fraunces`), weights **300 / 400**, `style: italic` only, `display: swap`. Stack: `var(--font-fraunces), Georgia, serif`. Used exclusively for eyebrow labels (the small `— Section` markers above each page heading).

**Scale** (from page inline styles; `clamp(min, fluid, max)`):

| Element | Font | Size | Weight | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- | --- |
| Eyebrow / label | Fraunces italic | `0.9rem` | 400 | — | `0.03em` |
| Status row (home) | Space Grotesk | `clamp(0.8rem, 1.5vw, 0.95rem)` | 500 | — | — |
| H1 — hero | Space Grotesk | `clamp(2.2rem, 6.5vw, 5rem)` | 400 | 1.02 | `-0.045em` |
| H2 — section (about) | Space Grotesk | `clamp(1.7rem, 3.5vw, 2.6rem)` | 400 | — | `-0.035em` |
| Intro paragraph | Space Grotesk | `clamp(1rem, 2vw, 1.25rem)` | 400 | 1.55 | — |
| Body (about) | Space Grotesk | `clamp(0.95rem, 1.6vw, 1.1rem)` | 400 | 1.65 | — |
| Buttons / CTA | Space Grotesk | `0.95rem` | 500 | — | — |
| Field input | Space Grotesk | `0.9rem` | 400 | — | — |
| Skill chip | Space Grotesk | `0.85rem` | — | — | — |
| Small / range | Space Grotesk | `0.8rem` | 400 | 1.6 | `0.02em` |

Headlines rely on **size + negative tracking** for impact at weight 400. Eyebrow labels use Fraunces italic (no uppercase, tighter tracking) to create a cinematic editorial contrast against the Space Grotesk headlines.

---

## 3. Radius, spacing, layout

**Border radius**
| Use | Value |
| --- | --- |
| Pills, glass, chips, buttons | `9999px` |
| Form inputs | `0.6rem` |
| Portrait / image container | `18px` |

**Spacing** — fluid `clamp()` throughout:
- Inline gaps `clamp(0.75rem, 2vw, 1.5rem)`; section gaps `clamp(2rem, 5vw, 4.5rem)`
- Button padding `0.8rem clamp(1.5rem, 3vw, 2rem)`; field padding `0.7rem 0.85rem`; chip gap `0.6rem`

**Breakpoints** (match `app/globals.css` exactly):
| Width | Effect |
| --- | --- |
| `min-width: 1024px` | desktop nav shown, hamburger + mobile menu hidden |
| `min-width: 720px` | work category column (`.work-cat`) visible |
| `max-width: 880px` | `.two-col` → column; `.about-portrait` full width (max 320px); `.home-row` stacks |
| `max-width: 639px` | `.nav-actions` hidden |

**Z-index layering** (`components/portfolio-shell.tsx`): video `z0` → grain/vignette overlays `z1` → scrim `z2` → bottom blur mask `z3` → navbar `z50`.

---

## 4. Component patterns

### `.liquid-glass` (the signature surface)
```css
background: rgba(246, 243, 240, 0.04);
border: 1px solid rgba(246, 243, 240, 0.04);
box-shadow:
  inset 0 1px 0 0 rgba(246, 243, 240, 0.08),  /* top rim catch-light */
  0 24px 80px 0 rgba(1, 0, 8, 0.08),
  0 12px 40px 0 rgba(1, 0, 8, 0.12),
  0 4px 12px 0 rgba(1, 0, 8, 0.16),
  0 1px 1px 0 rgba(1, 0, 8, 0.2);
color: rgba(246, 243, 240, 0.88);
transition: background-color .3s, border-color .3s, box-shadow .3s, color .3s,
            transform .35s cubic-bezier(0.34, 1.56, 0.64, 1);
```
- Hover: fill `0.07`, border `0.10`, color → `--ink`.
- Focus-visible: `outline: 1px solid rgba(246,243,240,0.24); outline-offset: 2px`.
- Anchors must be `inline-flex` (`a.liquid-glass`) or transforms are ignored.
- No heavy backdrop blur — the shape reads from rim light + shadow stack only.

### `.btn-solid`
Solid light fill, dark text; hover → `#fff` + `translateY(-2px)`; active → `scale(0.95)` (combined `translateY(-2px) scale(0.95)` while hovering).

### Tactile press (scoped to `a`/`button`)
`a.liquid-glass:active, button.liquid-glass:active { transform: scale(0.95); transition-duration: 0.08s; }` — quick press-down, springy release. The contact `<form>` and success `<div>` (also `.liquid-glass`) are deliberately excluded.

### `.field-input`
Faint fill + hairline border, radius `0.6rem`, placeholder `--m4`; focus → border `--accent`, fill `rgba(255,250,244,0.04)`.

### `.work-row`
`transition: padding-left .35s, background .35s`. Hover → `padding-left: 1.25rem`, bg `rgba(255,244,232,0.04)`, title → `--accent-hi`, arrow fades/slides in (`translateX(-8px) → 0`).

### Nav / links
`.nav-link:hover → --ink`; `.menu-link:hover` glass-tint bg + `--ink`; `.email-link:hover → --accent-hi`; `.back-link:hover → --ink`.

### Work preview (`components/work-preview.tsx`)
Floating 4:3 media that follows the cursor via Framer Motion spring + velocity-driven tilt, with the film overlay. Hover-capable devices only (media-query gated).

---

## 5. Motion / keyframes

```css
@keyframes blurFadeUp {  /* staggered entrance */
  from { opacity: 0; filter: blur(20px); transform: translateY(40px); }
  to   { opacity: 1; filter: blur(0);    transform: translateY(0); }
}
.animate-blur-fade-up { opacity: 1; animation: blurFadeUp 1s ease-out backwards; }
/* `backwards` (not `forwards`) so finished anim doesn't pin transform over :hover/:active */

@keyframes softPulse {  /* availability dot */
  0%, 100% { opacity: 1;    transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.7); }
}
```
- Stagger entrances with delays (~300–800ms).
- Spring timing function for tactile elements: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Component animation uses **Framer Motion**; GSAP/Lenis/R3F are installed for roadmap motion (see `docs/PRD.md`).

---

## 6. Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .animate-blur-fade-up { opacity: 1 !important; }
}
```
- All entrance/loop animations collapse under reduced-motion; content stays fully visible.
- Glass elements expose `:focus-visible` outlines.

---

## 7. Media & assets
- Background videos + project media: Cloudinary (cloud `dh0spkwh3`, `q_auto,f_auto`) via `lib/cloudinary.ts`. Per-route bg clips: `bg-home`, `bg-work`, `bg-about`, `bg-contact`.
- Local: `public/noise.png` (grain), `favicon.ico`, `profile-image.png`, OG/Twitter images, `manifest.json`.
- `next.config.ts`: image formats webp/avif; device sizes 640/768/1024/1280/1600; Cloudinary remote pattern.

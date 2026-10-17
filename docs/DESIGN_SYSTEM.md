# Design System — jamalakbara. (Working Folder v2)

**Last updated:** 2026-10-17. This replaces the dark cinematic system (2026-06) on the public site.

**Sources of truth**
- Canvas: Pencil `jamalakbara.pen` (Working Folder v2). Reference frames: Home `QiOko` / `lYF3g`, Work `Pb8Dp` / `vs4kI`, About `BWDyJ` / `U7cNrD`, Contact `qlvWa` / `IWLZT`, Journal `NDBsB` / `b7j55z`, Article `m54Zq` / `c73NeH`, 404 `Y57IP` / `huATr`.
- Designer spec + tokens, copied into the repo: `docs/design/working-folder-canvas-spec.md` and `docs/design/design-tokens.json`.
- Code: `app/(site)/site.css` holds the tokens and component classes. React building blocks live in `components/site/`.

**Scope.** `site.css` is imported only by `app/(site)/layout.tsx` and `app/not-found.tsx`, so `/admin` never loads it. Admin keeps the legacy dark tokens and classes in `app/globals.css` (see §9). Never restyle a shared `globals.css` class for the public site: add an `f-` class in `site.css` instead.

---

## 1. Color tokens (`--f-*`, on `:root` in `site.css`)

| Token | Hex | Role |
| --- | --- | --- |
| `--f-paper` | `#F8F6F0` | Folder panels, navigation |
| `--f-note` | `#FFFEFA` | Receipt and contact note (deliberately distinct from paper) |
| `--f-ink` | `#201E19` | Headings, body, links, icons |
| `--f-muted` | `#6E695F` | Supporting text on paper/note only, and field outlines |
| `--f-surface` | `#E8E3D9` | Secondary buttons, empty-state stage. Use ink text on it, never muted |
| `--f-line` | `#D8D2C8` | Decorative dividers and note outline. Not for text |
| `--f-rule` | `#BDB5A7` | Receipt and skills rules |
| `--f-perf` | `#9F998F` | Receipt perforation |
| `--f-accent` | `#2445DB` | Primary action, email, active indicator, focus ring |
| `--f-hover` | `#1D36AF` | Primary hover / pressed |
| `--f-error` | `#A62929` | Error text and outline (always paired with a message) |
| `--f-success` / `--f-success-wash` | `#456D5B` / `#E3EDE5` | Sent confirmation |
| `--f-white` | `#FFFFFF` | Text and icons on cobalt |
| Aurora | `#AFBDE2` `#CDC1DD` `#BFD4C8` `#DDC9B8` | Shell background only (decorative) |

Measured contrast: ink/paper 15.4:1 · muted/paper 5.05:1 · cobalt/paper 6.6:1 · white/cobalt 7.1:1 · error/paper 6.5:1. Supplied artwork (stickers, number tiles, stamp, photography) keeps its own colours and does not count as palette drift.

## 2. Typography

Fontshare faces, self-hosted with `next/font/local` in `app/layout.tsx`. The files are woff2 subsets in `app/fonts/`.

| Family | Variable | Use | Notes |
| --- | --- | --- | --- |
| **Tanker** 400 | `--font-tanker` → `--f-tanker` | Display, section headings, titles, folder tabs, wordmark | Latin + Latin-1 subset, 12 KB |
| **Erode** 400 | `--font-erode` → `--f-erode` | Body, actions, metadata, nav | Latin + Latin-1 subset, 12 KB |
| **Comico** 400 | `--font-comico` → `--f-comico` | Hero identity "Jamal Akbar Alam" and number-tile digits **only** | Subset to the name glyphs + digits (54 KB). Re-subset if other text needs it |

All faces are weight 400 with normal tracking. Never synthesize bold or italic (`.f-prose strong` stays at weight 400).

| Role | Class | Desktop | Mobile (<768) |
| --- | --- | --- | --- |
| Identity | `.f-identity` | Comico 104 / 1.1 | 46 (two lines) |
| Section / page heading | `.f-display` | Tanker 48 | 32 |
| Project / skill title | `.f-title` | Tanker 20 | 20 |
| Folder tab | `.f-tabtext` | Tanker 12 | 12 |
| Body | `.f-body` | Erode 18 | 16 |
| Action / link | `.f-action` | Erode 16 | 16 |
| Metadata | `.f-meta` | Erode 12 | 12 |
| Contact email | `.f-note__email` | Tanker 30 / 1.2 | 24 |

**Canvas text metrics (important for 1:1 builds).** The canvas sets each line at `size × ratio` and then adds the faces' 0.09 em line gap. That makes every CSS `line-height` the role ratio + 0.09:

| Role ratio | CSS line-height |
| --- | --- |
| 1.4 | 1.49 |
| 1.5 | 1.59 |
| 1.08 | 1.17 |
| 1.2 | 1.29 |

Canvas text boxes also carry 1 px above and below, which the role classes reproduce with `padding-block: 1px`. Auto-width labels carry 1 px of side bearing on each side, so control paddings are 17 / 19 px rather than 16 / 18. Text in Tanker headings uses `.f-display--caps` where the canvas source is uppercase.

**Heading breaks.** `sentenceLines()` in `lib/site-format.ts` breaks headings like the canvas does. A multi-sentence heading breaks after each sentence. A single long sentence is balanced over two lines. A space is kept before each `<br>`, so the heading's text content (and SEO) is unchanged. When a frame needs different breaks at different sizes, use `<br className="f-br-d" />` / `<br className="f-br-m" />` and never duplicate the copy.

## 3. Space, shape, layout

- Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96.
- **Desktop (≥1024, ref 1440):** shell inset 12 (`--f-shell`), panels 1416, panel inset 40 (`--f-inset`), content 1336, nav 76, hero 700.
- **Tablet (768–1023):** stacked compositions, inset 24.
- **Mobile (<768, ref 390):** shell inset 6, panel inset 16, nav 72, hero 620.
- Panels have a 12 px radius at every size. Controls have 4 px. Note and receipt are square. Project images are square-edged.
- **Folders:** 12 px lead-in, then a 36 px tab rail, then the paper body. Tabs are 220 px wide on desktop and 150 px on mobile, with offsets 0 / 180 / 360 (desktop) and 0 / 88 / 176 (mobile). The body's top-left corner is square only when the tab sits flush left. The root gap between panels is 4 px.
- **Reading column:** 640 px max. Article and journal rows use a 400 px left column, a 48 px gap, and a 640 px main column.
- **Sticker fields** (`<Stickers base={…}>`) place stickers with container-query units, so a composition is exact at its canvas width and scales elsewhere. Bases: title panels and article margins 1416, home collage 1336 / 346, mobile title panel 378.

## 4. Components → code

| Canvas component | Code |
| --- | --- |
| Navigation / Desktop (+ active variants), recessed notch | `components/portfolio-shell.tsx` `.f-nav`, `.f-notch`, `.f-navlink[aria-current]` |
| Navigation / Mobile + Mobile / Open | `.f-mnav`, `.f-menu` (modal: `aria-modal`, focus trap, Escape, focus returns to the toggle) |
| Identity / Wordmark | `.f-wordmark` (Tanker 24, white on black tab) |
| Identity / Stamp (static 44, hero 108 / 64 loop) | `components/site/stamp.tsx` (`/brand/stamp.svg`) |
| Folder / Tab, Section / Paper | `components/site/folder.tsx`, `.f-tab`, `.f-folder__body` |
| Page title panel | `components/site/title-panel.tsx` |
| Project / Editorial row (+ media strip A/B/C) | `components/site/project-row.tsx`, number tiles in `number-tile.tsx` |
| Receipt (perforation, barcode, torn edges) | `components/site/receipt.tsx` |
| Contact / Note (copy-email stamp) | `components/site/contact-note.tsx` |
| Contact footer strip | `components/site/contact-strip.tsx` |
| Empty state / 404 stage | `components/site/empty-state.tsx` |
| Journal editorial row | `components/site/journal-index.tsx` |
| Article reading surface | `components/site/article-view.tsx`, `.f-prose` |
| Button primary / secondary / disabled | `.f-btn--primary`, `.f-btn--secondary`, `[disabled]` |
| Link / Editorial (underlined) | `.f-link` (underline bar), `.f-uline` (border variant), `.f-act` (icon + label) |
| Filter chips | `.f-filter[aria-pressed]` |
| Field / Email default · focus · error | `.f-input`, `:focus`, `[aria-invalid="true"]` |
| Icons (hand-drawn set) | `components/site/icons.tsx`: ArrowUpRight, ArrowRight, ArrowUp, ArrowLeft, ArrowDown, MapPin, Loader, Menu, Close, Send, Check |

**Arrow semantics:** down means in-page, up-right means external or "see more", right means go to a page, left means back.

## 5. States & interaction

- Every interactive control has a minimum 48 px target and shows a focus ring of 2 px cobalt at a 2 px offset.
- Hover transitions are 160 ms ease-out with no layout shift. The menu opens and closes in 240 ms.
- Primary hover and pressed use `--f-hover`. Disabled controls drop to 50% opacity. Text links are underlined, not colour-only.
- Copy email: success announces "Copied" through an `aria-live` region without moving layout. On failure the address stays selectable and the mail link remains.
- Forms:
  - Every field has a visible label.
  - Inputs are 52 px tall.
  - An error message sits between the label and its input, linked with `aria-describedby`.
  - Focus moves to the first invalid field, and an error summary sits at the top.

## 6. Motion

- **Aurora** (`components/site/aurora.tsx`): WebGL port of `shaders/folder-aurora.glsl` with `u_motion` 0.6. It renders at 1/8 resolution and 15 fps, pauses when the tab is hidden, and is static under `prefers-reduced-motion`. Without WebGL it falls back to a CSS gradient.
- **Hero stamp:** a 3 s press-and-settle loop (`@keyframes f-stamp-settle`), static under reduced motion.
- **Stickers:** a subtle lift shadow on hover.
- There are no other decorative effects. Paper texture appears only as the grid paper (`.f-grid-paper`) behind the about receipt.

## 7. Assets

| Path | Contents |
| --- | --- |
| `public/brand/stamp.svg` | Logo stamp, vector, unchanged |
| `public/brand/stickers/*.svg` | The 12 supplied stickers, unrotated. Rotation comes from the canvas values |
| `public/brand/numbers/tile-{yellow,lilac,mint,peach}.svg` | Number tiles: every project number is a blank tile (colour cycles from 01) with Comico digits. `01–09.svg` are the original digit artwork, no longer rendered |
| `public/brand/icons/*.svg` | Numbered capability icons (About) |
| `public/brand/akbar-portrait-cobalt.jpg` | Cobalt portrait (`about.profileImage`) |

Vectors were rebuilt from Pencil HTML exports. To refresh an asset, export the frame as `html-css` from Pencil and rebuild it with the same approach (nested `<svg>` per path, positioned from the export). Never ship text rendered as an image.

## 8. Verification recipe (1:1 builds)

1. Export the frame from Pencil as a 1x PNG.
2. Take a full-page screenshot of the route in headless Chrome at 1440 and at 390. The page scrolls inside `.f-scroll`, so set the viewport height to `.f-page`'s `scrollHeight`.
3. Compare the two with `pixelmatch` (threshold 0.15, ignore antialiasing).
4. Treat these as expected differences: CMS copy where the canvas used placeholder copy, real data counts, and canvas render artifacts.
5. Check for horizontal overflow at 320, 390, 768, 1024 and 1440.

## 9. Legacy (admin only)

`app/globals.css` keeps the 2026-06 dark cinematic tokens and classes that `/admin` uses: `--bg`, `--ink`, `--m1…m4`, `--accent`, `.liquid-glass`, `.btn-*`, `.field-input`, `.section-*`, `.journal-prose`, `.nav-link`, `.lang-link`, `.back-link`, and `blurFadeUp`. Space Grotesk and Fraunces are still loaded for admin. The public site does not use any of them.

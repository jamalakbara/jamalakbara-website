# Jamalakbara — Working Folder design system

Version 2.0 · Canonical direction: 14B Working Folder

## Source of truth and scope

- Canvas: `jamalakbara.pen`.
- Approved homepage: `QiOko` (1440 desktop), `lYF3g` (390 mobile).
- System boards: `bi8Au` Brand, `iEg2H` Foundations, `c4dtyu` Components, `IZU7k` Layout.
- Machine-readable values: `design-tokens.json`; canvas variables use `folder-*`.
- This supersedes the original white/Inter/Ember system and the subsequent quiet/expressive cobalt concept. Old `ja-*`, `jc-*` through `jh-*` variables remain for historical screens, not new work.
- Other concept screens and the existing browser prototype have not been comprehensively migrated. Shared component edits may propagate to their instances. Do not use older screenshots or exports as the current specification.

## Brand and identity

Personal, useful and crafted: a working folder, not a corporate template. Preserve the paper panels, folder tabs, recessed navigation, receipt, contact note and supplied sticker collage.

Write in first person. Use concrete verbs and verified outcomes. Preserve the existing email, project names and personal story; never invent metrics or client claims.

### Approved identity

1. Navigation wordmark: `JAMALAKBARA.` in Tanker 400, 24 px on both breakpoints; retain the period. Reuse `yJV72`. Minimum 12 px clear space. No alternate Erode/Inter wordmark.
2. Hero identity: `Jamal Akbar Alam` in Comico 400, 104 px desktop / 46 px mobile. One line desktop; two lines mobile. Do not use Comico for body, buttons or navigation.
3. Mark: supplied blue `logo_stamp.svg` artwork, unchanged colors and proportions. Canonical static 44 px component: `EaXCh`. Contact uses it inside a 48 px copy-email target. Hero uses existing 108 px desktop / 64 px mobile stamp compositions.
4. Color-loop portrait `DijVV` is an earlier exploration, not the current mark. Do not substitute it for the stamp.
5. Client logos, number illustrations and stickers retain their supplied colors. They are not UI palette violations.

## Color tokens

| Canvas variable | Value | Role |
|---|---|---|
| folder-paper | #F8F6F0 | Default folder and navigation surface |
| folder-note | #FFFEFA | Receipt and contact note |
| folder-ink | #201E19 | Headings, body, links, icons |
| folder-muted | #6E695F | Supporting text on paper/note only |
| folder-surface | #E8E3D9 | Secondary controls; use ink text |
| folder-line | #D8D2C8 | Decorative dividers, note outlines |
| folder-accent | #2445DB | Primary action, email emphasis, active indication |
| folder-hover | #1D36AF | Primary hover/pressed |
| folder-focus | #2445DB | Keyboard outline |
| folder-error | #A62929 | Error text plus explicit error message |
| folder-success | #456D5B | Success text plus explicit confirmation |
| folder-white | #FFFFFF | Text/icons on cobalt |

Use semantic tokens, not copied hex values. Note and Paper are intentionally distinct. Do not flatten supplied art into this palette. Aurora colors are decorative only: blue #AFBDE2, lilac #CDC1DD, mint #BFD4C8, peach #DDC9B8.

Measured contrast: ink/paper 15.41:1; muted/paper 5.05:1; cobalt/paper 6.59:1; white/cobalt 7.12:1; error/paper 6.54:1. Muted/surface is only 4.27:1: use Ink on Surface for normal active text. Line is not suitable for text or an essential input boundary. Use Muted for default field outlines.

## Typography

All use weight 400 and normal tracking. Do not synthesize bold or italic variants.

| Role | Family | Desktop | Mobile | Line height |
|---|---|---:|---:|---:|
| Hero identity | Comico | 104 | 46 | 1.1 |
| Navigation wordmark | Tanker | 24 | 24 | 1.4 |
| Section heading | Tanker | 48 | 32 | 1.08 |
| Contact email | Tanker | 30 | 24 | 1.2 |
| Project/skill title | Tanker | 20 | 20 | 1.4 |
| Body/description | Erode | 18 | 16 | 1.5 |
| Action/link | Erode | 16 | 16 | 1.4 |
| Metadata/tab number | Erode | 12 | 12 | 1.4 |
| Folder tab | Tanker | 12 | 12 | 1.4 |

Receipt typography is intentionally compact: 12 px informational rows and service descriptions, 18/16 px total, Tanker 25/21 px name. Body text outside this receipt exception must not fall below 16 px. Long-form pages use a 640 px maximum reading column. Break headings deliberately; let prose wrap naturally.

### Fontshare canvas compatibility

The canvas does not currently recognize the local Tanker, Erode and Comico font names. Visible specimens are 3× PNGs rendered from supplied fonts rather than silently substituted fonts. The hero preserves its existing Comico artwork.

- Fonts: `fonts/Tanker-400.ttf`, `fonts/Erode-400.ttf`, `fonts/Comico-400.ttf`.
- Current generated specimens: `images/system/`. Contact page artwork: `images/contact/`, source `tools/contact-type.py` → `tools/contact-type-jobs.json`.
- Authoritative source content and rendering parameters: `tools/type-source.json` and `tools/type-jobs.json`.
- Renderer: `swift tools/render-type.swift tools/type-jobs.json > tools/type-result.json`.
- Earlier rectangle metadata can contain pre-migration sizes. The source manifest and role table above take precedence.
- System-board legacy text layers are retained disabled to preserve existing instance references; visible artwork is the approved appearance.
- Rendered specimens do not automatically reflow or recolor when a token changes. Update the source manifest, regenerate artwork and update its bounds. Do not stretch an image of text to a new breakpoint.
- In production, use real selectable text and locally loaded fonts. Never ship text PNGs as accessible UI. Validate font loading and fallback metrics before deployment.

## Space, shape and layout

Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96 px. Preserve 6 px as the intentional mobile outer-shell exception.

- Desktop reference: 1440 wide, 12 shell inset, 1416 panel width, 40 panel inset, 1336 content width; navigation 76 high, hero 700 high.
- Mobile reference: 390 wide, 6 shell inset, 378 panel width, 16 panel inset, 346 content width; navigation 72 high, hero 620 high.
- Tablet 768–1023: stacked composition with 24 px section inset. Below 768: mobile layout. From 1024: desktop composition; adapt columns without shrinking controls.
- Panels: 12 px radius at both sizes. Controls: 4 px. Note/receipt: square. Project images normally square-edged. No generic elevated card style.
- Folder rails: 36 px high, tabs 220 px desktop / 150 px mobile. The 12 px section lead-in and 4 px root gap preserve the folder rhythm.
- Project index: desktop 400 px details beside flexible media; mobile identity → description → media. Preserve supplied artwork aspect ratios.
- Contact note: desktop 560 px / mobile available width, padding 28 / 20. Profile links stay in a row while they fit, then stack.
- Growth: sections expand for content. Do not clip paragraphs, shrink fonts or hide actions to preserve a reference height. Hero height is a reference, not a production maximum.

## Components and interaction contract

Use existing instances; add a library variant before inventing a local treatment.

| Component | Node |
|---|---|
| Wordmark | yJV72 |
| Primary default / hover / focus / disabled | hpFNG / nuD5Q / TLJlL / kepOk |
| Primary pressed / loading | HrUDZ / g5r9Y |
| Secondary | RVshv |
| Editorial link / focus / hover | fNR3I / XqaqM / Dpo65 |
| Full-column action | AxFVY |
| Desktop / mobile navigation | U1uux / P9BFPZ |
| Desktop navigation, Journal / About / Contact active | C8kDy / G0SRqV / uDjaR |
| Filters | OPadp / zK9Pf / T3jMD |
| Email default / focus / error | rEAOf / fmw6q / wF8qi |
| Compact project index | nUR1P |
| Paper / note section treatment | Lutbu / LLV2W |
| Folder tab desktop / mobile | bwzoP / sn2bc |
| Static stamp | EaXCh |
| Mobile project details | m2WIwU |
| Mobile contact note | g9cCw |

### Actions

48 px minimum target, 16 px Erode label, 16 px Lucide arrow, 8 px label/icon gap; button horizontal padding 16 px. Menu icon remains 24 px inside a 48 px target. Stamp artwork is the deliberate icon-size exception.

Primary: cobalt/white; hover and pressed: darker cobalt. Secondary: Surface/Ink, no decorative border. Text links: ink and underline; do not rely solely on color. Arrows indicate destination: down for in-page exploration, up-right for external destination; direction does not replace an accessible label.

Focus: 2 px cobalt ring with 2 px offset in implementation, visible on all interactive controls. Disabled: 50% opacity, semantic disabled state, no hover/action. Loading: prevent repeat submission, show a progress indicator, replace the label with “Sending…” or task-specific text, preserve width and announce busy. The loading canvas specimen shows the visual treatment, not a functioning spinner.

Success: announce “Copied” or “Sent” without moving layout. Clipboard failure offers selectable email and a mail link. Do not use color alone for success/error. One strongest primary action per section.

### Navigation

Same wordmark across widths. Desktop active Work state combines recessed notch and underline. In production, move both with the selected route and set aria-current. Mobile menu requires a visible close action, aria-expanded, focus management and Escape handling; this interaction is specified, not implemented by the canvas.

### Forms

Visible labels, 52 px input height, 16 px value text, 12 px help/error, 8 px internal spacing. Default outline Muted, focus Cobalt, error Error. Associate help and errors programmatically. Preserve entered values after failure; show actionable recovery. Do not submit on focus or validate every keystroke.

## Art direction and motion

- Homepage order: navigation → identity hero → work folder → about/receipt folder → contact/note/collage.
- Use actual project screenshots, supplied number artwork and the twelve existing stickers. Keep captions and controls outside images.
- Aurora belongs to the shell, paper texture to the about folder. Do not add more shader effects or grain to reading surfaces.
- UI hover 160 ms; menu 240 ms; ease-out; no layout-shifting hover transforms.
- Hero stamp retains the existing 3-second settling loop. Contact stamp is static. Global folder-motion = 0 freezes stamp motion; aurora must also be stopped for reduced motion in implementation.
- Production must provide pause/stop for continuous decorative motion and respect prefers-reduced-motion. All content remains visible in the settled state.

## Reference library

These links document inspiration and design history, not external specifications. The approved working-folder system takes priority. Canvas counterpart: board **04 — Layout and art direction → Reference library**.

| Reference | Link | Influence / status |
| --- | --- | --- |
| Paul Kalkbrenner | https://www.paulkalkbrenner.net/ | Oversized hero identity, inline image and generous whitespace; adapted with Akbar’s lettering and animated logo. |
| Oimachi | https://www.oimachi.co/ | Selected-work metadata, right-aligned image strips and fine dividers; unified with the warm-paper palette. |
| Partizan | https://partizan.com/ | Folder partitions, rounded panels and recessed active-navigation notch. |
| Sakib | https://sakib.design/ | Natural sticker collage with varied scale and rotation. Supplied original assets are used; contact remains the main action. |
| Harpreet Jaggi / Wall of Portfolios | https://www.wallofportfolios.in/portfolios/harpreet-jaggi/ | Graph-paper About background and itemised receipt, adapted to skills and services. Torn edges are reserved for the About receipt. |
| F1.8 / Best Free Fonts | https://bestfreefonts.com/f18?text=Jamal+Akbar+Alam | Historical hero font exploration, superseded by Comico. Not current typography guidance. |
| F1.8 / Original font source | https://dotcolon.net/font/f1_8 | Sora Sagano’s source for the earlier F1.8 experiment; supporting resource. |
| Blå Station | https://www.blastation.com/ | Earlier editorial and imagery exploration retained on the canvas; not the governing direction for 14B. |

## New-page workflow

1. Read this file and the four system boards. Use the 14B pages as the composition reference, not old concept boards.
2. Reuse `folder-*` values and canonical components. Keep identity and UI semantics unchanged.
3. Pick a page-specific content structure: case study = context → role → decisions → real media → verified outcome; article = title → metadata → readable body → related action.
4. Keep content-specific imagery separate from global UI colors. Never invent project evidence.
5. Create desktop and mobile together; check intermediate sizes before implementation sign-off.
6. If a new pattern is needed, document its purpose, states and responsive behavior on board 03, then use instances.
7. Update `design-tokens.json` and this specification with any approved global change. Regenerate local-font artwork when necessary.

## Review and implementation boundary

Canvas review checks: visible frame bounds, clipping, spacing/alignment, text hierarchy, matched identity, color pairings and target sizes. Preserve intentional artwork details; do not treat client-image colors as token drift.

Before shipping code, additionally test 320, 390, 768, 1024 and 1440 px; 200% text zoom; keyboard navigation; screen readers; reduced motion; clipboard failure; loading/error/success; menu focus restoration; font-loading failures. These runtime checks have not been performed on a new implementation.

This delivery updates the canvas system and the two selected reference layouts. It does not deploy a site or implement navigation, forms, clipboard behavior or responsive runtime behavior.

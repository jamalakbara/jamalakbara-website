# Brand Guidelines — jamalakbara.

**Last updated:** 2026-10-17 (Working Folder v2 identity)
Single source for brand identity, voice, and usage. Visual tokens live in `docs/DESIGN_SYSTEM.md`; mood/direction in `docs/MOODBOARD.md`.

---

## 1. Identity

| Field | Value |
| --- | --- |
| Full name | **Jamal Akbar Alam** |
| Wordmark / short name | **jamalakbara.** (lowercase, trailing period) |
| Goes by | **Akbar** (first person in copy) |
| Tagline | **Creative Developer & Designer** |
| Description | Portfolio showcasing web development, UI/UX design, and creative digital solutions by Jamal Akbar Alam |
| Location | Based in Bandung, Indonesia |

**Naming rules**
- Wordmark is always lowercase with the trailing period: `jamalakbara.` — the period is part of the mark, never drop it.
- Use the full name "Jamal Akbar Alam" in formal/legal/metadata contexts; "Akbar" in conversational body copy.

---

## 2. Voice & Tone

Casual-expert. First-person, warm, grounded, no corporate fluff. Confident about craft without bragging. Indonesia-rooted and proud of it.

**Sounds like** (verbatim from the site):
> "I'm Akbar — a developer & designer from Bandung crafting digital experiences that feel fast, clear, and built to work in the real world."
> "Hey! I'm Akbar - just a developer from Bandung who loves turning cool ideas into actual working apps."
> "…building websites and apps that actually work well in Indonesia - dealing with our unpredictable internet and making sure everything runs smoothly even when the connection isn't great."

**Principles**
- **Plain over polished.** Short, direct sentences. Contractions welcome.
- **Show the real world.** Emphasize performance under real constraints (slow networks, real users) over buzzwords.
- **Local pride.** Indonesian market context (Bandung, local payment rails) is a feature, not a footnote.
- **Outcome-first.** "Fast, clear, built to work" beats feature lists.

**Avoid:** hype adjectives ("revolutionary", "synergy"), jargon walls, third-person self-reference.

---

## 3. Identity marks (Working Folder v2)

Brand idea: **a working folder, not a corporate template**. Paper panels, folder tabs, a receipt, a contact note and a hand-made sticker collage. The tone is personal, useful and crafted.

| Mark | Rule |
| --- | --- |
| **Navigation wordmark** | `JAMALAKBARA.` in Tanker, 24 px, white on a black tab (10 px top radius). Keep the period and at least 12 px of clear space. No alternate Erode or Inter wordmark. |
| **Hero identity** | "Jamal Akbar Alam" in Comico: 104 px on one line on desktop, 46 px over two lines on mobile. Never use Comico for body, buttons or navigation. |
| **Stamp** | The supplied blue `logo_stamp` artwork (`public/brand/stamp.svg`), with unchanged colours and proportions. Static 44 px in UI. 108 / 64 px with the 3 s settle loop in the hero. It doubles as the copy-email control in the contact note. |
| **Stickers & number tiles** | The 12 supplied stickers and the illustrated 01–09 tiles keep their own colours. Use the originals and never redraw them. |
| In running text | The short name stays lowercase with the period: `jamalakbara.` |

Favicon remains the legacy `app/favicon.ico` (owner preference). The "j." monogram set covers iOS and the manifest only.

---

## 4. Color (brand level)

Full token table in `docs/DESIGN_SYSTEM.md`. The brand is **light-first on warm paper**:

| Token | Hex | Brand role |
| --- | --- | --- |
| Paper | `#F8F6F0` | Folder surface |
| Note | `#FFFEFA` | Receipt and note paper |
| Ink | `#201E19` | Text and marks |
| Cobalt | `#2445DB` | The single accent: primary action, email, active state |
| Aurora | `#AFBDE2` `#CDC1DD` `#BFD4C8` `#DDC9B8` | Decorative shell field only |

**Rules**
- Cobalt is the only UI accent. Use ink and muted for hierarchy.
- Never use muted text on the surface colour, and never use the line colour for text.
- The previous dark cinematic palette (orange `#e0875a` on `#0c0908`) survives only in `/admin`.

---

## 5. Typography (brand level)

- **Tanker** for display, titles, tabs and the wordmark.
- **Erode** for reading, actions and metadata.
- **Comico** for the hero name only.
- Everything is weight 400. Break headings deliberately and let prose wrap naturally.
- Exact scale and canvas metrics are in `docs/DESIGN_SYSTEM.md` §2.

---

## 6. Contact & Social

| Channel | Value |
| --- | --- |
| Email | hello-im@jamalakbara.com |
| Phone | +6281321766565 |
| GitHub | https://github.com/jamalakbara (@jamalakbara) |
| LinkedIn | https://linkedin.com/in/jamalakbara (@jamalakbara) |
| Twitter | https://twitter.com/jamalakbara (@jamalakbara) |

Handle is consistently **@jamalakbara** across platforms.

---

## 7. Brand Asset Inventory (`public/`)

| Asset | Use |
| --- | --- |
| `favicon.ico` | Working site icon |
| `brand/akbar-portrait-cobalt.jpg` | About-page portrait (cobalt treatment) |
| `brand/stamp.svg`, `brand/stickers/`, `brand/numbers/`, `brand/icons/` | Working Folder identity artwork |
| `work/` | Curated project photography |
| `profile-image.png` | Previous portrait (fallback) |
| `og-image.jpg` | Open Graph share card |
| `twitter-image.jpg` | Twitter share card |
| `noise.png` | Legacy film-grain texture (unused on the public site) |
| `manifest.json` | PWA manifest (`name: "jamalakbara. - Creative Developer"`) |
| `screenshot-desktop.png`, `screenshot-mobile.png` | Store/preview screenshots |

Project media is hosted on Cloudinary (cloud `dh0spkwh3`) or in `public/work/`. The per-route background videos are no longer used by the public site, though the admin field and data still exist.

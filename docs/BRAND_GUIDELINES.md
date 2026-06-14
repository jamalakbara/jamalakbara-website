# Brand Guidelines — jamalakbara.

**Last updated:** 2026-06-14
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

## 3. Logo / Wordmark Usage

- Primary mark: the text wordmark `jamalakbara.` set in Inter.
- Keep generous clear space; never stretch, recolor outside the palette, or remove the period.
- On video/photo backgrounds, place the wordmark on a `.liquid-glass` surface or ensure sufficient contrast against the warm-dark scrim.

> **Asset gap:** `app/layout.tsx` references `/logo.png` for icons and mask-icon, but `public/logo.png` does not exist. `favicon.ico` is the working icon. Produce a `logo.png` (16/32/180px usable) or update the references.

---

## 4. Color (brand level)

Full token table + recipes in `docs/DESIGN_SYSTEM.md`. Brand-level rules:

| Token | Hex | Brand role |
| --- | --- | --- |
| Background | `#0c0908` | Warm near-black canvas — the brand is dark-first. |
| Ink | `#f4ede3` | Warm cream — primary text/marks. |
| Accent | `#e0875a` | Warm orange — the single brand accent (links, focus, highlights). |
| Accent hi | `#eab38a` | Lighter orange — hover only. |
| Green | `#6ee787` | Reserved for availability/status, not decoration. |

**Rules**
- One accent. Don't introduce new hues; use the muted ramp (`--m1`…`--m4`) for hierarchy.
- Green is functional (status), not a brand color — don't use it as a second accent.
- Maintain warm-dark; do not ship a light theme without updating these guidelines.

---

## 5. Typography (brand level)
- **Inter** is the only typeface (weights 300/400/500/600/700). No secondary display or mono face.
- Headlines: large, tight negative letter-spacing, weight 400 carried by size for impact.
- See `docs/DESIGN_SYSTEM.md` for the exact scale.

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
| `profile-image.png` | About-page portrait |
| `og-image.jpg` | Open Graph share card |
| `twitter-image.jpg` | Twitter share card |
| `noise.png` | Film-grain texture overlay |
| `manifest.json` | PWA manifest (`name: "jamalakbara. - Creative Developer"`) |
| `screenshot-desktop.png`, `screenshot-mobile.png` | Store/preview screenshots |
| _missing:_ `logo.png` | Referenced but absent — see §3 |

Background videos and project media are hosted on Cloudinary (cloud `dh0spkwh3`), not in `public/`.

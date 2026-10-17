<div align="center">

# jamalakbara.

### Portfolio of Jamal Akbar Alam, a creative developer & designer based in Bandung, Indonesia

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer)](https://motion.dev/)

**[jamalakbara.com](https://jamalakbara.com)**

</div>

---

## The Working Folder (v2.0)

In October 2026 the public site was rebuilt from the Pencil design **Working Folder v2**. It replaces the earlier dark, video-backed look with a paper-and-desk feel:

- **Warm paper panels** on a pastel **aurora** shell (a WebGL shader that renders as a still image under reduced motion and pauses when the tab is hidden)
- **Folder tabs** and a nav with a **recessed notch** that glides under the active route
- **Tanker / Erode / Comico** type with a **cobalt `#2445DB`** accent
- A **services receipt**, a **contact note** with copy-to-clipboard email, and a hand-made **sticker collage** whose stickers peel on hover
- A **first-load splash** (once per session): the name types out, the stamp slams down, then it settles and morphs into the hero
- View-transition page changes, stacked sections with scroll reveals, and a sticky header that hides as you scroll down
- A stamp-portrait favicon and app icons

`/admin` keeps its own legacy dark styling.

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (PostCSS plugin, no config file) plus `--f-*` tokens and `.f-*` classes in `app/(site)/site.css` |
| Motion | Framer Motion, CSS, and a WebGL aurora shader. GSAP, Lenis and React Three Fiber are installed for later work but not used yet |
| Content | Content files in git (`content/*.json`, `content/journal|jurnal/*.mdx`) and a custom CMS at `/admin` |
| Media | Cloudinary for project images. Brand artwork is vector SVG in `public/brand/` |
| Auth | next-auth v5 with GitHub OAuth (one allowed login, no database) |
| Forms | react-hook-form + zod |
| SEO & analytics | Metadata on every route, dynamic sitemap and robots, JSON-LD, and GA4 that loads only after cookie consent |

---

## Quick start

```bash
git clone https://github.com/jamalakbara/jamalakbara-website.git
cd jamalakbara-website
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

### Commands

```bash
npm run dev              # Dev server (Webpack)
npm run dev:turbopack    # Dev server with Turbopack
npm run build            # Production build, which also type-checks content and pages
npm start                # Production server
npm run lint             # ESLint (currently broken, see Known gaps)
```

---

## Project structure

```
app/
├── layout.tsx            # Root layout: fonts and global metadata
├── fonts/                # Tanker / Erode / Comico woff2 subsets
├── not-found.tsx         # 404 page inside the folder shell
├── (site)/               # Public site, wrapped by PortfolioShell
│   ├── site.css          # Working Folder tokens and classes
│   ├── page.tsx          # Home
│   └── work/ about/ contact/ journal/ jurnal/ privacy/
├── admin/                # CMS (dynamic, noindex)
├── api/                  # auth, admin media, MDX preview
├── sitemap.ts  robots.ts
components/
├── portfolio-shell.tsx   # Aurora, folder nav with notch, mobile menu, skip link
└── site/                 # aurora, splash, stamp, sticker(s), folder, title-panel,
                          # project-row, number-tile, receipt, contact-note, journal-index, …
content/
├── projects.json         # Ordered list of projects
├── site/*.json           # Site config, hero, services, about, cta, pages (incl. SEO)
├── journal/*.mdx         # English posts
└── jurnal/*.mdx          # Posts in Bahasa Indonesia
lib/
├── content/              # Typed content imports and zod schemas
├── site-data.ts          # View models the pages read
├── site-format.ts        # sentenceLines() heading breaks
├── admin/                # content-store (fs locally, GitHub commits on Vercel)
└── cloudinary.ts  seo.ts  journal.ts  jurnal.ts  analytics/
public/brand/             # Stamp, stickers, number tiles, icons (SVG)
docs/                     # PRD, brand guidelines, moodboard, design system
proxy.ts                  # Auth gate for /admin and /api/admin
```

---

## Content & CMS

The repo is the database. You can edit content in two ways:

- **`/admin`**: projects (add, edit, reorder, set featured), journal and jurnal MDX editors with live preview, site copy and per-route SEO, the Cloudinary media library, and branding files.
- **Directly** in `content/`.

When you run locally, admin saves write to your working tree, and you review and commit them yourself. In production, each save becomes a git commit on `main`, which starts a Vercel rebuild; changes go live in about 1–2 minutes. Because of this, `main` collects content-only commits ahead of `development`, so merge `main → development` from time to time.

If you change the **shape** of content, update all of these: `lib/content-types.ts`, `lib/content/schemas.ts`, the admin form, and `lib/site-data.ts`.

---

## Design system

Read **`docs/DESIGN_SYSTEM.md`** before you change any styles. The source is the Pencil file `jamalakbara.pen`, and pages should match the canvas 1:1 (the doc includes a pixel-diff recipe).

| Token | Value |
| --- | --- |
| `--f-paper` | `#F8F6F0` |
| `--f-note` | `#FFFEFA` |
| `--f-ink` | `#201E19` |
| `--f-muted` | `#6E695F` |
| `--f-line` | `#D8D2C8` |
| `--f-accent` | `#2445DB` |

Fonts: **Tanker** for display text, titles, tabs and the wordmark; **Erode** for body text; **Comico** only for the hero name and number digits. `prefers-reduced-motion` is respected everywhere.

---

## Environment variables

See `.env.example`.

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GSC_VERIFICATION_CONTENT`
- Admin: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `ADMIN_GITHUB_LOGIN`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_CONTENT_BRANCH`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, plus optional `ADMIN_CONTENT_BACKEND` (`fs` | `github`)

---

## Deployment

The site is deployed on **Vercel**. Pushing to `main` deploys production. The public pages are built as static pages with no runtime fetching; only `/admin` is dynamic.

---

## Known gaps

- `npm run lint` crashes. This is an existing problem caused by ESLint 9 with the legacy config. Use `npm run build` as the quality check instead.

---

## License

[MIT](LICENSE)

<div align="center">

*Built by [jamalakbara.](https://jamalakbara.com)*

</div>

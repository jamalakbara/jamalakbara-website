# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jamalakbara is a multi-page portfolio website for **Jamal Akbar Alam** ("jamalakbara."), a creative developer & designer based in Bandung, Indonesia. The public site uses the **Working Folder v2** design (Oct 2026): warm paper panels on a pastel aurora shell, folder tabs, a recessed-notch nav, Tanker / Erode / Comico type, cobalt `#2445DB` accent, a services receipt, a contact note and a hand-made sticker collage. It replaced the earlier dark cinematic / video-background look; `/admin` still uses the legacy dark styling.

**Key Technologies:**
- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **Tailwind CSS v4** (PostCSS plugin, no config file). Public-site tokens and classes live in `app/(site)/site.css` (`--f-*`, `.f-*`); `app/globals.css` keeps the legacy admin tokens.
- **Motion**: Framer Motion (`framer-motion`) is the primary in-use animation library. **GSAP** (`gsap` + `@gsap/react`), **Lenis** (smooth scroll), and **React Three Fiber** (`three` + `@react-three/fiber` + `@react-three/drei`) are installed for roadmap features but not yet wired into shipped pages.
- **State**: Zustand installed; React hooks are the primary mechanism in shipped code.
- **Content**: git-backed content files (`content/*.json` + `content/journal/*.mdx`) edited via the custom `/admin` CMS or directly — see Architecture.
- **Media**: Cloudinary (cloud `dh0spkwh3`) for all project images (asset folder `portfolio/images`, `work-*` public IDs); identity artwork (stamp, stickers, number tiles, capability icons) is vector SVG in `public/brand/`.
- **Forms**: react-hook-form + zod.
- **Analytics/SEO**: `@next/third-parties` (Google Analytics) with a cookie-consent gate, dynamic `sitemap.ts` / `robots.ts`, and JSON-LD structured data.
- **Theme**: single light "Working Folder" theme on the public site. `next-themes` is a dependency but no toggle is shipped.

> Design docs live in **`docs/`**: `PRD.md`, `BRAND_GUIDELINES.md`, `MOODBOARD.md`, `DESIGN_SYSTEM.md`. Read `docs/DESIGN_SYSTEM.md` before touching styles.

## Development Commands

```bash
npm run dev            # Dev server (Webpack — default)
npm run dev:turbopack  # Dev server with Turbopack (opt-in)
npm run build          # Production build (Webpack)
npm run build:turbopack# Production build with Turbopack (opt-in)
npm start              # Production server
npm run lint           # ESLint (eslint-config-next)
```

## Architecture Overview

### Content System — git-backed files + custom admin CMS
Content lives as **files in the repo** (git is the database) and is editable through the custom CMS at **`/admin`**:

- **`content/projects.json`** — ONE ordered array of all projects (array index = display order).
- **`content/site/*.json`** — singletons: `site-config`, `navigation`, `hero`, `services`, `about`, `comprehensive-about`, `cta`, `pages` (per-page copy).
- **`content/journal/*.mdx`** — journal posts (frontmatter: `title`, `description`, `date`, `tags`, `draft`).
- **`lib/content-types.ts`** — canonical TS interfaces; **`lib/content/schemas.ts`** — matching zod schemas (admin write-path validation only).
- **`lib/content/index.ts`** — typed static JSON imports for the site (inlined at build; works in client components).
- **`lib/site-data.ts`** — derived view-model constants consumed by pages: `NAV_LINKS`, `BRAND`, `home`, `works` (maps projects → `WorkRow`), `work`, `about`, `contact`.

**Site read path** (build-time, static):
```typescript
import { projects, hero } from '@/lib/content'
```
Pages typically consume the pre-shaped constants from `@/lib/site-data` instead.

**Admin write path**: `lib/admin/content-store.ts` is the only module admin code uses to read/write content. Backend switches automatically: local dev = fs writes to the working tree (you review + commit); on Vercel = git commits to `GITHUB_CONTENT_BRANCH` via `lib/admin/github.ts` (GitHub Contents/Git Data API), which triggers a production rebuild (~1–2 min publish). Never fs-read content in prod admin code — go through content-store.

### Admin CMS (`/admin`)
- **Auth**: GitHub OAuth via next-auth v5 (`lib/auth.ts`), single allowed login (`ADMIN_GITHUB_LOGIN`), JWT session, no DB. `proxy.ts` gates `/admin/*` + `/api/admin/*`; every server action/route handler also calls `requireAdmin()` (defense in depth).
- **Routes**: `app/admin/login` (public) + `app/admin/(protected)/…` — dashboard, `projects` (CRUD/reorder/featured), `journal` (MDX editor + live preview), `site` (singleton editors), `media` (Cloudinary library), `branding` (logo/favicon/app-icon file replacement, slots in `lib/admin/branding.ts`).
- **API**: `app/api/admin/media` (Cloudinary Admin API list/delete), `media/sign` (signed direct uploads), `preview/mdx` (editor preview compile).
- Admin is `force-dynamic`, `noindex`, robots-disallowed, never in the sitemap, and NOT wrapped by `PortfolioShell` (it has its own scroll container — `body` is `overflow:hidden`).
- **Publishing model**: prod saves commit to `main` → Vercel rebuild. `main` drifts ahead of `development` with content-only commits — merge `main → development` periodically.

### Routes (`app/`)
Multi-page App Router. Public page components are client components; admin pages are server components with client islands.

```
app/
├── layout.tsx        # RootLayout: html/body, fonts, global metadata only
├── globals.css       # Tailwind import + legacy dark tokens/classes (used by /admin)
├── fonts/            # Tanker / Erode / Comico woff2 subsets (next/font/local)
├── not-found.tsx     # 404 in the folder shell (imports (site)/site.css)
├── (site)/           # public site, wrapped by PortfolioShell (+ StructuredData, GA, CookieConsent)
│   ├── site.css      # Working Folder v2 tokens + classes (public site only)
│   ├── layout.tsx
│   ├── page.tsx      # Home (/)
│   ├── work/  about/  contact/  journal/
├── admin/            # CMS — liquid-glass chrome, no video bg, force-dynamic, noindex
│   ├── layout.tsx  login/
│   └── (protected)/  # auth-checked layout: dashboard, projects, journal, site, media, branding
├── api/              # auth/[...nextauth], admin/media, admin/media/sign, admin/preview/mdx
├── sitemap.ts        # Dynamic XML sitemap (admin never enters)
├── robots.ts         # robots.txt (disallows /admin, /api)
└── favicon.ico
proxy.ts              # (repo root) auth gate for /admin/* and /api/admin/*
```

### Components (`components/`)
```
components/
├── portfolio-shell.tsx          # App shell: aurora field, folder nav with recessed notch under the
│                                 #   active route (aria-current), modal mobile menu, skip link,
│                                 #   <main id="main">. Page scrolls inside .f-scroll (body overflow:hidden).
├── site/                        # Working Folder building blocks: aurora (WebGL shader port),
│                                 #   icons (hand-drawn set), stamp, sticker(s), folder, title-panel,
│                                 #   project-row, number-tile, receipt, contact-note (copy email),
│                                 #   contact-strip, empty-state, journal-index, article-view
├── structured-data.tsx          # JSON-LD (Person, Project, Service, WebSite, etc.)
├── analytics/GoogleAnalytics.tsx# GA via @next/third-parties, gated on consent
└── analytics/CookieConsent.tsx  # Consent banner (necessary/analytics/marketing/preferences)
```
There is no `components/ui/` shadcn directory in active use; Radix primitives are available as dependencies.

### Cloudinary media (`lib/cloudinary.ts`)
- `getCloudinaryUrl(publicId, options)`, `getProjectImageUrl(imageName, options)`, `getCloudinaryBaseUrl()`.
- Transforms: width/height/quality/format/crop/gravity; defaults `q_auto,f_auto`.
- Cloud name from `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (`dh0spkwh3`).
- Project images stream from Cloudinary; a project row's media strip is its `gallery` (up to 3), else `image`.
- The per-route background videos (`pages.*.backgroundVideo`, `lib/backgrounds.ts`) are **no longer rendered** by the public site; the admin field and data remain untouched.

### Analytics & Consent (`lib/analytics/`)
- `ga-config.ts` — `GoogleAnalyticsConfig` singleton, `EVENTS`, `CUSTOM_DIMENSIONS`.
- `consent.ts` — `CookieConsentManager`, persists to `localStorage` key `cookie-consent`.
- `events.ts` — `GoogleAnalyticsEvents` (page views, scroll depth, dwell time, device info).
- GA scripts load only after analytics consent.

### SEO
- `app/sitemap.ts`, `app/robots.ts`, and `components/structured-data.tsx` (JSON-LD).
- `next.config.ts`: `output: 'standalone'`, image formats webp/avif, Cloudinary remote pattern, `optimizePackageImports` for framer-motion + lucide-react.

## Styling

### Tailwind CSS v4
- `app/globals.css` begins with `@import "tailwindcss";` — there is **no `tailwind.config.*`** (v4 PostCSS plugin in `postcss.config.mjs`).
- Theme is **not** in a Tailwind config; it lives as CSS custom properties.

### Design system — read `docs/DESIGN_SYSTEM.md` first
- Canvas source: Pencil `jamalakbara.pen` (Working Folder v2); designer spec + tokens in `docs/design/`.
- Tokens (`app/(site)/site.css`): `--f-paper #F8F6F0`, `--f-note #FFFEFA`, `--f-ink #201E19`, `--f-muted #6E695F`, `--f-surface #E8E3D9`, `--f-line #D8D2C8`, `--f-accent #2445DB`, `--f-hover #1D36AF`, `--f-error #A62929`, `--f-success #456D5B`.
- Type: **Tanker** (display/titles/tabs/wordmark), **Erode** (body/actions/meta), **Comico** (hero name + number digits only; subset — re-subset if used for other text). All weight 400. CSS line-heights = canvas ratio + 0.09 (canvas adds the faces' line gap); role classes carry `padding-block: 1px`.
- Classes: `.f-panel`, `.f-folder`/`.f-tab`, `.f-display`/`.f-title`/`.f-body`/`.f-action`/`.f-meta`, `.f-btn--primary|secondary`, `.f-link`/`.f-uline`/`.f-act`, `.f-filter`, `.f-input`, `.f-row`, `.f-receipt`, `.f-note`, `.f-prose`.
- Headings: `sentenceLines()` (`lib/site-format.ts`) breaks like the canvas without changing text content.
- Space Grotesk / Fraunces are still loaded for admin only.

### Motion
- Aurora shell shader (static under reduced motion, paused when hidden), hero stamp 3 s settle loop, 160 ms hovers, 240 ms menu. `prefers-reduced-motion` is honored in `site.css`.

## Animation Patterns
Use Framer Motion for component animation:
```typescript
import { motion } from 'framer-motion'
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} />
```
For pure CSS entrances use `.animate-blur-fade-up` with a stagger delay. When introducing GSAP/Lenis/R3F (roadmap), follow the conventions in `docs/PRD.md`.

## File Structure Conventions

### Path Aliases
- `@/components`, `@/lib` (`@/app`, `@/hooks`, `@/contexts` resolve too, but `hooks/` and `contexts/` are not currently present).

## Environment Variables
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud (`dh0spkwh3`).
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics ID (`G-…`).
- `NEXT_PUBLIC_GSC_VERIFICATION_CONTENT` — Google Search Console verification (optional).
- Admin CMS: `AUTH_SECRET`, `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` (GitHub OAuth app), `ADMIN_GITHUB_LOGIN`, `GITHUB_TOKEN` (fine-grained PAT, Contents RW, this repo only), `GITHUB_REPO`, `GITHUB_CONTENT_BRANCH`, `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (server-only), optional `ADMIN_CONTENT_BACKEND` (`fs`|`github`).
See `.env.example`.

## Testing and Quality
- **ESLint**: `npm run lint`.
- **TypeScript**: strict; `next.config.ts` does **not** ignore build errors.
- **Build validation**: `npm run build` type-checks all content and pages.

## Common Development Tasks

### Adding / editing content
- Preferred: edit through `/admin` (projects, journal, site copy, media, branding).
- Direct file edits work too: `content/projects.json`, `content/site/*.json`, `content/journal/*.mdx`.
- If a content **shape** changes: update the interface in `lib/content-types.ts`, the zod schema in `lib/content/schemas.ts`, the admin form, and `lib/site-data.ts` if pages read it via a shaped constant.

### Adding a route
1. Create `app/(site)/<route>/page.tsx` (client component).
2. Add it to `NAV_LINKS` in `lib/site-data.ts` and to `app/sitemap.ts`.
3. Build it from `components/site/*` (title panel, folder, contact strip) — no background video step any more.

### Styling new components
1. Reuse `--f-*` tokens and `f-` classes in `app/(site)/site.css` — see `docs/DESIGN_SYSTEM.md`. Never restyle a shared `globals.css` class for the public site (admin depends on them).
2. Match the canvas 1:1: take values from Pencil (export the frame as `html-css`), verify with the pixel-diff recipe in `docs/DESIGN_SYSTEM.md` §8, and respect `prefers-reduced-motion`.

## Known Gaps
- `npm run lint` crashes (ESLint 9 + legacy `eslintrc` config, circular-structure error) — pre-existing; type-checking via `npm run build` is the working quality gate.

## Icons
The favicon is the **legacy `app/favicon.ico`** (owner preference — do not swap it for the SVG or list `icon.svg` in metadata icons). The "j." monogram set (`public/icon.svg` source, `public/apple-icon.png` 180×180, `public/icon-192.png` / `public/icon-512.png`) covers iOS home-screen and manifest icons only; regenerate from glyph outlines if the brand changes. `public/logo.svg` is the full wordmark (not used as an icon).

## Performance Considerations
- Public site content is static (compile-time JSON imports), no runtime fetch; only `/admin` is dynamic.
- Use `next/image` + Cloudinary `q_auto,f_auto`; image formats webp/avif.
- Heavy hover/preview effects are gated to hover-capable devices.
- Prefer CSS transforms; keep motion within `prefers-reduced-motion` rules.

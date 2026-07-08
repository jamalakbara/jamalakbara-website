# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jamalakbara is a cinematic, multi-page portfolio website for **Jamal Akbar Alam** ("jamalakbara."), a creative developer & designer based in Bandung, Indonesia. The site pairs a warm, dark, film-grade visual language with per-route Cloudinary video backgrounds, glassmorphic ("liquid-glass") UI, and motion-driven micro-interactions.

**Key Technologies:**
- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **Tailwind CSS v4** (PostCSS plugin, no config file) — design tokens live as CSS custom properties in `app/globals.css`
- **Motion**: Framer Motion (`framer-motion`) is the primary in-use animation library. **GSAP** (`gsap` + `@gsap/react`), **Lenis** (smooth scroll), and **React Three Fiber** (`three` + `@react-three/fiber` + `@react-three/drei`) are installed for roadmap features but not yet wired into shipped pages.
- **State**: Zustand installed; React hooks are the primary mechanism in shipped code.
- **Content**: TypeScript static content modules (no JSON/CMS) — see Architecture.
- **Media**: Cloudinary (cloud `dh0spkwh3`) for background videos and project images/videos.
- **Forms**: react-hook-form + zod.
- **Analytics/SEO**: `@next/third-parties` (Google Analytics) with a cookie-consent gate, dynamic `sitemap.ts` / `robots.ts`, and JSON-LD structured data.
- **Theme**: single dark cinematic theme. `next-themes` is a dependency but no light/dark toggle is shipped.

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

### Content System — TypeScript static modules
There is **no `/content/` JSON directory and no CMS**. All content is type-safe TypeScript:

- **`lib/content-types.ts`** — interfaces: `Service`, `Project`, `NavigationItem`, `AboutContent`, `ComprehensiveAboutContent`, `SiteConfig`, `HeroContent`, `BlogContent`, `CTAContent`.
- **`lib/static-content.ts`** — the content source, exposed via `getStaticContent`:
  - `siteConfig()`, `navigation()`, `hero()`, `services()` (×4), `projects()` (×18), `featuredProjects()`, `homepageShowcaseProjects()`, `about()`, `comprehensiveAbout()`, `blog()` (×5), `cta()`.
- **`lib/site-data.ts`** — derived view-model constants consumed by pages: `NAV_LINKS`, `BRAND`, `home`, `works` (maps projects → `WorkRow`), `work`, `about`, `contact`.

**Loading pattern** (client + server, same import):
```typescript
import { getStaticContent } from '@/lib/static-content'
const projects = getStaticContent.projects()
```
Pages typically consume the pre-shaped constants from `@/lib/site-data` instead.

### Routes (`app/`)
Multi-page App Router. All page components are client components.

```
app/
├── layout.tsx        # RootLayout: metadata, Inter font, GoogleAnalytics, CookieConsent, PortfolioShell
├── globals.css       # Design tokens + component classes (the styling source of truth)
├── page.tsx          # Home (/)
├── work/page.tsx     # Work portfolio (/work)
├── about/page.tsx    # About (/about)
├── contact/page.tsx  # Contact (/contact) — react-hook-form + zod
├── sitemap.ts        # Dynamic XML sitemap
├── robots.ts         # robots.txt
└── favicon.ico
```

### Components (`components/`)
```
components/
├── portfolio-shell.tsx          # App shell: two-layer crossfading per-route Cloudinary video
│                                 #   background, liquid-glass smart-hide navbar, mobile menu,
│                                 #   film-grain + vignette overlays. z-layering: video z0 →
│                                 #   overlays z1 → scrim z2 → blur z3 → navbar z50.
├── work-preview.tsx             # Cursor-following floating media preview (Framer Motion spring +
│                                 #   velocity tilt). Desktop/hover-devices only.
├── structured-data.tsx          # JSON-LD (Person, Project, Service, WebSite, etc.)
├── analytics/GoogleAnalytics.tsx# GA via @next/third-parties, gated on consent
└── analytics/CookieConsent.tsx  # Consent banner (necessary/analytics/marketing/preferences)
```
There is no `components/ui/` shadcn directory in active use; Radix primitives are available as dependencies.

### Cloudinary media (`lib/cloudinary.ts`)
- `getCloudinaryUrl(publicId, options)`, `getProjectImageUrl(imageName, options)`, `getCloudinaryBaseUrl()`.
- Transforms: width/height/quality/format/crop/gravity; defaults `q_auto,f_auto`.
- Cloud name from `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (`dh0spkwh3`).
- **Background videos** are served per route from Cloudinary (`bg-home`, `bg-work`, `bg-about`, `bg-contact`) and crossfaded in `portfolio-shell.tsx`. Project thumbnails/videos also stream from Cloudinary.

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

### Design tokens (`app/globals.css`)
```css
--bg: #0c0908;        /* background — warm near-black */
--ink: #f4ede3;       /* primary text — warm cream */
--m1: #d8cdbf; --m2: #b3a596; --m3: #a99c8d; --m4: #7d7163;  /* muted ramp */
--accent: #e0875a;    /* warm orange */
--accent-hi: #eab38a; /* hover orange */
--green: #6ee787;     /* availability / status */
```

### Typography
- **Space Grotesk** (via `next/font/google`, weights 300–400–500, variable `--font-space-grotesk`) — primary face for all headlines, body, nav, and UI.
- **Fraunces** (via `next/font/google`, weights 300–400, italic only, variable `--font-fraunces`) — accent face used exclusively for eyebrow labels (`— Selected Work`, `— About`, etc.).
- Headings use large `clamp()` sizes with tight negative letter-spacing. See `docs/DESIGN_SYSTEM.md` for the full scale.

### Component classes & motion
- Key class: **`.liquid-glass`** (translucent fill + hairline border + layered soft shadows + springy press). Others: `.btn-solid`, `.field-input`, `.work-row`, `.nav-link`, `.menu-link`, `.email-link`, `.back-link`.
- Keyframes: **`blurFadeUp`** (staggered entrance) and **`softPulse`** (availability dot).
- `prefers-reduced-motion: reduce` is honored globally.

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
See `.env.example`.

## Testing and Quality
- **ESLint**: `npm run lint`.
- **TypeScript**: strict; `next.config.ts` does **not** ignore build errors.
- **Build validation**: `npm run build` type-checks all content and pages.

## Common Development Tasks

### Adding / editing content
1. Update the relevant method in `lib/static-content.ts` (and the interface in `lib/content-types.ts` if shape changes).
2. If pages read it via a shaped constant, update `lib/site-data.ts`.

### Adding a route
1. Create `app/<route>/page.tsx` (client component).
2. Add it to `NAV_LINKS` in `lib/site-data.ts` and to `app/sitemap.ts`.
3. Add a background video entry in `components/portfolio-shell.tsx` if it needs one.

### Styling new components
1. Reuse tokens (CSS custom properties) and existing classes (`.liquid-glass`, etc.) — see `docs/DESIGN_SYSTEM.md`.
2. Respect z-index layering and `prefers-reduced-motion`.

## Known Gaps
- `npm run lint` crashes (ESLint 9 + legacy `eslintrc` config, circular-structure error) — pre-existing; type-checking via `npm run build` is the working quality gate.

## Icons
The favicon is the **legacy `app/favicon.ico`** (owner preference — do not swap it for the SVG or list `icon.svg` in metadata icons). The "j." monogram set (`public/icon.svg` source, `public/apple-icon.png` 180×180, `public/icon-192.png` / `public/icon-512.png`) covers iOS home-screen and manifest icons only; regenerate from glyph outlines if the brand changes. `public/logo.svg` is the full wordmark (not used as an icon).

## Performance Considerations
- Content is static (compile-time), no runtime fetch.
- Use `next/image` + Cloudinary `q_auto,f_auto`; image formats webp/avif.
- Heavy hover/preview effects are gated to hover-capable devices.
- Prefer CSS transforms; keep motion within `prefers-reduced-motion` rules.

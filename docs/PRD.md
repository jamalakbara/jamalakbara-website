# Product Requirements Document (PRD)

**Project Name:** Jamalakbara Portfolio (v2.x)
**Owner:** Jamal Akbar Alam ("jamalakbara.") — Creative Developer & Designer, Bandung, Indonesia
**Last updated:** 2026-06-14
**Status:** Multi-page site shipped. This document records the **as-built** product and a clearly-marked **roadmap** of not-yet-built features.

---

## 1. Overview & Objectives

* **Primary objective:** A high-end, "alive" portfolio that showcases technical and design craft through cinematic video backgrounds, glassmorphic UI, and physics-based micro-interactions — aiming for Awwwards-level polish.
* **Target audience:** High-ticket clients, tech recruiters, and the design community (Awwwards/CSSDA).
* **Success metrics:**
  * Lighthouse Performance > 90 despite heavy media.
  * SOTD / Honorable Mention potential.
  * Avg. session > 2 minutes.

---

## 2. Technical Stack (as-built)

| Area | Tool | Status |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + React 19 + TypeScript | Shipped |
| Styling | **Tailwind CSS v4** (PostCSS plugin, no config); tokens as CSS custom properties | Shipped |
| Motion (primary) | **Framer Motion** | Shipped |
| Media | **Cloudinary** (cloud `dh0spkwh3`) — bg videos + project media | Shipped |
| Forms | react-hook-form + zod | Shipped |
| Analytics/SEO | `@next/third-parties` GA (consent-gated), `sitemap.ts`, `robots.ts`, JSON-LD | Shipped |
| Deployment | Vercel (`output: 'standalone'`) | Shipped |
| Animation timelines | **GSAP** (`gsap` + `@gsap/react`) | Installed, roadmap |
| Smooth scroll | **Lenis** | Installed, roadmap |
| 3D / WebGL | **React Three Fiber** (`three` + drei) | Installed, roadmap |
| State | **Zustand** | Installed, used sparingly |
| Theme | `next-themes` | Installed; single dark theme shipped (no toggle) |

---

## 3. Design Principles (the "vibe")

* **Cinematic warm-dark:** near-black warm background (`#0c0908`) with cream text (`#f4ede3`) and a single warm-orange accent (`#e0875a`).
* **Typography-driven:** large Inter headings with tight negative tracking and `clamp()` fluid scaling.
* **Filmic texture:** per-route background video under a grain + vignette overlay to remove "digital coldness."
* **Glassmorphic surfaces:** the `.liquid-glass` system — translucent fill, hairline rim light, layered soft shadows, springy press.
* **Physics-based motion:** spring/velocity-driven cursor preview; entrances settle (blur-fade-up).
* Full design spec in `docs/DESIGN_SYSTEM.md`; brand voice in `docs/BRAND_GUIDELINES.md`; visual direction in `docs/MOODBOARD.md`.

---

## 4. As-Built Features

### 4.1 Pages
| Route | Purpose |
| --- | --- |
| `/` | Home — status row (role / location / availability), large headline, intro, selected-work range. |
| `/work` | Portfolio list (18 projects) with cursor-following hover previews. |
| `/about` | Bio, portrait, expertise chips. |
| `/contact` | Validated contact form (name / email / message) with success state. |

### 4.2 Global shell (`components/portfolio-shell.tsx`)
| Feature | Description |
| --- | --- |
| **Per-route video background** | Two-layer crossfade between Cloudinary clips (`bg-home`, `bg-work`, `bg-about`, `bg-contact`) on route change. |
| **Film grain + vignette** | Fixed overlay layers for filmic texture and edge falloff. |
| **Smart-hide navbar** | `.liquid-glass` pill nav; centered desktop links + mobile hamburger menu. |
| **Z-layering** | video `z0` → overlays `z1` → scrim `z2` → blur mask `z3` → navbar `z50`. |

### 4.3 Interactions
* **Work preview** (`components/work-preview.tsx`): floating media card follows the cursor with a Framer Motion spring + velocity-driven tilt; hover-capable devices only; 4:3 media with film overlay.
* **Liquid-glass press**: tactile quick press-down + springy release on buttons/links.
* **Entrance**: `blurFadeUp` staggered reveals; availability dot uses `softPulse`.

### 4.4 Content
* TypeScript static content (`lib/static-content.ts` → `getStaticContent`; view-models in `lib/site-data.ts`). 18 projects, 4 services, 5 blog entries, about/comprehensive-about. No CMS.

### 4.5 Analytics, consent & SEO
* GA via `@next/third-parties`, loaded **only after analytics consent** (`lib/analytics/*`, banner in `components/analytics/CookieConsent.tsx`).
* Dynamic `app/sitemap.ts` + `app/robots.ts`; JSON-LD via `components/structured-data.tsx` (Person, Project, Service, WebSite, …).
* `next.config.ts`: image formats webp/avif, Cloudinary remote pattern, `optimizePackageImports`.

---

## 5. Non-Functional Requirements

* **Performance:** images via `next/image` + Cloudinary `q_auto,f_auto`; background video must not block first paint; heavy hover effects disabled on touch.
* **Responsiveness:** breakpoints at 1024 (desktop nav), 880 (two-col → stack), 720 (work category column), 639 (hide nav actions). Layouts collapse to single column on mobile.
* **Accessibility:** `prefers-reduced-motion: reduce` honored globally; focus-visible outlines on glass elements.
* **SEO:** sitemap, robots, JSON-LD structured data, Open Graph / Twitter images.

---

## 6. Roadmap — Not Yet Built

These were part of the original vision and remain targets. Dependencies are already installed.

| Feature | Notes | Dep |
| --- | --- | --- |
| **Preloader** | Typography-based 0–100% counter that "curtains" up to the hero. | GSAP |
| **Lenis smooth scroll** | Inertia scroll normalized across input devices. | Lenis |
| **WebGL image distortion** | Liquid/flashlight hover on project media; pause off-viewport. | R3F |
| **Bento grid works** | Asymmetrical grid layout for `/work` (currently a list). | — |
| **Sticky-curtain footer** | Content slides up to reveal a fixed footer with a magnetic "Let's Talk" CTA. | GSAP |
| **Skills marquee** | Scroll-direction-aware ticker on `/about`. | — |
| **Project expand transition** | View Transitions API / GSAP Flip from thumbnail → case study. | — |

### Known gaps
* `app/layout.tsx` references `/logo.png` (icons/mask-icon) but the asset is missing — `favicon.ico` is the working icon.

---

## 7. Asset Inventory (`public/`)
`favicon.ico`, `profile-image.png`, `og-image.jpg`, `twitter-image.jpg`, `noise.png` (grain), `manifest.json`, desktop/mobile screenshots, `split-bill.png`. Background videos + project media stream from Cloudinary.

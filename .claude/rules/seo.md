# SEO rules

Conventions for keeping this site's SEO intact. Established July 2026 alongside the journal launch.

## Every route owns its metadata

- All `app/*/page.tsx` files are client components — they **cannot** export metadata. Each route gets a `layout.tsx` that exports `metadata` and passes `children` through (see `app/work/layout.tsx` for the pattern).
- Every route's metadata must set: unique `title`, unique `description`, `alternates.canonical` (full URL), and `openGraph.url`.
- **Never let a route inherit the root canonical.** The root layout's canonical points at the homepage; an uncorrected child route tells Google it is a duplicate of `/`.
- Title template gotcha: the root `title.template` ("%s | Jamal Akbar Alam") does **not** propagate past a nested layout that sets `title` as a plain string. If a section has child routes (like `/journal/[slug]`), its layout must re-declare `title: { default, template }` — see `app/journal/layout.tsx`.

## Adding a route — SEO checklist

1. `app/<route>/layout.tsx` with full metadata (above).
2. Add to `NAV_LINKS` in `lib/site-data.ts`.
3. Add to the `routes` array in `app/sitemap.ts`.
4. Add a background-video entry in `PAGE_PATHS` in `components/portfolio-shell.tsx` (reuse an existing video if no dedicated one).
5. Prefer a **server component** for any content-bearing page so crawlers get real HTML; isolate interactivity in child client components.

## Journal posts

- Posts are MDX files in `content/journal/*.mdx`. Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), `tags`, `draft`.
- `draft: true` posts never render, list, or enter the sitemap — publishing is flipping the flag and updating `date`.
- Per-post SEO is automatic via `app/journal/[slug]/page.tsx`: `generateMetadata` (title, description, canonical, OG article) and `Article` JSON-LD. Do not add manual meta tags inside post content.
- `lib/journal.ts` is the only reader; `app/sitemap.ts` pulls post URLs and dates from it. New posts need no sitemap edits.
- Post `description` doubles as the meta description — write it as a search snippet (under ~160 chars, contains the topic keyword).
- Posts should cross-link related posts and end client-facing posts with a CTA linking `/contact`.

## Icons

- **Favicon is the legacy `app/favicon.ico` by owner preference.** Do not add an `icon.svg` entry to the metadata `icons.icon` list — browsers prefer SVG over ICO and would hide the chosen favicon.
- The "j." monogram set (`public/icon.svg` source, `public/apple-icon.png` 180, `public/icon-192.png` / `icon-512.png`) serves iOS home-screen and the PWA manifest only.
- `public/logo.svg` is the text wordmark — never reference it as a favicon/app icon (it imports a remote font and is non-square).
- Keep `manifest.json` colors on `#0c0908`.

## Verification

- `npm run lint` is broken (pre-existing ESLint 9 config crash) — `npm run build` is the quality gate; it type-checks and prerenders every page, and fails on metadata type errors.
- After SEO-affecting changes, verify on a local prod server: `<title>` per page, `rel="canonical"` per page, `/sitemap.xml` URL count, and JSON-LD presence on article pages.
- Off-site steps (Google Search Console sitemap submission, request-indexing) are manual and happen after deploy — code changes alone do nothing until deployed.

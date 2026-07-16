# SEO rules

Conventions for keeping this site's SEO intact. Established July 2026 alongside the journal launch.

## Every route owns its metadata

- All public `app/(site)/*/page.tsx` files are client components — they **cannot** export metadata. Each route gets a `layout.tsx` that exports `metadata` and passes `children` through (see `app/(site)/work/layout.tsx` for the pattern).
- Every route's metadata must set: unique `title`, unique `description`, `alternates.canonical` (full URL), and `openGraph.url`.
- **Never let a route inherit the root canonical.** The root layout's canonical points at the homepage; an uncorrected child route tells Google it is a duplicate of `/`.
- Title template gotcha: the root `title.template` ("%s | Jamal Akbar Alam") does **not** propagate past a nested layout that sets `title` as a plain string. If a section has child routes (like `/journal/[slug]`), its layout must re-declare `title: { default, template }` — see `app/(site)/journal/layout.tsx`.

### Admin-editable per-route SEO (`/work`, `/about`, `/contact`, `/journal`)
- These four layouts build metadata via `buildPageMetadata()` in `lib/seo.ts`, which reads `pages.<route>.seo` ({ `title`, `description` }) from `content/site/pages.json` — editable in the admin **Site** editor (SEO fieldset per tab). The layout's inline object is the **fallback** used when a field is blank.
- `title` is the short route title (feeds the `%s | Jamal Akbar Alam` template); OG/Twitter titles derive as `<title> — Jamal Akbar Alam`. Editing SEO in admin publishes on the normal commit→rebuild cycle.
- Home (`/`) is also admin-driven, but **specially**: its editable `title`/`description` come from `pages.home.seo` and are wired directly in the root `app/layout.tsx` (not via `buildPageMetadata`), because that title is the FULL homepage title AND the site-wide default/fallback (no `%s | …` suffix). The template, OG image, icons, keywords, and verification stay hardcoded in the root layout — only the title/description text is admin-editable. Home's admin SEO field uses `appendBrand={false}`.
- The `seo` field is optional in `pagesSchema` (`lib/content/schemas.ts`); if you add a new admin-editable route, extend that schema, seed `pages.json`, and route the layout through `buildPageMetadata()`.

## Admin CMS routes

- Everything under `/admin` and `/api` is non-SEO surface: `app/admin/layout.tsx` sets `robots: { index: false, follow: false }`, `app/robots.ts` disallows `/admin` + `/api/`, and admin routes must **never** enter `app/sitemap.ts` or `PAGE_PATHS`.
- Public pages moved into the `app/(site)/` route group (July 2026, CMS launch) — URLs unchanged. The `(site)/layout.tsx` carries `PortfolioShell` + StructuredData + GA; root layout keeps the global metadata. Per-route metadata layouts live inside `(site)/`.
- Prod admin saves commit to `main` and republish via Vercel rebuild — SEO verification steps below still apply after content changes deploy.

## Adding a route — SEO checklist

1. `app/(site)/<route>/layout.tsx` with full metadata (above).
2. Add to `NAV_LINKS` in `lib/site-data.ts` only if it belongs in the navbar — `/jurnal` is intentionally excluded.
3. Add to the `routes` array in `app/sitemap.ts`.
4. Add a background-video entry in `PAGE_PATHS` in `components/portfolio-shell.tsx` (reuse an existing video if no dedicated one).
5. Prefer a **server component** for any content-bearing page so crawlers get real HTML; isolate interactivity in child client components.
6. **No event handlers in server component page files** — use CSS classes (defined in `globals.css`) for hover effects, not `onMouseEnter`/`onMouseLeave`.

## Journal posts (English — `/journal`)

- Posts are MDX files in `content/journal/*.mdx`. Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), `tags`, `draft`.
- `draft: true` posts never render, list, or enter the sitemap — publishing is flipping the flag and updating `date`.
- Per-post SEO is automatic via `app/(site)/journal/[slug]/page.tsx`: `generateMetadata` (title, description, canonical, OG article) and `Article` JSON-LD with `inLanguage: "en"`. Do not add manual meta tags inside post content.
- `lib/journal.ts` is the only reader; `app/sitemap.ts` pulls post URLs and dates from it. New posts need no sitemap edits.
- Post `description` doubles as the meta description — write it as a search snippet (under ~160 chars, contains the topic keyword).
- Posts should cross-link related posts and end client-facing posts with a CTA linking `/contact`.
- Dates must be staggered (not all the same) — Google uses recency as a freshness signal. Update `date` when making substantial edits.

## Jurnal posts (Bahasa Indonesia — `/jurnal`)

- Posts are MDX files in `content/jurnal/*.mdx`. Same frontmatter shape as `/journal`: `title`, `description`, `date` (YYYY-MM-DD), `tags`, `draft`.
- `lib/jurnal.ts` is the only reader. `app/sitemap.ts` pulls from both `getJournalPosts()` and `getJurnalPosts()`. New posts need no sitemap edits.
- `/jurnal` is **not** in the navbar — it is linked from the `/journal` listing page via a "Bahasa Indonesia →" link near the eyebrow. The `/jurnal` listing page mirrors this with "English →".
- Per-post JSON-LD uses `inLanguage: "id"` — do not change this to "en".
- `/jurnal` is a separate independent content section, not a translation of `/journal`. Posts can cover the same topics but the content is different and written natively in Bahasa.
- The `/jurnal` layout (`app/(site)/jurnal/layout.tsx`) has hardcoded Indonesian metadata — it does not go through `buildPageMetadata()` and is not admin-editable.
- Background video for `/jurnal` reuses the journal video (set in `PAGE_PATHS` in `portfolio-shell.tsx`).

## Content tone and voice

### English journal (`/journal`)
- Thoughtful, opinionated, first-person ("I"). Clear and direct — not academic, not casual.
- Write for a sophisticated reader: clients who care about craft, developers who want the reasoning.
- State a position, defend it, acknowledge tradeoffs. No listicles without substance behind each point.
- End client-facing posts with a CTA to `/contact`. Cross-link related posts where natural.
- `description` is a search snippet — write it like a one-sentence summary that contains the topic keyword and stands alone.

### Bahasa journal (`/jurnal`)
- Casual, conversational, first-person ("gue/lo" register — common in Indonesian tech/internet writing).
- Contractions and informal vocabulary: "nggak", "gimana", "kayak", "banget", "udah" are natural here.
- Still opinionated and substantive — casual tone does not mean thin content. Every post should have a real argument.
- Target Indonesian search queries: "jasa website bandung", "shopify developer indonesia", "developer bandung", etc. Work the keyword into the title and first paragraph naturally — not stuffed.
- End posts with a CTA to `/contact`. Internal links use `/contact`, `/work`, `/jurnal/[slug]` etc.
- `description` should read naturally in Bahasa and contain the primary search term.
- Do NOT write `/jurnal` posts in English. Do NOT mix languages within a post.

## Icons

- **Favicon is the legacy `app/favicon.ico` by owner preference.** Do not add an `icon.svg` entry to the metadata `icons.icon` list — browsers prefer SVG over ICO and would hide the chosen favicon.
- The "j." monogram set (`public/icon.svg` source, `public/apple-icon.png` 180, `public/icon-192.png` / `icon-512.png`) serves iOS home-screen and the PWA manifest only.
- `public/logo.svg` is the text wordmark — never reference it as a favicon/app icon (it imports a remote font and is non-square).
- Keep `manifest.json` colors on `#0c0908`.

## Verification

- `npm run lint` is broken (pre-existing ESLint 9 config crash) — `npm run build` is the quality gate; it type-checks and prerenders every page, and fails on metadata type errors.
- After SEO-affecting changes, verify on a local prod server: `<title>` per page, `rel="canonical"` per page, `/sitemap.xml` URL count, and JSON-LD presence on article pages.
- Off-site steps (Google Search Console sitemap submission, request-indexing) are manual and happen after deploy — code changes alone do nothing until deployed.

# SEO rules

Conventions for keeping this site's SEO intact. Established July 2026 alongside the journal launch.

## Every route owns its metadata

- Each public route gets a `layout.tsx` that exports `generateMetadata` and passes `children` through (see `app/[lang]/work/layout.tsx` for the pattern). Pages are thin server components around client views in `components/site/`.
- Every route's metadata must set: unique `title`, unique `description`, `alternates.canonical` (full URL), and `openGraph.url`.
- **Never let a route inherit the root canonical.** The root layout's canonical points at the homepage; an uncorrected child route tells Google it is a duplicate of `/`.
- Title template gotcha: the root `title.template` ("%s | Jamal Akbar Alam") does **not** propagate past a nested layout that sets `title` as a plain string. If a section has child routes (like `/journal/[slug]`), its layout must re-declare `title: { default, template }` — see `app/[lang]/journal/layout.tsx`.

### Admin-editable per-route SEO (`/work`, `/about`, `/contact`, `/journal`)
- These layouts build metadata via `buildPageMetadata()` in `lib/seo.ts`, which reads `pages.<route>.seo` ({ `title`, `description` }) from `content/site/pages.json` and its Bahasa overlay — editable in the admin **Site** editor (SEO fieldset per tab, EN / ID switch). The layout's inline object is the **fallback** used when a field is blank.
- `title` is the short route title (feeds the `%s | Jamal Akbar Alam` template); OG/Twitter titles derive as `<title> — Jamal Akbar Alam`. Editing SEO in admin publishes on the normal commit→rebuild cycle.
- Home (`/`) is also admin-driven, but **specially**: its editable `title`/`description` come from `pages.home.seo` and are wired directly in `app/[lang]/layout.tsx` (not via `buildPageMetadata`), because that title is the FULL homepage title AND the site-wide default/fallback (no `%s | …` suffix). The template, OG image, icons, keywords, and verification stay hardcoded in the root layout — only the title/description text is admin-editable. Home's admin SEO field uses `appendBrand={false}`.
- The `seo` field is optional in `pagesSchema` (`lib/content/schemas.ts`); if you add a new admin-editable route, extend that schema, seed `pages.json`, and route the layout through `buildPageMetadata()`.

## Structured data

- `components/structured-data.tsx` reads `content/site/seo.json` (admin **SEO** screen). Each type renders only where it describes the page: `WebSite` + `Person` on home, `Person` on `/about`, `LocalBusiness` on `/contact` and service pages, `Project` + `Breadcrumb` on case studies.
- `FAQ` markup goes only on a page that shows the same FAQ. Never add it to `app/[lang]/layout.tsx`.
- Business data stays at city level. Do not reintroduce postal code, street or coordinates.
- Do not add a `SearchAction`: the site has no search route.

## Languages

- English lives at the root, Bahasa under `/id` with the same paths. All public routes sit in `app/[lang]`. `proxy.ts` rewrites `/work` to `/en/work` without changing the URL and redirects `/en/*` away.
- Write paths English-style and pass them through `localePath(lang, path)` (`lib/i18n/routes.ts`). Never hardcode `/id`.
- Bahasa stays offline until `published` is true in `content/i18n/id/site.json`, set in **/admin/translations**, which needs required copy done. `requireLive()` makes those pages 404 until then. Before launch only Bahasa posts are public, at their old `/jurnal` URLs. After launch `/jurnal/*` and `/kontak` redirect permanently to `/id`.
- Each page is canonical to itself. `alternatesFor()` in `lib/seo.ts` adds hreflang `en`, `id` and `x-default` (English) only when both versions are live. Every route's metadata goes through it, and `app/sitemap.ts` repeats it in `alternates.languages`.
- Never redirect by IP or browser language: Google must be able to crawl both versions.
- A language must not mix. Interface text comes from `content/site/ui.json` plus the Bahasa overlay, read with `getSite(lang)` or `useSite()`. Do not hardcode user-facing strings in components.
- A project shows on `/id/work` only with its Bahasa copy; a case study also needs its story. Unpaired posts have no hreflang and the language link goes to the journal list.

## Case studies and service pages

- `/work/<id>` exists only for non-draft projects with `caseStudy: true`. The owner reviews each project's claims before switching it on.
- `/services/<slug>` and `/id/services/<slug>` come from `content/service-pages.json`, one record per language linked by `alternate`. Drafts have no route and no sitemap entry. Not in the navbar: `serviceLinks` adds them to the home footer line and Keep reading.
- Both enter `app/sitemap.ts` automatically. `/work` keeps `template: true` so `/work/[id]` titles get the suffix.

## Admin CMS routes

- Everything under `/admin`, `/api` and `/preview` is non-SEO surface. `/preview/<token>` (admin draft previews) sets `robots: noindex` and is disallowed in `app/robots.ts`.
- `/admin` and `/api`: `app/admin/layout.tsx` sets `robots: { index: false, follow: false }`, `app/robots.ts` disallows `/admin` + `/api/`, and admin routes must **never** enter `app/sitemap.ts`.
- Public pages live in `app/[lang]/` (Nov 2026) — English URLs unchanged. `app/[lang]/layout.tsx` is a root layout with `PortfolioShell`, GA and the global metadata; `app/admin/layout.tsx` is the admin's own root layout.
- Prod admin saves commit to `main` and republish via Vercel rebuild — SEO verification steps below still apply after content changes deploy.

## Adding a route — SEO checklist

1. `app/[lang]/<route>/layout.tsx` with full metadata (above), and `requireLive(lang)` in the page.
2. Add to `content/site/navigation.json` only if it belongs in the navbar.
3. Add to the `pages` array in `app/sitemap.ts`.
4. (Background videos were retired with the Working Folder revamp, Oct 2026 — no per-route video entry is needed.)
5. Prefer a **server component** for any content-bearing page so crawlers get real HTML; isolate interactivity in child client components.
6. **No event handlers in server component page files** — use CSS classes (public site: `app/[lang]/site.css`) for hover effects, not `onMouseEnter`/`onMouseLeave`.

## Journal posts (English — `/journal`)

- Posts are MDX files in `content/journal/*.mdx`. Frontmatter: `title`, `description`, `date` (YYYY-MM-DD), `tags`, `draft`.
- `draft: true` posts never render, list, or enter the sitemap — publishing is flipping the flag and updating `date`.
- Per-post SEO is automatic via `app/[lang]/journal/[slug]/page.tsx`: `generateMetadata` (title, description, canonical, OG article) and `Article` JSON-LD with `inLanguage` set to the post's language. Do not add manual meta tags inside post content.
- `lib/journal.ts` is the only reader; `app/sitemap.ts` pulls post URLs and dates from it. New posts need no sitemap edits.
- Post `description` doubles as the meta description — write it as a search snippet (under ~160 chars, contains the topic keyword).
- Posts should cross-link related posts and end client-facing posts with a CTA linking `/contact`. The "Keep reading" block adds links automatically; `related` in frontmatter (post editor) overrides the pick.
- Dates must be staggered (not all the same) — Google uses recency as a freshness signal. Update `date` when making substantial edits.

## Jurnal posts (Bahasa Indonesia — `/jurnal`)

- Posts are MDX files in `content/jurnal/*.mdx`. Same frontmatter shape as `/journal`: `title`, `description`, `date` (YYYY-MM-DD), `tags`, `draft`.
- `lib/jurnal.ts` is the only reader. `app/sitemap.ts` pulls from both `getJournalPosts()` and `getJurnalPosts()`. New posts need no sitemap edits.
- Public URL is `/id/journal/<slug>` after launch and `/jurnal/<slug>` before. The journal list links to the other language near the eyebrow.
- Bahasa posts are written natively, not translated. Same-topic posts can be paired, and the rest stay in their own language.
- Optional pairing: `alternate: "<slug>"` in both posts' frontmatter (set in the admin "Bahasa version" panel, kept mutual automatically). Only a mutual, published pair emits `alternates.languages` (hreflang en/id) and the article's language-switch link (`lib/post-lang.ts`); a one-sided or draft link is ignored.

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
- End posts with a CTA to contact. Write links as `/contact`, `/journal/<slug>` or `/services/<slug>`: `contentHref()` maps them to the Bahasa URLs, and also accepts the older `/kontak` and `/jurnal/<slug>` forms.
- `description` should read naturally in Bahasa and contain the primary search term.
- Do NOT write `/jurnal` posts in English. Do NOT mix languages within a post.

## Icons

- **Favicon is `app/favicon.ico`** — the stamp portrait (refreshed Oct 2026, owner-approved). Keep it the only `icons.icon` entry; do not add `icon.svg` to the metadata `icons.icon` list (browsers prefer SVG over ICO).
- The stamp app-icon set (`public/icon.svg` source, `public/apple-icon.png` 180, `public/icon-192.png` / `icon-512.png`) serves iOS home-screen and the PWA manifest. Regenerate favicon + all app icons together so they stay in sync.
- `public/logo.svg` is the text wordmark — never reference it as a favicon/app icon (it imports a remote font and is non-square).
- Keep `manifest.json` `background_color`/`theme_color` on the Working Folder paper `#F8F6F0` (was `#0c0908` before the Oct 2026 revamp).

## Revamp guardrails (Working Folder, Oct 2026)

- Page headings keep their CMS text, and every public page has exactly one `h1` (Nov 2026: `/work`, `/about`, `/contact` moved from `h2`); visual line breaks go through `sentenceLines()` / `<br className="f-br-*">` so text content is unchanged. Never duplicate copy per breakpoint.
- `/privacy` text lives in `content/privacy/<lang>.mdx` (Bahasa editable in **/admin/translations**, not in the navbar; linked from the cookie banner). Bump its `updated` date when the policy text or the site's data handling (analytics, storage keys, third parties) changes, in both languages.
- `app/[lang]/not-found.tsx` renders the 404 per language, with `app/global-not-found.tsx` for anything outside it — Next sends HTTP 404 + noindex; never add it to the sitemap.
- Article `##` headings get `id`s for the in-page index; their text must stay untouched.

## Verification

- `npm run lint` is broken (pre-existing ESLint 9 config crash) — `npm run build` is the quality gate; it type-checks and prerenders every page, and fails on metadata type errors.
- After SEO-affecting changes, verify on a local prod server: `<title>` per page, `rel="canonical"` per page, `/sitemap.xml` URL count, and JSON-LD presence on article pages.
- Off-site steps (Google Search Console sitemap submission, request-indexing) are manual and happen after deploy — code changes alone do nothing until deployed.

# Keyword, intent and competitor research: English

Run 8 Nov 2026 with OpenSEO (DataForSEO + live Google reads). Language `en`. Volumes are monthly Google estimates. KD is OpenSEO keyword difficulty. Companion to `SEO_KEYWORD_RESEARCH_ID.md`. The two markets are different, so the page lists differ on purpose.

## 0. Market choice and how to read the numbers

- **Demand market = United States (location 2840).** English clients are remote and come from anywhere, so the US gives the deepest, most reliable volume data. Indonesia in English is almost empty (table below), so do not plan English pages around Indonesia or Bandung.
- **Same-number volumes are shared.** `hire react developer` and `react developer for hire` both show 720 / $160 CPC; `website redesign services` and `web design services` both show 5,400 / $18.55. Google groups close variants. Do not add them up.
- **KD 0 is not "easy".** Many terms show KD 0 (`hire next.js developer`, `frontend development services`). The live results say platforms and agencies hold them. Trust the SERP tables over KD, as in the Bahasa report.
- **Not measured:** UK, Australia and Singapore separately. Phrase-level checks (`freelance web developer uk` 10, `web developer singapore` 10, `web design australia` 10) show country-modified pages are not worth building.
- **CPC is high on almost everything ($18 to $160).** Advertisers pay for these clicks, which says the leads are worth real money. It also says the SERP has paid ads above the organic rows.

## 1. Where jamalakbara.com stands today

| Check | Result |
|---|---|
| Search Console, 5 Aug to 5 Nov 2026 | 6 queries, all name variants (`jamal akbar`, `akbar alam`, `akbar jamal`). 0 clicks, 16 impressions in total. |
| Pages with impressions | `/` 24 (avg pos 6.4) · `/about` 11 (8.2, the only click) · `/journal` 6 · `/work` 5 (pos 46) · four journal posts 1 to 5 each |
| Brand SERP, US, `jamal akbar alam` | jamalakbara.com is #4 ("Jamal Akbar Alam — Developer & Designer"). Another "Jamal Akbar Alam - Backend & Frontend Developer" profile sits at #2. Find out whose it is and whether it is yours. |
| `jamalakbara` | Not found. Google treats it as a typo of other names. Brand is `Jamal Akbar Alam`, not the domain. |
| Domain data (organic traffic/keywords) | None. No ranked keywords yet in any market. |
| English service pages | None. `content/service-pages.json` only holds Bahasa records. All current English ranking potential sits on home, about, work and the journal. |

Takeaway: the site is indexed and wins its own name. It has no page that matches a buyer query yet.

## 2. What people searching in English want

| Intent | Example queries (US vol, KD, CPC) | What the SERP shows | Fit |
|---|---|---|---|
| **Hire a stack specialist** (commercial/transactional) | hire react developer 720, KD 8, $160 · react developer for hire 720 · hire next.js developer 170, KD 0, $104 · hire full stack developer 480, KD 2, $37 · hire front end developer 140, KD 11, $74 | Offshore agency landing pages titled "Hire X Developers" (zignuts, nextwebi, kanhasoft, serviots, softaims, techformation) plus Toptal and Arc.dev lists, Reddit threads, paid ads | **Best.** One focused page per stack is the winning format, and it fits your React/Next.js work. |
| **Hire a service by deliverable** (commercial) | frontend development services 390, KD 0 · web app development services 720, KD 13 · custom web application development 260, KD 4 · mvp development services 590 · landing page design services 720, KD 16 | Agency service pages and "best agencies" listicles | **Good.** Specific, lower competition than "web design services". |
| **Website for a business** (commercial) | small business web design 1,900, KD 21 · business website design 1,000, KD 40 · corporate website design 260, KD 2 · web design for startups 170 | US agencies, GoDaddy/Wix, Forbes lists, olidenson.com at #1 | **Good** with proof (work, price, process). Use "business/corporate website". Nobody in the US searches "company profile". |
| **Redesign / migrate** (commercial) | website redesign services 5,400, KD 10, $18.55 · website migration services 590, KD 8, $75 | Listicles (amasty, silvamarketingco) + agencies (phenomenonstudio, webfx, digitalsilk) | **Best volume-to-effort.** A WordPress to Next.js angle is yours to own. |
| **Hire a designer** (commercial) | freelance web designer 2,400, KD 16 · hire a web designer 1,300, KD 25 · ui ux design services 590, KD 15 · ux design services 590 · hire ui ux designer 140, $106 | Listicles (designrush, punchlist, linkupst), Upwork, Toptal, Clutch, US agencies, Reddit, People Also Ask | **Medium.** Directory-led. Fold UI/UX into the website pages, one dedicated page later. |
| **Hire a mobile app builder** (commercial) | mobile app development services 12,100, KD 29, $36 · hire app developer 1,600, KD 13, $98 · freelance mobile app developer 480, KD 15 · hire react native developer 320, KD 18 | Agencies (zazz.io, binary-studio, uptech), Upwork/Toptal/Arc, Reddit | **Medium.** Big but agency territory. Target the freelancer and React Native terms, not the 12,100 head. |
| **Hire a Shopify builder** (commercial) | shopify web design 880, KD 30 · hire shopify developer 390, KD 46 · shopify store development 390, KD 39 · freelance shopify developer 140, KD 20 · shopify developer for hire 70, KD 10 | shopify.com #1 on both main queries, then agencies and Upwork | **Later.** Winnable only on the long tail. |
| **Price check** (commercial + info) | how much does a website cost 1,900, KD 19 · website design cost 1,300, KD 17 · web design cost 1,300 · how much does a shopify store cost 210 | Not pulled this run | **Journal.** A real price range is a gap competitors avoid. Inspect the SERP before writing. |
| **Compare options** (commercial) | shopify vs wordpress 590, KD 0 · next.js vs react 2,400, KD 5 (CPC $0.03) | Dev blogs (radixweb, toptal, imaginarycloud) | Shopify vs WordPress is a buyer question. Next.js vs React is a developer audience, so it only helps if written for business owners. |
| **Freelancer advice / jobs** | freelance web developer 1,000, KD 20 · creative developer 70 · creative technologist 1,300 · ux design jobs 6,600 | Reddit "is it worth it", Upwork job boards, Indeed, Awwwards jobs, Codecademy | **Skip.** Wrong reader. Applies even to "freelance web developer": the SERP answers people wanting to *become* one. |
| **Inspiration** | portfolio website design 1,600, KD 40 · web developer portfolio 590 · ux portfolio 1,900 | Dribbble #1, Awwwards, Behance, Pinterest | **Maybe.** "Portfolio website design" can be a real service ("I build portfolio sites for designers"), with this site as the proof. |
| **Learn** | what is ux design 5,400 · figma to react 170 · react tutorial 135,000 | Docs, Figma blog, dev.to | **Skip.** Developers, not buyers. |
| **Indonesia in English** | web design bali 260 (KD 24) · web design indonesia 110 (KD 81) · web developer indonesia 50 · web developer bandung 20 · hire indonesian developer ~0 | Bali agencies (local pack); Bandung and Indonesia SERPs are job boards | **Skip as targets.** Use "Indonesia" as a trust and price signal, not a keyword. |

SERP features seen: AI Overview on every query, People Also Ask on the design and Shopify queries, paid ads on `hire react developer` and `hire app developer`, forum/Reddit blocks on most.

## 3. Priority keyword map

Order is by (buyer fit × winnable × effort). Volumes are US.

| Wave | Page (English URL) | Primary (vol, KD) | Secondary | Why this one |
|---|---|---|---|---|
| 1 | `/services/nextjs-react-developer` | hire react developer (720, 8) | hire next.js developer (170, 0) · react development services (210, 21) · next.js development services (110, 14) · hire front end developer (140, 11) · frontend development services (390, 0) · hire full stack developer (480, 2) | Highest CPC ($74 to $160). SERP is single-page agency templates that a real portfolio can beat. |
| 1 | `/services/website-redesign` | website redesign services (5,400, 10) | website migration services (590, 8) · web design and development (1,600, 47) · wordpress to next.js migration (not measured) | Biggest English volume with low KD. Your journal already covers rebuilding sites. |
| 1 | `/services/business-website` | small business web design (1,900, 21) | business website design (1,000, 40) · corporate website design (260, 2) · web design for startups (170, 0) | Closest English match to the Bahasa company-profile page. |
| 2 | `/services/web-app-development` | web app development services (720, 13) | custom web application development (260, 4) · mvp development services (590, 0) · startup web development (90) · saas web design (320, 16) | Uses your backend skills, which the English site barely sells yet. |
| 2 | `/services/landing-page-design` | landing page design services (720, 16) | landing page designer (140, 38) · hire landing page designer (40, 0) | Same deliverable as Bahasa, bigger volume. Superside and listicles lead. |
| 2 | `/services/mobile-app-development` | hire app developer (1,600, 13) | freelance mobile app developer (480, 15) · hire react native developer (320, 18) | Only if you want app clients. Do not chase the 12,100 head term. |
| 3 | `/services/shopify-development` | shopify web design (880, 30) | hire shopify developer (390, 46) · shopify store development (390, 39) · freelance shopify developer (140, 20) | shopify.com blocks the top. Needs proof and a case study. |
| 3 | `/services/ui-ux-design` | ui ux design services (590, 15) | ux design services (590) · hire ui ux designer (140, 0) | Agencies and Clutch dominate. Link from the website pages first. |
| 3 | `/services/portfolio-website-design` | portfolio website design (1,600, 40) | portfolio website developer (590, 22) | Optional niche. Wins only with a visible portfolio of portfolios. |
| Journal | pricing guide | how much does a website cost (1,900, 19) | website design cost (1,300, 17) · web design cost (1,300) | Check the SERP before writing. State real ranges and what changes the price. |
| Journal | Shopify vs WordPress for a small business | shopify vs wordpress (590, 0) | how much does a shopify store cost (210, 13) | Buyer question. Links to the Shopify and business-website pages. |
| Journal | WordPress to Next.js migration | website migration services (590, 8) | | Supports the redesign page. |
| Journal | Next.js vs React for business sites | next.js vs react (2,400, 5) | | Only as a business-owner explainer. Developers searching this will not hire. |

Home page stays brand-led: `Jamal Akbar Alam` + "developer and designer". Do not target "creative developer" (70 searches, job seekers). Use the role as brand, not a keyword.

## 4. Competitors

### Platforms (cannot beat; use as price anchors and profile channels)
Upwork (top 3 on hire queries), Toptal, Arc.dev, Fiverr, Freelancer, PeoplePerHour, Contra, Codementor, Lemon.io, Twine, Guru, ZipRecruiter, Indeed. **Dribbble, Behance and Awwwards** own the portfolio and creative queries. A profile on Contra, Dribbble or Behance is a brand channel, not a ranking plan.

### Community sites (answer, do not outrank)
Reddit is the most visible domain across the set: avg position 2.8 on 13 of the 30 queries (hire freelance web developer #1, hire UI/UX designer #1, offshore web developer #1, creative developer #1). Quora and YouTube also appear. Real answers in relevant threads are worth more than a blog post here.

### Listicles and directories (get listed; they also feed AI Overviews)
designrush, clutch, punchlist, linkupst, amasty, revenuebase, techbehemoths, superside, forbes. Pitch inclusion where free.

### Offshore agencies: your closest rivals for "hire X developer"
zignuts, nextwebi, kanhasoft ("from $18/hr, US-aligned team"), serviots, softaims, techformation ("top 1% in 24 hours"), thetechclouds, bitsclan, mindpathtech, ishir, inheritx, mindinventory, acquaintsoft, belitsoft, sciflare, openxcell, zazz.io, binary-studio, uptech.

What they have in common: one landing page per stack, a rate or speed hook, trust badges. Their sites are small (nextwebi: 321 keywords, ~27 estimated visits). Pages like these rank on templated copy, so a credible one-person page with real work should compete.

### US design agencies (redesign / small business / UI/UX)
phenomenonstudio, madmindstudios, webfx, digitalsilk, 3plains, brand-theory, silvamarketingco, effectivesoft, kopiustech, digitalscientists, halo-lab, artversion, thriveagency, netlynxinc. Pitch a team and a price floor; you will not beat them on scale.

### Solo / small-site benchmarks
| Domain | Est. organic visits | Keywords | Notes |
|---|---|---|---|
| olidenson.com | 4 | 29 | #1 for small business web design and website design services in the live SERP read. Its traffic estimate looks low for that rank (another report shows 1,444). Open the page and study its structure. |
| skfreelancers.com | n/a | n/a | #3 small business web design, #2 website design services. A directory, so it also means directories are winnable. |
| ryangittings.co.uk | 38 | 77 | #3 for freelance web designer with a long guide. Proof that one solid page can rank. |

### Bali and Indonesia (English)
baliwebpro.com, webhance.com.au, id.timedoor.net, mousmedia.com, mahadisuta.com for web design bali. Directory pages for hiring Indonesian developers: asiatal, secondtalent, emerhub, recruitgo, realgreatdevs. All Bali or directory plays. Bandung has none. Not a market for English pages.

## 5. Gaps you can own

- **The solo-expert page.** Offshore agencies sell "dedicated developers" with a pitch for 50 stacks. A page that says "I build it, Next.js, here is the work, here is the price range" is rare among results.
- **Fixed price ranges and timelines.** Agencies hide price behind a form. Pricing and "how much" queries add up to roughly 4,000 searches (variants overlap).
- **Redesign and WordPress migration told as a story.** Your site is a documented rebuild (`building-jamalakbara-com`, `typescript-content-modules`). Few agencies show a before/after with performance numbers.
- **Fast, accessible, SEO-ready builds** (Core Web Vitals, WCAG) as the proof point. The service data already lists these.
- **Rate and time-zone clarity** for US/EU/AU clients: Bandung is UTC+7. A visible overlap window answers the offshore objection directly.

## 6. Do next

1. Publish wave 1 pages in `content/service-pages.json` with `lang: "en"` records (admin: /admin/service-pages). Each needs the primary keyword in `title`, H1 and first paragraph, a price range, one project proof, and a CTA to `/contact`.
2. Structured data for service pages is already handled by `components/structured-data.tsx`. Add FAQ markup only where the page shows the same FAQ.
3. Write the pricing guide after reading its SERP.
4. Link the four existing journal posts (`web-development`, `app-development`, `shopify-development`, `company-profile-development`) to the matching service pages.
5. Create or update profiles on Contra, Dribbble and Behance, link back to the service pages.
6. Add the 20 or so wave 1 and 2 keywords to rank tracking (US, desktop + mobile) and recheck in 8 to 12 weeks. Expect slow movement: the domain has no backlinks or rankings yet. Backlinks were not checked in this run.
7. Re-pull Search Console after wave 1 is live. Today it only has name queries.

## 7. Data notes

- Credits used: 486 (9,552 before, 9,066 after).
- Volumes are Google Ads-style estimates for the US. They are not leads.
- SERPs were read three times and merged. A site seen once is weak evidence.
- Estimated traffic for tiny sites varies between tools. Treat them as order of magnitude.

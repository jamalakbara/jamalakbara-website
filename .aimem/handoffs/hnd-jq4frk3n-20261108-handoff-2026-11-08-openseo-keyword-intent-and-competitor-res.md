---
aimem: 1
id: hnd-jq4frk3n
type: handoff
title: "Handoff 2026-11-08: OpenSEO keyword, intent and competitor research for Indonesia, written up in docs/SEO_KEYWORD_RESEA…"
summary: "Done: OpenSEO keyword, intent and competitor research for Indonesia, written up in docs/SEO_KEYWORD_RESEARCH_ID.md. · Next: Owner reviews content/i18n/id/site.json, then set published:true via /admin…"
status: final
trust: agent
roles: [all]
author: agent:claude-code:sonnet-5.5
created: 2026-11-08T08:15:55Z
updated: 2026-11-08T08:15:55Z
branch: feat/bilingual
---

## Done
- OpenSEO keyword, intent and competitor research for Indonesia, written up in docs/SEO_KEYWORD_RESEARCH_ID.md.
- Five Bahasa service pages in content/service-pages.json: jasa-website-bandung, company profile, landing page, toko online (Shopify, WooCommerce, custom), aplikasi mobile. Each has 6 sections and 8 FAQ items, prices, scope, 50/50 payment, one month free maintenance. Owner reviewed and edited the copy. All set to draft:false.
- Pricing post content/jurnal/biaya-pembuatan-website.mdx, rewritten to plain native Bahasa, with the price list and scope. draft:false.
- Bahasa overlay content/i18n/id/site.json filled: pages 22/22, interface 187/187, nav (Home, Work, Jurnal, About, Kontak), tagline, location, three SEO descriptions. published is still false.
- Previewed on the dev server (post and pages render, links 200, canonical and JSON-LD present). npm run build passes after the overlay change.

## Not done
- Bahasa not published (published:false). Nothing committed or merged: feat/bilingual has uncommitted changes.
- Owner has not reviewed the new overlay copy in id/site.json (home, work, about, interface strings, nav labels).
- With published:false the post is live at /jurnal/biaya-pembuatan-website but its service-page links 404.
- Assumptions not confirmed by owner: 2 revision rounds, scope limits (7 sections, 5 pages, 20 products, 8 screens), definition of the free maintenance month, mobile app at Rp25 juta.
- aboutParagraphs, jobTitles and business services arrays in the overlay are left as English fallback or empty.

## Next
- Owner reviews content/i18n/id/site.json, then set published:true via /admin/translations.
- Commit on feat/bilingual, merge to main, deploy, submit sitemap in Search Console and request indexing.
- Preview /id home, work, about with the new copy after publishing locally.
- Add WooCommerce and WordPress to knowsAbout in /admin/seo.
- More journal posts from the research plan: cara membuat website, apa itu UI/UX and UI vs UX, apa itu web developer.

## Blocked
none

## Notes for next agent
Voice and pricing decisions are recorded (see Bahasa copy voice and Service pricing). Keep prices consistent across the post, "Soal biaya" sections and FAQs. Caveman style in chat only; content files are written normally.

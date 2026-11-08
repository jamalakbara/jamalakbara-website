---
aimem: 1
id: dec-9xkaedsv
type: decision
title: "Bilingual site: app/[lang] with proxy rewrite, English at root, Bahasa under /id"
summary: English URLs stay unchanged via proxy rewrite to /en. Overlays in content/i18n/id. Bahasa offline until published in /admin/translations.
status: proposed
trust: verified
roles: [all]
author: human:akbar
created: 2026-11-07T14:55:37Z
updated: 2026-11-07T14:55:37Z
verified: 2026-11-07
---

Chosen over next-intl and separate route trees: proxy.ts already ran on all public paths, and app/[lang] gives a real html lang. Rejected localized path segments to keep hreflang and links simple. Journal stays native with four pairs. /jurnal rewrites to /id/journal before launch and redirects after.

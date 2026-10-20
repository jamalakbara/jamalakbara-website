---
aimem: 1
id: dec-s4pymdn6
type: decision
title: Per-route SEO is admin-editable via pages.<route>.seo
summary: /work /about /contact /journal use buildPageMetadata() (lib/seo.ts); home title/description wired directly in root app/layout.tsx as the site-wide default.
status: accepted
trust: agent
roles: [all]
tags: [seo, cms]
paths: [lib/seo.ts, content/site/pages.json, app/layout.tsx, app/(site)/*/layout.tsx]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:40Z
updated: 2026-10-20T03:28:29Z
links: [dec-rpqe6kjf, dec-qssdnxaa, dec-z8vym4nz]
---

Layout inline object = fallback when the CMS field is blank. Home has no '%s | Jamal Akbar Alam' suffix (appendBrand={false}). New admin-editable route: extend pagesSchema seo field, seed pages.json, route layout through buildPageMetadata().

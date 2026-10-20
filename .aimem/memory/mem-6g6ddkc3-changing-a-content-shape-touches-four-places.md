---
aimem: 1
id: mem-6g6ddkc3
type: memory
title: Changing a content shape touches four places
summary: lib/content-types.ts interface, lib/content/schemas.ts zod schema, the admin form, and lib/site-data.ts if pages read a shaped constant.
status: active
trust: agent
roles: [all]
tags: [cms, content]
paths: [lib/content-types.ts, lib/content/schemas.ts, lib/site-data.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:15Z
updated: 2026-10-20T03:28:15Z
links: [dec-rpqe6kjf]
kind: howto
---

1. Interface in lib/content-types.ts (site read path types).
2. Zod schema in lib/content/schemas.ts (admin write-path validation only).
3. The admin form under app/admin/(protected)/.
4. lib/site-data.ts if pages consume a derived constant (NAV_LINKS, home, works, about, contact).
npm run build then catches mismatches against content/*.json.

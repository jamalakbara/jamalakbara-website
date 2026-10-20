---
aimem: 1
id: dec-rpqe6kjf
type: decision
title: Custom git-backed CMS at /admin, zero database
summary: Content is files in the repo; /admin saves commit to main via GitHub API and Vercel rebuild publishes. Chosen over Keystatic/Payload/Sanity/Neon.
status: accepted
trust: agent
roles: [all]
tags: [cms, architecture, admin]
paths: [lib/admin/**, app/admin/**, content/**, lib/content/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:26:16Z
updated: 2026-10-20T03:27:36Z
---

Decided 2026-07-09 by the owner. Rejected alternatives: Keystatic, Payload, Sanity, a Neon Postgres DB.

- Content: content/projects.json (array order = display order), content/site/*.json singletons, content/journal/*.mdx, content/jurnal/*.mdx.
- Write path: lib/admin/content-store.ts only. Local dev = fs writes to the working tree; on Vercel = git commits to GITHUB_CONTENT_BRANCH via lib/admin/github.ts, which triggers a rebuild (~1-2 min).
- Auth: GitHub OAuth (next-auth v5), single allowed login ADMIN_GITHUB_LOGIN, JWT session, no user DB. proxy.ts gate + requireAdmin() in every action/route.
- Media: Cloudinary, signed direct uploads; content stores plain secure_url strings. Branding files (logo/favicon/app icons) are edited as repo binaries via the same commit path.
- Site reads content via static JSON imports at build time (lib/content/index.ts) — no runtime fetch.

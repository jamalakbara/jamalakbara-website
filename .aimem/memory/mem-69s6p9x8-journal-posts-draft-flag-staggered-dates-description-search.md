---
aimem: 1
id: mem-69s6p9x8
type: memory
title: "Journal posts: draft flag, staggered dates, description = search snippet"
summary: draft:true never renders/lists/sitemaps; stagger and bump dates on substantial edits; description under ~160 chars with topic keyword; end client posts with /contact CTA.
status: active
trust: agent
roles: [all]
tags: [seo, journal]
paths: [content/journal/**, content/jurnal/**, lib/journal.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:17Z
updated: 2026-10-20T03:28:17Z
links: [dec-qssdnxaa]
kind: constraint
---

Frontmatter: title, description, date (YYYY-MM-DD), tags, draft. Publishing = flip draft and update date. Per-post metadata and Article JSON-LD are automatic from app/(site)/journal/[slug]/page.tsx — no manual meta in content. English voice: thoughtful, opinionated first person. Full rules: .claude/rules/seo.md.

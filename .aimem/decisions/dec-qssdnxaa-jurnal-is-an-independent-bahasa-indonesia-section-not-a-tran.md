---
aimem: 1
id: dec-qssdnxaa
type: decision
title: /jurnal is an independent Bahasa Indonesia section, not a translation
summary: Native casual gue/lo posts targeting Indonesian queries; not in navbar, linked from /journal; inLanguage id; hardcoded metadata (not admin-editable).
status: accepted
trust: agent
roles: [all]
tags: [seo, journal, i18n]
paths: [content/jurnal/**, app/(site)/jurnal/**, lib/jurnal.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:40Z
updated: 2026-10-20T03:27:40Z
---

Full rules in .claude/rules/seo.md. Never write /jurnal posts in English or mix languages. lib/jurnal.ts is the only reader; sitemap pulls from getJournalPosts() and getJurnalPosts().

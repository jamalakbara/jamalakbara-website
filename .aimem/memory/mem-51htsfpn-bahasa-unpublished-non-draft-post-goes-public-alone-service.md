---
aimem: 1
id: mem-51htsfpn
type: memory
title: "Bahasa unpublished: non-draft post goes public alone, service pages 404"
summary: With published:false, /jurnal/<slug> posts are live but /id/services/* 404, so post links to service pages break.
status: active
trust: agent
roles: [all]
tags: [bahasa, publish, gotcha]
paths: [content/i18n/id/site.json, lib/i18n/targets.ts, lib/i18n/completeness.ts]
author: agent:claude-code:sonnet-5.5
created: 2026-11-08T08:15:40Z
updated: 2026-11-08T08:15:40Z
kind: gotcha
---

While content/i18n/id/site.json has published:false, a non-draft Bahasa journal post is still public at /jurnal/<slug> and in the sitemap, but /id/services/* returns 404 (requireLive) and stays out of the sitemap. So a post that links to service pages has dead links until Bahasa is published.

Setting published:true in the file skips the admin completeness check. The check requires three groups complete: pages, interface text, privacy. On 8 Nov 2026 the overlay was filled (pages 22/22, interface 187/187) so publishing is possible, but the owner still has to review that copy first. Python or admin can count missing fields; completeness lives in lib/i18n/completeness.ts.

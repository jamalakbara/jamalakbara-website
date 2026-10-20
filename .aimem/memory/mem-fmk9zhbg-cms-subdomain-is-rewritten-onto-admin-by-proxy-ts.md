---
aimem: 1
id: mem-fmk9zhbg
type: memory
title: cms.* subdomain is rewritten onto /admin by proxy.ts
summary: Bare paths on cms.* rewrite to /admin/*; /admin/* on cms.* redirects to the clean path; /api/admin is exempt. Auth redirects use clean paths on that host.
status: active
trust: agent
roles: [all]
tags: [admin, routing]
paths: [proxy.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:44Z
updated: 2026-10-20T03:27:44Z
kind: gotcha
---

Admin Link hrefs are hardcoded /admin/*, so following them on cms.* would leak the prefix — hence the redirect-then-rewrite dance (commits ab7e304, 7f16eb3, 2026-07-11). Keep this in mind when adding admin links or auth redirects.

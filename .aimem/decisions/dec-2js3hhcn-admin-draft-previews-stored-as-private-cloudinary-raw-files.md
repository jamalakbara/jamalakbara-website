---
aimem: 1
id: dec-2js3hhcn
type: decision
title: Admin draft previews stored as private Cloudinary raw files behind HMAC /preview links
summary: "No DB: unsaved editor state uploads to Cloudinary admin-previews/<kind>-<slug>.json (type private); /preview/<token> is HMAC(AUTH_SECRET), 1h expiry."
status: proposed
trust: agent
roles: [all]
tags: [admin, preview, cloudinary]
paths: [lib/admin/preview.ts, app/(site)/preview/**]
author: agent:claude-code
created: 2026-10-20T17:32:04Z
updated: 2026-10-20T17:32:04Z
---

Owner chose Cloudinary raw over Vercel Blob (new service) and saved-only previews (no unsaved edits). One file per item, overwritten each preview, so storage stays bounded. Link is public-by-token so it can be shared; noindex + robots disallow. Rejected: draft mode on real routes (pages are static, content not available at runtime).

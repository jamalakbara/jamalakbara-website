---
aimem: 1
id: mem-4e26qg9z
type: memory
title: Cloudinary cloud dh0spkwh3 hosts all project images
summary: Folder portfolio/images, work-* public IDs, q_auto,f_auto; row media strip = gallery (max 3) else image. Brand artwork is SVG in public/brand/.
status: active
trust: agent
roles: [all]
tags: [media, cloudinary]
paths: [lib/cloudinary.ts, public/brand/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:18Z
updated: 2026-10-20T03:28:18Z
kind: fact
---

Helpers in lib/cloudinary.ts: getCloudinaryUrl, getProjectImageUrl, getCloudinaryBaseUrl. Cloud name from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Admin uploads are signed direct uploads (app/api/admin/media/sign) using server-only CLOUDINARY_API_KEY/SECRET. Identity artwork (stamp, stickers, number tiles, icons) is vector SVG in public/brand/, not Cloudinary.

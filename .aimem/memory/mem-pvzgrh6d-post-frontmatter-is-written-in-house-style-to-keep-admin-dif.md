---
aimem: 1
id: mem-pvzgrh6d
type: memory
title: Post frontmatter is written in house style to keep admin diffs minimal
summary: serializePost writes JSON-quoted scalars and inline tag arrays; all 17 posts round-trip byte-identical. gray-matter stringify re-dumps YAML and churns every line.
status: active
trust: agent
roles: [all]
tags: [admin, content]
paths: [lib/admin/posts.ts]
author: agent:claude-code
created: 2026-10-20T17:32:14Z
updated: 2026-10-20T17:32:14Z
---

Fact: lib/admin/posts.ts serializePost emits title/description/date/tags/draft/alternate in the existing file style. Why: the old matter.stringify path rewrote quotes and tag arrays on every save. Verify: read+serialize every content/{journal,jurnal}/*.mdx and compare to disk.

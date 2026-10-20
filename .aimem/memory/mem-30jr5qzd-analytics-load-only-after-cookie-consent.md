---
aimem: 1
id: mem-30jr5qzd
type: memory
title: Analytics load only after cookie consent
summary: GA via @next/third-parties gated by CookieConsentManager (localStorage key cookie-consent).
status: active
trust: agent
roles: [all]
tags: [analytics, privacy]
paths: [lib/analytics/**, components/analytics/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:17Z
updated: 2026-10-20T03:28:17Z
kind: fact
---

lib/analytics/consent.ts persists consent categories (necessary/analytics/marketing/preferences) to localStorage key cookie-consent. components/analytics/GoogleAnalytics.tsx renders GA only with analytics consent. Measurement ID: NEXT_PUBLIC_GA_MEASUREMENT_ID.

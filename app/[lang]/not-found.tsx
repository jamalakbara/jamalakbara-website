"use client";

import { NotFoundView } from "@/components/site/not-found-view";

// 404 inside the language layout: notFound() and unknown URLs land here.
// Next returns HTTP 404 + noindex.
export default function NotFound() {
  return <NotFoundView />;
}

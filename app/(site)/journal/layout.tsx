import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

// template: true re-declares the title template so it still reaches
// /journal/[slug] pages (a plain-string title here would stop it).
export const metadata: Metadata = buildPageMetadata(
  "journal",
  "/journal",
  {
    title: "Journal",
    description:
      "Journal by Jamal Akbar Alam — build logs and notes on web development and design: Next.js, animation, UI engineering, and the craft behind the work.",
  },
  { template: true },
);

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

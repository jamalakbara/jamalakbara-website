import type { Metadata } from "next";

const description =
  "Journal by Jamal Akbar Alam — build logs and notes on web development and design: Next.js, animation, UI engineering, and the craft behind the work.";

export const metadata: Metadata = {
  // Re-declare the template: a plain-string title here would stop the root
  // template from reaching /journal/[slug] pages.
  title: {
    default: "Journal",
    template: "%s | Jamal Akbar Alam",
  },
  description,
  alternates: {
    canonical: "https://jamalakbara.com/journal",
  },
  openGraph: {
    title: "Journal — Jamal Akbar Alam",
    description,
    url: "https://jamalakbara.com/journal",
  },
  twitter: {
    title: "Journal — Jamal Akbar Alam",
    description,
  },
};

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

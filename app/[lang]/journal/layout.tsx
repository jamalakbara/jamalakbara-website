import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

// template: true re-declares the title template so it still reaches
// /journal/[slug] pages (a plain-string title here would stop it).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return buildPageMetadata(
    lang,
    "journal",
    "/journal",
    {
      title: "Journal",
      description:
        "Journal by Jamal Akbar Alam — build logs and notes on web development and design: Next.js, animation, UI engineering, and the craft behind the work.",
    },
    { template: true },
  );
}

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

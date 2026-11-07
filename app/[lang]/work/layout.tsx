import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

// template: true keeps the title template reaching /work/[id] pages.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return buildPageMetadata(
    lang,
    "work",
    "/work",
    {
      title: "Work",
      description:
        "Selected work by Jamal Akbar Alam — websites, web apps, and mobile products built across design and development, from interface to the code behind it.",
    },
    { template: true },
  );
}

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

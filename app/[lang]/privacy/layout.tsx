import type { Metadata } from "next";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  const { title, description } = getSite(lang).ui.privacy;
  const alternates = alternatesFor(lang, "/privacy");
  return {
    title,
    description,
    alternates,
    openGraph: {
      title: `${title} — Jamal Akbar Alam`,
      description,
      url: alternates.canonical,
      ...(lang === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title: `${title} — Jamal Akbar Alam`, description },
  };
}

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import type { Lang } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return buildPageMetadata(lang, "about", "/about", {
    title: "About",
    description:
      "About Jamal Akbar Alam — a developer and designer based in Bandung, Indonesia, who works across design and development to turn ideas into clean, fast, easy-to-use products.",
  });
}

export default async function AboutLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <StructuredData lang={lang} type="Person" />
      {children}
    </>
  );
}

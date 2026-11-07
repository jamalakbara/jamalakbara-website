import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import type { Lang } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return buildPageMetadata(lang, "contact", "/contact", {
    title: "Contact",
    description:
      "Got an idea? Get in touch with Jamal Akbar Alam — developer and designer in Bandung, Indonesia — for websites, web apps, and product design work.",
  });
}

export default async function ContactLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <StructuredData lang={lang} type="LocalBusiness" />
      {children}
    </>
  );
}

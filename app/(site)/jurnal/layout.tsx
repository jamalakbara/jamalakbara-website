import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

// template: true keeps the title template reaching /jurnal/[slug] pages.
export const metadata: Metadata = buildPageMetadata(
  "jurnal",
  "/jurnal",
  {
    title: "Jurnal",
    description:
      "Catatan dan tulisan dari Akbar, developer dan desainer dari Bandung. Tentang web development, Shopify, desain, dan proses di balik setiap build.",
  },
  { template: true, locale: "id_ID" },
);

export default function JurnalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

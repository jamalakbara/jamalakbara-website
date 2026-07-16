import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Jurnal",
    template: "%s | Jamal Akbar Alam",
  },
  description:
    "Catatan dan tulisan dari Akbar — developer dan desainer dari Bandung. Tentang web development, Shopify, desain, dan proses di balik setiap build.",
  alternates: { canonical: "https://jamalakbara.com/jurnal" },
  openGraph: {
    title: "Jurnal — Jamal Akbar Alam",
    description:
      "Catatan dan tulisan dari Akbar — developer dan desainer dari Bandung. Tentang web development, Shopify, desain, dan proses di balik setiap build.",
    url: "https://jamalakbara.com/jurnal",
  },
  twitter: {
    title: "Jurnal — Jamal Akbar Alam",
    description:
      "Catatan dan tulisan dari Akbar — developer dan desainer dari Bandung. Tentang web development, Shopify, desain, dan proses di balik setiap build.",
  },
};

export default function JurnalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

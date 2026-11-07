import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(
  "kontak",
  "/kontak",
  {
    title: "Kontak",
    description:
      "Punya ide website atau aplikasi? Hubungi Akbar, developer dan desainer di Bandung, buat ngobrol soal project kalian lewat WhatsApp atau email.",
  },
  { locale: "id_ID", languages: { en: "/contact", id: "/kontak" } },
);

export default function KontakLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <StructuredData type="LocalBusiness" />
      {children}
    </>
  );
}

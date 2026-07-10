import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("contact", "/contact", {
  title: "Contact",
  description:
    "Got an idea? Get in touch with Jamal Akbar Alam — developer and designer in Bandung, Indonesia — for websites, web apps, and product design work.",
});

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

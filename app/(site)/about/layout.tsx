import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("about", "/about", {
  title: "About",
  description:
    "About Jamal Akbar Alam — a developer and designer based in Bandung, Indonesia, who works across design and development to turn ideas into clean, fast, easy-to-use products.",
});

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

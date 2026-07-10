import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata("work", "/work", {
  title: "Work",
  description:
    "Selected work by Jamal Akbar Alam — websites, web apps, and mobile products built across design and development, from interface to the code behind it.",
});

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

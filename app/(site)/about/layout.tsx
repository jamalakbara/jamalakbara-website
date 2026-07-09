import type { Metadata } from "next";

const description =
  "About Jamal Akbar Alam — a developer and designer based in Bandung, Indonesia, who works across design and development to turn ideas into clean, fast, easy-to-use products.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: {
    canonical: "https://jamalakbara.com/about",
  },
  openGraph: {
    title: "About — Jamal Akbar Alam",
    description,
    url: "https://jamalakbara.com/about",
  },
  twitter: {
    title: "About — Jamal Akbar Alam",
    description,
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

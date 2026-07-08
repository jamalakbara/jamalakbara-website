import type { Metadata } from "next";

const description =
  "Got an idea? Get in touch with Jamal Akbar Alam — developer and designer in Bandung, Indonesia — for websites, web apps, and product design work.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: {
    canonical: "https://jamalakbara.com/contact",
  },
  openGraph: {
    title: "Contact — Jamal Akbar Alam",
    description,
    url: "https://jamalakbara.com/contact",
  },
  twitter: {
    title: "Contact — Jamal Akbar Alam",
    description,
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

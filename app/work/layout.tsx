import type { Metadata } from "next";

const description =
  "Selected work by Jamal Akbar Alam — websites, web apps, and mobile products built across design and development, from interface to the code behind it.";

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: {
    canonical: "https://jamalakbara.com/work",
  },
  openGraph: {
    title: "Work — Jamal Akbar Alam",
    description,
    url: "https://jamalakbara.com/work",
  },
  twitter: {
    title: "Work — Jamal Akbar Alam",
    description,
  },
};

export default function WorkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

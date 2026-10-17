import type { Metadata } from "next";

const url = "https://jamalakbara.com/privacy";
const description =
  "Privacy policy for jamalakbara.com — what data the site collects, how Google Analytics cookies are used with your consent, and how to get in touch about it.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: url },
  openGraph: {
    title: "Privacy Policy — Jamal Akbar Alam",
    description,
    url,
  },
  twitter: {
    title: "Privacy Policy — Jamal Akbar Alam",
    description,
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — jamalakbara.",
    template: "%s | Admin — jamalakbara.",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // body has overflow:hidden (the public site scrolls inside PortfolioShell),
  // so the admin surface provides its own scroll container.
  return (
    <div className="h-screen overflow-y-auto bg-[var(--bg)] text-[var(--ink)]">
      {children}
    </div>
  );
}

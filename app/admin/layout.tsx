import type { Metadata } from "next";
import "./admin.css";

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
  // body has overflow:hidden (the public site scrolls inside PortfolioShell);
  // the admin shell provides its own scroll containers (.a-main / .a-sidebar).
  return children;
}

import type { Metadata } from "next";
import { fontClasses } from "@/lib/fonts";
import "../globals.css";
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
  // Own root layout: the public site's lives in app/[lang]. body has
  // overflow:hidden; the admin shell has its own scroll containers
  // (.a-main / .a-sidebar).
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontClasses} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { AdminBackground } from "@/components/admin/admin-background";

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
    <div className="relative h-screen overflow-y-auto bg-[var(--bg)] text-[var(--ink)]">
      {/* Animated WebGL flow-field background (brand-colored domain-warped
          noise, cursor-reactive, grain + vignette). Non-interactive, fixed,
          behind all admin chrome. Freezes under prefers-reduced-motion. */}
      <AdminBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

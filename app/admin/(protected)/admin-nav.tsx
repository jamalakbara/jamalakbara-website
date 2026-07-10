"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Work", href: "/admin/projects" },
  { label: "Journal", href: "/admin/journal" },
  { label: "Site", href: "/admin/site" },
  { label: "Media", href: "/admin/media" },
  { label: "Branding", href: "/admin/branding" },
];

/** Center nav for the admin pill — mirrors the public navbar's active
 *  underline treatment (accent border, ink text, weight 500). */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="admin-desktop-nav absolute left-1/2 -translate-x-1/2 items-center gap-8">
      {ADMIN_NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link pb-[3px] text-[0.875rem] transition-colors"
            style={{
              color: active ? "var(--ink)" : "var(--m2)",
              fontWeight: active ? 500 : 400,
              borderBottom: `1px solid ${active ? "var(--accent)" : "transparent"}`,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

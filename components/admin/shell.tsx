"use client";

// Admin shell (canvas 23 "Shell": sidebar + mobile top bar / menu sheet).

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  FileText,
  GitBranch,
  Images,
  Languages,
  LayoutGrid,
  LogOut,
  Menu,
  NotebookPen,
  Stamp,
  X,
} from "lucide-react";
import { GuardedLink, UnsavedProvider } from "@/components/admin/unsaved";
import { ToastProvider } from "@/components/admin/toast";

export interface ShellInfo {
  counts: { projects: number; journal: number; jurnal: number };
  backend: { label: string; github: boolean; branch: string };
  vercel: boolean;
  user: { login: string; image: string | null };
}

type NavItem = { label: string; href: string; icon: typeof LayoutGrid; count?: keyof ShellInfo["counts"] };

const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutGrid }] },
  {
    group: "Content",
    items: [
      { label: "Work", href: "/admin/projects", icon: BriefcaseBusiness, count: "projects" },
      { label: "Journal", href: "/admin/journal", icon: NotebookPen, count: "journal" },
      { label: "Jurnal", href: "/admin/jurnal", icon: Languages, count: "jurnal" },
    ],
  },
  {
    group: "Settings",
    items: [
      { label: "Site copy", href: "/admin/site", icon: FileText },
      { label: "Media", href: "/admin/media", icon: Images },
      { label: "Branding", href: "/admin/branding", icon: Stamp },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ env }: { env: string }) {
  return (
    <GuardedLink href="/admin" className="a-brand" aria-label="Back office — dashboard">
      <span className="a-brand__mark">jamalakbara.</span>
      <span className="a-brand__bar">
        <span className="a-eyebrow">Back office</span>
        <span className="a-meta">{env}</span>
      </span>
    </GuardedLink>
  );
}

function Nav({ info, onNavigate }: { info: ShellInfo; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="a-nav" aria-label="Admin">
      {NAV.map((g) => (
        <div key={g.group} className="a-nav__section">
          <p className="a-nav__group">{g.group}</p>
          {g.items.map((item) => {
            const Icon = item.icon;
            const count = item.count ? info.counts[item.count] : undefined;
            return (
              <GuardedLink
                key={item.href}
                href={item.href}
                className="a-navitem"
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                onClick={onNavigate}
              >
                <Icon size={16} strokeWidth={1.6} />
                <span className="a-navitem__label">{item.label}</span>
                {count !== undefined && <span className="a-navitem__count">{count}</span>}
              </GuardedLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Foot({ info, signOut }: { info: ShellInfo; signOut: () => Promise<void> }) {
  return (
    <div className="a-sidebar__foot">
      <div className="a-backend" title="Where saves are written">
        <GitBranch size={16} />
        <div>
          <p className="a-small">{info.backend.label}</p>
          <p className="a-meta a-muted">
            {info.backend.github ? "Saves publish in ~2 min" : "Saves edit your working tree"}
          </p>
        </div>
      </div>
      <div className="a-user">
        {info.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={info.user.image} alt="" className="a-user__avatar" />
        ) : (
          <span className="a-user__avatar" />
        )}
        <span className="a-truncate">@{info.user.login}</span>
        <form action={signOut} style={{ marginLeft: "auto", display: "flex" }}>
          <button type="submit" className="a-user__out" aria-label="Sign out" title="Sign out">
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({
  info,
  signOut,
  children,
}: {
  info: ShellInfo;
  signOut: () => Promise<void>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const env = info.backend.github ? "prod" : "local";
  const current = NAV.flatMap((g) => g.items).find((i) => isActive(pathname, i.href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ToastProvider branch={info.backend.branch} vercel={info.vercel}>
      <UnsavedProvider>
        <div className="a-shell">
          <aside className="a-sidebar">
            <Brand env={env} />
            <Nav info={info} />
            <Foot info={info} signOut={signOut} />
          </aside>

          <div className="a-topbar">
            <div>
              <p className="a-topbar__brand">jamalakbara.</p>
              <p className="a-topbar__sub">Back office · {current?.label ?? "Admin"}</p>
            </div>
            <button
              type="button"
              className="a-topbar__menu"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="a-menu" data-open={open} onClick={() => setOpen(false)}>
            {open && (
              <div className="a-menu__sheet" role="dialog" aria-modal="true" aria-label="Admin menu" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Brand env={env} />
                  <button type="button" className="a-iconbtn" aria-label="Close menu" onClick={() => setOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
                <Nav info={info} onNavigate={() => setOpen(false)} />
                <Foot info={info} signOut={signOut} />
              </div>
            )}
          </div>

          <main id="admin-main" className="a-main" tabIndex={-1}>
            <div className="a-page">{children}</div>
          </main>
        </div>
      </UnsavedProvider>
    </ToastProvider>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { backendLabel } from "@/lib/admin/content-store";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Journal", href: "/admin/journal" },
  { label: "Site", href: "/admin/site" },
  { label: "Media", href: "/admin/media" },
  { label: "Branding", href: "/admin/branding" },
];

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.login !== process.env.ADMIN_GITHUB_LOGIN) redirect("/admin/login");

  const backend = backendLabel();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      <header className="sticky top-0 z-50 -mx-6 mb-10 px-6 pt-4 pb-3 backdrop-blur-sm">
        <div className="liquid-glass flex items-center justify-between gap-4 rounded-full px-5 py-2.5">
          <Link href="/admin" className="text-sm font-medium tracking-tight">
            j.<span className="text-[var(--m3)]"> admin</span>
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            {ADMIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link text-xs text-[var(--m2)]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full border border-[rgba(246,243,240,0.08)] px-2.5 py-1 text-[10px] text-[var(--m3)]"
              title="Where saves are written"
            >
              {backend}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button type="submit" className="nav-link text-xs text-[var(--m3)]">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

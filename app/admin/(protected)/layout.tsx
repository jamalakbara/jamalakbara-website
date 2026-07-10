import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { backendLabel } from "@/lib/admin/content-store";
import { AdminNav } from "./admin-nav";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.login !== process.env.ADMIN_GITHUB_LOGIN) redirect("/admin/login");

  const backend = backendLabel();

  return (
    <div className="mx-auto max-w-[1080px] pb-20">
      {/* Header mirrors the public navbar pill: centered, same radius,
          padding, wordmark treatment and centered active-underline nav. */}
      <header className="sticky top-0 z-50 flex justify-center px-[clamp(1rem,4vw,3rem)] pt-6 pb-4 backdrop-blur-sm">
        <div className="liquid-glass relative flex w-full items-center justify-between rounded-full py-2 pl-6 pr-2.5 [cursor:default]">
          <Link
            href="/admin"
            className="flex h-10 items-center gap-2.5 tracking-[-0.02em]"
          >
            <span className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-semibold">
              jamalakbara<span className="text-[var(--accent)]">.</span>
            </span>
            <span className="rounded-full border border-[rgba(246,243,240,0.1)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--m3)]">
              admin
            </span>
          </Link>

          <AdminNav />

          <div className="flex items-center gap-3">
            <span
              className="rounded-full border border-[rgba(246,243,240,0.1)] px-2.5 py-1 text-[10px] text-[var(--m3)]"
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
              <button
                type="submit"
                className="nav-link rounded-full px-4 py-2 text-[0.875rem] text-[var(--m2)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="px-[clamp(1rem,4vw,3rem)]">{children}</div>
    </div>
  );
}

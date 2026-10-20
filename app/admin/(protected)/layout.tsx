import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { backend, backendLabel, listContentDir, readProjects } from "@/lib/admin/content-store";
import { vercelConfigured } from "@/lib/admin/vercel";
import { AdminShell } from "@/components/admin/shell";

const mdxCount = async (dir: string) =>
  (await listContentDir(dir)).filter((f) => f.endsWith(".mdx")).length;

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.login !== process.env.ADMIN_GITHUB_LOGIN) redirect("/admin/login");

  const [projects, journal, jurnal] = await Promise.all([
    readProjects().then((p) => p.length).catch(() => 0),
    mdxCount("content/journal").catch(() => 0),
    mdxCount("content/jurnal").catch(() => 0),
  ]);

  return (
    <AdminShell
      info={{
        counts: { projects, journal, jurnal },
        backend: {
          label: backendLabel(),
          github: backend() === "github",
          branch: process.env.GITHUB_CONTENT_BRANCH || "main",
        },
        vercel: vercelConfigured(),
        user: { login: session.login ?? "", image: session.user?.image ?? null },
      }}
      signOut={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      {children}
    </AdminShell>
  );
}

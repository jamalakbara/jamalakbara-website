import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.login === process.env.ADMIN_GITHUB_LOGIN) redirect("/admin");

  return (
    <main className="flex min-h-full items-center justify-center px-6">
      <div className="liquid-glass w-full max-w-sm rounded-2xl p-8 text-center animate-blur-fade-up">
        <p
          className="mb-2 text-sm italic text-[var(--m3)]"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          — Admin
        </p>
        <h1 className="mb-6 text-2xl font-light tracking-tight">
          jamalakbara.
        </h1>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button type="submit" className="btn-solid w-full rounded-full px-6 py-3">
            Continue with GitHub
          </button>
        </form>
        <p className="mt-4 text-xs text-[var(--m4)]">
          Owner access only.
        </p>
      </div>
    </main>
  );
}

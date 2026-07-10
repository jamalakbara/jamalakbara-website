import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.login === process.env.ADMIN_GITHUB_LOGIN) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="liquid-glass animate-blur-fade-up w-full max-w-sm rounded-2xl p-8 text-center [cursor:default]">
        <p className="section-eyebrow mb-5">Admin</p>

        {/* Brand wordmark — styled text, matches the public navbar exactly */}
        <div
          className="mb-6 text-2xl"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          jamalakbara<span style={{ color: "var(--accent)" }}>.</span>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="btn-solid w-full py-3"
          >
            <Image
              src="/github-logo.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden
            />
            Continue with GitHub
          </button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-[var(--m4)]">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--green)]"
            style={{ animation: "softPulse 2.4s ease-in-out infinite" }}
          />
          Owner access only.
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Github, Lock } from "lucide-react";
import { auth, signIn } from "@/lib/auth";
import { Stamp } from "@/components/site/stamp";

// Canvas 24A "Login" / 24A-M.
export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.login === process.env.ADMIN_GITHUB_LOGIN) redirect("/admin");

  return (
    <main className="a-shell a-login">
      <div className="a-login__card">
        <span className="a-login__tab">jamalakbara.</span>
        <div className="a-login__panel">
          <div className="a-login__top">
            <h1 className="a-display">Back office</h1>
            <Stamp size={40} />
          </div>
          <p className="a-text a-muted" style={{ maxWidth: 310 }}>
            Edit work, journal and site copy. Saves publish to the live site in about two minutes.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin" });
            }}
          >
            <button type="submit" className="a-btn a-btn--ink a-btn--block">
              <Github size={16} />
              Continue with GitHub
            </button>
          </form>
          <hr className="a-divider" />
          <p className="a-meta a-muted" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={13} />
            Owner access only. Other GitHub accounts are turned away.
          </p>
        </div>
        <Link href="/" className="a-login__back">
          <ArrowLeft size={14} />
          Back to jamalakbara.com
        </Link>
      </div>
    </main>
  );
}

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    login?: string;
  }
}

/**
 * Single-user admin auth: GitHub OAuth, JWT session, no database.
 * Only the GitHub account named in ADMIN_GITHUB_LOGIN may sign in.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    signIn({ profile }) {
      const login = (profile as { login?: string } | null)?.login;
      return Boolean(login) && login === process.env.ADMIN_GITHUB_LOGIN;
    },
    jwt({ token, profile }) {
      const login = (profile as { login?: string } | null)?.login;
      if (login) token.login = login;
      return token;
    },
    session({ session, token }) {
      session.login = token.login as string | undefined;
      return session;
    },
  },
});

/**
 * Server-side guard for admin server actions and route handlers.
 * Never rely on the proxy alone — call this at the top of every mutation.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.login || session.login !== process.env.ADMIN_GITHUB_LOGIN) {
    throw new Error("Unauthorized");
  }
  return session;
}

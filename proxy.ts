import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Early gate for the admin surface. Real authorization happens
 * server-side in the admin layout / requireAdmin() — this only
 * short-circuits obvious unauthenticated traffic.
 *
 * Also maps the cms.* subdomain onto the admin surface: bare paths
 * on cms.jamalakbara.com are rewritten to /admin/* (URL unchanged
 * in the browser). /admin/* and /api/* pass through untouched so
 * auth endpoints and existing admin links keep working on both hosts.
 */
export default auth((req) => {
  const host = req.headers.get("host") ?? "";
  const isAdminHost = host.startsWith("cms.");
  const { pathname } = req.nextUrl;

  const needsRewrite =
    isAdminHost && !pathname.startsWith("/admin") && !pathname.startsWith("/api");
  const effectivePath = needsRewrite
    ? pathname === "/"
      ? "/admin"
      : `/admin${pathname}`
    : pathname;

  const isLoggedIn = Boolean(req.auth);
  const isLoginPage = effectivePath === "/admin/login";

  if (!isLoggedIn && effectivePath.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (effectivePath.startsWith("/admin")) {
    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
  }

  if (needsRewrite) {
    const url = req.nextUrl.clone();
    url.pathname = effectivePath;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
});

export const config = {
  // Everything except Next internals and static files (paths with a dot).
  // Must stay broad: host-based routing for cms.* needs to see all paths,
  // and /api/admin/* needs the 401 short-circuit above.
  matcher: ["/((?!_next|.*\\..*).*)"],
};

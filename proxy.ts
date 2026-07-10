import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Early gate for the admin surface. Real authorization happens
 * server-side in the admin layout / requireAdmin() — this only
 * short-circuits obvious unauthenticated traffic.
 *
 * Also maps the cms.* subdomain onto the admin surface:
 *
 *   cms.jamalakbara.com/*  →  internally served from /admin/*
 *
 * URL-bar stays clean because:
 *  - Inbound bare paths are REWRITTEN to /admin/* (no visible redirect).
 *  - Admin pages contain hardcoded Link hrefs like /admin/projects, so
 *    when followed on the cms host they'd expose the prefix. We catch
 *    those with a REDIRECT back to the clean path, which the rewrite
 *    then maps internally on the next request.
 */
export default auth((req) => {
  const host = req.headers.get("host") ?? "";
  const isAdminHost = host.startsWith("cms.");
  const { pathname } = req.nextUrl;

  // Strip /admin prefix on cms host so internal links stay clean.
  // Exempt /api/admin (auth endpoints, API routes live there separately).
  if (
    isAdminHost &&
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/api/admin")
  ) {
    const cleanPath = pathname.slice("/admin".length) || "/";
    const url = req.nextUrl.clone();
    url.pathname = cleanPath;
    return NextResponse.redirect(url);
  }

  const needsRewrite =
    isAdminHost && !pathname.startsWith("/admin") && !pathname.startsWith("/api");
  const effectivePath = needsRewrite
    ? pathname === "/"
      ? "/admin"
      : `/admin${pathname}`
    : pathname;

  const isLoggedIn = Boolean(req.auth);
  const isLoginPage = effectivePath === "/admin/login";

  // Use clean paths for auth redirects on cms host so /admin never leaks.
  const loginRedirect = isAdminHost ? "/login" : "/admin/login";
  const dashRedirect = isAdminHost ? "/" : "/admin";

  if (!isLoggedIn && effectivePath.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (effectivePath.startsWith("/admin")) {
    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.redirect(new URL(loginRedirect, req.nextUrl));
    }
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL(dashRedirect, req.nextUrl));
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
  matcher: ["/((?!_next|.*\\..*).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ID_PUBLISHED } from "@/lib/i18n/config";

/**
 * Language routing for public pages. English stays at the root: /work is
 * served from /en/work without changing the URL. Bahasa lives under /id. Its
 * old /jurnal URLs keep working until launch, then redirect.
 */
function routeLanguage(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  if (/^\/en(\/|$)/.test(pathname)) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (/^\/kontak\/?$/.test(pathname)) {
    url.pathname = ID_PUBLISHED ? "/id/contact" : "/contact";
    return NextResponse.redirect(url, ID_PUBLISHED ? 308 : 307);
  }
  if (/^\/jurnal(\/|$)/.test(pathname)) {
    url.pathname = pathname.replace("/jurnal", "/id/journal");
    return ID_PUBLISHED ? NextResponse.redirect(url, 308) : NextResponse.rewrite(url);
  }
  if (/^\/id(\/|$)/.test(pathname)) {
    if (!ID_PUBLISHED && /^\/id\/journal(\/|$)/.test(pathname)) {
      url.pathname = pathname.replace("/id/journal", "/jurnal");
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

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

  if (!isAdminHost && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return routeLanguage(req);
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

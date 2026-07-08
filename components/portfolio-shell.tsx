"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";

// Background loop videos, served from Cloudinary. Cloud: dh0spkwh3.
// q_auto/f_auto = adaptive quality + format per browser. From the same asset we
// also derive a sharp first-frame poster (so_0) and a tiny blurred LQIP, so each
// layer paints an instant still while the video bytes load.
const CLD_BASE = "https://res.cloudinary.com/dh0spkwh3/video/upload";
const VIDEO_T = "q_auto:best,f_auto"; // full-quality loop
const POSTER_T = "q_auto,f_auto,so_0"; // sharp first frame
const BLUR_T = "q_auto,f_auto,so_0,w_64,e_blur:1200"; // ~few-KB LQIP

// route -> versioned Cloudinary path WITHOUT extension
const PAGE_PATHS: Record<string, string> = {
  "/": "v1781452916/bg-home_oaxs7i",
  "/work": "v1781452917/bg-work_rsbzrp",
  "/journal": "v1783495304/bg-journal_afdxkd",
  "/about": "v1781452916/bg-about_zkw2rg",
  "/contact": "v1781452916/bg-contact_sx4ep4",
};

const videoUrl = (p: string) => `${CLD_BASE}/${VIDEO_T}/${p}.mp4`;
const posterUrl = (p: string) => `${CLD_BASE}/${POSTER_T}/${p}.jpg`;
const blurUrl = (p: string) => `${CLD_BASE}/${BLUR_T}/${p}.jpg`;

function getPath(pathname: string): string {
  for (const key of Object.keys(PAGE_PATHS)) {
    if (key === "/" ? pathname === "/" : pathname.startsWith(key))
      return PAGE_PATHS[key];
  }
  return PAGE_PATHS["/"];
}

const ACCENT = "#e0875a";
const INK = "#f4ede3";
const MUTED = "#a99c8d";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Two stacked layers crossfade on route change. Each layer is a wrapper <div>
  // whose CSS background is the still (sharp poster over a tiny blur LQIP) plus
  // an inner <video>. The still paints reliably from CSS (no <video poster>
  // quirks); the video is kept hidden until it can play, so a reused layer never
  // flashes a stale frame — it reveals the correct still underneath instead.
  const wrapARef = useRef<HTMLDivElement>(null);
  const wrapBRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLVideoElement>(null);
  const layerBRef = useRef<HTMLVideoElement>(null);
  const frontRef = useRef<"A" | "B">("A"); // which layer is currently visible
  const currentPathRef = useRef(getPath(pathname)); // Cloudinary path showing now
  const [initialPath] = useState(() => getPath(pathname)); // frozen for first-render HTML

  // Sharp first-frame still over the tiny blur LQIP (first listed = on top).
  const stillBg = (p: string) => `url(${posterUrl(p)}), url(${blurUrl(p)})`;

  // Warm the browser media cache for a route's video on hover/focus intent, so
  // the real layer swap is near-instant. Deduped so each video fetches once.
  const prefetchedRef = useRef<Set<string>>(new Set());
  const prefetch = (p: string) => {
    if (prefetchedRef.current.has(p)) return;
    prefetchedRef.current.add(p);
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.src = videoUrl(p);
    v.load();
  };

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Mount fallback: kick playback on layer A (autoplay can be blocked) and
  // reveal it if it can already paint (canPlay may have fired pre-hydration).
  useEffect(() => {
    const v = layerARef.current;
    if (!v) return;
    v.play().catch(() => {});
    if (v.readyState >= 2) v.style.opacity = "1";
  }, []);

  // Crossfade to the new route on navigation. Driven imperatively so React never
  // rewrites the src behind our back (the old reactive <source> binding did,
  // which defeated the load() guard and broke swaps without a refresh).
  //
  // The back layer's STILL (CSS background) is set to the new page and the layer
  // is revealed immediately, so the new page's still shows right away instead of
  // the previous page's video lingering. The back video is hidden until it can
  // play, then fades in over its own still — no stale-frame flash.
  useEffect(() => {
    const newPath = getPath(pathname);
    if (newPath === currentPathRef.current) return;
    const frontWrap = frontRef.current === "A" ? wrapARef.current : wrapBRef.current;
    const backWrap = frontRef.current === "A" ? wrapBRef.current : wrapARef.current;
    const back = frontRef.current === "A" ? layerBRef.current : layerARef.current;
    if (!frontWrap || !backWrap || !back) return;
    backWrap.style.backgroundImage = stillBg(newPath); // correct still, instant
    back.style.opacity = "0"; // hide video until ready (reveals still beneath)
    back.src = videoUrl(newPath);
    back.load();
    back.play().catch(() => {});
    backWrap.style.opacity = "1";
    frontWrap.style.opacity = "0";
    frontRef.current = frontRef.current === "A" ? "B" : "A";
    currentPathRef.current = newPath;
  }, [pathname]);

  // Reveal a layer's video once it can paint (fades in over its still).
  const onVideoReady = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.play().catch(() => {});
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkStyle = (href: string): React.CSSProperties => {
    const active = isActive(href);
    return {
      fontSize: "0.875rem",
      textDecoration: "none",
      cursor: "pointer",
      transition: "color 0.25s",
      color: active ? INK : MUTED,
      fontWeight: active ? 500 : 400,
      paddingBottom: "3px",
      borderBottom: active
        ? `1px solid ${ACCENT}`
        : "1px solid transparent",
    };
  };

  const iconBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
  };

  // Uniform heavy scrim on every route — keeps body text legible across all
  // bgs, including bright ones like /about's dusk sky.
  const scrimBg =
    "linear-gradient(to top, rgba(10,7,5,0.88) 0%, rgba(10,7,5,0.72) 50%, rgba(10,7,5,0.5) 100%)";

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#0c0908",
        color: INK,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---- Background — two crossfading layers (z0) ----
          Wrapper paints the still (CSS bg: sharp poster over blur LQIP) instantly;
          the inner video fades in over it once it can play. */}
      <div
        ref={wrapARef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 1,
          backgroundImage: stillBg(initialPath),
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.6s ease",
        }}
      >
        <video
          ref={layerARef}
          src={videoUrl(initialPath)}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={onVideoReady}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>
      <div
        ref={wrapBRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.6s ease",
        }}
      >
        <video
          ref={layerBRef}
          muted
          loop
          playsInline
          onCanPlay={onVideoReady}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>

      {/* ---- Warm film grade + vignette (z1) ---- */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(135deg, rgba(224,135,91,0.20) 0%, rgba(60,28,40,0.12) 55%, rgba(28,40,64,0.16) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 45%, rgba(12,9,8,0.55) 100%)",
        }}
      />

      {/* ---- Page scrim (z2) — darkens for text-heavy pages ---- */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: scrimBg,
          transition: "background 0.6s ease",
        }}
      />

      {/* ---- Bottom blur (z3) ---- */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, transparent 45%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
        }}
      />

      {/* ---- Navbar (z50) — centered frosted-glass pill ---- */}
      <nav
        style={{
          position: "relative",
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          padding: "1.5rem clamp(1rem, 4vw, 3rem) 0",
        }}
      >
        <div
          className="liquid-glass animate-blur-fade-up"
          style={{
            animationDelay: "0ms",
            width: "100%",
            maxWidth: "1080px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "9999px",
            padding: "0.5rem 0.6rem 0.5rem 1.5rem",
            cursor: "default",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              textDecoration: "none",
              color: INK,
            }}
          >
            jamalakbara<span style={{ color: ACCENT }}>.</span>
          </Link>

          <div
            className="desktop-nav"
            style={{
              alignItems: "center",
              gap: "2rem",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => GAEvents.trackNavigationClick(l.href, "navbar")}
                onMouseEnter={() => prefetch(getPath(l.href))}
                onFocus={() => prefetch(getPath(l.href))}
                className="animate-blur-fade-up nav-link"
                style={{ ...linkStyle(l.href), animationDelay: `${100 + i * 50}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/contact"
              onClick={() => GAEvents.trackNavigationClick("/contact", "navbar_lets_talk")}
              onMouseEnter={() => prefetch(getPath("/contact"))}
              onFocus={() => prefetch(getPath("/contact"))}
              className="nav-actions liquid-glass animate-blur-fade-up"
              style={{
                animationDelay: "350ms",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                padding: "0.5rem clamp(1rem, 2vw, 1.4rem)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "9999px",
                  background: "#6ee787",
                  boxShadow: "0 0 8px #6ee787",
                  animation: "softPulse 2.4s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              <span>Let&apos;s talk</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="hamburger liquid-glass animate-blur-fade-up"
              style={{
                animationDelay: "350ms",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: "18px",
                  height: "18px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    ...iconBase,
                    transform: menuOpen
                      ? "rotate(180deg) scale(0.5)"
                      : "rotate(0) scale(1)",
                    opacity: menuOpen ? 0 : 1,
                  }}
                >
                  <Menu size={18} />
                </span>
                <span
                  style={{
                    ...iconBase,
                    transform: menuOpen
                      ? "rotate(0) scale(1)"
                      : "rotate(-180deg) scale(0.5)",
                    opacity: menuOpen ? 1 : 0,
                  }}
                >
                  <X size={18} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Mobile menu — frosted-glass panel (matches the nav pill) ---- */}
      <div
        className="mobile-menu liquid-glass"
        style={{
          position: "absolute",
          top: "5.5rem",
          left: "clamp(1rem, 4vw, 3rem)",
          right: "clamp(1rem, 4vw, 3rem)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          padding: "0.6rem",
          borderRadius: "1.5rem",
          WebkitBackdropFilter: "blur(2px)",
          backdropFilter: "blur(2px)",
          cursor: "default",
          transformOrigin: "top center",
          transition:
            "transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease-out",
          transform: menuOpen
            ? "translateY(0) scale(1)"
            : "translateY(-0.75rem) scale(0.98)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => {
              GAEvents.trackNavigationClick(l.href, "mobile_menu");
              setMenuOpen(false);
            }}
            onMouseEnter={() => prefetch(getPath(l.href))}
            onFocus={() => prefetch(getPath(l.href))}
            className="menu-link"
            style={{
              display: "block",
              padding: "0.85rem 1.1rem",
              borderRadius: "9999px",
              color: isActive(l.href) ? INK : MUTED,
              textDecoration: "none",
              fontSize: "0.8rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "background 0.25s, color 0.25s",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* ---- Content region (z10) ----
          Scrollable so any page taller than the viewport (e.g. About/Contact
          on small/short screens) can scroll instead of being clipped by the
          shell's height:100vh / overflow:hidden. On desktop content fits, so
          no scrollbar appears and the cinematic full-screen look is unchanged. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          padding:
            "0 clamp(1rem, 4vw, 3rem) clamp(2rem, 5vw, 3.5rem)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

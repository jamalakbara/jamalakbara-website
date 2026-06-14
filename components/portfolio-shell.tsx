"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";

// Background loop videos, served from Cloudinary (q_auto,f_auto = adaptive
// quality + format per browser). Cloud: dh0spkwh3.
const CLD = "https://res.cloudinary.com/dh0spkwh3/video/upload/q_auto,f_auto";

const PAGE_VIDEOS: Record<string, string> = {
  "/": `${CLD}/v1781452916/bg-home_oaxs7i.mp4`,
  "/work": `${CLD}/v1781452917/bg-work_rsbzrp.mp4`,
  "/about": `${CLD}/v1781452916/bg-about_zkw2rg.mp4`,
  "/contact": `${CLD}/v1781452916/bg-contact_sx4ep4.mp4`,
};

function getVideoUrl(pathname: string): string {
  for (const [key, val] of Object.entries(PAGE_VIDEOS)) {
    if (key === "/" ? pathname === "/" : pathname.startsWith(key)) return val;
  }
  return PAGE_VIDEOS["/"];
}

const ACCENT = "#e0875a";
const INK = "#f4ede3";
const MUTED = "#a99c8d";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Two stacked video layers crossfade on route change (no black flash).
  const layerARef = useRef<HTMLVideoElement>(null);
  const layerBRef = useRef<HTMLVideoElement>(null);
  const frontRef = useRef<"A" | "B">("A"); // which layer is currently visible
  const currentUrlRef = useRef(getVideoUrl(pathname));
  const [initialUrl] = useState(() => getVideoUrl(pathname)); // frozen for first-render HTML

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Mount fallback: kick playback on both layers (autoplay can be blocked).
  useEffect(() => {
    for (const v of [layerARef.current, layerBRef.current]) {
      if (v) v.play().catch(() => {});
    }
  }, []);

  // Crossfade to the new route's video. Driven imperatively so React never
  // rewrites the src behind our back (the old reactive <source> binding did,
  // which defeated the load() guard and broke swaps without a refresh).
  useEffect(() => {
    const newUrl = getVideoUrl(pathname);
    if (newUrl === currentUrlRef.current) return;
    const front =
      frontRef.current === "A" ? layerARef.current : layerBRef.current;
    const back =
      frontRef.current === "A" ? layerBRef.current : layerARef.current;
    if (!front || !back) return;
    back.src = newUrl;
    back.load();
    const reveal = () => {
      back.play().catch(() => {});
      back.style.opacity = "1";
      front.style.opacity = "0";
      frontRef.current = frontRef.current === "A" ? "B" : "A";
      currentUrlRef.current = newUrl;
    };
    if (back.readyState >= 2) reveal();
    else back.addEventListener("canplay", reveal, { once: true });
    return () => back.removeEventListener("canplay", reveal);
  }, [pathname]);

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

  const scrimBg =
    pathname === "/"
      ? "transparent"
      : "linear-gradient(to top, rgba(10,7,5,0.82) 0%, rgba(10,7,5,0.5) 50%, rgba(10,7,5,0.18) 100%)";

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0c0908",
        color: INK,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---- Background video — two crossfading layers (z0) ---- */}
      <video
        ref={layerARef}
        src={initialUrl}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 1,
          transition: "opacity 0.6s ease",
        }}
      />
      <video
        ref={layerBRef}
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0,
          transition: "opacity 0.6s ease",
        }}
      />

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
            onClick={() => setMenuOpen(false)}
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

      {/* ---- Content region (z10) ---- */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          position: "relative",
          padding:
            "0 clamp(1rem, 4vw, 3rem) clamp(2rem, 5vw, 3.5rem)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

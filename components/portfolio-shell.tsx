"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, contact } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";
import { Aurora } from "@/components/site/aurora";
import { ArrowUpRight, Close, Menu } from "@/components/site/icons";

// Working Folder shell: aurora field behind paper panels, folder navigation
// with a recessed notch under the active route, and a modal mobile menu.
// The page scrolls inside .f-scroll (body stays overflow:hidden, as before).

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const close = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the mobile menu whenever the route changes; start each page at the top.
  useEffect(() => {
    setMenuOpen(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // Modal menu: focus the first item, trap Tab, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const stack = stackRef.current;
    const focusables = () =>
      Array.from(stack?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    stack?.querySelector<HTMLElement>(".f-menu__item")?.focus(); // land on the first link
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, close]);

  // Close the modal if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activeIndex = NAV_LINKS.findIndex((l) => isActive(l.href));
  const before = activeIndex === -1 ? NAV_LINKS : NAV_LINKS.slice(0, activeIndex);
  const active = activeIndex === -1 ? null : NAV_LINKS[activeIndex];
  const after = activeIndex === -1 ? [] : NAV_LINKS.slice(activeIndex + 1);

  const navLink = (l: (typeof NAV_LINKS)[number]) => (
    <Link
      key={l.href}
      href={l.href}
      className="f-navlink"
      aria-current={isActive(l.href) ? "page" : undefined}
      onClick={() => GAEvents.trackNavigationClick(l.href, "navbar")}
    >
      {l.label}
    </Link>
  );

  const wordmark = (onClick?: () => void) => (
    <Link href="/" className="f-wordmark" aria-label="jamalakbara. — Home" onClick={onClick}>
      JAMALAKBARA.
    </Link>
  );

  return (
    <div className="f-shell">
      <div className="f-scroll" ref={scrollRef} data-scroll-root>
        <div className="f-page">
          <Aurora />
          <a href="#main" className="f-skip">
            Skip to content
          </a>

          {/* ---- Desktop / tablet navigation ---- */}
          <nav className="f-nav" aria-label="Primary">
            <div
              className="f-nav__start"
              style={active ? undefined : { borderRadius: 12, paddingRight: 40 }}
            >
              {wordmark()}
              {before.length > 0 && <div className="f-nav__links">{before.map(navLink)}</div>}
            </div>
            {active && (
              <>
                <div className="f-notch">
                  <span className="f-notch__fill" aria-hidden="true" />
                  {navLink(active)}
                </div>
                <div className={after.length ? "f-nav__end" : "f-nav__end f-nav__end--empty"}>
                  {after.map(navLink)}
                </div>
              </>
            )}
          </nav>

          {/* ---- Mobile navigation bar ---- */}
          <div className="f-mnav">
            {wordmark()}
            <button
              ref={toggleRef}
              type="button"
              className="f-iconbtn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="f-mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <main id="main" className="f-main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>

      {/* ---- Mobile menu (modal) ---- */}
      <div
        id="f-mobile-menu"
        className="f-menu"
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <div className="f-menu__scrim" onClick={() => close(false)} />
        <div className="f-menu__stack" ref={stackRef}>
          <div className="f-mnav" style={{ display: "flex" }}>
            {wordmark(() => setMenuOpen(false))}
            <button
              type="button"
              className="f-iconbtn"
              aria-label="Close menu"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => close()}
            >
              <Close size={24} />
            </button>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="f-menu__item"
              tabIndex={menuOpen ? 0 : -1}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={() => {
                GAEvents.trackNavigationClick(l.href, "mobile_menu");
                setMenuOpen(false);
              }}
            >
              <span className="f-menu__label">{l.label}</span>
            </Link>
          ))}
          <div className="f-menu__social">
            {contact.socials.slice(0, 2).map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="f-menu__item"
                tabIndex={menuOpen ? 0 : -1}
              >
                {s.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

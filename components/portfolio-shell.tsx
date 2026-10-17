"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, contact } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";
import { Aurora } from "@/components/site/aurora";
import { StickerPeel } from "@/components/site/sticker-peel";
import { ArrowUpRight, Close, Menu } from "@/components/site/icons";

// Working Folder shell: aurora field behind paper panels, folder navigation
// with a recessed notch under the active route, and a modal mobile menu.
// The page scrolls inside .f-scroll (body stays overflow:hidden, as before).

const REVEAL = [
  ".f-row", ".f-jrow", ".f-cap", ".f-field", ".f-form__actions", ".f-prose > *", ".f-quote",
  ".f-title-panel__label", ".f-title-panel__intro", ".f-journal-intro", ".f-art-toc", ".f-art-sig",
  ".f-loc", ".f-strip", ".f-end", ".f-filters", ".f-display", ".f-receipt",
  ".f-stamp:not(.f-stamp--loop)", ".f-sticker", ".f-tile", ".f-note", ".f-portrait", ".f-row__img",
].join(", ");

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const vtDone = useRef<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(false);

  // /jurnal (Bahasa journal) has no nav entry of its own — it lights Journal.
  const navPath = pathname.replace(/^\/jurnal(?=\/|$)/, "/journal");
  const isActive = (href: string) =>
    href === "/" ? navPath === "/" : navPath.startsWith(href);

  const close = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the mobile menu whenever the route changes; start each page at the top.
  useEffect(() => {
    setMenuOpen(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    vtDone.current?.(); // new page is committed → let the view transition capture it
    vtDone.current = null;
  }, [pathname]);

  // Page transitions: internal link clicks run inside a View Transition. The
  // nav's paper boxes, notch, wordmark and links carry their own
  // view-transition-names, so the notch + active link glide to the new route
  // while the page content swaps (animations in site.css). Unsupported
  // browsers and reduced motion fall through to Next's normal navigation.
  useEffect(() => {
    if (!("startViewTransition" in document)) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (still.matches) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/^\/(admin|api)(\/|$)/.test(url.pathname)) return;
      e.preventDefault(); // Next's <Link> skips its own navigation when defaultPrevented
      // keep the old page where it was on screen while it leaves (site.css)
      document.documentElement.style.setProperty("--vt-y", `${-(scrollRef.current?.scrollTop ?? 0)}px`);
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const t = window.setTimeout(resolve, 2500);
            vtDone.current = () => {
              window.clearTimeout(t);
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Stacked sections: every <main> child is position:sticky (site.css), so the
  // next section slides over the previous one. A section taller than the
  // viewport sticks by its bottom edge (negative top) so it can be read fully
  // before the next one covers it.
  useEffect(() => {
    const root = scrollRef.current;
    const main = root?.querySelector<HTMLElement>("#main");
    if (!root || !main) return;
    const measure = () => {
      const vh = root.clientHeight;
      for (const el of Array.from(main.children) as HTMLElement[]) {
        el.style.setProperty("--f-stick", `${Math.min(0, vh - el.offsetHeight)}px`);
      }
    };
    const ro = new ResizeObserver(measure);
    const observe = () => {
      ro.disconnect();
      ro.observe(root);
      for (const el of Array.from(main.children)) ro.observe(el);
      measure();
    };
    const mo = new MutationObserver(observe);
    mo.observe(main, { childList: true });
    observe();

    // As the next section slides over, the covered one sinks back
    // (--f-cover 0→1 drives scale + dim in site.css). Off under reduced motion.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const cover = () => {
      frame = 0;
      const kids = Array.from(main.children) as HTMLElement[];
      const vh = root.clientHeight;
      kids.forEach((el, i) => {
        const next = kids[i + 1];
        let c = 0;
        if (next) {
          const overlap = el.getBoundingClientRect().bottom - next.getBoundingClientRect().top;
          c = Math.min(1, Math.max(0, overlap / Math.min(vh, el.offsetHeight)));
        }
        el.style.setProperty("--f-cover", c.toFixed(3));
        el.toggleAttribute("data-covered", c > 0);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(cover);
    };
    if (!still) {
      root.addEventListener("scroll", onScroll, { passive: true });
      cover();
    }

    return () => {
      ro.disconnect();
      mo.disconnect();
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Sticky header: hides once scrolled past it going down, returns on any
  // small scroll up, always shown near the top (CSS in site.css).
  useEffect(() => {
    const root = scrollRef.current;
    const shell = shellRef.current;
    if (!root || !shell) return;
    let lastY = root.scrollTop;
    let frame = 0;
    const set = (state: "shown" | "hidden") => {
      if (shell.dataset.nav !== state) shell.dataset.nav = state;
    };
    const update = () => {
      frame = 0;
      const y = root.scrollTop;
      const dy = y - lastY;
      // pinned once scrolled past the header's resting offset (--f-shell, ≤12px)
      shell.toggleAttribute("data-nav-stuck", y > 12);
      if (y < 120 || menuOpenRef.current) set("shown");
      else if (dy > 6) set("hidden");
      else if (dy < -6) set("shown");
      else return; // jitter: keep lastY so slow scrolls still accumulate
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    set("shown");
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Reveals: every target plays its CSS entrance on mount; anything below
  // the fold is re-armed (data-rv="pending" → "in") to replay when scrolled
  // into view. Elements under the fold aren't visible yet, so arming them
  // after paint never blinks. Selectors mirror the Reveals block in site.css.
  useEffect(() => {
    const root = scrollRef.current;
    const main = root?.querySelector<HTMLElement>("#main");
    if (!root || !main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--rv-d", `${Math.min(i++, 5) * 80}ms`);
          el.dataset.rv = "in";
          io.unobserve(el);
        }
      },
      { root, rootMargin: "0px 0px -10% 0px" },
    );
    const arm = () => {
      const fold = root.getBoundingClientRect().bottom;
      main.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
        // Strict Mode double-invokes effects: re-observe leftovers.
        if (el.dataset.rv === "pending") return void io.observe(el);
        if (el.dataset.rv) return;
        const r = el.getBoundingClientRect();
        if (r.top < fold || r.height === 0) {
          el.dataset.rv = "static";
          return;
        }
        el.dataset.rv = "pending";
        io.observe(el);
      });
    };
    const mo = new MutationObserver(arm);
    mo.observe(main, { childList: true, subtree: true });
    arm();
    return () => {
      io.disconnect();
      mo.disconnect();
    };
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
      style={{ viewTransitionName: `f-nav-${l.href.slice(1) || "home"}` }}
      aria-current={isActive(l.href) ? "page" : undefined}
      onClick={() => GAEvents.trackNavigationClick(l.href, "navbar")}
    >
      {l.label}
    </Link>
  );

  const wordmark = (onClick?: () => void) => (
    <Link href="/" className="f-wordmark" aria-label="jamalakbara. — Home" onClick={onClick}>
      <span className="f-wordmark__roll" aria-hidden="true">JAMALAKBARA.</span>
    </Link>
  );

  return (
    <div className="f-shell" ref={shellRef}>
      <div className="f-scroll" ref={scrollRef} data-scroll-root>
        <div className="f-page">
          <Aurora />
          <StickerPeel />

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

"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useSite } from "@/lib/i18n/context";
import { GAEvents } from "@/lib/analytics/events";
import { Folder } from "@/components/site/folder";
import { ProjectRow } from "@/components/site/project-row";
import { Receipt } from "@/components/site/receipt";
import { ContactNote } from "@/components/site/contact-note";
import { Stamp } from "@/components/site/stamp";
import { Stickers, type StickerSpot } from "@/components/site/sticker";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from "@/components/site/icons";

// Home — canvas 14 (QiOko desktop / lYF3g mobile).
// Order: identity hero → selected-work folder → journal strip (canvas 35) →
// about/receipt folder → contact folder.

const COLLAGE_D: StickerSpot[] = [
  { name: "dev-mode", x: 38, y: 98, w: 162.655, h: 166, r: 9 },
  { name: "debug-duck", x: 235, y: 212, w: 106.434, h: 120, r: -11 },
  { name: "make-it-useful", x: 414, y: 60, w: 210, h: 198.804, r: 5 },
  { name: "browser-rocket", x: 744, y: 57, w: 105.823, h: 124, r: -13 },
  { name: "build-with-care", x: 954, y: 155, w: 182, h: 149.742, r: 12 },
  { name: "kopi-susu", x: 1250, y: 70, w: 59.325, h: 120, r: 8 },
  { name: "pen-tool", x: 92, y: 305, w: 91.596, h: 108, r: -16 },
  { name: "less-noise-more-craft", x: 411, y: 324, w: 178, h: 142.885, r: -7 },
  { name: "builder-cursor", x: 656, y: 234, w: 79.226, h: 110, r: 15 },
  { name: "bandung-volcano", x: 816, y: 326, w: 141.349, h: 146, r: -6 },
  { name: "shopping-bag-cursor", x: 1134, y: 323, w: 128.527, h: 132, r: 7 },
  { name: "dev-laptop", x: 1045, y: 45, w: 108, h: 98.048, r: -9 },
];

const COLLAGE_M: StickerSpot[] = [
  { name: "dev-mode", x: 20, y: 45, w: 123.461, h: 126, r: 9 },
  { name: "debug-duck", x: 215, y: 127, w: 88.695, h: 100, r: -12 },
  { name: "make-it-useful", x: 59, y: 234, w: 150, h: 142.003, r: 7 },
  { name: "browser-rocket", x: 246, y: 302, w: 73.394, h: 86, r: -12 },
  { name: "build-with-care", x: 28, y: 433, w: 136, h: 111.895, r: -8 },
  { name: "kopi-susu", x: 269, y: 473, w: 51.415, h: 104, r: 9 },
  { name: "pen-tool", x: 22, y: 637, w: 81.419, h: 96, r: -13 },
  { name: "less-noise-more-craft", x: 158, y: 608, w: 145, h: 116.395, r: 9 },
  { name: "builder-cursor", x: 185, y: 402, w: 56.179, h: 78, r: 12 },
  { name: "bandung-volcano", x: 179, y: 785, w: 126.827, h: 131, r: -7 },
  { name: "shopping-bag-cursor", x: 35, y: 819, w: 99.316, h: 102, r: 10 },
  { name: "dev-laptop", x: 169, y: 48, w: 83, h: 75.352, r: -7 },
];

export type LatestPost = { href: string; title: string; date: string };

// "\n" in copy becomes a <br />, keeping the canvas line breaks.
function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export function HomeView({ latest }: { latest: LatestPost[] }) {
  const { home, works, path, serviceLinks, ui } = useSite();
  const t = ui.home;
  // Selected work: projects starred "Featured on home" in the admin first, then
  // those with a full three-image strip (the curated canvas selection), topped
  // up from the ordered list.
  const featured = works.filter((w) => w.featured);
  const full = works.filter((w) => !w.featured && w.media.length >= 3);
  const selected = [...featured, ...full, ...works.filter((w) => !w.featured && !full.includes(w))].slice(0, 3);
  const years = selected.map((w) => Number(w.year)).filter(Boolean);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";

  const exploreWork = (
    <a href="#selected-work" className="f-link">
      <span className="f-link__row">
        {t.exploreWork}
        <ArrowDown size={16} />
      </span>
      <span className="f-link__line" />
    </a>
  );

  return (
    <>
      {/* ---- Identity hero ---- */}
      <section className="f-panel f-hero" aria-label={t.introLabel}>
        <div className="f-hero__center">
          <p className="f-identity f-hero__name" aria-label="Jamal Akbar Alam">
            <span className="f-hero__name-line" aria-hidden="true">
              <span>JAMAL</span>
              <span className="f-hero__stamp-d">
                <Stamp size={108} loop />
              </span>
              <span className="f-hero__stamp-m">
                <Stamp size={64} loop />
              </span>
            </span>
            <span aria-hidden="true">AKBAR ALAM</span>
          </p>
        </div>

        <div className="f-hero__bottom">
          <div className="f-hero__caption f-hero__caption-d">
            <span className="f-meta">{t.noteLabel}</span>
            <span className="f-action">
              <Lines text={t.note} />
            </span>
          </div>
          <p className="f-hero__intro f-hero__intro-d">
            <Lines text={t.intro} />
          </p>
          <div className="f-hero__intro f-hero__intro-m">
            <h1 className="f-hero__h1">{home.headline}</h1>
          </div>
          <div className="f-hero__actions f-hero__actions-d">{exploreWork}</div>
          <div className="f-hero__mrow">
            <div className="f-hero__caption">
              <span className="f-meta">{t.noteLabel}</span>
              <span className="f-action">
                <Lines text={t.note} />
              </span>
            </div>
            {exploreWork}
          </div>
        </div>
      </section>

      {/* ---- Selected work ---- */}
      <Folder tab={t.selectedTab} n="01" id="selected-work" labelledBy="selected-work-h">
        <div className="f-sec">
          <div className="f-sec-intro">
            <span className="f-meta">{t.selectedTab}{span ? ` / ${span}` : ""}</span>
            <div className="f-sec-intro__row">
              <h2 id="selected-work-h" className="f-display">
                {t.selectedHeading}
              </h2>
              <Link
                href={path("/work")}
                className="f-btn f-btn--secondary"
                onClick={() => GAEvents.trackNavigationClick("/work", "home_cta")}
              >
                {t.exploreAll}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          {selected.map((row, i) => (
            <ProjectRow key={row.id} row={row} index={i} />
          ))}
        </div>
      </Folder>

      {/* ---- From the journal ---- */}
      {latest.length > 0 && (
        <Folder tab={t.journalTab} n="02" labelledBy="home-journal-h">
          <div className="f-jstrip">
            <h2 id="home-journal-h" className="f-sr">
              {t.journalHeading}
            </h2>
            {latest.map((post) => (
              <Link key={post.href} href={post.href} className="f-jstrip__row">
                <h3 className="f-jstrip__title">{post.title}</h3>
                <span className="f-jstrip__meta">
                  <span className="f-meta f-muted">{post.date}</span>
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
            <Link href={path("/journal")} className="f-act">
              {t.journalAll}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Folder>
      )}

      {/* ---- About / receipt ---- */}
      <Folder tab={t.aboutTab} n="03" offset={[180, 88]} labelledBy="home-about-h" bodyClassName="f-grid-paper">
        <div className="f-story">
          <div className="f-story__col">
            <span className="f-meta">{t.aboutLabel}</span>
            <h2 id="home-about-h" className="f-display f-pre">
              {t.aboutHeading}
            </h2>
            <p className="f-body">{home.intro}</p>
            <div className="f-skills">
              <span className="f-meta">{t.bringLabel}</span>
              {t.skills.map((skill) => (
                <div key={skill.name} className="f-skill">
                  <h3 className="f-title">{skill.name}</h3>
                  <p className="f-body">{skill.desc}</p>
                </div>
              ))}
            </div>
            <p className="f-body">
              {t.aboutClosing}
            </p>
            <span className="f-sig">
              <MapPin size={18} />
              <span className="f-meta">{ui.common.locationCaps}</span>
            </span>
          </div>
          <Receipt />
        </div>
      </Folder>

      {/* ---- Contact ---- */}
      <Folder tab={t.contactTab} n="04" offset={[360, 176]} labelledBy="home-contact-h">
        <div className="f-sec f-home-contact">
          <div className="f-invite">
            <div className="f-invite__h">
              <span className="f-meta">{t.contactLabel}</span>
              <h2 id="home-contact-h" className="f-display f-pre">
                {t.contactHeading}
              </h2>
              <p className="f-body">{t.contactBody}</p>
            </div>
            <ContactNote socialLimit={2} />
          </div>
          <Stickers spots={COLLAGE_D} className="f-collage f-collage--d" base={1336} />
          <Stickers spots={COLLAGE_M} className="f-collage f-collage--m" base={346} />
          <div className="f-copyright f-meta">
            <span>© {new Date().getFullYear()} Jamal Akbar Alam</span>
            {serviceLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <span>{ui.common.locationCaps}</span>
          </div>
        </div>
      </Folder>
    </>
  );
}

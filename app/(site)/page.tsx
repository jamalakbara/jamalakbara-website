"use client";

import Link from "next/link";
import { home, works } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";
import { Folder } from "@/components/site/folder";
import { ProjectRow } from "@/components/site/project-row";
import { Receipt } from "@/components/site/receipt";
import { ContactNote } from "@/components/site/contact-note";
import { Stamp } from "@/components/site/stamp";
import { Stickers, type StickerSpot } from "@/components/site/sticker";
import { ArrowDown, ArrowUpRight, MapPin } from "@/components/site/icons";

// Home — canvas 14 (QiOko desktop / lYF3g mobile).
// Order: identity hero → selected-work folder → about/receipt folder → contact folder.

// Selected work: projects with a full three-image strip first (the curated
// canvas selection), topped up from the ordered list.
const full = works.filter((w) => w.media.length >= 3);
const selected = [...full, ...works.filter((w) => !full.includes(w))].slice(0, 3);
const years = selected.map((w) => Number(w.year)).filter(Boolean);
const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";
const featured = selected[0];

const SKILLS = [
  ["Design", "Clear layouts, visual hierarchy and easy-to-use interfaces."],
  ["Development", "Responsive websites built with speed and usability in mind."],
  ["Ship", "Launch-ready websites and apps, tested and ready to go live."],
] as const;

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

export default function HomePage() {
  const exploreWork = (
    <a href="#selected-work" className="f-link">
      <span className="f-link__row">
        Explore work
        <ArrowDown size={16} />
      </span>
      <span className="f-link__line" />
    </a>
  );

  return (
    <>
      {/* ---- Identity hero ---- */}
      <section className="f-panel f-hero" aria-label="Introduction">
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
            <span className="f-meta">A PERSONAL NOTE</span>
            <span className="f-action">
              Mostly coding, sometimes moving things
              <br />a few pixels until they feel right.
            </span>
          </div>
          <p className="f-hero__intro f-hero__intro-d">
            I’m Akbar, a developer and designer
            <br />
            in Bandung. Here’s some of what
            <br />
            I’ve been working on.
          </p>
          <div className="f-hero__intro f-hero__intro-m">
            <h1 className="f-hero__h1">{home.headline}</h1>
            <br />
            Independent developer &amp; designer
            <br />
            based in Bandung, Indonesia.
          </div>
          <div className="f-hero__actions f-hero__actions-d">{exploreWork}</div>
          <div className="f-hero__mrow">
            <div className="f-hero__caption">
              <span className="f-meta">SELECTED WORK / 01</span>
              {featured && <span className="f-action">{featured.title}</span>}
            </div>
            {exploreWork}
          </div>
        </div>
      </section>

      {/* ---- Selected work ---- */}
      <Folder tab="SELECTED WORK" n="01" id="selected-work" labelledBy="selected-work-h">
        <div className="f-sec">
          <div className="f-sec-intro">
            <span className="f-meta">SELECTED WORK{span ? ` / ${span}` : ""}</span>
            <div className="f-sec-intro__row">
              <h2 id="selected-work-h" className="f-display">
                Selected work.
              </h2>
              <Link
                href="/work"
                className="f-btn f-btn--secondary"
                onClick={() => GAEvents.trackNavigationClick("/work", "home_cta")}
              >
                Explore all
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          {selected.map((row, i) => (
            <ProjectRow key={row.id} row={row} index={i} />
          ))}
        </div>
      </Folder>

      {/* ---- About / receipt ---- */}
      <Folder tab="ABOUT" n="02" offset={[180, 88]} labelledBy="home-about-h" bodyClassName="f-grid-paper">
        <div className="f-story">
          <div className="f-story__col">
            <span className="f-meta">ABOUT / SKILLS &amp; SERVICES</span>
            <h2 id="home-about-h" className="f-display f-pre">
              {"From first idea\nto final build."}
            </h2>
            <p className="f-body">{home.intro}</p>
            <div className="f-skills">
              <span className="f-meta">WHAT I BRING</span>
              {SKILLS.map(([name, desc]) => (
                <div key={name} className="f-skill">
                  <h3 className="f-title">{name}</h3>
                  <p className="f-body">{desc}</p>
                </div>
              ))}
            </div>
            <p className="f-body">
              Design and development, in the same conversation. I care about how a website looks—and how it
              works.
            </p>
            <span className="f-sig">
              <MapPin size={18} />
              <span className="f-meta">BANDUNG, INDONESIA</span>
            </span>
          </div>
          <Receipt />
        </div>
      </Folder>

      {/* ---- Contact ---- */}
      <Folder tab="CONTACT" n="03" offset={[360, 176]} labelledBy="home-contact-h">
        <div className="f-sec f-home-contact">
          <div className="f-invite">
            <div className="f-invite__h">
              <span className="f-meta">LET’S WORK TOGETHER</span>
              <h2 id="home-contact-h" className="f-display f-pre">
                {"Have something\nin mind?"}
              </h2>
              <p className="f-body">Tell me what you’re building. I can help with the design, the development, or both.</p>
            </div>
            <ContactNote socialLimit={2} />
          </div>
          <Stickers spots={COLLAGE_D} className="f-collage f-collage--d" base={1336} />
          <Stickers spots={COLLAGE_M} className="f-collage f-collage--m" base={346} />
          <div className="f-copyright f-meta">
            <span>© {new Date().getFullYear()} Jamal Akbar Alam</span>
            <span>BANDUNG, INDONESIA</span>
          </div>
        </div>
      </Folder>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { about } from "@/lib/site-data";
import { sentenceLines } from "@/lib/site-format";
import { TitlePanel } from "@/components/site/title-panel";
import { Folder } from "@/components/site/folder";
import { Receipt } from "@/components/site/receipt";
import { ContactStrip } from "@/components/site/contact-strip";
import { Stickers, type StickerSpot } from "@/components/site/sticker";
import { ArrowRight, MapPin } from "@/components/site/icons";

// About — canvas 18 (BWDyJ desktop / U7cNrD mobile).

const STICKERS: StickerSpot[] = [
  { name: "bandung-volcano", x: 716, y: 70, w: 126.827, h: 131, r: -7 },
  { name: "kopi-susu", x: 884, y: 146, w: 56, h: 113.275, r: -5 },
  { name: "dev-laptop", x: 596, y: 40, w: 83, h: 75.352, r: -7 },
  { name: "builder-cursor", x: 470, y: 30, w: 76, h: 105.52, r: 10 },
  { name: "dev-mode", x: 968, y: 34, w: 96, h: 97.974, r: -9 },
  { name: "debug-duck", x: 1112, y: 70, w: 88.695, h: 100, r: -7 },
  { name: "shopping-bag-cursor", x: 1250, y: 78, w: 99.316, h: 102, r: 10 },
];

const CAPABILITIES = [
  { icon: "web-app", w: 80, h: 67.752, name: "WEB APP DEVELOPMENT", desc: "Web apps and websites that load fast, rank on Google and stay easy to maintain." },
  { icon: "mobile-app", w: 57.306, h: 80, name: "MOBILE APP DEVELOPMENT", desc: "iOS and Android apps from one React Native codebase, when an app actually earns its cost." },
  { icon: "desktop-app", w: 80, h: 76.265, name: "DESKTOP APP DEVELOPMENT", desc: "Desktop apps that feel at home on your computer and stay quick to use." },
  { icon: "ui-ux", w: 67.772, h: 80, name: "UI/UX DESIGN", desc: "Clear layouts and interfaces that work the way people expect." },
];

export default function AboutPage() {
  return (
    <>
      <TitlePanel
        label="ABOUT / PROFILE"
        aside={
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            Bandung, Indonesia
          </span>
        }
        heading={<h2 className="f-display f-display--caps">{sentenceLines(about.heading)}</h2>}
        intro={<p className="f-body">Hi, I’m Akbar — a developer and designer based in Bandung, Indonesia.</p>}
        stickers={STICKERS}
        mobileStickers={[{ name: "kopi-susu", x: 282, y: 64, w: 51.415, h: 104, r: 9 }]}
      />

      <Folder tab="MY STORY" n="01" bodyClassName="f-about-story">
        <div className="f-portrait-col">
          <span className="f-tabtext">THE SHORT VERSION</span>
          <div className="f-portrait">
            <Image src={about.portrait} alt="Portrait of Akbar" fill sizes="(max-width: 1023px) 100vw, 400px" priority />
          </div>
          <span className="f-meta f-muted">Jamal Akbar Alam, Bandung</span>
        </div>
        <div className="f-reading">
          {about.paragraphs.map((para, i) => (
            <p key={i} className="f-body">
              {para}
            </p>
          ))}
          <blockquote className="f-quote">
            “ALWAYS CHASING <br className="f-br-m" />
            WORK <br className="f-br-d" />
            THAT FEELS <br className="f-br-m" />
            WORTH BUILDING.”
          </blockquote>
          <div style={{ paddingTop: 8 }}>
            <Link href="/work" className="f-uline">
              See the work
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Stickers
          spots={[{ name: "make-it-useful", x: 1196, y: 420, w: 144, h: 136.323, r: -7 }]}
          className="f-stickers f-stickers--margin"
          base={1416}
        />
      </Folder>

      <Folder tab="WHAT I DO" n="02" offset={[180, 88]} bodyClassName="f-grid-paper">
        <div className="f-story" style={{ paddingBottom: 56 }}>
          <div className="f-story__col">
            <span className="f-tabtext">WHAT I BRING</span>
            <h3 className="f-display">
              DESIGN AND CODE, <br />
              IN THE SAME <br className="f-br-m" />
              CONVERSATION.
            </h3>
            <ul className="f-caps-list" style={{ listStyle: "none", margin: 0 }}>
              {CAPABILITIES.map((c) => (
                <li key={c.name} className="f-cap">
                  <span className="f-cap__icon">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/icons/${c.icon}.svg`}
                      alt=""
                      width={c.w}
                      height={c.h}
                      aria-hidden="true"
                      style={{ "--w": `${c.w}px`, "--h": `${c.h}px` } as React.CSSProperties}
                    />
                  </span>
                  <span className="f-cap__text">
                    <span className="f-cap__name">
                      <span className="f-title">{c.name}</span>
                    </span>
                    <span className="f-body f-cap__desc">{c.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Receipt />
        </div>
      </Folder>

      <ContactStrip />
    </>
  );
}

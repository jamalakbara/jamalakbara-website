"use client";

import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/lib/i18n/context";
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

const ICONS = [
  { icon: "web-app", w: 80, h: 67.752 },
  { icon: "mobile-app", w: 57.306, h: 80 },
  { icon: "desktop-app", w: 80, h: 76.265 },
  { icon: "ui-ux", w: 67.772, h: 80 },
];

export function AboutView() {
  const { about, path, ui } = useSite();
  const t = ui.about;
  return (
    <>
      <TitlePanel
        label={t.label}
        aside={
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            {ui.common.location}
          </span>
        }
        heading={<h1 className="f-display f-display--caps">{sentenceLines(about.heading)}</h1>}
        intro={<p className="f-body">{t.intro}</p>}
        stickers={STICKERS}
        mobileStickers={[{ name: "kopi-susu", x: 282, y: 64, w: 51.415, h: 104, r: 9 }]}
      />

      <Folder tab={t.storyTab} n="01" bodyClassName="f-about-story">
        <div className="f-portrait-col">
          <span className="f-tabtext">{t.shortLabel}</span>
          <div className="f-portrait">
            <Image src={about.portrait} alt={t.portraitAlt} fill sizes="(max-width: 1023px) 100vw, 400px" priority />
          </div>
          <span className="f-meta f-muted">{t.portraitCaption}</span>
        </div>
        <div className="f-reading">
          {about.paragraphs.map((para, i) => (
            <p key={i} className="f-body">
              {para}
            </p>
          ))}
          <blockquote className="f-quote">
            {t.quote[0]}
            <br className="f-br-m" />
            {t.quote[1]}
            <br className="f-br-d" />
            {t.quote[2]}
            <br className="f-br-m" />
            {t.quote[3]}
          </blockquote>
          <div style={{ paddingTop: 8 }}>
            <Link href={path("/work")} className="f-uline">
              {ui.common.seeTheWork}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Stickers
          spots={[{ name: "make-it-useful", x: 1196, y: 420, w: 144, h: 136.323, r: -7 }]}
          className="f-stickers f-stickers--margin f-stickers--beside"
          base={1416}
        />
      </Folder>

      <Folder tab={t.doTab} n="02" offset={[180, 88]} bodyClassName="f-grid-paper">
        <div className="f-story" style={{ paddingBottom: 56 }}>
          <div className="f-story__col">
            <span className="f-tabtext">{t.bringLabel}</span>
            <h3 className="f-display">
              {t.doHeading[0]}
              <br />
              {t.doHeading[1]}
              <br className="f-br-m" />
              {t.doHeading[2]}
            </h3>
            <ul className="f-caps-list" style={{ listStyle: "none", margin: 0 }}>
              {t.capabilities.map((text, i) => {
                const c = { ...ICONS[i], ...text };
                return (
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
                );
              })}
            </ul>
          </div>
          <Receipt />
        </div>
      </Folder>

      <ContactStrip />
    </>
  );
}

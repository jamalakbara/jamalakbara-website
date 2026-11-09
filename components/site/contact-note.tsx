"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/i18n/context";
import { GAEvents } from "@/lib/analytics/events";
import { IconButton } from "@/components/site/button";

// Hand-made sticker icons (canvas "social icons" frame) shown before each
// label. They peel on hover like the collage stickers (sticker-peel.tsx).
const SOCIAL_ICONS: Record<string, { src: string; w: number; h: number }> = {
  mail: { src: "/brand/social/mail.svg", w: 685, h: 708 },
  github: { src: "/brand/social/github.svg", w: 741, h: 823 },
  linkedin: { src: "/brand/social/linkedin.svg", w: 701, h: 722 },
  twitter: { src: "/brand/social/twitter.svg", w: 921, h: 717 },
  x: { src: "/brand/social/twitter.svg", w: 921, h: 717 },
  copy: { src: "/brand/social/copy.svg", w: 1263, h: 1483 },
};

function SocialIcon({ name, index }: { name: string; index: number }) {
  const icon = SOCIAL_ICONS[name.toLowerCase()];
  if (!icon) return null;
  return (
    <span className="f-sicon" style={{ "--si": index } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon.src} alt="" aria-hidden="true" width={icon.w} height={icon.h} draggable={false} />
    </span>
  );
}

// "A note to Akbar" (canvas Contact / Straight-edge paper note). The copy sticker is
// the copy-email control: success announces "Copied" without moving layout;
// if the clipboard is unavailable/denied the address stays selectable and the
// mail link remains, with a polite announcement.

type CopyState = "idle" | "copied" | "failed";

export function ContactNote({
  socialLimit,
  trackEmail = false,
}: {
  socialLimit?: number;
  /** fire the existing contact "email_link" GA event (contact page only, as before) */
  trackEmail?: boolean;
}) {
  const { contact, ui } = useSite();
  const text = ui.note;
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(contact.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  };

  const socials = socialLimit ? contact.socials.slice(0, socialLimit) : contact.socials;
  const msg = state === "copied" ? text.copied : state === "failed" ? text.failed : "";

  return (
    <div className="f-note">
      <div className="f-note__head">
        <span className="f-meta">{text.label}</span>
        <IconButton
          className="f-copy"
          data-peel-link=""
          onClick={copy}
          aria-label={`${text.copyLabel} ${contact.email}`}
          data-state={state}
          data-msg={msg}
        >
          <SocialIcon name="copy" index={0} />
        </IconButton>
      </div>
      <p className="f-note__email">{contact.email}</p>
      <span className="f-sr" role="status" aria-live="polite">
        {msg}
      </span>
      <div>
        <a
          href={`mailto:${contact.email}`}
          className="f-slink"
          data-peel-link=""
          onClick={trackEmail ? () => GAEvents.trackContactMessage("email_link") : undefined}
        >
          <SocialIcon name="mail" index={0} />
          {text.mail}
        </a>
      </div>
      <div className="f-note__links">
        {socials.map((s, i) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="f-slink" data-peel-link="">
            <SocialIcon name={s.label} index={i + 1} />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

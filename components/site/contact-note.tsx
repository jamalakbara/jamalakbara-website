"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";
import { Stamp } from "@/components/site/stamp";
import { ArrowUpRight } from "@/components/site/icons";

// "A note to Akbar" (canvas Contact / Straight-edge paper note). The stamp is
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
  const msg = state === "copied" ? "Copied" : state === "failed" ? "Couldn’t copy — select the address" : "";

  return (
    <div className="f-note">
      <div className="f-note__head">
        <span className="f-meta">A NOTE TO AKBAR</span>
        <button
          type="button"
          className="f-iconbtn f-copy"
          onClick={copy}
          aria-label={`Copy email address ${contact.email}`}
          data-state={state}
          data-msg={msg}
        >
          <Stamp size={44} />
        </button>
      </div>
      <p className="f-note__email">{contact.email}</p>
      <span className="f-sr" role="status" aria-live="polite">
        {msg}
      </span>
      <div>
        <a
          href={`mailto:${contact.email}`}
          className="f-uline"
          onClick={trackEmail ? () => GAEvents.trackContactMessage("email_link") : undefined}
        >
          Send an email
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="f-note__links">
        {socials.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="f-link">
            <span className="f-link__row">
              {s.label}
              <ArrowUpRight size={16} />
            </span>
            <span className="f-link__line" />
          </a>
        ))}
      </div>
    </div>
  );
}

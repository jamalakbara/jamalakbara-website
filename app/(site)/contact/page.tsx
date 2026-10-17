"use client";

import { useRef, useState } from "react";
import { contact } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";
import { TitlePanel } from "@/components/site/title-panel";
import { ContactNote } from "@/components/site/contact-note";
import { ContactStrip } from "@/components/site/contact-strip";
import type { StickerSpot } from "@/components/site/sticker";
import { Check, MapPin, Send } from "@/components/site/icons";
import { sentenceLines } from "@/lib/site-format";

// Contact — canvas 19 (qlvWa / IWLZT), validation 19A, success 19C.
// Behaviour is unchanged: client-side checks, then the brief opens in WhatsApp.

type Errors = { name?: string; email?: string; message?: string };

// wa.me number, composed in site-data from the CMS country + local fields
// (already digits only). Falls back to the shipped default when unset.
const WHATSAPP_NUMBER = contact.whatsapp || "6281321766565";

const STICKERS: StickerSpot[] = [
  { name: "make-it-useful", x: 470, y: 74, w: 126, h: 119.283, r: 6 },
  { name: "debug-duck", x: 700, y: 150, w: 76.633, h: 86.4, r: -10 },
  { name: "pen-tool", x: 850, y: 44, w: 68.697, h: 81, r: -14 },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const fields = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "What's your name?";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      next.email = "That email doesn't look right.";
    if (!form.message.trim()) next.message = "Tell me a bit about it.";
    if (Object.keys(next).length) {
      setErrors(next);
      const first = (["name", "email", "message"] as const).find((k) => next[k]);
      if (first) fields[first].current?.focus();
      return;
    }
    setErrors({});

    const text = [
      `Hi Akbar, I'm ${form.name.trim()}.`,
      "",
      form.message.trim(),
      "",
      `Reply to: ${form.email.trim()}`,
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    GAEvents.trackContactMessage("whatsapp_form");
    setSent(true);
  };

  const hasErrors = Boolean(errors.name || errors.email || errors.message);

  const field = (
    key: "name" | "email",
    label: string,
    type: string,
    placeholder: string,
    autoComplete: string,
  ) => (
    <div className="f-field">
      <label className="f-field__label" htmlFor={`f-${key}`}>
        {label}
      </label>
      {errors[key] && (
        <p className="f-field__err" id={`f-${key}-err`}>
          {errors[key]}
        </p>
      )}
      <input
        ref={fields[key]}
        id={`f-${key}`}
        className="f-input"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={update(key)}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `f-${key}-err` : undefined}
      />
    </div>
  );

  return (
    <>
      <TitlePanel
        label="CONTACT / SAY HELLO"
        aside={
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            Bandung, Indonesia
          </span>
        }
        heading={<h2 className="f-display f-display--caps">{sentenceLines(contact.heading)}</h2>}
        intro={<p className="f-body">Tell me what you’re building. I can help with the design, the development, or both.</p>}
        stickers={STICKERS}
        mobileStickers={[{ name: "debug-duck", x: 270, y: 74, w: 59.603, h: 67.2, r: -10 }]}
      />

      <section className="f-folder" aria-label="Send a message">
        <div className="f-tab">
          <span className="f-tabtext">SEND A MESSAGE</span>
          <span className="f-tab__n f-muted">01</span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-split">
          {sent ? (
            <div className="f-form f-sent" role="status">
              <span className="f-sent__icon">
                <Check size={24} />
              </span>
              <p className="f-sent__h">Opening WhatsApp…</p>
              <p className="f-sent__p">Just hit send in the chat and I&apos;ll get back to you within a day or two.</p>
            </div>
          ) : (
            <form className="f-form" onSubmit={submit}>
              <span className="f-tabtext">PROJECT BRIEF</span>
              {hasErrors && (
                <div className="f-status" role="alert">
                  <p className="f-status__h">A few details are missing.</p>
                  <p className="f-action f-muted">Check the highlighted fields below, then send your message.</p>
                </div>
              )}
              <div className="f-form__row">
                {field("name", "Name", "text", "Your name", "name")}
                {field("email", "Email", "email", "you@example.com", "email")}
              </div>
              <div className="f-field">
                <label className="f-field__label" htmlFor="f-message">
                  Project
                </label>
                {errors.message && (
                  <p className="f-field__err" id="f-message-err">
                    {errors.message}
                  </p>
                )}
                <textarea
                  ref={fields.message}
                  id="f-message"
                  className="f-input"
                  placeholder="What's the project?"
                  value={form.message}
                  onChange={update("message")}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "f-message-err" : undefined}
                />
              </div>
              <div className="f-form__actions">
                <button type="submit" className="f-btn f-btn--primary">
                  <Send size={16} />
                  Send message
                </button>
                <span className="f-meta f-muted">Your email stays private.</span>
              </div>
            </form>
          )}
          <ContactNote trackEmail />
        </div>
      </section>

      <ContactStrip heading="Curious what I’ve built?" label="See the work" href="/work" variant="arrow" />
    </>
  );
}

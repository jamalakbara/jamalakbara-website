"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSite } from "@/lib/i18n/context";
import { GAEvents } from "@/lib/analytics/events";
import { TitlePanel } from "@/components/site/title-panel";
import { ContactNote } from "@/components/site/contact-note";
import { ContactStrip } from "@/components/site/contact-strip";
import type { StickerSpot } from "@/components/site/sticker";
import { Check, MapPin, Send } from "@/components/site/icons";
import { sentenceLines } from "@/lib/site-format";

// Contact view shared by /contact (canvas 19: qlvWa / IWLZT, validation 19A,
// success 19C) and /kontak (canvas 40). Only the copy differs.
// Behaviour is unchanged: client-side checks, then the brief opens in WhatsApp.

type Errors = { name?: string; email?: string; message?: string };


const STICKERS: StickerSpot[] = [
  { name: "make-it-useful", x: 470, y: 74, w: 126, h: 119.283, r: 6 },
  { name: "debug-duck", x: 700, y: 150, w: 76.633, h: 86.4, r: -10 },
  { name: "pen-tool", x: 850, y: 44, w: 68.697, h: 81, r: -14 },
];

export function ContactView({ preview = false, previewField }: { preview?: boolean; previewField?: string }) {
  const { contact, path, ui } = useSite();
  const copy = ui.contact;
  // wa.me number from the CMS country + local fields; shipped default when unset.
  const whatsappNumber = contact.whatsapp || "6281321766565";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [validationErrors, setErrors] = useState<Errors>({});
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
    if (!form.name.trim()) next.name = copy.errorName;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      next.email = copy.errorEmail;
    if (!form.message.trim()) next.message = copy.errorMessage;
    if (Object.keys(next).length) {
      setErrors(next);
      const first = (["name", "email", "message"] as const).find((k) => next[k]);
      if (first) fields[first].current?.focus({ preventScroll: preview });
      return;
    }
    setErrors({});
    if (preview) {
      setSent(true);
      return;
    }

    const text = [
      copy.greeting.replace("{name}", form.name.trim()),
      "",
      form.message.trim(),
      "",
      `${copy.replyTo} ${form.email.trim()}`,
    ].join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    GAEvents.trackContactMessage("whatsapp_form");
    setSent(true);
  };

  const errors: Errors = previewField === "errorName" ? { name: copy.errorName }
    : previewField === "errorEmail" ? { email: copy.errorEmail }
    : previewField === "errorMessage" ? { message: copy.errorMessage }
    : previewField === "statusHeading" || previewField === "statusBody" ? { name: copy.errorName }
    : validationErrors;
  const hasErrors = Boolean(errors.name || errors.email || errors.message);
  const showSent = sent || previewField === "sentHeading" || previewField === "sentBody";

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
        label={copy.label}
        aside={
          <span className="f-loc f-meta f-muted">
            <MapPin size={14} />
            {ui.common.location}
          </span>
        }
        heading={<h1 className="f-display f-display--caps">{sentenceLines(contact.heading)}</h1>}
        intro={<p className="f-body">{copy.intro}</p>}
        stickers={STICKERS}
        mobileStickers={[{ name: "debug-duck", x: 270, y: 74, w: 59.603, h: 67.2, r: -10 }]}
      />

      <section className="f-folder" aria-label={copy.tab}>
        <div className="f-tab">
          <span className="f-tabtext">{copy.tab}</span>
          <span className="f-tab__n f-muted">01</span>
        </div>
        <div className="f-folder__body f-folder__body--flush f-split">
          {showSent ? (
            <div className="f-form f-sent" role="status">
              <span className="f-sent__icon">
                <Check size={24} />
              </span>
              <p className="f-sent__h">{copy.sentHeading}</p>
              <p className="f-sent__p">{copy.sentBody}</p>
            </div>
          ) : (
            <form className="f-form" onSubmit={submit}>
              <span className="f-tabtext">{copy.formLabel}</span>
              {hasErrors && (
                <div className="f-status" role="alert">
                  <p className="f-status__h">{copy.statusHeading}</p>
                  <p className="f-action f-muted">{copy.statusBody}</p>
                </div>
              )}
              <div className="f-form__row">
                {field("name", copy.name, "text", copy.namePlaceholder, "name")}
                {field("email", copy.email, "email", copy.emailPlaceholder, "email")}
              </div>
              <div className="f-field">
                <label className="f-field__label" htmlFor="f-message">
                  {copy.project}
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
                  placeholder={copy.projectPlaceholder}
                  value={form.message}
                  onChange={update("message")}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "f-message-err" : undefined}
                />
              </div>
              <div className="f-form__actions">
                <button type="submit" className="f-btn f-btn--primary">
                  <Send size={16} />
                  {copy.submit}
                </button>
                <span className="f-meta f-muted">
                  {copy.privacyNote} <Link href={path("/privacy")} style={{ textDecoration: "underline" }}>{copy.privacyLink}</Link>
                </span>
              </div>
            </form>
          )}
          <ContactNote trackEmail />
        </div>
      </section>

      <ContactStrip heading={copy.stripHeading} label={copy.stripLabel} href={path("/work")} variant="arrow" />
    </>
  );
}

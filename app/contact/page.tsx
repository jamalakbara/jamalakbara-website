"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { contact } from "@/lib/site-data";

type Errors = { name?: string; email?: string; message?: string };

const WHATSAPP_NUMBER = "6281321766565";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

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

    setSent(true);
  };

  const errStyle = (msg?: string): React.CSSProperties => ({
    fontSize: "0.78rem",
    color: "#e0875a",
    marginTop: "0.35rem",
    display: msg ? "block" : "none",
  });

  return (
    <div
      className="contact-root"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 0,
      }}
    >
      <div
        className="two-col"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "clamp(2rem, 6vw, 5rem)",
          width: "100%",
          maxWidth: "1080px",
          margin: "0 auto",
        }}
      >
        {/* left column */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: "32rem" }}>
          <div
            className="animate-blur-fade-up"
            style={{
              animationDelay: "150ms",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              color: "#e0875a",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: "22px",
                height: "1px",
                background: "#e0875a",
                display: "inline-block",
              }}
            />
            {contact.eyebrow}
          </div>

          <h2
            className="animate-blur-fade-up"
            style={{
              animationDelay: "250ms",
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "0 0 1.5rem",
              textWrap: "balance",
            }}
          >
            {contact.heading}
          </h2>

          <a
            href={`mailto:${contact.email}`}
            className="animate-blur-fade-up email-link"
            style={{
              animationDelay: "350ms",
              display: "inline-block",
              fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)",
              color: "#f4ede3",
              textDecoration: "none",
              borderBottom: "1px solid rgba(224,135,91,0.5)",
              paddingBottom: "2px",
              marginBottom: "1.75rem",
              transition: "color 0.25s",
            }}
          >
            {contact.email}
          </a>

          <div
            className="animate-blur-fade-up"
            style={{
              animationDelay: "450ms",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
            }}
          >
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass"
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.1rem",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* right column — form / success */}
        <div
          className="animate-blur-fade-up"
          style={{
            animationDelay: "400ms",
            flex: 1,
            minWidth: 0,
            maxWidth: "30rem",
            width: "100%",
          }}
        >
          {sent ? (
            <div
              className="liquid-glass"
              style={{
                borderRadius: "1.1rem",
                padding: "2.5rem 2rem",
                textAlign: "center",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "9999px",
                  background: "rgba(110,231,135,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <Check size={22} color="#6ee787" strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: "1.15rem", marginBottom: "0.4rem" }}>
                Opening WhatsApp…
              </div>
              <div style={{ fontSize: "0.9rem", color: "#b3a596" }}>
                Just hit send in the chat and I&apos;ll get back to you within a
                day or two.
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="liquid-glass"
              style={{
                borderRadius: "1.1rem",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={update("name")}
                  />
                  <div style={errStyle(errors.name)}>{errors.name}</div>
                </div>
                <div>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={update("email")}
                  />
                  <div style={errStyle(errors.email)}>{errors.email}</div>
                </div>
                <div>
                  <textarea
                    className="field-input"
                    rows={4}
                    placeholder="What's the project?"
                    style={{ resize: "none" }}
                    value={form.message}
                    onChange={update("message")}
                  />
                  <div style={errStyle(errors.message)}>{errors.message}</div>
                </div>
                <button
                  type="submit"
                  className="btn-solid"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "#f4ede3",
                    color: "#1a120b",
                    border: "none",
                    borderRadius: "9999px",
                    fontWeight: 500,
                    padding: "0.8rem 1.5rem",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <span>Send message</span>
                  <Send size={17} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

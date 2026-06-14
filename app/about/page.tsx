"use client";

/* eslint-disable @next/next/no-img-element */
import { about } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <div
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
          alignItems: "center",
          gap: "clamp(2rem, 5vw, 4.5rem)",
        }}
      >
        <div
          className="about-portrait animate-blur-fade-up"
          style={{
            animationDelay: "150ms",
            width: "clamp(220px, 26vw, 340px)",
            flexShrink: 0,
          }}
        >
          <img
            src={about.portrait}
            alt="Portrait of Akbar"
            style={{
              width: "100%",
              aspectRatio: "4 / 5",
              objectFit: "cover",
              borderRadius: "18px",
              display: "block",
              background: "rgba(255,244,232,0.04)",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, maxWidth: "38rem" }}>
          <div
            className="animate-blur-fade-up"
            style={{
              animationDelay: "250ms",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
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
            {about.eyebrow}
          </div>

          <h2
            className="animate-blur-fade-up"
            style={{
              animationDelay: "350ms",
              fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
              fontWeight: 400,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              margin: "0 0 1.25rem",
            }}
          >
            {about.heading}
          </h2>

          <p
            className="animate-blur-fade-up"
            style={{
              animationDelay: "450ms",
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
              color: "#b3a596",
              lineHeight: 1.65,
              margin: "0 0 1rem",
            }}
          >
            {about.paragraphs[0]}
          </p>
          <p
            className="animate-blur-fade-up"
            style={{
              animationDelay: "520ms",
              fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
              color: "#b3a596",
              lineHeight: 1.65,
              margin: "0 0 1.75rem",
            }}
          >
            {about.paragraphs[1]}
          </p>

          <div
            className="animate-blur-fade-up"
            style={{
              animationDelay: "600ms",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
            }}
          >
            {about.chips.map((chip) => (
              <span
                key={chip}
                className="liquid-glass"
                style={{
                  borderRadius: "9999px",
                  padding: "0.45rem 1rem",
                  fontSize: "0.85rem",
                  cursor: "default",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

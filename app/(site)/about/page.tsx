"use client";

import Image from "next/image";
import { about } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <div
      className="about-root"
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
          gap: "clamp(2rem, 5vw, 4.5rem)",
          width: "100%",
          maxWidth: "1080px",
          margin: "0 auto",
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
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: "18px",
              overflow: "hidden",
              background: "rgba(255,244,232,0.04)",
            }}
          >
            <Image
              src={about.portrait}
              alt="Portrait of Akbar"
              fill
              priority
              sizes="(max-width: 700px) 60vw, 340px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, maxWidth: "38rem" }}>
          <div
            className="animate-blur-fade-up"
            style={{
              animationDelay: "250ms",
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

          {about.paragraphs.map((para, i) => (
            <p
              key={i}
              className="animate-blur-fade-up"
              style={{
                animationDelay: `${450 + i * 70}ms`,
                fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
                color: "#b3a596",
                lineHeight: 1.65,
                margin: i === about.paragraphs.length - 1 ? "0 0 1.75rem" : "0 0 1rem",
              }}
            >
              {para}
            </p>
          ))}

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

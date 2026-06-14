"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { works, work, type WorkRow } from "@/lib/site-data";
import WorkPreview from "@/components/work-preview";

export default function WorkPage() {
  const [active, setActive] = useState<WorkRow | null>(null);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        paddingTop: "clamp(0.5rem, 2vw, 1.5rem)",
      }}
    >
      <div
        className="animate-blur-fade-up"
        style={{ animationDelay: "100ms", marginBottom: "clamp(1rem, 3vw, 2rem)" }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e0875a",
            marginBottom: "0.75rem",
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
          {work.eyebrow}
        </div>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {work.heading}
        </h2>
      </div>

      {/* scrollable list */}
      <div
        onMouseLeave={() => setActive(null)}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid rgba(255,244,232,0.1)",
        }}
      >
        {works.map((p, i) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActive(p)}
            className="work-row animate-blur-fade-up"
            style={{
              animationDelay: `${150 + i * 70}ms`,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "clamp(0.7rem, 1.6vw, 1.05rem) 0",
              borderBottom: "1px solid rgba(255,244,232,0.1)",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "#7d7163",
                width: "2rem",
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.num}
            </span>
            <span
              className="work-title"
              style={{
                fontSize: "clamp(1.1rem, 2.6vw, 1.7rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                flex: 1,
                minWidth: 0,
                color: "#f4ede3",
              }}
            >
              {p.title}
            </span>
            <span
              className="work-cat"
              style={{ fontSize: "0.8rem", color: "#b3a596", flexShrink: 0 }}
            >
              {p.category}
            </span>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#7d7163",
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.year}
            </span>
            <span
              className="work-arrow"
              style={{
                flexShrink: 0,
                color: "#eab38a",
                display: "inline-flex",
              }}
            >
              <ArrowUpRight size={18} />
            </span>
          </a>
        ))}
      </div>

      <WorkPreview active={active} />
    </div>
  );
}

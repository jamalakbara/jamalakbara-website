"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { home } from "@/lib/site-data";
import { GAEvents } from "@/lib/analytics/events";

export default function HomePage() {
  return (
    <div
      className="home-root"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* status row */}
      <div
        className="animate-blur-fade-up"
        style={{
          animationDelay: "300ms",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(0.75rem, 2vw, 1.5rem)",
          marginBottom: "clamp(1.25rem, 3vw, 1.75rem)",
          fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "9999px",
              background: "#e0875a",
              display: "inline-block",
            }}
          />
          <span>{home.role}</span>
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#b3a596",
          }}
        >
          <MapPin size={17} />
          <span>{home.location}</span>
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "#b3a596",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "9999px",
              background: "#6ee787",
              boxShadow: "0 0 8px #6ee787",
              animation: "softPulse 2.4s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          <span>{home.availability}</span>
        </span>
      </div>

      <h1
        className="animate-blur-fade-up"
        style={{
          animationDelay: "400ms",
          fontSize: "clamp(2.2rem, 6.5vw, 5rem)",
          fontWeight: 400,
          letterSpacing: "-0.045em",
          lineHeight: 1.02,
          margin: "0 0 clamp(1rem, 2vw, 1.5rem)",
          maxWidth: "16ch",
          textWrap: "balance",
        }}
      >
        {home.headline}
      </h1>

      <p
        className="animate-blur-fade-up"
        style={{
          animationDelay: "500ms",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "#b3a596",
          margin: "0 0 clamp(1.5rem, 3.5vw, 2.5rem)",
          maxWidth: "44ch",
          lineHeight: 1.55,
        }}
      >
        {home.intro}
      </p>

      <div
        className="home-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(0.75rem, 1.5vw, 1rem)",
          }}
        >
          <Link
            href="/work"
            onClick={() => GAEvents.trackNavigationClick("/work", "home_cta")}
            className="animate-blur-fade-up btn-solid"
            style={{
              animationDelay: "600ms",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f4ede3",
              color: "#1a120b",
              border: "none",
              borderRadius: "9999px",
              fontWeight: 500,
              padding: "0.8rem clamp(1.5rem, 3vw, 2rem)",
              fontSize: "0.95rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <span>See the work</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            onClick={() => GAEvents.trackNavigationClick("/contact", "home_cta")}
            className="liquid-glass animate-blur-fade-up"
            style={{
              animationDelay: "700ms",
              borderRadius: "9999px",
              fontWeight: 500,
              padding: "0.8rem clamp(1.5rem, 3vw, 2rem)",
              fontSize: "0.95rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Say hi
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getJurnalPosts, formatJurnalDate } from "@/lib/jurnal";

export default function JurnalPage() {
  const posts = getJurnalPosts();

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
        style={{
          animationDelay: "100ms",
          marginBottom: "clamp(0.75rem, 2vw, 1.25rem)",
          paddingBottom: "clamp(0.75rem, 2vw, 1.25rem)",
          borderBottom: "1px solid rgba(255,244,232,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              color: "#e0875a",
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
            Jurnal
          </div>
          <Link href="/journal" className="lang-link">
            English →
          </Link>
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Notes from the build.
        </h1>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, #000 18px)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 18px)",
        }}
      >
        {posts.length === 0 && (
          <p style={{ color: "#a99c8d", padding: "1rem 0" }}>
            Belum ada tulisan — segera hadir.
          </p>
        )}
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/jurnal/${p.slug}`}
            className="work-row animate-blur-fade-up"
            style={{
              animationDelay: `${150 + i * 70}ms`,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "clamp(0.9rem, 2vw, 1.3rem) 0",
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
                width: "6.5rem",
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatJurnalDate(p.date)}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                className="work-title"
                style={{
                  display: "block",
                  fontSize: "clamp(1.1rem, 2.6vw, 1.7rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#f4ede3",
                }}
              >
                {p.title}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#a99c8d",
                  marginTop: "0.3rem",
                  maxWidth: "56ch",
                }}
              >
                {p.description}
              </span>
            </span>
            <span
              className="work-cat"
              style={{ fontSize: "0.8rem", color: "#b3a596", flexShrink: 0 }}
            >
              {p.readingMinutes} menit
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
          </Link>
        ))}
      </div>
    </div>
  );
}

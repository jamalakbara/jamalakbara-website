"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, flagEmoji } from "@/lib/country-codes";

// Searchable country dial-code picker. Value is the dial code (digits). Renders
// a compact trigger (flag + code) and a filterable dropdown.
export function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (dial: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.dial === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        className="a-input"
        style={{ width: 120, justifyContent: "space-between" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="a-truncate">
          {selected ? `${flagEmoji(selected.iso2)} +${selected.dial}` : "Select"}
        </span>
        <span aria-hidden className="a-muted">▾</span>
      </button>
      {open && (
        <div className="a-panel a-panel--note" style={{ position: "absolute", left: 0, top: "calc(100% + 4px)", zIndex: 50, width: 288, padding: 8, boxShadow: "0 12px 32px rgb(32 30 25 / 0.16)" }}>
          <input
            ref={inputRef}
            className="a-input"
            style={{ marginBottom: 8, minHeight: 40 }}
            placeholder="Search country or code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ maxHeight: 256, overflowY: "auto" }}>
            {filtered.map((c) => (
              <button
                key={c.iso2}
                type="button"
                className="a-navitem a-small"
                style={{ height: 36, width: "100%", textAlign: "left", ...(c.dial === value ? { color: "var(--f-accent)" } : {}) }}
                onClick={() => {
                  onChange(c.dial);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{flagEmoji(c.iso2)}</span>
                <span className="a-truncate" style={{ flex: 1 }}>{c.name}</span>
                <span className="a-muted">+{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="a-small a-muted" style={{ padding: 12, textAlign: "center" }}>No match.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        className="field-input flex w-28 cursor-pointer items-center justify-between gap-1"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {selected ? `${flagEmoji(selected.iso2)} +${selected.dial}` : "Select"}
        </span>
        <span aria-hidden className="text-[var(--m4)]">▾</span>
      </button>
      {open && (
        <div className="liquid-glass absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl p-2">
          <input
            ref={inputRef}
            className="field-input mb-2 w-full text-xs"
            placeholder="Search country or code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.iso2}
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-[var(--m4)]/10"
                style={c.dial === value ? { color: "var(--accent)" } : undefined}
                onClick={() => {
                  onChange(c.dial);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{flagEmoji(c.iso2)}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-[var(--m4)]">+{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-3 text-center text-xs text-[var(--m4)]">No match.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

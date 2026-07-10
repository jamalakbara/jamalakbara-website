"use client";

import { useRef, useState, useTransition } from "react";
import {
  BRANDING_SLOTS,
  MAX_BRANDING_BYTES,
  type BrandingSlot,
} from "@/lib/admin/branding";
import { saveBrandingAsset } from "./actions";

function pngDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("could not read file"));
    reader.readAsDataURL(file);
  });
}

function slotSpec(entry: (typeof BRANDING_SLOTS)[BrandingSlot]): string {
  if (entry.pngSize) return `PNG ${entry.pngSize}×${entry.pngSize}`;
  return entry.accept.startsWith(".svg") ? "SVG" : ".ico";
}

function SlotRow({ slot }: { slot: BrandingSlot }) {
  const entry = BRANDING_SLOTS[slot];
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [bump, setBump] = useState(0); // cache-buster after replace

  async function pick(file: File) {
    setMessage(null);
    if (file.size > MAX_BRANDING_BYTES) {
      setMessage("File too large (max 1 MB)");
      return;
    }
    if (entry.pngSize) {
      try {
        const { w, h } = await pngDimensions(file);
        if (w !== entry.pngSize || h !== entry.pngSize) {
          setMessage(`Must be exactly ${entry.pngSize}×${entry.pngSize} (got ${w}×${h})`);
          return;
        }
      } catch {
        setMessage("Could not read image dimensions");
        return;
      }
    }
    const base64 = await toBase64(file);
    startTransition(async () => {
      const result = await saveBrandingAsset(slot, base64);
      if (result.ok) {
        setMessage("Saved.");
        setBump((b) => b + 1);
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="liquid-glass flex cursor-default items-center gap-4 rounded-xl px-5 py-3.5">
      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[rgba(246,243,240,0.03)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${entry.publicUrl}?v=${bump}`}
          alt={entry.label}
          className="max-h-9 max-w-14 object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">{entry.label}</p>
        <p
          className={`mt-0.5 truncate text-xs ${
            message ? "text-[var(--m2)]" : "text-[var(--m4)]"
          }`}
        >
          {message ?? entry.note}
        </p>
      </div>
      <span className="hidden shrink-0 rounded-full border border-[rgba(246,243,240,0.1)] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[var(--m3)] sm:inline-flex">
        {slotSpec(entry)}
      </span>
      <button
        type="button"
        className="liquid-glass shrink-0 rounded-full px-4 py-1.5 text-xs disabled:opacity-40"
        disabled={pending}
        onClick={() => fileRef.current?.click()}
      >
        {pending ? "Saving…" : "Replace"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={entry.accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pick(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function BrandingForm() {
  const slots = Object.keys(BRANDING_SLOTS) as BrandingSlot[];
  return (
    <div>
      <div className="grid max-w-3xl gap-3">
        {slots.map((slot) => (
          <SlotRow key={slot} slot={slot} />
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-xs text-[var(--m4)]">
        Previews show the currently deployed assets — after saving in production,
        the new file appears once the rebuild finishes. Replacements only change
        file bytes; the favicon stays favicon.ico by design.
      </p>
    </div>
  );
}

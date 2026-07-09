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

function SlotCard({ slot }: { slot: BrandingSlot }) {
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
    <div className="liquid-glass cursor-default rounded-2xl p-5">
      <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-[rgba(246,243,240,0.03)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${entry.publicUrl}?v=${bump}`}
          alt={entry.label}
          className="max-h-16 max-w-[80%] object-contain"
        />
      </div>
      <p className="text-sm">{entry.label}</p>
      <p className="mb-3 mt-0.5 text-xs text-[var(--m4)]">{entry.note}</p>
      <button
        type="button"
        className="liquid-glass rounded-full px-4 py-1.5 text-xs disabled:opacity-40"
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
      {message && <p className="mt-2 text-xs text-[var(--m3)]">{message}</p>}
    </div>
  );
}

export function BrandingForm() {
  const slots = Object.keys(BRANDING_SLOTS) as BrandingSlot[];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <SlotCard key={slot} slot={slot} />
        ))}
      </div>
      <p className="mt-6 text-xs text-[var(--m4)]">
        Previews show the currently deployed assets — after saving in production,
        the new file appears once the rebuild finishes. Replacements only change
        file bytes; the favicon stays favicon.ico by design.
      </p>
    </div>
  );
}

"use server";

import { requireAdmin } from "@/lib/auth";
import { writeBinaryFile } from "@/lib/admin/content-store";
import {
  BRANDING_SLOTS,
  MAX_BRANDING_BYTES,
  type BrandingSlot,
} from "@/lib/admin/branding";
import type { ActionResult } from "../projects/actions";

function looksLike(slot: BrandingSlot, bytes: Buffer): boolean {
  switch (slot) {
    case "favicon":
      // ICO header: 00 00 01 00
      return bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0;
    case "logo":
      return bytes.subarray(0, 512).toString("utf8").includes("<svg");
    default:
      // PNG magic
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
}

export async function saveBrandingAsset(
  slot: BrandingSlot,
  base64: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entry = BRANDING_SLOTS[slot];
    if (!entry) return { ok: false, error: `unknown slot "${slot}"` };

    const bytes = Buffer.from(base64, "base64");
    if (bytes.length === 0) return { ok: false, error: "empty file" };
    if (bytes.length > MAX_BRANDING_BYTES) {
      return { ok: false, error: "file too large (max 1 MB)" };
    }
    if (!looksLike(slot, bytes)) {
      return { ok: false, error: `file does not look like a valid ${entry.label}` };
    }

    await writeBinaryFile(entry.path, base64, `branding: update ${slot}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

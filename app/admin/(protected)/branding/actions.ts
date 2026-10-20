"use server";

import { requireAdmin } from "@/lib/auth";
import { readTextFile, writeBinaryFile, writeManyFiles, writeTextFile } from "@/lib/admin/content-store";
import {
  BRANDING_SLOTS,
  ICON_SOURCE,
  MANIFEST_PATH,
  MAX_BRANDING_BYTES,
  type BrandingSlot,
} from "@/lib/admin/branding";
import { renderIconSet } from "@/lib/admin/icon-set";
import { fail, type ActionResult } from "@/lib/admin/action-result";

function looksLike(slot: BrandingSlot, bytes: Buffer): boolean {
  switch (slot) {
    case "favicon":
      // ICO header: 00 00 01 00
      return bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0;
    case "logo":
      return bytes.subarray(0, 512).toString("utf8").includes("<svg");
    case "og-image":
      // JPEG SOI marker
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    default:
      // PNG magic
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
}

export async function saveBrandingAsset(slot: BrandingSlot, base64: string): Promise<ActionResult> {
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

    const sha = await writeBinaryFile(entry.path, base64, `branding: update ${slot}`);
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

/** Re-render favicon + all app icons from public/icon.svg in one commit. */
export async function regenerateIconSet(): Promise<ActionResult> {
  try {
    await requireAdmin();
    const svg = await readTextFile(ICON_SOURCE);
    if (!svg) return { ok: false, error: `${ICON_SOURCE} not found` };
    const files = await renderIconSet(svg);
    const sha = await writeManyFiles(
      Object.entries(files).map(([path, buf]) => ({ path, content: "", base64: buf.toString("base64") })),
      "branding: update icon set (regenerated from icon.svg)"
    );
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

const HEX = /^#[0-9a-f]{6}$/i;

export async function saveManifestColors(background: string, theme: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!HEX.test(background) || !HEX.test(theme)) return { ok: false, error: "use #RRGGBB colours" };
    const raw = await readTextFile(MANIFEST_PATH);
    if (!raw) return { ok: false, error: "manifest.json not found" };
    const manifest = JSON.parse(raw) as Record<string, unknown>;
    manifest.background_color = background.toUpperCase();
    manifest.theme_color = theme.toUpperCase();
    const sha = await writeTextFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "branding: update manifest colours");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

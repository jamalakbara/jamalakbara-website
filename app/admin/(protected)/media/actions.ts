"use server";

import { requireAdmin } from "@/lib/auth";
import { writeJsonFile } from "@/lib/admin/content-store";
import { MEDIA_META_PATH, readMediaAlt } from "@/lib/admin/media-usage";
import { mediaMetaSchema } from "@/lib/content/schemas";
import { fail, type ActionResult } from "@/lib/admin/action-result";

/** Save (or clear) one asset's alt text in content/media.json. */
export async function saveMediaAlt(key: string, alt: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!/^[\w-]+$/.test(key)) return { ok: false, error: "invalid media key" };
    const map = await readMediaAlt();
    const value = alt.trim().slice(0, 125);
    if (value) map[key] = value;
    else delete map[key];
    const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
    const sha = await writeJsonFile(
      MEDIA_META_PATH,
      mediaMetaSchema.parse({ alt: sorted }),
      `content(media): ${value ? "set" : "clear"} alt ${key}`
    );
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

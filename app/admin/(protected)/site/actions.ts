"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { writeManyFiles } from "@/lib/admin/content-store";
import { SINGLETONS, type SingletonKey } from "@/lib/admin/singletons";
import { fail, type ActionResult } from "@/lib/admin/action-result";

/** Save every changed site-copy file in ONE commit ("one save = one commit"). */
export async function saveSiteCopy(
  entries: Array<[SingletonKey, unknown]>,
  label: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (entries.length === 0) return { ok: true, sha: null };
    const files = entries.map(([key, value]) => {
      const entry = SINGLETONS[key];
      if (!entry) throw new Error(`unknown singleton "${key}"`);
      return { path: entry.path, content: JSON.stringify(entry.schema.parse(value), null, 2) + "\n" };
    });
    const sha = await writeManyFiles(files, `content(site): update ${label}`);
    revalidatePath("/admin/site");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

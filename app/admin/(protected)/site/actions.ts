"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { writeJsonFile } from "@/lib/admin/content-store";
import { SINGLETONS, type SingletonKey } from "@/lib/admin/singletons";
import type { ActionResult } from "../projects/actions";

export async function saveSingleton(
  key: SingletonKey,
  value: unknown
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const entry = SINGLETONS[key];
    if (!entry) return { ok: false, error: `unknown singleton "${key}"` };
    const parsed = entry.schema.parse(value);
    await writeJsonFile(entry.path, parsed, `content(site): update ${key}`);
    revalidatePath("/admin/site");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

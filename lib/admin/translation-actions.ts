"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readJsonFile, writeJsonFile, writeManyFiles } from "@/lib/admin/content-store";
import { fail, type ActionResult } from "@/lib/admin/action-result";
import { idProjectSchema, idSiteSchema } from "@/lib/content/schemas";
import { loadTranslationReport } from "@/lib/admin/translations";
import type { IdProject, IdProjects, IdSite } from "@/lib/i18n/completeness";

const SITE_PATH = "content/i18n/id/site.json";
const PROJECTS_PATH = "content/i18n/id/projects.json";
const PRIVACY_PATH = "content/privacy/id.mdx";

/** Save the Translations screen in one commit. Publishing needs required copy done. */
export async function saveTranslations(
  site: IdSite,
  privacy: { updated: string; body: string }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = idSiteSchema.parse(site);
    if (parsed.published) {
      const report = await loadTranslationReport({ site: parsed as IdSite, privacy: privacy.body });
      if (!report.ready) return { ok: false, error: "Required Bahasa copy is not finished yet" };
    }
    const sha = await writeManyFiles(
      [
        { path: SITE_PATH, content: JSON.stringify(parsed, null, 2) + "\n" },
        { path: PRIVACY_PATH, content: `---\nupdated: ${JSON.stringify(privacy.updated)}\n---\n\n${privacy.body.trim()}\n` },
      ],
      "content(i18n): update Bahasa copy"
    );
    revalidatePath("/admin/translations");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

/** Save one project's Bahasa copy. */
export async function saveProjectTranslation(id: string, overlay: IdProject): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = idProjectSchema.parse(overlay);
    const all = await readJsonFile<IdProjects>(PROJECTS_PATH);
    const sha = await writeJsonFile(PROJECTS_PATH, { ...all, [id]: parsed }, `content(i18n): update ${id}`);
    revalidatePath("/admin/translations");
    revalidatePath("/admin/projects");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readJsonFile, writeJsonFile } from "@/lib/admin/content-store";
import { servicePageSchema, servicePagesSchema } from "@/lib/content/schemas";
import type { ServicePage } from "@/lib/content-types";
import { fail, type ActionResult } from "@/lib/admin/action-result";

const PATH = "content/service-pages.json";

export async function readServicePages(): Promise<ServicePage[]> {
  await requireAdmin();
  return readJsonFile<ServicePage[]>(PATH);
}

export async function upsertServicePage(
  page: ServicePage,
  originalSlug?: string
): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin();
    const parsed = servicePageSchema.parse(page);
    const pages = await readJsonFile<ServicePage[]>(PATH);
    const taken = pages.some((p) => p.slug === parsed.slug && p.slug !== originalSlug);
    if (taken) return { ok: false, error: `A page with slug "${parsed.slug}" already exists` };

    const index = pages.findIndex((p) => p.slug === (originalSlug ?? parsed.slug));
    const next = index === -1 ? [...pages, parsed] : pages.map((p, i) => (i === index ? parsed : p));
    const sha = await writeJsonFile(
      PATH,
      servicePagesSchema.parse(next),
      `content(service-pages): ${index === -1 ? "add" : "update"} ${parsed.slug}`
    );
    revalidatePath("/admin/service-pages");
    return { ok: true, sha, slug: parsed.slug };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteServicePage(slug: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const pages = await readJsonFile<ServicePage[]>(PATH);
    const next = pages.filter((p) => p.slug !== slug);
    if (next.length === pages.length) return { ok: false, error: `Page "${slug}" not found` };
    const sha = await writeJsonFile(PATH, next, `content(service-pages): delete ${slug}`);
    revalidatePath("/admin/service-pages");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

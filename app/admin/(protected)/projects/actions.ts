"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readProjects, writeProjects } from "@/lib/admin/content-store";
import { projectSchema } from "@/lib/content/schemas";
import type { Project } from "@/lib/content-types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(e: unknown): ActionResult {
  return { ok: false, error: e instanceof Error ? e.message : String(e) };
}

/** Persist row order + featured flags from the list view in one commit. */
export async function saveProjectsList(
  order: string[],
  featuredIds: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const projects = await readProjects();
    const byId = new Map(projects.map((p) => [p.id, p]));
    if (order.length !== projects.length || order.some((id) => !byId.has(id))) {
      return { ok: false, error: "Order is out of sync — reload and retry" };
    }
    const featured = new Set(featuredIds);
    const next = order.map((id) => ({
      ...byId.get(id)!,
      featured: featured.has(id),
    }));
    await writeProjects(next, "content(projects): reorder / featured update");
    revalidatePath("/admin/projects");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function upsertProject(
  project: Project,
  originalId?: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(project) as Project;
    const projects = await readProjects();
    const idTaken = projects.some(
      (p) => p.id === parsed.id && p.id !== originalId
    );
    if (idTaken) return { ok: false, error: `id "${parsed.id}" already exists` };

    let next: Project[];
    if (originalId) {
      next = projects.map((p) => (p.id === originalId ? parsed : p));
      if (!projects.some((p) => p.id === originalId)) {
        return { ok: false, error: `project "${originalId}" not found` };
      }
    } else {
      next = [...projects, parsed];
    }
    await writeProjects(
      next,
      `content(projects): ${originalId ? "update" : "add"} ${parsed.id}`
    );
    revalidatePath("/admin/projects");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const projects = await readProjects();
    const next = projects.filter((p) => p.id !== id);
    if (next.length === projects.length) {
      return { ok: false, error: `project "${id}" not found` };
    }
    await writeProjects(next, `content(projects): remove ${id}`);
    revalidatePath("/admin/projects");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

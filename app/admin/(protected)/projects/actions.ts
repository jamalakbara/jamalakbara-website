"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readProjects, writeProjects } from "@/lib/admin/content-store";
import { projectSchema } from "@/lib/content/schemas";
import type { Project } from "@/lib/content-types";
import { fail, type ActionResult } from "@/lib/admin/action-result";
import { createPreview, siteOrigin } from "@/lib/admin/preview";

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
    const next = order.map((id) => {
      const { featured: _f, ...rest } = byId.get(id)!;
      return featured.has(id) ? { ...rest, featured: true } : rest;
    });
    const sha = await writeProjects(next, "content(projects): reorder / featured update");
    revalidatePath("/admin/projects");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

export async function upsertProject(
  project: Project,
  originalId?: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = projectSchema.parse(project) as Project;
    const projects = await readProjects();
    const idTaken = projects.some((p) => p.id === parsed.id && p.id !== originalId);
    if (idTaken) return { ok: false, error: `id "${parsed.id}" already exists` };

    let next: Project[];
    if (originalId) {
      if (!projects.some((p) => p.id === originalId)) {
        return { ok: false, error: `project "${originalId}" not found` };
      }
      next = projects.map((p) => (p.id === originalId ? parsed : p));
    } else {
      next = [...projects, parsed];
    }
    const sha = await writeProjects(
      next,
      `content(projects): ${originalId ? "update" : "add"} ${parsed.id}`
    );
    revalidatePath("/admin/projects");
    return { ok: true, sha, id: parsed.id };
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
    const sha = await writeProjects(next, `content(projects): remove ${id}`);
    revalidatePath("/admin/projects");
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

export async function previewProject(
  project: Project
): Promise<ActionResult<{ url: string; expiresAt: number }>> {
  try {
    await requireAdmin();
    const projects = await readProjects();
    const live = projects.filter((p) => !p.draft);
    const at = live.findIndex((p) => p.id === project.id);
    const { token, expiresAt } = await createPreview({
      kind: "project",
      project,
      index: at === -1 ? live.length : at,
    });
    return { ok: true, url: `${siteOrigin()}/preview/${token}`, expiresAt };
  } catch (e) {
    return fail(e);
  }
}

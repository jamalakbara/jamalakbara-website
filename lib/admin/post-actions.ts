"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readTextFile, writeManyFiles } from "@/lib/admin/content-store";
import { postSchema, type PostInput } from "@/lib/admin/post-schema";
import { fail, type ActionResult } from "@/lib/admin/action-result";
import { createPreview, siteOrigin } from "@/lib/admin/preview";
import {
  SECTIONS,
  postPath,
  readPost,
  serializePost,
  setFrontmatterKey,
  type Section,
} from "@/lib/admin/posts";

type FileChange = { path: string; content: string | null };

/** Point (or unpoint) the counterpart post at `slug`, as a file change. */
async function linkChange(section: Section, slug: string, alternate: string | null): Promise<FileChange | null> {
  const path = postPath(section, slug);
  const raw = await readTextFile(path);
  if (raw === null) return null;
  const next = setFrontmatterKey(raw, "alternate", alternate);
  return next === raw ? null : { path, content: next };
}

export async function savePost(
  section: Section,
  input: PostInput,
  originalSlug?: string
): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin();
    if (!(section in SECTIONS)) return { ok: false, error: `unknown section "${section}"` };
    const parsed = postSchema.parse({ ...input, alternate: input.alternate || undefined });
    const other = SECTIONS[section].other;
    const isRename = Boolean(originalSlug && originalSlug !== parsed.slug);

    if (!originalSlug || isRename) {
      if ((await readTextFile(postPath(section, parsed.slug))) !== null) {
        return { ok: false, error: `post "${parsed.slug}" already exists` };
      }
    }

    const before = originalSlug ? await readPost(section, originalSlug) : null;
    const changes: FileChange[] = [];
    if (isRename) changes.push({ path: postPath(section, originalSlug!), content: null });
    changes.push({ path: postPath(section, parsed.slug), content: serializePost(parsed) });

    // Keep the EN ↔ ID link mutual.
    const prevAlt = before?.alternate;
    if (prevAlt && prevAlt !== parsed.alternate) {
      const prev = await readPost(other, prevAlt);
      if (prev?.alternate === originalSlug) {
        const c = await linkChange(other, prevAlt, null);
        if (c) changes.push(c);
      }
    }
    if (parsed.alternate) {
      const target = await readPost(other, parsed.alternate);
      if (!target) return { ok: false, error: `${SECTIONS[other].label} post "${parsed.alternate}" not found` };
      // The target was linked to a different post here — unlink that one.
      if (target.alternate && target.alternate !== parsed.slug && target.alternate !== originalSlug) {
        const c = await linkChange(section, target.alternate, null);
        if (c) changes.push(c);
      }
      const c = await linkChange(other, parsed.alternate, parsed.slug);
      if (c) changes.push(c);
    }

    const verb = !originalSlug ? "add" : isRename ? "rename" : "update";
    const message =
      verb === "rename"
        ? `content(${section}): rename ${originalSlug} → ${parsed.slug}`
        : `content(${section}): ${verb} ${parsed.slug}`;
    const sha = await writeManyFiles(changes, message);
    revalidatePath(`/admin/${section}`);
    revalidatePath(`/admin/${other}`);
    return { ok: true, sha, slug: parsed.slug };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePost(section: Section, slug: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const post = await readPost(section, slug);
    if (!post) return { ok: false, error: `post "${slug}" not found` };
    const changes: FileChange[] = [{ path: postPath(section, slug), content: null }];
    if (post.alternate) {
      const other = SECTIONS[section].other;
      const target = await readPost(other, post.alternate);
      if (target?.alternate === slug) {
        const c = await linkChange(other, post.alternate, null);
        if (c) changes.push(c);
      }
    }
    const sha = await writeManyFiles(changes, `content(${section}): remove ${slug}`);
    revalidatePath(`/admin/${section}`);
    return { ok: true, sha };
  } catch (e) {
    return fail(e);
  }
}

export async function previewPost(
  section: Section,
  input: PostInput
): Promise<ActionResult<{ url: string; expiresAt: number }>> {
  try {
    await requireAdmin();
    const { token, expiresAt } = await createPreview({ kind: section, post: input });
    return { ok: true, url: `${siteOrigin()}/preview/${token}`, expiresAt };
  } catch (e) {
    return fail(e);
  }
}

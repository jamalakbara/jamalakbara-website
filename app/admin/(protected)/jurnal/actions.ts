"use server";

import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  readTextFile,
  writeManyFiles,
  writeTextFile,
  deleteContentFile,
} from "@/lib/admin/content-store";
import { postSchema, type PostInput } from "@/lib/admin/post-schema";
import type { ActionResult } from "../projects/actions";

const postPath = (slug: string) => `content/jurnal/${slug}.mdx`;

function serialize(input: PostInput): string {
  const { slug: _slug, body, ...frontmatter } = input;
  return matter.stringify(body.endsWith("\n") ? body : body + "\n", frontmatter);
}

export async function saveJurnalPost(
  input: PostInput,
  originalSlug?: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = postSchema.parse(input);
    const isRename = originalSlug && originalSlug !== parsed.slug;

    if (!originalSlug || isRename) {
      const existing = await readTextFile(postPath(parsed.slug));
      if (existing !== null) {
        return { ok: false, error: `post "${parsed.slug}" already exists` };
      }
    }

    const content = serialize(parsed);
    if (isRename) {
      await writeManyFiles(
        [
          { path: postPath(originalSlug), content: null },
          { path: postPath(parsed.slug), content },
        ],
        `content(jurnal): rename ${originalSlug} → ${parsed.slug}`
      );
    } else {
      await writeTextFile(
        postPath(parsed.slug),
        content,
        `content(jurnal): ${originalSlug ? "update" : "add"} ${parsed.slug}`
      );
    }
    revalidatePath("/admin/jurnal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function deleteJurnalPost(slug: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteContentFile(
      postPath(slug),
      `content(jurnal): remove ${slug}`
    );
    revalidatePath("/admin/jurnal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

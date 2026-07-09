"use server";

import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  readTextFile,
  writeManyFiles,
  writeTextFile,
  deleteContentFile,
} from "@/lib/admin/content-store";
import type { ActionResult } from "../projects/actions";

const postSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD"),
  tags: z.array(z.string()),
  draft: z.boolean(),
  body: z.string().min(1),
});

export type JournalPostInput = z.infer<typeof postSchema>;

const postPath = (slug: string) => `content/journal/${slug}.mdx`;

function serialize(input: JournalPostInput): string {
  const { slug: _slug, body, ...frontmatter } = input;
  return matter.stringify(body.endsWith("\n") ? body : body + "\n", frontmatter);
}

export async function saveJournalPost(
  input: JournalPostInput,
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
        `content(journal): rename ${originalSlug} → ${parsed.slug}`
      );
    } else {
      await writeTextFile(
        postPath(parsed.slug),
        content,
        `content(journal): ${originalSlug ? "update" : "add"} ${parsed.slug}`
      );
    }
    revalidatePath("/admin/journal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function deleteJournalPost(slug: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteContentFile(
      postPath(slug),
      `content(journal): remove ${slug}`
    );
    revalidatePath("/admin/journal");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

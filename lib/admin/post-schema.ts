import { z } from "zod";

// Shared write-path validator + type for MDX post editors (journal + jurnal).
// Both admin sections have identical frontmatter/body shape.
export const postSchema = z.object({
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

export type PostInput = z.infer<typeof postSchema>;

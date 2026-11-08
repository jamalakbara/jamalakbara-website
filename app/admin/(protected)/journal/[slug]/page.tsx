import { PostPage } from "@/components/admin/post-page";
import { sectionFor } from "@/lib/admin/sections";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);
  return <PostPage section={sectionFor(lang)} slug={slug} />;
}

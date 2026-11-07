import { PostPage } from "@/components/admin/post-page";
import { sectionFor } from "@/lib/admin/sections";

export const metadata = { title: "New post" };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <PostPage section={sectionFor(lang)} />;
}

import { PostPage } from "@/components/admin/post-page";

export const metadata = { title: "Edit post" };

export default async function EditJournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostPage section="journal" slug={slug} />;
}

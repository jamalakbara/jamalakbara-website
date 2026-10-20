import { PostsIndex } from "@/components/admin/posts-index";

export const metadata = { title: "Journal" };

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <PostsIndex section="journal" status={status} />;
}

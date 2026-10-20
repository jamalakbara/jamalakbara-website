import { PostsIndex } from "@/components/admin/posts-index";

export const metadata = { title: "Jurnal" };

export default async function AdminJurnalPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <PostsIndex section="jurnal" status={status} />;
}

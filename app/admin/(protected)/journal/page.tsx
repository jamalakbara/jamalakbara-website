import { PostsIndex } from "@/components/admin/posts-index";

export const metadata = { title: "Journal" };

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; lang?: string }>;
}) {
  const { status, lang } = await searchParams;
  return <PostsIndex status={status} lang={lang === "en" || lang === "id" ? lang : undefined} />;
}

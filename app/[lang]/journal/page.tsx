import { JournalIndex } from "@/components/site/journal-index";
import type { Lang } from "@/lib/i18n/config";
import { getPosts } from "@/lib/posts";

type Props = { params: Promise<{ lang: string }> };

// Server component — post rows render as static HTML for crawlers.
export default async function JournalPage({ params }: Props) {
  const lang = (await params).lang as Lang;
  return <JournalIndex posts={getPosts(lang)} language={lang} />;
}

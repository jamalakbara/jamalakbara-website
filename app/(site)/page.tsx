import { HomeView } from "@/components/site/home-view";
import { StructuredData } from "@/components/structured-data";
import { getJournalPosts, formatPostDate } from "@/lib/journal";

// Server wrapper: posts are read from disk here, the view is a client component.
export default function HomePage() {
  const latest = getJournalPosts()
    .slice(0, 3)
    .map((p) => ({ href: `/journal/${p.slug}`, title: p.title, date: formatPostDate(p.date) }));

  return (
    <>
      <StructuredData type="WebSite" />
      <StructuredData type="Person" />
      <HomeView latest={latest} />
    </>
  );
}

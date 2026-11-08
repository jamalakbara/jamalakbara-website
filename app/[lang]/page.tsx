import { HomeView } from "@/components/site/home-view";
import { StructuredData } from "@/components/structured-data";
import type { Lang } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routes";
import { requireLive } from "@/lib/i18n/targets";
import { formatDate, getPosts } from "@/lib/posts";

type Props = { params: Promise<{ lang: string }> };

// Server wrapper: posts are read from disk here, the view is a client component.
export default async function HomePage({ params }: Props) {
  const lang = (await params).lang as Lang;
  requireLive(lang);
  const latest = getPosts(lang)
    .slice(0, 3)
    .map((p) => ({ href: localePath(lang, `/journal/${p.slug}`), title: p.title, date: formatDate(lang, p.date) }));

  return (
    <>
      <StructuredData lang={lang} type="WebSite" />
      <StructuredData lang={lang} type="Person" />
      <HomeView latest={latest} />
    </>
  );
}

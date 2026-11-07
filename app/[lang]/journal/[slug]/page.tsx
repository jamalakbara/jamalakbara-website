import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/article-view";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { absoluteUrl, localePath } from "@/lib/i18n/routes";
import { postLang } from "@/lib/post-lang";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { pickRelated } from "@/lib/related-posts";
import { alternatesFor } from "@/lib/seo";

type Params = { lang: string; slug: string };

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getPosts(params.lang as Lang).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const post = getPost(language, slug);
  if (!post) return {};
  const path = `/journal/${post.slug}`;
  const twin = postLang(language, post.slug, post.alternate);
  const alternates = alternatesFor(language, path, twin?.path ?? null, { force: true });
  return {
    title: post.title,
    description: post.description,
    alternates,
    openGraph: {
      type: "article",
      ...(language === "id" ? { locale: "id_ID" } : {}),
      title: post.title,
      description: post.description,
      url: alternates.canonical,
      publishedTime: post.date,
      authors: ["Jamal Akbar Alam"],
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function JournalPostPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const post = getPost(language, slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: language,
    url: absoluteUrl(localePath(language, `/journal/${post.slug}`)),
    author: {
      "@type": "Person",
      name: "Jamal Akbar Alam",
      url: "https://jamalakbara.com",
    },
    publisher: {
      "@type": "Person",
      name: "Jamal Akbar Alam",
      url: "https://jamalakbara.com",
    },
  };

  const all = getPosts(language);
  const position = Math.max(1, all.findIndex((p) => p.slug === post.slug) + 1);
  const site = getSite(language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView
        post={post}
        position={position}
        total={all.length}
        language={language}
        lang={postLang(language, post.slug, post.alternate)?.link}
        date={formatDate(language, post.date)}
        related={[
          ...pickRelated(post, all).map((p) => ({
            href: localePath(language, `/journal/${p.slug}`),
            title: p.title,
            meta: formatDate(language, p.date),
          })),
          ...site.serviceLinks.map((l) => ({ href: l.href, title: l.label, meta: site.ui.services.more })),
        ]}
      />
    </>
  );
}

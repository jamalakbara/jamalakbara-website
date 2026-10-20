import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/article-view";
import { postLang } from "@/lib/post-lang";
import { getJournalPost, getJournalPosts, formatPostDate } from "@/lib/journal";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getJournalPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  const url = `https://jamalakbara.com/journal/${post.slug}`;
  const lang = postLang("en", post.slug, post.alternate);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url, ...(lang ? { languages: lang.languages } : {}) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: ["Jamal Akbar Alam"],
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "en",
    url: `https://jamalakbara.com/journal/${post.slug}`,
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

  const all = getJournalPosts();
  const position = Math.max(1, all.findIndex((p) => p.slug === post.slug) + 1);

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
        basePath="/journal"
        lang={postLang("en", post.slug, post.alternate)?.link}
        date={formatPostDate(post.date)}
        copy={{
          back: "All journal entries",
          backEnd: "Back to journal",
          writtenBy: "WRITTEN BY",
          minRead: (n) => `${n} min read`,
          tab: "READING NOTES",
          toc: "IN THIS ENTRY",
          backToTop: "Back to top",
        }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/site/article-view";
import { getJurnalPost, getJurnalPosts, formatJurnalDate } from "@/lib/jurnal";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getJurnalPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getJurnalPost(slug);
  if (!post) return {};
  const url = `https://jamalakbara.com/jurnal/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
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

export default async function JurnalPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getJurnalPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "id",
    url: `https://jamalakbara.com/jurnal/${post.slug}`,
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

  const all = getJurnalPosts();
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
        basePath="/jurnal"
        date={formatJurnalDate(post.date)}
        copy={{
          back: "Semua tulisan jurnal",
          backEnd: "Kembali ke jurnal",
          writtenBy: "DITULIS OLEH",
          minRead: (n) => `${n} menit baca`,
          tab: "CATATAN BACA",
          toc: "DI TULISAN INI",
          backToTop: "Kembali ke atas",
        }}
      />
    </>
  );
}

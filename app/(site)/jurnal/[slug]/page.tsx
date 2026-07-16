import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
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

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 0,
        paddingTop: "clamp(0.5rem, 2vw, 1.5rem)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        className="animate-blur-fade-up"
        style={{
          animationDelay: "100ms",
          width: "100%",
          maxWidth: "44rem",
        }}
      >
        <Link
          href="/jurnal"
          className="back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            color: "#a99c8d",
            textDecoration: "none",
            marginBottom: "clamp(1.25rem, 3vw, 2rem)",
            transition: "color 0.25s",
          }}
        >
          <ArrowLeft size={15} />
          Jurnal
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontSize: "0.9rem",
            letterSpacing: "0.03em",
            color: "#e0875a",
            marginBottom: "0.9rem",
          }}
        >
          <span
            style={{
              width: "22px",
              height: "1px",
              background: "#e0875a",
              display: "inline-block",
            }}
          />
          {formatJurnalDate(post.date)}
          <span style={{ color: "#7d7163" }}>
            · {post.readingMinutes} menit baca
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            margin: "0 0 clamp(1.5rem, 3.5vw, 2.5rem)",
          }}
        >
          {post.title}
        </h1>

        <div className="journal-prose">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}

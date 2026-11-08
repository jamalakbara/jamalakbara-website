import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/i18n";
import { LANGS, type Lang } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { ServiceView } from "@/components/site/service-view";

// Service landing page: canvas 34. Copy comes from content/service-pages.json
// (/admin/service-pages). Drafts have no route and stay out of the sitemap.

type Params = { lang: string; slug: string };

export function generateStaticParams() {
  return LANGS.flatMap((lang) => getSite(lang).services.map((page) => ({ lang, slug: page.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const page = getSite(language).services.find((p) => p.slug === slug);
  if (!page) return {};
  const title = page.seo.title.trim() || page.title;
  const description = page.seo.description.trim() || page.intro;
  const twin = getSite(language === "en" ? "id" : "en").services.find((p) => p.slug === page.alternate);
  const alternates = alternatesFor(language, `/services/${page.slug}`, twin ? `/services/${twin.slug}` : null);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      ...(language === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title, description },
  };
}

export default async function ServicePageRoute({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const language = lang as Lang;
  const site = getSite(language);
  const page = site.services.find((p) => p.slug === slug);
  if (!page) notFound();

  return <ServiceView site={site} page={page} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";
import { alternatesFor } from "@/lib/seo";
import { CaseStudyView } from "@/components/site/case-study-view";

// Case study: canvas 33. Only projects with the admin "Publish case study page"
// toggle get a route; everything else 404s and stays out of the sitemap.

type Params = { lang: string; id: string };

const mediaOf = (p: { gallery?: string[]; image: string }) => (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean);
const summaryOf = (p: { summary?: string; description: string }) => p.summary?.trim() || p.description;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSite(params.lang as Lang).caseStudies.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, id } = await params;
  const language = lang as Lang;
  const project = getSite(language).caseStudies.find((p) => p.id === id);
  if (!project) return {};
  const title = project.seo?.title?.trim() || project.title;
  const description = project.seo?.description?.trim() || summaryOf(project);
  const path = `/work/${project.id}`;
  const hasTwin = getSite(language === "en" ? "id" : "en").caseStudies.some((p) => p.id === id);
  const alternates = alternatesFor(language, path, hasTwin ? path : null);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      images: mediaOf(project).slice(0, 1),
      ...(language === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title, description },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { lang, id } = await params;
  const language = lang as Lang;
  requireLive(language);
  const site = getSite(language);
  const project = site.caseStudies.find((p) => p.id === id);
  if (!project) notFound();

  return <CaseStudyView site={site} project={project} />;
}

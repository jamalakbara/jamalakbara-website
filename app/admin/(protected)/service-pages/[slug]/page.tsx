import { notFound } from "next/navigation";
import { readJsonFile } from "@/lib/admin/content-store";
import type { ServicePage } from "@/lib/content-types";
import { ServicePageForm } from "../service-page-form";

export const metadata = { title: "Edit service page" };

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = await readJsonFile<ServicePage[]>("content/service-pages.json");
  const page = pages.find((p) => p.slug === slug);
  if (!page) notFound();
  return <ServicePageForm initial={page} />;
}

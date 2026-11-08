import { readJsonFile } from "@/lib/admin/content-store";
import type { ServicePage } from "@/lib/content-types";
import { ServicePageForm } from "../service-page-form";

export const metadata = { title: "New service page" };

export default async function NewServicePage() {
  const pages = await readJsonFile<ServicePage[]>("content/service-pages.json");
  return <ServicePageForm pages={pages} />;
}

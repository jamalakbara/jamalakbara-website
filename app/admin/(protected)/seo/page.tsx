import { readJsonFile } from "@/lib/admin/content-store";
import type { SeoSettings } from "@/lib/content/schemas";
import { SeoEditor } from "./seo-editor";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const seo = await readJsonFile<SeoSettings>("content/site/seo.json");
  return <SeoEditor initial={seo} />;
}

import { readJsonFile } from "@/lib/admin/content-store";
import type { SeoSettings } from "@/lib/content/schemas";
import { readIdSite } from "@/lib/admin/translations";
import { SeoEditor } from "./seo-editor";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const [seo, idSite] = await Promise.all([readJsonFile<SeoSettings>("content/site/seo.json"), readIdSite()]);
  return <SeoEditor initial={seo} initialId={idSite} />;
}

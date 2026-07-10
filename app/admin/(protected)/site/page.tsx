import { readJsonFile } from "@/lib/admin/content-store";
import type { AboutContent, SiteConfig } from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import { SiteEditor } from "./site-editor";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Site copy" };

export default async function AdminSitePage() {
  const [pages, about, siteConfig, navigation] = await Promise.all([
    readJsonFile<PagesContent>("content/site/pages.json"),
    readJsonFile<AboutContent>("content/site/about.json"),
    readJsonFile<SiteConfig>("content/site/site-config.json"),
    readJsonFile<NavLink[]>("content/site/navigation.json"),
  ]);

  return (
    <main>
      <PageHeading
        eyebrow="Site copy"
        title="Everything that isn't a project or post"
      />
      <PageBody>
        <SiteEditor
          pages={pages}
          about={about}
          siteConfig={siteConfig}
          navigation={navigation}
        />
      </PageBody>
    </main>
  );
}

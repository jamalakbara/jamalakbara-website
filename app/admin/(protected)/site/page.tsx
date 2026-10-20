import { readJsonFile } from "@/lib/admin/content-store";
import type { AboutContent, SiteConfig } from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import { SiteEditor } from "./site-editor";
import { SITE_TABS, type SiteTab } from "./site-tabs";

export const metadata = { title: "Site copy" };

export default async function AdminSitePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const [pages, about, siteConfig, navigation] = await Promise.all([
    readJsonFile<PagesContent>("content/site/pages.json"),
    readJsonFile<AboutContent>("content/site/about.json"),
    readJsonFile<SiteConfig>("content/site/site-config.json"),
    readJsonFile<NavLink[]>("content/site/navigation.json"),
  ]);
  const initialTab = SITE_TABS.some((t) => t.key === tab) ? (tab as SiteTab) : "home";

  return <SiteEditor pages={pages} about={about} siteConfig={siteConfig} navigation={navigation} initialTab={initialTab} />;
}

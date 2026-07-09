import { readJsonFile } from "@/lib/admin/content-store";
import type { HeroContent, SiteConfig } from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import { SiteEditor } from "./site-editor";

export const metadata = { title: "Site copy" };

export default async function AdminSitePage() {
  const [pages, hero, siteConfig, navigation, services, about, comprehensiveAbout, cta] =
    await Promise.all([
      readJsonFile<PagesContent>("content/site/pages.json"),
      readJsonFile<HeroContent>("content/site/hero.json"),
      readJsonFile<SiteConfig>("content/site/site-config.json"),
      readJsonFile<NavLink[]>("content/site/navigation.json"),
      readJsonFile<unknown>("content/site/services.json"),
      readJsonFile<unknown>("content/site/about.json"),
      readJsonFile<unknown>("content/site/comprehensive-about.json"),
      readJsonFile<unknown>("content/site/cta.json"),
    ]);

  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Site copy
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">
        Everything that isn&apos;t a project or post
      </h1>
      <SiteEditor
        pages={pages}
        hero={hero}
        siteConfig={siteConfig}
        navigation={navigation}
        json={[
          { key: "services", label: "Services", value: services },
          { key: "about", label: "About", value: about },
          { key: "comprehensive-about", label: "About (SEO)", value: comprehensiveAbout },
          { key: "cta", label: "CTA", value: cta },
        ]}
      />
    </main>
  );
}

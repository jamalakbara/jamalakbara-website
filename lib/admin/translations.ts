import matter from "gray-matter";
import { readJsonFile, readProjects, readTextFile } from "@/lib/admin/content-store";
import { ui } from "@/lib/content";
import type { PagesContent } from "@/lib/content/schemas";
import type { AboutContent, ServicePage } from "@/lib/content-types";
import { translationReport, type IdProjects, type IdSite } from "@/lib/i18n/completeness";

// Reads the current Bahasa state through content-store, so production admin
// sees the latest commit rather than the build.

export const readIdSite = () => readJsonFile<IdSite>("content/i18n/id/site.json");
export const readIdProjects = () => readJsonFile<IdProjects>("content/i18n/id/projects.json");

export async function readIdPrivacy() {
  const { data, content } = matter((await readTextFile("content/privacy/id.mdx")) ?? "");
  return { updated: String(data.updated ?? ""), body: content.trim() };
}

export async function loadTranslationReport(overrides?: { site?: IdSite; privacy?: string }) {
  const [site, overlays, privacy, pages, about, projects, servicePages] = await Promise.all([
    overrides?.site ?? readIdSite(),
    readIdProjects(),
    overrides?.privacy ?? readIdPrivacy().then((p) => p.body),
    readJsonFile<PagesContent>("content/site/pages.json"),
    readJsonFile<AboutContent>("content/site/about.json"),
    readProjects(),
    readJsonFile<ServicePage[]>("content/service-pages.json"),
  ]);
  return translationReport({
    site,
    ui,
    pages,
    aboutParagraphs: about.description,
    projects,
    overlays,
    privacy,
    servicePages,
  });
}

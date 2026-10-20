// Where each media asset is used: scans the content files (projects, site
// copy, journal + jurnal MDX) for Cloudinary URLs and maps them by media key.
// Feeds the Media "Used in" panel, the "Unused" filter and the SEO alt check.
import { listContentDir, readJsonFile, readProjects, readTextFile } from "@/lib/admin/content-store";
import { SINGLETONS } from "@/lib/admin/singletons";
import { mediaKey } from "@/lib/media-meta";

export interface MediaUse {
  label: string;
  href: string;
}

const URL_RE = /https:\/\/res\.cloudinary\.com\/[^\s"')\]>]+/g;

export async function mediaUsage(): Promise<Record<string, MediaUse[]>> {
  const map: Record<string, MediaUse[]> = {};
  const add = (url: string, use: MediaUse) => {
    const key = mediaKey(url);
    (map[key] ??= []).push(use);
  };

  const projects = await readProjects();
  for (const p of projects) {
    const href = `/admin/projects/${p.id}`;
    if (p.image) add(p.image, { label: `${p.title} · cover`, href });
    if (p.video) add(p.video, { label: `${p.title} · hover video`, href });
    p.gallery?.forEach((g, i) => add(g, { label: `${p.title} · gallery ${i + 1}`, href }));
  }

  for (const [key, entry] of Object.entries(SINGLETONS)) {
    const raw = await readTextFile(entry.path);
    for (const url of raw?.match(URL_RE) ?? []) {
      add(url, { label: `Site copy · ${entry.label}`, href: `/admin/site?tab=${key}` });
    }
  }

  for (const section of ["journal", "jurnal"] as const) {
    const files = (await listContentDir(`content/${section}`)).filter((f) => f.endsWith(".mdx"));
    await Promise.all(
      files.map(async (file) => {
        const raw = await readTextFile(`content/${section}/${file}`);
        const slug = file.replace(/\.mdx$/, "");
        for (const url of new Set(raw?.match(URL_RE) ?? [])) {
          add(url, { label: `${section === "journal" ? "Journal" : "Jurnal"} · ${slug}`, href: `/admin/${section}/${slug}` });
        }
      })
    );
  }
  return map;
}

export const MEDIA_META_PATH = "content/media.json";

export async function readMediaAlt(): Promise<Record<string, string>> {
  try {
    return (await readJsonFile<{ alt: Record<string, string> }>(MEDIA_META_PATH)).alt ?? {};
  } catch {
    return {};
  }
}

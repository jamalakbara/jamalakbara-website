// Per-asset metadata edited in /admin/media (content/media.json). Keyed by
// the asset's public id basename, so a Cloudinary URL with or without a
// transform resolves to the same entry. Static import — safe in the site.
import mediaJson from "@/content/media.json";

const meta = mediaJson as { alt: Record<string, string> };

/** "https://res.cloudinary.com/x/image/upload/v1/work-avelle-01.jpg" → "work-avelle-01" */
export function mediaKey(urlOrId: string): string {
  const last = urlOrId.split("?")[0].split("/").pop() ?? urlOrId;
  return last.replace(/\.[a-z0-9]+$/i, "");
}

export function mediaAlt(urlOrId: string): string | undefined {
  return meta.alt[mediaKey(urlOrId)]?.trim() || undefined;
}

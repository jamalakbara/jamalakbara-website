import { readTextFile } from "@/lib/admin/content-store";
import { recentCommits } from "@/lib/admin/activity";
import { BRANDING_SLOTS, ICON_SET, MANIFEST_PATH } from "@/lib/admin/branding";
import { BrandingForm } from "./branding-form";

export const metadata = { title: "Branding" };

export default async function AdminBrandingPage() {
  const [commits, manifestRaw] = await Promise.all([
    Promise.all(ICON_SET.map((slot) => recentCommits(1, BRANDING_SLOTS[slot].path).then((c) => c[0] ?? null))),
    readTextFile(MANIFEST_PATH),
  ]);
  const shas = commits.map((c) => c?.sha ?? null);
  const known = shas.every(Boolean);
  const inSync = known && new Set(shas).size === 1;
  const newest = commits.filter(Boolean).sort((a, b) => (a!.date < b!.date ? 1 : -1))[0];
  const manifest = manifestRaw ? (JSON.parse(manifestRaw) as { background_color?: string; theme_color?: string }) : {};

  return (
    <BrandingForm
      sync={{ inSync, known, date: newest?.date ?? null, outOf: ICON_SET.filter((_, i) => shas[i] !== newest?.sha) }}
      colors={{ background: manifest.background_color ?? "#F8F6F0", theme: manifest.theme_color ?? "#F8F6F0" }}
    />
  );
}

// Post sections (client-safe). English /journal + Bahasa /jurnal.

export type Section = "journal" | "jurnal";

export const SECTIONS = {
  journal: { label: "Journal", lang: "en", code: "EN", other: "jurnal", base: "/journal", name: "English" },
  jurnal: { label: "Jurnal", lang: "id", code: "ID", other: "journal", base: "/jurnal", name: "Bahasa" },
} as const;

/** Admin URL of a post. One journal in admin; Bahasa posts carry ?lang=id. */
export const postHref = (section: Section, slug?: string) =>
  `/admin/journal/${slug ?? "new"}${section === "jurnal" ? "?lang=id" : ""}`;

export const sectionFor = (lang?: string): Section => (lang === "id" ? "jurnal" : "journal");

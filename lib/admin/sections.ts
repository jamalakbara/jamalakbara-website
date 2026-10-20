// Post sections (client-safe). English /journal + Bahasa /jurnal.

export type Section = "journal" | "jurnal";

export const SECTIONS = {
  journal: { label: "Journal", lang: "en", code: "EN", other: "jurnal", base: "/journal", name: "English" },
  jurnal: { label: "Jurnal", lang: "id", code: "ID", other: "journal", base: "/jurnal", name: "Bahasa" },
} as const;

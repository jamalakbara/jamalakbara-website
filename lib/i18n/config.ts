import idSite from "@/content/i18n/id/site.json";

// Two languages: English at the root, Bahasa under /id.
export const LANGS = ["en", "id"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value);

/** The Bahasa site is offline until this is switched on in /admin/translations. */
export const ID_PUBLISHED: boolean = idSite.published;

export const SITE_URL = "https://jamalakbara.com";

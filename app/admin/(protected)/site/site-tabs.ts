export const SITE_TABS = [
  { key: "home", label: "Home", path: "/" },
  { key: "work", label: "Work", path: "/work" },
  { key: "about", label: "About", path: "/about" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "journal", label: "Journal", path: "/journal" },
  { key: "navigation", label: "Navigation", path: "/" },
] as const;

export type SiteTab = (typeof SITE_TABS)[number]["key"];

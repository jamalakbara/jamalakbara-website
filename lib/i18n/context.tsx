"use client";

import { createContext, useContext } from "react";
import { getSite, type Site } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import type { LanguageTargets } from "@/lib/i18n/routes";

const LangContext = createContext<{ lang: Lang; targets: LanguageTargets }>({
  lang: "en",
  targets: { posts: {}, services: {}, caseStudies: [] },
});

export function LangProvider({
  lang,
  targets,
  children,
}: {
  lang: Lang;
  targets: LanguageTargets;
  children: React.ReactNode;
}) {
  return <LangContext.Provider value={{ lang, targets }}>{children}</LangContext.Provider>;
}

/** Site copy and data for the current language, for client components. */
export function useSite(): Site {
  return getSite(useContext(LangContext).lang);
}

export const useLanguageTargets = () => useContext(LangContext).targets;

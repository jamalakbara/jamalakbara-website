"use client";

import { createContext, useContext } from "react";
import { getInterfacePreviewSite, getSite, type Site } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import type { LanguageTargets } from "@/lib/i18n/routes";

const LangContext = createContext<{ lang: Lang; targets: LanguageTargets; previewSite?: Site }>({
  lang: "en",
  targets: { posts: {}, services: {}, caseStudies: [] },
});

export function LangProvider({
  lang,
  targets,
  previewUi,
  children,
}: {
  lang: Lang;
  targets: LanguageTargets;
  previewUi?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const previewSite = previewUi === undefined ? undefined : getInterfacePreviewSite(previewUi);
  return <LangContext.Provider value={{ lang, targets, previewSite }}>{children}</LangContext.Provider>;
}

/** Site copy and data for the current language, for client components. */
export function useSite(): Site {
  const { lang, previewSite } = useContext(LangContext);
  return previewSite ?? getSite(lang);
}

export const useLanguageTargets = () => useContext(LangContext).targets;

import { ui } from "@/lib/content";
import { loadTranslationReport, readIdPrivacy, readIdSite } from "@/lib/admin/translations";
import { TranslationsEditor } from "./translations-editor";

export const metadata = { title: "Translations" };

export default async function AdminTranslationsPage() {
  const [site, privacy, report] = await Promise.all([readIdSite(), readIdPrivacy(), loadTranslationReport()]);
  return <TranslationsEditor initialSite={site} initialPrivacy={privacy} report={report} ui={ui} />;
}

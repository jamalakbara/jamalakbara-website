import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";
import { PrivacyView } from "@/components/site/privacy-view";

type Props = { params: Promise<{ lang: string }> };

export default async function PrivacyPage({ params }: Props) {
  const lang = (await params).lang as Lang;
  requireLive(lang);
  const site = getSite(lang);
  return <PrivacyView site={site} />;
}

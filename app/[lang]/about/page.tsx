import { AboutView } from "@/components/site/about-view";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";

type Props = { params: Promise<{ lang: string }> };

export default async function AboutPage({ params }: Props) {
  requireLive((await params).lang as Lang);
  return <AboutView />;
}

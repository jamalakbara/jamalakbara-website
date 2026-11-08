import { WorkView } from "@/components/site/work-view";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";

type Props = { params: Promise<{ lang: string }> };

export default async function WorkPage({ params }: Props) {
  requireLive((await params).lang as Lang);
  return <WorkView />;
}

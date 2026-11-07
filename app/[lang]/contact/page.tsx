import { ContactView } from "@/components/site/contact-view";
import type { Lang } from "@/lib/i18n/config";
import { requireLive } from "@/lib/i18n/targets";

type Props = { params: Promise<{ lang: string }> };

export default async function ContactPage({ params }: Props) {
  requireLive((await params).lang as Lang);
  return <ContactView />;
}

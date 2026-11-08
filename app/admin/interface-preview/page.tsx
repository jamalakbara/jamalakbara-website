import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { interfacePreview } from "@/lib/admin/interface-preview";
import { idSite } from "@/lib/content";
import { InterfacePreviewFrame } from "./preview-frame";
import "../../[lang]/site.css";
import "./preview.css";

export default async function InterfacePreviewPage({ searchParams }: {
  searchParams: Promise<{ section?: string }>;
}) {
  const session = await auth();
  if (!session?.login || session.login !== process.env.ADMIN_GITHUB_LOGIN) redirect("/admin/login");
  const { section = "home" } = await searchParams;
  return <InterfacePreviewFrame section={section}>{interfacePreview(section, idSite.ui)}</InterfacePreviewFrame>;
}

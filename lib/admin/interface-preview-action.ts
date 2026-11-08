"use server";

import { requireAdmin } from "@/lib/auth";
import { interfacePreview } from "@/lib/admin/interface-preview";

export async function renderInterfacePreview(section: string, draft: Record<string, unknown>, field?: string) {
  await requireAdmin();
  return interfacePreview(section, draft, field);
}

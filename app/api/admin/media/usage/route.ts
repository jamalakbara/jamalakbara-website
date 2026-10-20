import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { mediaUsage, readMediaAlt } from "@/lib/admin/media-usage";

// Usage map + alt text for the media library (keyed by media key).
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [usage, alt] = await Promise.all([mediaUsage(), readMediaAlt()]);
    return NextResponse.json({ usage, alt });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "usage scan failed" }, { status: 500 });
  }
}

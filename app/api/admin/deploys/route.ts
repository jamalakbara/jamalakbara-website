import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deployStateFor, getActivity } from "@/lib/admin/activity";

// Publish status for the admin. ?sha=<commit> → build state of that commit's
// production deployment (post-save watch); no params → recent activity.
export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sha = new URL(request.url).searchParams.get("sha");
  try {
    if (sha) return NextResponse.json({ state: await deployStateFor(sha) });
    return NextResponse.json(await getActivity(5));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "deploy status failed" }, { status: 502 });
  }
}

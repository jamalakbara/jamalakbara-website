import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import { requireAdmin } from "@/lib/auth";

// Compiles raw MDX for the journal editor's live preview. Returns the
// serialized result for the client-side <MDXRemote>, or the compile error
// so the editor can show it inline instead of crashing.
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { source } = (await request.json()) as { source?: string };
  if (typeof source !== "string") {
    return NextResponse.json({ error: "source required" }, { status: 400 });
  }

  try {
    const mdxSource = await serialize(source);
    return NextResponse.json({ ok: true, mdxSource });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : "MDX compile error",
    });
  }
}

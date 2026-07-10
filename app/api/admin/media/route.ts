import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Cloudinary Admin API proxy (list + delete). Runs server-side only:
// the Admin API uses Basic auth with the API secret.

// All portfolio media lives under portfolio/<images|videos>. Uploads are
// stored there and the library lists only that folder per media type.
const FOLDER = { image: "portfolio/images", video: "portfolio/videos" } as const;

function cloudinaryEnv() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env vars not configured");
  }
  return {
    base: `https://api.cloudinary.com/v1_1/${cloudName}`,
    auth: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
  };
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") === "video" ? "video" : "image";
  const cursor = url.searchParams.get("cursor");

  try {
    const { base, auth } = cloudinaryEnv();
    // Account uses Cloudinary dynamic folders: the folder is stored in
    // asset_folder, not in the public_id, so a prefix filter won't match.
    // The Search API filters on asset_folder directly.
    const body: {
      expression: string;
      max_results: number;
      sort_by: { created_at: string }[];
      next_cursor?: string;
    } = {
      expression: `asset_folder="${FOLDER[type]}" AND resource_type:${type}`,
      max_results: 30,
      sort_by: [{ created_at: "desc" }],
    };
    if (cursor) body.next_cursor = cursor;
    const res = await fetch(`${base}/resources/search`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Cloudinary list failed: ${res.status}` },
        { status: 502 }
      );
    }
    const json = (await res.json()) as {
      resources: {
        public_id: string;
        secure_url: string;
        format: string;
        bytes: number;
        created_at: string;
      }[];
      next_cursor?: string;
    };
    return NextResponse.json({
      resources: json.resources.map((r) => ({
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format,
        bytes: r.bytes,
        createdAt: r.created_at,
      })),
      nextCursor: json.next_cursor ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cloudinary error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId, type } = (await request.json()) as {
    publicId?: string;
    type?: string;
  };
  if (!publicId) {
    return NextResponse.json({ error: "publicId required" }, { status: 400 });
  }
  const resourceType = type === "video" ? "video" : "image";

  try {
    const { base, auth } = cloudinaryEnv();
    const params = new URLSearchParams();
    params.append("public_ids[]", publicId);
    const res = await fetch(
      `${base}/resources/${resourceType}/upload?${params}`,
      { method: "DELETE", headers: { Authorization: auth } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `Cloudinary delete failed: ${res.status}` },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cloudinary error" },
      { status: 500 }
    );
  }
}

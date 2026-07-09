import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Signs a direct-to-Cloudinary upload so the API secret never leaves the
// server. The client uploads straight to api.cloudinary.com with this
// signature and stores the returned secure_url in content.
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary env vars not configured" },
      { status: 500 }
    );
  }

  const { folder } = (await request.json().catch(() => ({}))) as {
    folder?: string;
  };

  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = { timestamp };
  if (folder) params.folder = folder;

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder });
}

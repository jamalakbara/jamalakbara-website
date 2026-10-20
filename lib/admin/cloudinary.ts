// Server-only Cloudinary helpers shared by the admin media routes and the
// draft-preview store. The API secret never leaves the server.
import { createHash } from "node:crypto";

export function cloudinaryEnv() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env vars not configured");
  }
  return {
    cloudName,
    apiKey,
    apiSecret,
    base: `https://api.cloudinary.com/v1_1/${cloudName}`,
    auth: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
  };
}

/** Cloudinary request signature: sorted `k=v` pairs joined by & + secret, sha1. */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/** Media folders the library lists (dynamic folders → asset_folder). */
export const MEDIA_FOLDER = { image: "portfolio/images", video: "portfolio/videos" } as const;

/** Total assets per kind + storage used (dashboard + media header). */
export async function mediaStats(): Promise<{ images: number; videos: number; storageBytes: number | null }> {
  const { base, auth } = cloudinaryEnv();
  const count = async (kind: "image" | "video") => {
    const res = await fetch(`${base}/resources/search`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: `asset_folder="${MEDIA_FOLDER[kind]}" AND resource_type:${kind}`,
        max_results: 1,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Cloudinary search: ${res.status}`);
    return ((await res.json()) as { total_count: number }).total_count;
  };
  const usage = async () => {
    const res = await fetch(`${base}/usage`, { headers: { Authorization: auth }, cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { storage?: { usage?: number } };
    return json.storage?.usage ?? null;
  };
  const [images, videos, storageBytes] = await Promise.all([count("image"), count("video"), usage()]);
  return { images, videos, storageBytes };
}

// Draft previews: the editor's unsaved state is stored as a private
// Cloudinary raw file (one per item, overwritten on each preview) and served
// at /preview/<token> on the public site with the real site styles. The
// token is HMAC-signed with AUTH_SECRET and expires after PREVIEW_TTL_S, so a
// link can be shared without an admin login. Server-only.
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Project } from "@/lib/content-types";
import type { PostInput } from "@/lib/admin/post-schema";
import { cloudinaryEnv, signParams } from "@/lib/admin/cloudinary";

export const PREVIEW_TTL_S = 60 * 60;
const FOLDER = "admin-previews";

export type PreviewPayload =
  | { kind: "journal" | "jurnal"; post: PostInput }
  | { kind: "project"; project: Project; index: number };

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function slotFor(payload: PreviewPayload): string {
  const key = payload.kind === "project" ? payload.project.id : payload.post.slug;
  return `${payload.kind}-${key.replace(/[^a-z0-9-]/g, "") || "untitled"}`;
}

/** Store the payload and return a signed token valid for PREVIEW_TTL_S. */
export async function createPreview(payload: PreviewPayload): Promise<{ token: string; expiresAt: number }> {
  const { base, apiKey, apiSecret } = cloudinaryEnv();
  const slot = slotFor(payload);
  const publicId = `${FOLDER}/${slot}.json`;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { invalidate: "true", overwrite: "true", public_id: publicId, timestamp, type: "private" };

  const form = new FormData();
  form.append(
    "file",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
    `${slot}.json`
  );
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append("api_key", apiKey);
  form.append("signature", signParams(params, apiSecret));

  const res = await fetch(`${base}/raw/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Preview upload failed: ${res.status} ${await res.text()}`);

  const expiresAt = timestamp + PREVIEW_TTL_S;
  const body = `${slot}.${expiresAt}`;
  return { token: `${body}.${sign(body)}`, expiresAt };
}

export type PreviewResult =
  | { ok: true; payload: PreviewPayload; expiresAt: number }
  | { ok: false; reason: "invalid" | "expired" | "missing" };

export async function readPreview(token: string): Promise<PreviewResult> {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };
  const [slot, exp, mac] = parts;
  const expected = Buffer.from(sign(`${slot}.${exp}`));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  const { base, apiKey, apiSecret } = cloudinaryEnv();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: `${FOLDER}/${slot}.json`, timestamp, type: "private" };
  const url = new URL(`${base}/raw/download`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("signature", signParams(params, apiSecret));
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { ok: false, reason: "missing" };
  return { ok: true, payload: (await res.json()) as PreviewPayload, expiresAt };
}

export function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL ? "https://jamalakbara.com" : "http://localhost:3000")
  );
}

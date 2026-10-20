// Shared admin formatting (server + client).

const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "just now", "2 h ago", "yesterday", "Oct 14" */
export function timeAgo(input: string | number | Date): string {
  const t = new Date(input).getTime();
  if (!Number.isFinite(t)) return "";
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 172800) return RTF.format(-1, "day");
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} days ago`;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Cloudinary URL → small cropped thumbnail (replaces an existing transform). */
export function cldThumb(url: string, w = 160, h = 120): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace(/\/upload\/(?:[a-z]{1,3}_[^/]*\/)?/, `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`);
}

export function formatBytes(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${Math.round(n / 1e3)} KB`;
}

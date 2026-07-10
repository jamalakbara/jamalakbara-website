// Brand asset slots editable at /admin/branding. These are repo files
// (not Cloudinary) — replaced byte-for-byte via the content-store commit
// path. The favicon stays app/favicon.ico by owner preference; only the
// file contents change, never the metadata wiring.
export const BRANDING_SLOTS = {
  favicon: {
    path: "app/favicon.ico",
    publicUrl: "/favicon.ico",
    label: "Favicon",
    accept: ".ico,image/x-icon,image/vnd.microsoft.icon",
    note: "Must be a .ico file (use a favicon generator for multi-size).",
    pngSize: null,
  },
  logo: {
    path: "public/logo.svg",
    publicUrl: "/logo.svg",
    label: "Logo (wordmark)",
    accept: ".svg,image/svg+xml",
    note: "SVG wordmark — not used as an icon anywhere.",
    pngSize: null,
  },
  "apple-icon": {
    path: "public/apple-icon.png",
    publicUrl: "/apple-icon.png",
    label: "Apple touch icon",
    accept: "image/png",
    note: "PNG, exactly 180×180.",
    pngSize: 180,
  },
  "icon-192": {
    path: "public/icon-192.png",
    publicUrl: "/icon-192.png",
    label: "Manifest icon 192",
    accept: "image/png",
    note: "PNG, exactly 192×192.",
    pngSize: 192,
  },
  "icon-512": {
    path: "public/icon-512.png",
    publicUrl: "/icon-512.png",
    label: "Manifest icon 512",
    accept: "image/png",
    note: "PNG, exactly 512×512.",
    pngSize: 512,
  },
} as const;

export type BrandingSlot = keyof typeof BRANDING_SLOTS;

export const MAX_BRANDING_BYTES = 1024 * 1024; // 1 MB is plenty for icons

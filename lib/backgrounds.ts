// Per-page background loop videos, served from Cloudinary (cloud dh0spkwh3).
// Shared by the public shell (components/portfolio-shell.tsx) and the admin site
// editor. A value is a full Cloudinary secure_url (same shape every other asset
// uses), e.g. https://res.cloudinary.com/dh0spkwh3/video/upload/v1781452916/bg-home.mp4.
// The helpers inject a transform right after "/upload/" and, for stills, swap the
// extension to .jpg so Cloudinary returns a video frame.

const CLD_BASE = "https://res.cloudinary.com/dh0spkwh3/video/upload";
export const VIDEO_T = "q_auto:best,f_auto"; // full-quality loop
export const POSTER_T = "q_auto,f_auto,so_0"; // sharp first frame
export const BLUR_T = "q_auto,f_auto,so_0,w_64,e_blur:1200"; // ~few-KB LQIP

const withTransform = (url: string, t: string) =>
  url.replace("/upload/", `/upload/${t}/`);
const asJpg = (url: string) => url.replace(/\.[a-z0-9]+$/i, ".jpg");

export const videoUrl = (u: string) => withTransform(u, VIDEO_T);
export const posterUrl = (u: string) => asJpg(withTransform(u, POSTER_T));
export const blurUrl = (u: string) => asJpg(withTransform(u, BLUR_T));

// Shipped defaults, keyed by the pages.json page key. `/journal` has no
// site-copy tab, so it is default-only.
export const DEFAULT_BACKGROUNDS = {
  home: `${CLD_BASE}/v1781452916/bg-home_oaxs7i.mp4`,
  work: `${CLD_BASE}/v1783502792/bg-work-new_hcj0vh.mp4`,
  about: `${CLD_BASE}/v1781452916/bg-about_zkw2rg.mp4`,
  contact: `${CLD_BASE}/v1781452916/bg-contact_sx4ep4.mp4`,
  journal: `${CLD_BASE}/v1783495304/bg-journal_afdxkd.mp4`,
} as const;

export type BackgroundPageKey = keyof typeof DEFAULT_BACKGROUNDS;

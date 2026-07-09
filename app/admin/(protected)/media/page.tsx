import { MediaLibrary } from "./media-library";

export const metadata = { title: "Media" };

export default function AdminMediaPage() {
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Media
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">
        Cloudinary library
      </h1>
      <MediaLibrary />
    </main>
  );
}

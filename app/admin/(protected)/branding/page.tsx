import { BrandingForm } from "./branding-form";

export const metadata = { title: "Branding" };

export default function AdminBrandingPage() {
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Branding
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">
        Logo, favicon &amp; app icons
      </h1>
      <BrandingForm />
    </main>
  );
}

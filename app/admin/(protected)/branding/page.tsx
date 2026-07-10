import { BrandingForm } from "./branding-form";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Branding" };

export default function AdminBrandingPage() {
  return (
    <main>
      <PageHeading eyebrow="Branding" title="Logo, favicon & app icons" />
      <PageBody>
        <BrandingForm />
      </PageBody>
    </main>
  );
}

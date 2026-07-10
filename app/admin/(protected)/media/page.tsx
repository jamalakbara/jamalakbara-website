import { MediaLibrary } from "./media-library";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Media" };

export default function AdminMediaPage() {
  return (
    <main>
      <PageHeading eyebrow="Media" title="Cloudinary library" />
      <PageBody>
        <MediaLibrary />
      </PageBody>
    </main>
  );
}

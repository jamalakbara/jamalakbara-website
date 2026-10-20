import { mediaStats } from "@/lib/admin/cloudinary";
import { MediaLibrary } from "./media-library";

export const metadata = { title: "Media" };

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ upload?: string }> }) {
  const { upload } = await searchParams;
  const stats = await mediaStats().catch(() => null);
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return (
    <MediaLibrary
      stats={stats}
      consoleUrl={cloud ? `https://console.cloudinary.com/console/${cloud}/media_library/folders/home` : "https://console.cloudinary.com"}
      focusUpload={upload === "1"}
    />
  );
}

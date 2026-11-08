import { redirect } from "next/navigation";

export default async function JurnalPostRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/admin/journal/${slug}?lang=id`);
}

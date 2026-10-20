import { notFound } from "next/navigation";
import { readProjects } from "@/lib/admin/content-store";
import { readMediaAlt } from "@/lib/admin/media-usage";
import { lastEditFor } from "@/lib/admin/project-meta";
import { ProjectForm } from "../project-form";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) notFound();
  const [alt, lastEdit] = await Promise.all([readMediaAlt(), lastEditFor("projects", id)]);

  return (
    <ProjectForm
      initial={projects[index]}
      index={index}
      categories={[...new Set(projects.map((p) => p.category))]}
      alt={alt}
      lastEdit={lastEdit}
    />
  );
}

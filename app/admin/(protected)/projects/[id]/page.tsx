import { notFound } from "next/navigation";
import { readProjects } from "@/lib/admin/content-store";
import { ProjectForm } from "../project-form";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await readProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <main>
      <PageHeading eyebrow="Edit project" title={project.title} />
      <PageBody>
        <ProjectForm initial={project} />
      </PageBody>
    </main>
  );
}

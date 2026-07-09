import { notFound } from "next/navigation";
import { readProjects } from "@/lib/admin/content-store";
import { ProjectForm } from "../project-form";

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
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Edit project
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">{project.title}</h1>
      <ProjectForm initial={project} />
    </main>
  );
}

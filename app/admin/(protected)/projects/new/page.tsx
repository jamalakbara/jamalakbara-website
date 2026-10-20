import { readProjects } from "@/lib/admin/content-store";
import { readMediaAlt } from "@/lib/admin/media-usage";
import { ProjectForm } from "../project-form";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const [projects, alt] = await Promise.all([readProjects(), readMediaAlt()]);
  return (
    <ProjectForm
      index={projects.length}
      categories={[...new Set(projects.map((p) => p.category))]}
      alt={alt}
      lastEdit={null}
    />
  );
}

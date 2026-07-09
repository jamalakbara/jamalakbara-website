import { readProjects } from "@/lib/admin/content-store";
import { ProjectsList } from "./projects-list";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await readProjects();
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Projects
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">
        {projects.length} projects
      </h1>
      <ProjectsList initial={projects} />
    </main>
  );
}

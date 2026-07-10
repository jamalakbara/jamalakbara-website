import { readProjects } from "@/lib/admin/content-store";
import { ProjectsList } from "./projects-list";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Work" };

export default async function AdminProjectsPage() {
  const projects = await readProjects();
  return (
    <main>
      <PageHeading eyebrow="Work" title={`${projects.length} projects`} />
      <PageBody>
        <ProjectsList initial={projects} />
      </PageBody>
    </main>
  );
}

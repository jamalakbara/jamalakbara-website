import { ProjectForm } from "../project-form";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <main>
      <PageHeading eyebrow="New project" title="Add a project" />
      <PageBody>
        <ProjectForm />
      </PageBody>
    </main>
  );
}

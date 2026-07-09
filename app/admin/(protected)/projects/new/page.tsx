import { ProjectForm } from "../project-form";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — New project
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">Add a project</h1>
      <ProjectForm />
    </main>
  );
}

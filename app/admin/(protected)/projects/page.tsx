import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { readProjects } from "@/lib/admin/content-store";
import { PageHeader } from "@/components/admin/ui";
import { readIdProjects } from "@/lib/admin/translations";
import { projectReady } from "@/lib/i18n/completeness";
import { ProjectsList } from "./projects-list";

export const metadata = { title: "Work" };

export default async function AdminProjectsPage() {
  const [projects, overlays] = await Promise.all([readProjects(), readIdProjects()]);
  const translated = projects.filter((p) => projectReady(p, overlays[p.id])).map((p) => p.id);
  return (
    <>
      <PageHeader
        eyebrow="Content / Work"
        index="02"
        title="Selected work"
        subtitle={`${projects.length} projects · order here is the order on the site.`}
        actions={
          <>
            <a className="a-btn a-btn--secondary" href="/work" target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              View /work
            </a>
            <Link className="a-btn a-btn--primary" href="/admin/projects/new">
              <Plus size={16} />
              New project
            </Link>
          </>
        }
      />
      <ProjectsList initial={projects} translated={translated} />
    </>
  );
}

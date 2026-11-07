import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { readJsonFile } from "@/lib/admin/content-store";
import { servicePageSeo } from "@/lib/admin/seo-checklist";
import type { ServicePage } from "@/lib/content-types";
import { Chip, EmptyState, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Service pages" };

export default async function AdminServicePagesPage() {
  const pages = await readJsonFile<ServicePage[]>("content/service-pages.json");
  const newPage = (
    <Link className="a-btn a-btn--primary" href="/admin/service-pages/new">
      <Plus size={16} />
      New page
    </Link>
  );

  return (
    <>
      <PageHeader
        eyebrow="Content / Service pages"
        index="03"
        title="Service pages"
        subtitle="Landing pages under /layanan, written for Bahasa searches."
        actions={newPage}
      />
      <div className="a-panel">
        {pages.length === 0 ? (
          <EmptyState icon={<Plus size={20} />} title="No service pages yet" body="Add one to target a search like “jasa website bandung”." action={newPage} />
        ) : (
          <div className="a-list">
            {pages.map((page) => {
              const seo = servicePageSeo(page);
              return (
                <div key={page.slug} className={`a-row a-row--link${page.draft ? " a-row--dim" : ""}`}>
                  <Link href={`/admin/service-pages/${page.slug}`} className="a-row__text">
                    <span className="a-row__title a-truncate">{page.seo.title || page.title}</span>
                    <span className="a-row__meta a-truncate">/layanan/{page.slug}</span>
                  </Link>
                  <span className="a-meta a-muted a-row__hide-m">
                    {seo.passed} / {seo.total} checks
                  </span>
                  <Chip kind={page.draft ? "draft" : "published"}>{page.draft ? "Draft" : "Published"}</Chip>
                  <Link href={`/admin/service-pages/${page.slug}`} className="a-iconbtn" aria-label={`Edit ${page.title}`}>
                    <Pencil size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

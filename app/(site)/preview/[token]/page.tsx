import type { Metadata } from "next";
import Link from "next/link";
import { ArticleView } from "@/components/site/article-view";
import { ProjectRow } from "@/components/site/project-row";
import { EmptyState } from "@/components/site/empty-state";
import { readPreview } from "@/lib/admin/preview";
import { formatPostDate } from "@/lib/journal";
import { formatJurnalDate } from "@/lib/jurnal";
import type { WorkRow } from "@/lib/site-data";

// Draft preview — unsaved admin edits rendered with the real site styles.
// Token-gated (HMAC, 1 hour) instead of login-gated so the link can be shared.
// Never indexed: noindex here, /preview disallowed in robots.ts, not in the sitemap.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

function Banner({ expiresAt, kind }: { expiresAt: number; kind: string }) {
  const until = new Date(expiresAt * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  return (
    <div className="f-panel" style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "14px var(--f-inset)" }}>
      <span className="f-meta">
        <strong className="f-tabtext">DRAFT PREVIEW</strong>
        {"  ·  "}
        {kind} · unsaved edits, not live · link expires {until} WIB
      </span>
      <span className="f-meta f-muted">Changes made after this link was created won’t show — open a new preview.</span>
    </div>
  );
}

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await readPreview(token).catch(() => ({ ok: false as const, reason: "missing" as const }));

  if (!result.ok) {
    return (
      <section className="f-folder__body">
        <EmptyState
          label="DRAFT PREVIEW"
          heading={result.reason === "expired" ? "THIS LINK EXPIRED." : "PREVIEW NOT FOUND."}
          body={
            result.reason === "expired"
              ? "Preview links last one hour. Ask for a fresh one from the editor."
              : "The link is incomplete or the draft was replaced. Ask for a fresh one from the editor."
          }
          actions={
            <Link href="/" className="f-btn f-btn--primary">
              Go to the site
            </Link>
          }
        />
      </section>
    );
  }

  const { payload, expiresAt } = result;

  if (payload.kind === "project") {
    const p = payload.project;
    const row: WorkRow = {
      id: p.id,
      num: String(payload.index + 1).padStart(2, "0"),
      title: p.title,
      category: p.category,
      year: p.year,
      href: p.livePreview || p.url || "#",
      image: p.image,
      video: p.video,
      description: p.summary?.trim() || p.description,
      media: (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean).slice(0, 3),
      featured: p.featured === true,
    };
    return (
      <>
        <Banner expiresAt={expiresAt} kind="Work row" />
        <section className="f-folder" aria-label="Project preview">
          <div className="f-tab">
            <span className="f-tabtext">ALL PROJECTS</span>
          </div>
          <div className="f-folder__body f-folder__body--flush f-index">
            <ProjectRow row={row} index={payload.index} headingLevel={2} />
          </div>
        </section>
      </>
    );
  }

  const { post } = payload;
  const en = payload.kind === "journal";
  return (
    <>
      <Banner expiresAt={expiresAt} kind={en ? "Journal post" : "Jurnal post"} />
      <ArticleView
        post={{ title: post.title, content: post.body, date: post.date, readingMinutes: readingMinutes(post.body) }}
        position={1}
        total={1}
        basePath={en ? "/journal" : "/jurnal"}
        date={en ? formatPostDate(post.date) : formatJurnalDate(post.date)}
        copy={
          en
            ? {
                back: "All journal entries",
                backEnd: "Back to journal",
                writtenBy: "WRITTEN BY",
                minRead: (n) => `${n} min read`,
                tab: "READING NOTES",
                toc: "IN THIS ENTRY",
                backToTop: "Back to top",
              }
            : {
                back: "Semua tulisan jurnal",
                backEnd: "Kembali ke jurnal",
                writtenBy: "DITULIS OLEH",
                minRead: (n) => `${n} menit baca`,
                tab: "CATATAN BACA",
                toc: "DI TULISAN INI",
                backToTop: "Kembali ke atas",
              }
        }
      />
    </>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleAlert,
  FilePen,
  Images,
  Languages,
  NotebookPen,
  Plus,
  SearchCheck,
} from "lucide-react";
import { readProjects } from "@/lib/admin/content-store";
import { getActivity, parseEdit, recentCommits, type Activity } from "@/lib/admin/activity";
import { listPosts, type PostRow } from "@/lib/admin/posts";
import { mediaStats } from "@/lib/admin/cloudinary";
import { readMediaAlt } from "@/lib/admin/media-usage";
import { postSeo, projectSeo } from "@/lib/admin/seo-checklist";
import { mediaKey } from "@/lib/media-meta";
import { repoUrl } from "@/lib/admin/github";
import { vercelDashboardUrl } from "@/lib/admin/vercel";
import { cldThumb, formatBytes, timeAgo } from "@/lib/admin/format";
import { PageHeader, Panel, Chip } from "@/components/admin/ui";
import { DeployPanel } from "@/components/admin/deploy-panel";
import { QuickActions } from "@/components/admin/quick-actions";

export const metadata = { title: "Dashboard" };

const TZ = "Asia/Jakarta";

function greeting() {
  const hour = Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: TZ }));
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 19) return "Good evening";
  return "Good night";
}

const daysSince = (date: string) => Math.max(0, Math.floor((Date.now() - new Date(`${date}T00:00:00`).getTime()) / 86400000));


export default async function AdminDashboardPage() {
  const [projects, journal, jurnal, activity, commits, media, alt] = await Promise.all([
    readProjects(),
    listPosts("journal"),
    listPosts("jurnal"),
    getActivity(5),
    recentCommits(30).catch(() => []),
    mediaStats().catch(() => null),
    readMediaAlt(),
  ]);

  const altFor = (url: string) => alt[mediaKey(url)];
  const branch = process.env.GITHUB_CONTENT_BRANCH || "main";

  /* Needs attention */
  const drafts = [
    ...journal.filter((p) => p.draft).map((p) => ({ ...p, section: "journal" as const })),
    ...jurnal.filter((p) => p.draft).map((p) => ({ ...p, section: "jurnal" as const })),
  ];
  const oldestDraft = drafts.reduce((max, p) => Math.max(max, p.date ? daysSince(p.date) : 0), 0);
  // Failing SEO checks across published items, grouped by kind of problem.
  const seoItems = [
    ...projects.filter((p) => !p.draft).map((p) => ({ checks: projectSeo(p, altFor).checks, href: `/admin/projects/${p.id}` })),
    ...journal.filter((p) => !p.draft).map((p) => ({ checks: postSeo(p, "/journal").checks, href: `/admin/journal/${p.slug}` })),
    ...jurnal.filter((p) => !p.draft).map((p) => ({ checks: postSeo(p, "/jurnal").checks, href: `/admin/jurnal/${p.slug}` })),
  ].filter((i) => i.checks.some((c) => !c.ok));
  const seoKinds = new Map<string, number>();
  for (const i of seoItems) {
    for (const c of i.checks) {
      if (c.ok) continue;
      const kind = /alt text/.test(c.label) ? "missing alt text" : /Description/.test(c.label) ? "description length" : /Title/.test(c.label) ? "title too long" : /Keyword|tech/.test(c.label) ? "keyword not used" : /summary/.test(c.label) ? "row summary" : "other";
      seoKinds.set(kind, (seoKinds.get(kind) ?? 0) + 1);
    }
  }
  const seoSummary = [...seoKinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => `${n} ${k}`).join(" · ");
  const failed = activity.items.find((i) => i.state === "failed");

  /* Recently edited (from content commits) */
  const seen = new Set<string>();
  const recent = commits
    .map(parseEdit)
    .filter((e): e is NonNullable<typeof e> => Boolean(e && e.target && e.verb !== "remove"))
    .filter((e) => (seen.has(`${e.scope}:${e.target}`) ? false : (seen.add(`${e.scope}:${e.target}`), true)))
    .map((e) => toRecent(e, projects, journal, jurnal, activity))
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .slice(0, 5);

  const now = new Date();
  const today = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        index="00"
        title={`${greeting()}, Jamal.`}
        subtitle={
          <>
            {today}
            {activity.lastLiveAt ? ` · last publish went live ${timeAgo(activity.lastLiveAt)}` : ""}
          </>
        }
        actions={
          <>
            <a className="a-btn a-btn--secondary" href="/" target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              Open site
            </a>
            <Link className="a-btn a-btn--primary" href="/admin/journal/new">
              <Plus size={16} />
              New post
            </Link>
          </>
        }
      />

      <div className="a-stats">
        <Stat href="/admin/projects" label="Projects" icon={<BriefcaseBusiness size={16} />} value={projects.length}
          sub={`${projects.filter((p) => p.featured).length} featured on home${projects.some((p) => p.draft) ? ` · ${projects.filter((p) => p.draft).length} hidden` : ""}`} />
        <Stat href="/admin/journal" label="Journal · EN" icon={<NotebookPen size={16} />} value={journal.length} sub={draftLabel(journal)} />
        <Stat href="/admin/jurnal" label="Jurnal · ID" icon={<Languages size={16} />} value={jurnal.length} sub={draftLabel(jurnal)} />
        <Stat href="/admin/media" label="Media" icon={<Images size={16} />} value={media ? media.images + media.videos : "—"}
          sub={media ? `Cloudinary${media.storageBytes ? ` · ${formatBytes(media.storageBytes)}` : ""}` : "Cloudinary not reachable"} />
      </div>

      <div className="a-grid a-grid--dash">
        <div className="a-stack">
          <DeployPanel initial={activity} branch={branch} repoUrl={repoUrl()} vercelUrl={vercelDashboardUrl()} />

          <Panel title="Recently edited" bodyClass="" aside={<Link href="/admin/projects" className="a-link a-small">All content</Link>}>
            <div className="a-list">
              {recent.length === 0 && <p className="a-row a-muted a-small">Edits you save here will show up in this list.</p>}
              {recent.map((r) => (
                <Link key={r.key} href={r.href} className="a-row a-row--link">
                  <span className="a-num a-row__num">{r.code}</span>
                  {r.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="a-row__thumb a-row__hide-m" src={cldThumb(r.thumb)} alt="" />
                  ) : (
                    <span className="a-row__thumb a-row__hide-m" />
                  )}
                  <span className="a-row__text">
                    <span className="a-row__title a-truncate">{r.title}</span>
                    <span className="a-row__meta a-truncate">{r.meta}</span>
                  </span>
                  <Chip kind={r.status} />
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <div className="a-stack">
          <Panel title="Needs attention" bodyClass="a-panel__body">
            <div style={{ marginTop: -16, marginBottom: -16 }}>
              {drafts.length > 0 && (
                <Attention
                  icon={<FilePen size={16} />}
                  title={`${drafts.length} draft${drafts.length === 1 ? "" : "s"} waiting`}
                  body={`${drafts.filter((d) => d.section === "journal").length} Journal · ${drafts.filter((d) => d.section === "jurnal").length} Jurnal — oldest is ${oldestDraft} days`}
                  href={`/admin/${drafts[0].section}?status=draft`}
                  cta="Review"
                />
              )}
              {seoItems.length > 0 && (
                <Attention
                  icon={<SearchCheck size={16} color="var(--a-warn)" />}
                  title={`SEO warnings on ${seoItems.length} item${seoItems.length === 1 ? "" : "s"}`}
                  body={seoSummary}
                  href={seoItems[0].href}
                  cta="Fix"
                />
              )}
              {failed && (
                <Attention
                  icon={<CircleAlert size={16} color="var(--f-error)" />}
                  title="Last build failed"
                  body={`${failed.message} · ${failed.sha.slice(0, 7)}`}
                  href={failed.inspectorUrl ?? vercelDashboardUrl()}
                  cta="Open log"
                  external
                />
              )}
              {drafts.length === 0 && seoItems.length === 0 && !failed && (
                <p className="a-small a-muted" style={{ padding: "16px 0" }}>All clear — nothing waiting on you.</p>
              )}
            </div>
          </Panel>
          <QuickActions />
        </div>
      </div>
    </>
  );
}

function draftLabel(rows: PostRow[]) {
  const n = rows.filter((p) => p.draft).length;
  return n === 0 ? "no drafts" : `${n} draft${n === 1 ? "" : "s"}`;
}


function Stat({ href, label, icon, value, sub }: { href: string; label: string; icon: React.ReactNode; value: number | string; sub: string }) {
  return (
    <Link href={href} className="a-statcard">
      <span className="a-statcard__top">
        {label}
        {icon}
      </span>
      <span className="a-stat">{value}</span>
      <span className="a-statcard__sub">{sub}</span>
    </Link>
  );
}

function Attention({ icon, title, body, href, cta, external }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string; external?: boolean }) {
  const link = external ? (
    <a className="a-link a-small" href={href} target="_blank" rel="noreferrer">{cta} →</a>
  ) : (
    <Link className="a-link a-small" href={href} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {cta} <ArrowRight size={13} />
    </Link>
  );
  return (
    <div className="a-attn">
      {icon}
      <div className="a-attn__text">
        <p className="a-text">{title}</p>
        <p className="a-meta a-muted">{body}</p>
      </div>
      {link}
    </div>
  );
}

function toRecent(
  e: NonNullable<ReturnType<typeof parseEdit>>,
  projects: Awaited<ReturnType<typeof readProjects>>,
  journal: PostRow[],
  jurnal: PostRow[],
  activity: Activity
) {
  const deploy = activity.items.find((i) => i.sha === e.sha)?.state;
  const when = timeAgo(e.date);
  if (e.scope === "projects") {
    const i = projects.findIndex((p) => p.id === e.target);
    if (i === -1) return null;
    const p = projects[i];
    return {
      key: `p:${p.id}`,
      code: String(i + 1).padStart(2, "0"),
      thumb: p.image,
      title: p.title,
      meta: `Work · ${e.verb === "add" ? "added" : "updated"} · ${when}`,
      href: `/admin/projects/${p.id}`,
      status: deploy === "building" ? ("building" as const) : p.draft ? ("draft" as const) : ("published" as const),
    };
  }
  if (e.scope === "journal" || e.scope === "jurnal") {
    const post = (e.scope === "journal" ? journal : jurnal).find((p) => p.slug === e.target);
    if (!post) return null;
    return {
      key: `${e.scope}:${post.slug}`,
      code: e.scope === "journal" ? "EN" : "ID",
      thumb: null,
      title: post.title,
      meta: `${e.scope === "journal" ? "Journal · EN" : "Jurnal · ID"}${post.draft ? " · draft" : ""} · ${when}`,
      href: `/admin/${e.scope}/${post.slug}`,
      status: deploy === "building" ? ("building" as const) : post.draft ? ("draft" as const) : ("published" as const),
    };
  }
  return null;
}

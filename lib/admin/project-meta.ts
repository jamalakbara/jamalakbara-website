// Server helpers for the project editor: last commit that touched a project
// and its build state, plus the alt-text map for the SEO check.
import { recentCommits, parseEdit } from "@/lib/admin/activity";
import { listDeploys } from "@/lib/admin/vercel";

export interface LastEdit {
  sha: string;
  date: string;
  state: "building" | "live" | "failed" | "canceled" | null;
}

export async function lastEditFor(scope: "projects" | "journal" | "jurnal", target: string): Promise<LastEdit | null> {
  const path = scope === "projects" ? "content/projects.json" : `content/${scope}/${target}.mdx`;
  const commits = await recentCommits(scope === "projects" ? 40 : 5, path).catch(() => []);
  const hit =
    scope === "projects"
      ? commits.find((c) => {
          const e = parseEdit(c);
          return e?.scope === "projects" && (e.target === target || e.verb === "reorder");
        })
      : commits[0];
  if (!hit) return null;
  const deploys = await listDeploys(20).catch(() => null);
  const d = deploys?.find((x) => x.sha === hit.sha);
  return { sha: hit.sha, date: hit.date, state: d?.state ?? null };
}

// Publish activity for the admin: recent commits on the content branch with
// their Vercel build state. Commits come from GitHub on Vercel, or from the
// local git log in dev (fs backend).
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { backend } from "@/lib/admin/content-store";
import * as github from "@/lib/admin/github";
import { listDeploys, vercelConfigured, type Deploy, type DeployState } from "@/lib/admin/vercel";

const run = promisify(execFile);

export interface ActivityItem {
  sha: string;
  message: string;
  date: string;
  /** null = no deployment found for this commit (or Vercel not configured) */
  state: DeployState | null;
  inspectorUrl: string | null;
}

export interface Activity {
  items: ActivityItem[];
  /** state of the newest production deployment */
  current: DeployState | null;
  lastLiveAt: number | null;
  vercel: boolean;
  error: string | null;
}

async function localCommits(limit: number, path?: string): Promise<github.RepoCommit[]> {
  const args = ["log", `-n${limit}`, "--format=%H%x1f%cI%x1f%s"];
  if (path) args.push("--", path);
  const { stdout } = await run("git", args, { cwd: process.cwd() });
  return stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, date, message] = line.split("\x1f");
      return { sha, date, message };
    });
}

export async function recentCommits(limit = 10, path?: string): Promise<github.RepoCommit[]> {
  if (backend() === "github") return github.listCommits({ perPage: limit, path });
  return localCommits(limit, path).catch(() => []);
}

export async function getActivity(limit = 5): Promise<Activity> {
  let error: string | null = null;
  const [commits, deploys] = await Promise.all([
    recentCommits(limit).catch((e) => {
      error = e instanceof Error ? e.message : String(e);
      return [] as github.RepoCommit[];
    }),
    listDeploys(20).catch((e) => {
      error = e instanceof Error ? e.message : String(e);
      return null as Deploy[] | null;
    }),
  ]);
  const bySha = new Map<string, Deploy>();
  for (const d of deploys ?? []) if (d.sha && !bySha.has(d.sha)) bySha.set(d.sha, d);
  const lastLive = deploys?.find((d) => d.state === "live");
  return {
    items: commits.map((c) => {
      const d = bySha.get(c.sha);
      return {
        sha: c.sha,
        message: humanizeCommit(c.message),
        date: c.date,
        state: d?.state ?? null,
        inspectorUrl: d?.inspectorUrl ?? null,
      };
    }),
    current: deploys?.[0]?.state ?? null,
    lastLiveAt: lastLive ? lastLive.readyAt ?? lastLive.createdAt : null,
    vercel: vercelConfigured(),
    error,
  };
}

/** Build state of the deployment for one commit (post-save watch). */
export async function deployStateFor(sha: string): Promise<DeployState | "pending" | null> {
  const deploys = await listDeploys(10);
  if (!deploys) return null;
  const d = deploys.find((x) => x.sha === sha);
  return d ? d.state : "pending";
}

const SCOPES: Record<string, string> = {
  projects: "Work",
  journal: "Journal",
  jurnal: "Jurnal",
  site: "Site copy",
  media: "Media",
};

/** "content(projects): update withavelle" → "Work: update withavelle" */
export function humanizeCommit(message: string): string {
  const m = /^content\(([^)]+)\):\s*(.+)$/.exec(message);
  if (m) return `${SCOPES[m[1]] ?? m[1]}: ${m[2]}`;
  const b = /^branding:\s*(.+)$/.exec(message);
  if (b) return `Branding: ${b[1]}`;
  return message;
}

/** Content commits parsed into the item they touched (dashboard "Recently edited"). */
export interface EditRef {
  scope: "projects" | "journal" | "jurnal" | "site" | "branding";
  verb: string;
  target: string | null;
  sha: string;
  date: string;
}

export function parseEdit(c: github.RepoCommit): EditRef | null {
  const m = /^content\((projects|journal|jurnal|site)\):\s*(\w+)(?:\s+(.+))?$/.exec(c.message);
  if (m) {
    let target: string | null = m[3] ?? null;
    if (target?.includes("→")) target = target.split("→")[1].trim();
    if (m[2] === "reorder") target = null;
    return { scope: m[1] as EditRef["scope"], verb: m[2], target, sha: c.sha, date: c.date };
  }
  const b = /^branding:\s*update\s+(.+)$/.exec(c.message);
  if (b) return { scope: "branding", verb: "update", target: b[1], sha: c.sha, date: c.date };
  return null;
}

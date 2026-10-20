// Vercel REST client for the admin publish status (dashboard deploy log,
// post-save build watch). Server-only. Optional: without VERCEL_TOKEN +
// VERCEL_PROJECT_ID the admin shows commits without build state.

export type DeployState = "building" | "live" | "failed" | "canceled";

export interface Deploy {
  id: string;
  state: DeployState;
  sha: string | null;
  message: string | null;
  createdAt: number;
  readyAt: number | null;
  inspectorUrl: string | null;
}

export function vercelConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID);
}

function mapState(state: string): DeployState {
  switch (state) {
    case "READY":
      return "live";
    case "ERROR":
      return "failed";
    case "CANCELED":
      return "canceled";
    default:
      return "building"; // QUEUED | INITIALIZING | BUILDING
  }
}

interface ApiDeployment {
  uid: string;
  state?: string;
  readyState?: string;
  created: number;
  ready?: number;
  inspectorUrl?: string;
  meta?: { githubCommitSha?: string; githubCommitMessage?: string };
}

/** Latest production deployments, newest first. Null when not configured. */
export async function listDeploys(limit = 10): Promise<Deploy[] | null> {
  if (!vercelConfigured()) return null;
  const params = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID!,
    target: "production",
    limit: String(limit),
  });
  if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);
  const res = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Vercel deployments: ${res.status}`);
  const json = (await res.json()) as { deployments: ApiDeployment[] };
  return json.deployments.map((d) => ({
    id: d.uid,
    state: mapState(d.state ?? d.readyState ?? ""),
    sha: d.meta?.githubCommitSha ?? null,
    message: d.meta?.githubCommitMessage?.split("\n")[0] ?? null,
    createdAt: d.created,
    readyAt: d.ready ?? null,
    inspectorUrl: d.inspectorUrl ?? null,
  }));
}

export function vercelDashboardUrl(): string {
  return process.env.VERCEL_DASHBOARD_URL || "https://vercel.com/dashboard";
}

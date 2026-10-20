"use client";

// Dashboard "Publish status" (canvas 24, kit PSNxZ). Server renders the first
// state; while a build is running it re-polls /api/admin/deploys.

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Activity } from "@/lib/admin/activity";
import { Chip, Panel } from "@/components/admin/ui";
import { timeAgo } from "@/lib/admin/format";

const POLL_MS = 15000;

export function DeployPanel({
  initial,
  branch,
  repoUrl,
  vercelUrl,
}: {
  initial: Activity;
  branch: string;
  repoUrl: string | null;
  vercelUrl: string;
}) {
  const [data, setData] = useState(initial);
  const building = data.items.some((i) => i.state === "building") || data.current === "building";

  useEffect(() => {
    if (!building) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/deploys", { cache: "no-store" });
        if (res.ok) setData(await res.json());
      } catch {}
    }, POLL_MS);
    return () => clearInterval(t);
  }, [building]);

  const chip =
    data.current === "building" ? <Chip kind="building" /> :
    data.current === "failed" ? <Chip kind="failed" /> :
    data.current === "live" ? <Chip kind="live" /> : null;

  return (
    <Panel title="Publish status" aside={chip} bodyClass="">
      {data.error && <p className="a-banner" style={{ margin: 16 }}>{data.error}</p>}
      {!data.vercel && (
        <p className="a-banner a-banner--info" style={{ margin: 16 }}>
          Build state needs VERCEL_TOKEN and VERCEL_PROJECT_ID — commits still show below.
        </p>
      )}
      <div className="a-list">
        {data.items.map((item) => {
          const dot =
            item.state === "building" ? "a-dot a-dot--building" :
            item.state === "failed" || item.state === "canceled" ? "a-dot a-dot--failed" :
            item.state === "live" ? "a-dot" : "a-dot a-dot--idle";
          const href = item.inspectorUrl ?? (repoUrl ? `${repoUrl}/commit/${item.sha}` : undefined);
          const Row = href ? "a" : "div";
          return (
            <Row key={item.sha} className="a-log" {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}>
              <span className={dot} title={item.state ?? "no deployment"} />
              <span className="a-log__msg a-truncate">{item.message}</span>
              <span className="a-log__sha">{item.sha.slice(0, 7)}</span>
              <span className="a-log__when">{timeAgo(item.date)}</span>
            </Row>
          );
        })}
        {data.items.length === 0 && <p className="a-log a-muted">No commits yet.</p>}
      </div>
      <div className="a-panel__foot">
        <span>git → {branch}{data.vercel ? " · Vercel production" : ""}</span>
        <a className="a-link" href={vercelUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13 }}>
          Open Vercel <ArrowUpRight size={14} />
        </a>
      </div>
    </Panel>
  );
}

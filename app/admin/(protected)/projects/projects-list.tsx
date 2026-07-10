"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Reorder } from "framer-motion";
import type { Project } from "@/lib/content-types";
import { saveProjectsList } from "./actions";

export function ProjectsList({ initial }: { initial: Project[] }) {
  const [order, setOrder] = useState(initial.map((p) => p.id));
  const [featured, setFeatured] = useState(
    () => new Set(initial.filter((p) => p.featured).map((p) => p.id))
  );
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const byId = useMemo(() => new Map(initial.map((p) => [p.id, p])), [initial]);
  const dirty =
    order.some((id, i) => initial[i]?.id !== id) ||
    initial.some((p) => Boolean(p.featured) !== featured.has(p.id));

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveProjectsList(order, [...featured]);
      setMessage(result.ok ? "Saved." : result.error);
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--m3)]">
          Drag to reorder · toggle the dot to feature
        </p>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs text-[var(--m3)]">{message}</span>}
          <button
            onClick={save}
            disabled={!dirty || pending}
            className="btn-solid btn-sm"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
          <Link href="/admin/projects/new" className="liquid-glass rounded-full px-5 py-2 text-sm">
            New project
          </Link>
        </div>
      </div>

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-2">
        {order.map((id, i) => {
          const project = byId.get(id);
          if (!project) return null;
          const isFeatured = featured.has(id);
          return (
            <Reorder.Item
              key={id}
              value={id}
              className="liquid-glass flex cursor-grab items-center gap-4 rounded-xl px-5 py-3 active:cursor-grabbing"
            >
              <span className="w-8 text-xs text-[var(--m4)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{project.title}</p>
                <p className="truncate text-xs text-[var(--m3)]">
                  {project.category} · {project.year}
                </p>
              </div>
              <button
                type="button"
                title={isFeatured ? "Featured — click to unfeature" : "Not featured"}
                onClick={() => {
                  setFeatured((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }}
                className="h-3 w-3 shrink-0 rounded-full transition-colors"
                style={{
                  background: isFeatured ? "var(--green)" : "rgba(246,243,240,0.15)",
                }}
              />
              <Link
                href={`/admin/projects/${id}`}
                className="nav-link shrink-0 text-xs text-[var(--m2)]"
              >
                Edit
              </Link>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}

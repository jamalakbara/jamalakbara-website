"use client";

// Canvas 25 "Work list": search + category filters, drag to reorder (full
// list only), star = featured on home, sticky save bar for order changes.

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Search, Star } from "lucide-react";
import type { Project } from "@/lib/content-types";
import { Chip, SaveBar, useSaveShortcut } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import { cldThumb } from "@/lib/admin/format";
import { saveProjectsList } from "./actions";

const ALL = "all";
const catKey = (c: string) => c.replace(/\s*development$/i, "").trim().toLowerCase();
const catLabel = (c: string) => {
  const k = c.replace(/\s*development$/i, "").trim();
  return k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
};


export function ProjectsList({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const toast = useToast();
  const [base, setBase] = useState(initial);
  const [order, setOrder] = useState(initial.map((p) => p.id));
  const [featured, setFeatured] = useState(() => new Set(initial.filter((p) => p.featured).map((p) => p.id)));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(ALL);
  const [pending, startTransition] = useTransition();

  const byId = useMemo(() => new Map(base.map((p) => [p.id, p])), [base]);
  const moved = order.filter((id, i) => base[i]?.id !== id).length;
  const starred = base.filter((p) => Boolean(p.featured) !== featured.has(p.id)).length;
  const dirty = moved > 0 || starred > 0;
  useUnsaved(dirty);

  const categories = useMemo(() => {
    const counts = new Map<string, { label: string; n: number }>();
    for (const p of base) {
      const k = catKey(p.category);
      counts.set(k, { label: catLabel(p.category), n: (counts.get(k)?.n ?? 0) + 1 });
    }
    return [...counts.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [base]);

  const q = query.trim().toLowerCase();
  const filtering = q !== "" || filter !== ALL;
  const visible = order.filter((id) => {
    const p = byId.get(id);
    if (!p) return false;
    if (filter !== ALL && catKey(p.category) !== filter) return false;
    return !q || `${p.title} ${p.category} ${p.tech.join(" ")}`.toLowerCase().includes(q);
  });

  function save() {
    if (!dirty || pending) return;
    startTransition(async () => {
      const result = await saveProjectsList(order, [...featured]);
      if (!result.ok) return toast.error(result.error);
      setBase(order.map((id) => ({ ...byId.get(id)!, featured: featured.has(id) || undefined })));
      toast.saved(result, moved ? "Work order" : "Featured on home");
      router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  const message = [
    moved && `Order changed · ${moved} project${moved === 1 ? "" : "s"} moved`,
    starred && `${starred} featured change${starred === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <div className="a-panel a-toolbar">
        <label className="a-input" style={{ width: 320, maxWidth: "100%" }}>
          <Search size={16} />
          <input type="search" placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search projects" />
        </label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} role="group" aria-label="Filter by category">
          <button type="button" className="a-filter" aria-pressed={filter === ALL} onClick={() => setFilter(ALL)}>
            All · {base.length}
          </button>
          {categories.map(([key, c]) => (
            <button key={key} type="button" className="a-filter" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {c.label} · {c.n}
            </button>
          ))}
        </div>
        <span className="a-toolbar__spacer" />
        <span className="a-meta a-muted a-row__hide-m" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <GripVertical size={14} />
          {filtering ? "Clear filters to reorder" : "Drag rows to reorder"}
        </span>
      </div>

      <div className="a-panel">
        {visible.length === 0 ? (
          <p className="a-row a-muted">No projects match “{query}”.</p>
        ) : (
          <Reorder.Group as="div" axis="y" values={order} onReorder={setOrder} className="a-list">
            {visible.map((id) => (
              <Row
                key={id}
                project={byId.get(id)!}
                index={order.indexOf(id)}
                draggable={!filtering}
                featured={featured.has(id)}
                onStar={() =>
                  setFeatured((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  })
                }
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {dirty && (
        <SaveBar
          message={message}
          pending={pending}
          saveLabel={moved ? "Save order" : "Save changes"}
          onSave={save}
          onDiscard={() => {
            setOrder(base.map((p) => p.id));
            setFeatured(new Set(base.filter((p) => p.featured).map((p) => p.id)));
          }}
        />
      )}
    </>
  );
}

function Row({
  project,
  index,
  draggable,
  featured,
  onStar,
}: {
  project: Project;
  index: number;
  draggable: boolean;
  featured: boolean;
  onStar: () => void;
}) {
  const controls = useDragControls();
  const [dragging, setDragging] = useState(false);
  return (
    <Reorder.Item
      as="div"
      value={project.id}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      className={`a-row${dragging ? " a-row--dragging" : ""}${project.draft ? " a-row--dim" : ""}`}
    >
      <span
        className="a-row__drag a-row__hide-m"
        aria-hidden
        style={{ visibility: draggable ? "visible" : "hidden" }}
        onPointerDown={(e) => draggable && controls.start(e)}
      >
        <GripVertical size={16} />
      </span>
      <span className="a-num a-row__num">{String(index + 1).padStart(2, "0")}</span>
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="a-row__thumb" src={cldThumb(project.image)} alt="" draggable={false} />
      ) : (
        <span className="a-row__thumb" />
      )}
      <Link href={`/admin/projects/${project.id}`} className="a-row__text">
        <span className="a-row__title a-truncate">{project.title}</span>
        <span className="a-row__meta a-truncate">
          {project.category} · {project.year}
        </span>
      </Link>
      <span className="a-row__hide-m">
        <Chip kind={project.draft ? "draft" : "published"} />
      </span>
      <button
        type="button"
        className="a-star"
        aria-pressed={featured}
        aria-label={featured ? `Unfeature ${project.title}` : `Feature ${project.title} on home`}
        title={featured ? "Featured on home" : "Feature on home"}
        onClick={onStar}
      >
        <Star size={16} fill={featured ? "currentColor" : "none"} />
      </button>
      <Link href={`/admin/projects/${project.id}`} className="a-iconbtn" aria-label={`Edit ${project.title}`}>
        <Pencil size={16} />
      </Link>
    </Reorder.Item>
  );
}

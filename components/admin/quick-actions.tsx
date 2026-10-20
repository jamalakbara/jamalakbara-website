"use client";

// Dashboard quick actions with two-key shortcuts (N P = new project, …).

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Languages, NotebookPen, PenLine, Plus, Upload } from "lucide-react";
import { Panel } from "@/components/admin/ui";
import { GuardedLink } from "@/components/admin/unsaved";

const ACTIONS = [
  { label: "New project", href: "/admin/projects/new", keys: "NP", icon: Plus },
  { label: "New journal post", href: "/admin/journal/new", keys: "NJ", icon: NotebookPen },
  { label: "Tulis jurnal baru", href: "/admin/jurnal/new", keys: "NI", icon: Languages },
  { label: "Upload media", href: "/admin/media?upload=1", keys: "U", icon: Upload },
  { label: "Edit home hero", href: "/admin/site?tab=home", keys: "GH", icon: PenLine },
];

export function QuickActions() {
  const router = useRouter();
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest("input, textarea, select, [contenteditable]")) return;
      if (!/^[a-z]$/i.test(e.key)) return;
      buffer.current = (buffer.current + e.key.toUpperCase()).slice(-2);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => (buffer.current = ""), 900);
      const hit =
        ACTIONS.find((a) => a.keys.length === 2 && buffer.current === a.keys) ??
        ACTIONS.find((a) => a.keys.length === 1 && buffer.current.endsWith(a.keys) && buffer.current.length === 1);
      if (hit) {
        buffer.current = "";
        router.push(hit.href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <Panel title="Quick actions" bodyClass="a-panel__body" >
      <div style={{ marginTop: -20 }}>
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <GuardedLink key={a.href} href={a.href} className="a-quick">
              <Icon size={16} strokeWidth={1.6} />
              {a.label}
              <kbd className="a-quick__key">{a.keys.split("").join(" ")}</kbd>
            </GuardedLink>
          );
        })}
      </div>
    </Panel>
  );
}

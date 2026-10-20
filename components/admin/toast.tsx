"use client";

// Toasts (canvas 32 "States"): saved / building / live / failed / error.
// `saved(result, label)` follows the commit through Vercel: committed →
// building → live (or failed), polling /api/admin/deploys?sha=… .

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

type Tone = "ok" | "busy" | "error";
interface Toast {
  id: number;
  tone: Tone;
  title: string;
  body?: string;
}

interface ToastApi {
  show: (t: Omit<Toast, "id">, ms?: number) => number;
  update: (id: number, t: Omit<Toast, "id">, ms?: number) => void;
  /** Report a save. Watches the build when the save produced a commit. */
  saved: (result: { sha?: string | null }, label: string) => void;
  error: (message: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(Ctx);
  if (!api) throw new Error("useToast outside ToastProvider");
  return api;
}

const WATCH_EVERY_MS = 8000;
const WATCH_FOR_MS = 6 * 60 * 1000;

export function ToastProvider({ children, branch, vercel }: { children: ReactNode; branch: string; vercel: boolean }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const nextId = useRef(1);

  const dismissLater = useCallback((id: number, ms?: number) => {
    clearTimeout(timers.current.get(id));
    if (ms) {
      timers.current.set(
        id,
        setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), ms)
      );
    }
  }, []);

  const show = useCallback(
    (t: Omit<Toast, "id">, ms = 5000) => {
      const id = nextId.current++;
      setToasts((all) => [...all.slice(-2), { ...t, id }]);
      dismissLater(id, ms);
      return id;
    },
    [dismissLater]
  );

  const update = useCallback(
    (id: number, t: Omit<Toast, "id">, ms?: number) => {
      setToasts((all) => (all.some((x) => x.id === id) ? all.map((x) => (x.id === id ? { ...t, id } : x)) : [...all, { ...t, id }]));
      dismissLater(id, ms);
    },
    [dismissLater]
  );

  const watch = useCallback(
    async (id: number, sha: string, label: string) => {
      const started = Date.now();
      while (Date.now() - started < WATCH_FOR_MS) {
        await new Promise((r) => setTimeout(r, WATCH_EVERY_MS));
        try {
          const res = await fetch(`/api/admin/deploys?sha=${sha}`, { cache: "no-store" });
          const { state } = (await res.json()) as { state: string | null };
          if (state === "live") {
            update(id, { tone: "ok", title: "Live on jamalakbara.com", body: `${label} · ${sha.slice(0, 7)}` }, 6000);
            return;
          }
          if (state === "failed" || state === "canceled") {
            update(id, { tone: "error", title: "Build failed", body: `${label} · ${sha.slice(0, 7)} — open Vercel for the log` }, 0);
            return;
          }
          if (state === null) return;
        } catch {
          return;
        }
      }
    },
    [update]
  );

  const saved = useCallback(
    (result: { sha?: string | null }, label: string) => {
      if (!result.sha) {
        show({ tone: "ok", title: "Saved to the working tree", body: `${label} · review and commit when ready` });
        return;
      }
      const id = show(
        {
          tone: vercel ? "busy" : "ok",
          title: `Committed to ${branch}`,
          body: `${label} · rebuild started, live in ~2 min`,
        },
        vercel ? 0 : 6000
      );
      if (vercel) void watch(id, result.sha, label);
    },
    [branch, show, vercel, watch]
  );

  const error = useCallback((message: string) => {
    show({ tone: "error", title: "Couldn’t save", body: message }, 8000);
  }, [show]);

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, []);

  return (
    <Ctx.Provider value={{ show, update, saved, error }}>
      {children}
      <div className="a-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`a-toast${t.tone === "error" ? " a-toast--error" : t.tone === "busy" ? " a-toast--busy" : ""}`}>
            {t.tone === "error" ? <CircleAlert size={16} /> : t.tone === "busy" ? <LoaderCircle size={16} /> : <CircleCheck size={16} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p>{t.title}</p>
              {t.body && <p className="a-toast__body">{t.body}</p>}
            </div>
            <button
              type="button"
              className="a-btn--onink"
              aria-label="Dismiss"
              style={{ alignSelf: "flex-start", color: "inherit", opacity: 0.7 }}
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

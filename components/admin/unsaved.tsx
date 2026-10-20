"use client";

// Unsaved-changes guard (canvas 32 "Leave without saving?"). Editors call
// useUnsaved(dirty); in-admin links go through <GuardedLink>, which asks
// before leaving a dirty editor. beforeunload covers tab close / reload.

import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/admin/confirm-dialog";

interface Guard {
  set: (dirty: boolean) => void;
  check: () => Promise<boolean>;
}

const Ctx = createContext<Guard | null>(null);

export function UnsavedProvider({ children }: { children: ReactNode }) {
  const dirty = useRef(false);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const set = useCallback((d: boolean) => {
    dirty.current = d;
  }, []);

  const check = useCallback(async () => {
    if (!dirty.current) return true;
    const ok = await confirm({
      title: "Leave without saving?",
      message: "Your edits on this page haven’t been committed. Leaving discards them.",
      confirmLabel: "Discard and leave",
      cancelLabel: "Keep editing",
    });
    if (ok) dirty.current = false;
    return ok;
  }, [confirm]);

  return (
    <Ctx.Provider value={{ set, check }}>
      {children}
      {dialog}
    </Ctx.Provider>
  );
}

export function useUnsaved(dirty: boolean) {
  const guard = useContext(Ctx);
  useEffect(() => {
    guard?.set(dirty);
    return () => guard?.set(false);
  }, [dirty, guard]);
}

export function useLeaveGuard() {
  return useContext(Ctx)?.check ?? (async () => true);
}

export function GuardedLink({ onClick, href, ...props }: ComponentProps<typeof Link>) {
  const check = useLeaveGuard();
  const router = useRouter();
  return (
    <Link
      href={href}
      {...props}
      onClick={async (e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        if (await check()) router.push(typeof href === "string" ? href : String(href.pathname ?? "/admin"));
      }}
    />
  );
}

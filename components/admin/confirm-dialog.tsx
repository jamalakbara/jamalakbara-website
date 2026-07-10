"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
}

// Promise-based replacement for window.confirm, styled like the rest of the
// admin. Render `dialog` once in the component tree and `await confirm(...)`
// wherever a destructive action needs sign-off.
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOptions(null);
  }, []);

  const dialog = options ? <ConfirmDialog {...options} onClose={close} /> : null;

  return { confirm, dialog };
}

function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onClose,
}: ConfirmOptions & { onClose: (ok: boolean) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex cursor-pointer items-center justify-center bg-black/85 p-6"
      onClick={() => onClose(false)}
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="liquid-glass w-full max-w-md cursor-default space-y-4 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base text-[var(--ink)]">{title}</p>
        {message && <p className="text-sm text-[var(--m3)]">{message}</p>}
        <div className="flex justify-end gap-3 pt-1">
          <button
            ref={cancelRef}
            type="button"
            className="liquid-glass cursor-pointer rounded-full px-5 py-2 text-sm"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={() => onClose(true)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

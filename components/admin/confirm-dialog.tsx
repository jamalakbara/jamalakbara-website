"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

// Promise-based replacement for window.confirm (canvas 32 dialogs). Render
// `dialog` once in the tree and `await confirm(...)` before destructive actions.
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
  cancelLabel = "Cancel",
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
    <div className="a-scrim" onClick={() => onClose(false)}>
      <div
        className="a-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="a-title">{title}</h2>
        {message && <p className="a-text a-muted">{message}</p>}
        <div className="a-dialog__actions">
          <button ref={cancelRef} type="button" className="a-btn a-btn--secondary" onClick={() => onClose(false)}>
            {cancelLabel}
          </button>
          <button type="button" className="a-btn a-btn--danger" onClick={() => onClose(true)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

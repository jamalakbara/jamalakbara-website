"use client";

interface MediaLightboxProps {
  url: string;
  publicId: string;
  kind: "image" | "video";
  onClose: () => void;
  /** When provided, shows a "Use this file" action (picker mode). */
  onSelect?: (url: string) => void;
}

// Enlarged preview overlay for a single asset. Click the backdrop or Close/Back
// to dismiss; in picker mode "Use this file" confirms the selection.
export function MediaLightbox({
  url,
  publicId,
  kind,
  onClose,
  onSelect,
}: MediaLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-[110] flex cursor-pointer items-center justify-center bg-black/85 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-4xl cursor-default flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url.replace("/upload/", "/upload/w_1400,q_auto,f_auto/")}
            alt={publicId}
            className="max-h-[70vh] w-auto rounded-xl object-contain"
          />
        ) : (
          <video
            src={url}
            className="max-h-[70vh] w-auto rounded-xl"
            controls
            autoPlay
            loop
            playsInline
          />
        )}
        <p className="max-w-full truncate text-xs text-[var(--m3)]" title={publicId}>
          {publicId}
        </p>
        <div className="flex gap-3">
          {onSelect && (
            <button
              type="button"
              className="btn-solid cursor-pointer"
              onClick={() => onSelect(url)}
            >
              Use this file
            </button>
          )}
          <button
            type="button"
            className="liquid-glass cursor-pointer rounded-full px-5 py-2 text-sm"
            onClick={onClose}
          >
            {onSelect ? "Back" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

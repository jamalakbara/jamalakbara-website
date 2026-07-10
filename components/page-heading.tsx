import type { ReactNode } from "react";

/** Eyebrow + title block shared across admin pages. Mirrors the public
 *  site's section heading (accent Fraunces eyebrow with a leading rule,
 *  large tight-tracked title). Visual tokens live in globals.css as
 *  `.section-eyebrow` / `.section-title`. Pass `action` to place a
 *  button (e.g. "New post") on the title row. */
/** Entrance stagger contract for admin pages: eyebrow 0ms → title 80ms →
 *  body 160ms. Wrap the content below a `PageHeading` in `PageBody` so every
 *  page animates in consistently. Lists that stagger their own items should
 *  start item delays at BODY_DELAY_MS instead. */
export const BODY_DELAY_MS = 160;

export function PageBody({ children }: { children: ReactNode }) {
  return (
    <div
      className="animate-blur-fade-up"
      style={{ animationDelay: `${BODY_DELAY_MS}ms` }}
    >
      {children}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  action,
  as: Tag = "h1",
}: {
  eyebrow: string;
  title: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-10">
      <p className="section-eyebrow mb-3 animate-blur-fade-up">{eyebrow}</p>
      <div className="flex items-end justify-between gap-4">
        <Tag
          className="section-title animate-blur-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </Tag>
        {action && (
          <div
            className="animate-blur-fade-up shrink-0"
            style={{ animationDelay: "80ms" }}
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Stamp } from "@/components/site/stamp";
import { ArrowRight } from "@/components/site/icons";
import { useSite } from "@/lib/i18n/context";

// Page-closing strip (canvas "* / Contact footer"). Default: "Have something
// in mind?" → contact with the stamp; the contact page uses the work variant.
export function ContactStrip({
  heading,
  label,
  href,
  variant = "stamp",
  onClick,
}: {
  heading?: string;
  label?: string;
  href?: string;
  variant?: "stamp" | "arrow";
  onClick?: () => void;
}) {
  const site = useSite();
  const title = heading ?? site.ui.strip.heading;
  return (
    <section className="f-strip" aria-label={title}>
      <p className="f-strip__h">{title}</p>
      <Link href={href ?? site.path("/contact")} className="f-strip__link" onClick={onClick}>
        {label ?? site.ui.strip.label}
        {variant === "stamp" ? (
          <Stamp size={44} />
        ) : (
          <span className="f-strip__badge">
            <ArrowRight size={16} />
          </span>
        )}
      </Link>
    </section>
  );
}

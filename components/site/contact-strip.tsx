"use client";

import Link from "next/link";
import { Stamp } from "@/components/site/stamp";
import { useSite } from "@/lib/i18n/context";

interface FooterActionProps {
  href: string;
  label: string;
  onClick?: () => void;
}

// Canvas Footer / Action: the stamp is shared by every destination.
export function FooterAction({ href, label, onClick }: FooterActionProps) {
  return (
    <Link href={href} className="f-strip__link" onClick={onClick}>
      <span>{label}</span>
      <Stamp size={44} />
    </Link>
  );
}

// Canvas Footer / Strip: responsive desktop and mobile variants of one system.
export function ContactStrip({
  heading,
  label,
  href,
  onClick,
}: {
  heading?: string;
  label?: string;
  href?: string;
  onClick?: () => void;
}) {
  const site = useSite();
  const title = heading ?? site.ui.strip.heading;
  return (
    <section className="f-strip" aria-label={title}>
      <p className="f-strip__h">{title}</p>
      <FooterAction
        href={href ?? site.path("/contact")}
        label={label ?? site.ui.strip.label}
        onClick={onClick}
      />
    </section>
  );
}

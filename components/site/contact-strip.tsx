import Link from "next/link";
import { Stamp } from "@/components/site/stamp";
import { ArrowRight } from "@/components/site/icons";

// Page-closing strip (canvas "* / Contact footer"). Default: "Have something
// in mind?" → /contact with the stamp; the contact page uses the work variant.
export function ContactStrip({
  heading = "Have something in mind?",
  label = "Let’s talk",
  href = "/contact",
  variant = "stamp",
  onClick,
}: {
  heading?: string;
  label?: string;
  href?: string;
  variant?: "stamp" | "arrow";
  onClick?: () => void;
}) {
  return (
    <section className="f-strip" aria-label={heading}>
      <p className="f-strip__h">{heading}</p>
      <Link href={href} className="f-strip__link" onClick={onClick}>
        {label}
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

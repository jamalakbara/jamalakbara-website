import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";

// "Keep reading" block at the end of an article (canvas 35).
export type RelatedItem = { href: string; title: string; meta: string };

export function RelatedPosts({ heading, items }: { heading: string; items: RelatedItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="f-related" aria-labelledby="related-h">
      <h2 id="related-h" className="f-case-h">
        {heading}
      </h2>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="f-related__row">
          <span className="f-related__text">
            <span className="f-related__title">{item.title}</span>
            <span className="f-meta f-muted">{item.meta}</span>
          </span>
          <ArrowRight size={16} />
        </Link>
      ))}
    </section>
  );
}

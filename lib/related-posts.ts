// "Keep reading" picks: the owner's `related` slugs first, then posts sharing
// the most tags, then the latest. `all` must be published posts, newest first.
interface RelatedCandidate {
  slug: string;
  tags: string[];
}

export function pickRelated<T extends RelatedCandidate>(
  post: RelatedCandidate & { related: string[] },
  all: T[],
  max = 3,
): T[] {
  const others = all.filter((p) => p.slug !== post.slug);
  const chosen = post.related
    .map((slug) => others.find((p) => p.slug === slug))
    .filter((p): p is T => Boolean(p));

  const shared = (p: T) => p.tags.filter((t) => post.tags.includes(t)).length;
  const rest = others
    .filter((p) => !chosen.includes(p))
    .map((p, i) => ({ p, i, n: shared(p) }))
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .map(({ p }) => p);

  return [...chosen, ...rest].slice(0, max);
}

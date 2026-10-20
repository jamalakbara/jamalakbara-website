// Result shape every admin server action returns. `sha` is the commit the
// save produced on the GitHub backend (null on the local fs backend) — the
// client uses it to watch the Vercel build for that commit.
export type ActionResult<T extends object = object> =
  | ({ ok: true; sha?: string | null } & T)
  | { ok: false; error: string };

export function fail(e: unknown): { ok: false; error: string } {
  return { ok: false, error: e instanceof Error ? e.message : String(e) };
}

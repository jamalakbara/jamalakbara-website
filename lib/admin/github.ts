// Minimal GitHub API client for git-backed content writes.
// Server-only: uses a fine-grained PAT (GITHUB_TOKEN) scoped to this repo.

const API = "https://api.github.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

function repo() {
  return env("GITHUB_REPO");
}

function branch() {
  return process.env.GITHUB_CONTENT_BRANCH || "main";
}

async function gh(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export interface RepoFile {
  /** UTF-8 decoded file content */
  text: string;
  sha: string;
}

export async function getFile(path: string): Promise<RepoFile | null> {
  const res = await gh(
    `/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile ${path}: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { content: string; sha: string };
  return {
    text: Buffer.from(json.content, "base64").toString("utf8"),
    sha: json.sha,
  };
}

export async function getFileSha(path: string): Promise<string | null> {
  const res = await gh(
    `/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFileSha ${path}: ${res.status}`);
  return ((await res.json()) as { sha: string }).sha;
}

async function putContents(
  path: string,
  base64: string,
  message: string,
  sha: string | null
): Promise<Response> {
  return gh(`/repos/${repo()}/contents/${encodeURI(path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: base64,
      branch: branch(),
      ...(sha ? { sha } : {}),
    }),
  });
}

/**
 * Create or update a single file. Fetches the current sha itself and
 * retries once on a 409 (stale sha) — enough for a single-editor CMS.
 */
export async function putFile(
  path: string,
  data: { text?: string; base64?: string },
  message: string
): Promise<void> {
  const base64 =
    data.base64 ?? Buffer.from(data.text ?? "", "utf8").toString("base64");
  let sha = await getFileSha(path);
  let res = await putContents(path, base64, message, sha);
  if (res.status === 409) {
    sha = await getFileSha(path);
    res = await putContents(path, base64, message, sha);
  }
  if (!res.ok) throw new Error(`GitHub putFile ${path}: ${res.status} ${await res.text()}`);
}

export async function deleteFile(path: string, message: string): Promise<void> {
  const sha = await getFileSha(path);
  if (!sha) return;
  const res = await gh(`/repos/${repo()}/contents/${encodeURI(path)}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: branch() }),
  });
  if (!res.ok) throw new Error(`GitHub deleteFile ${path}: ${res.status} ${await res.text()}`);
}

export async function listDir(path: string): Promise<string[]> {
  const res = await gh(
    `/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub listDir ${path}: ${res.status}`);
  const json = (await res.json()) as { name: string; type: string }[];
  return json.filter((e) => e.type === "file").map((e) => e.name);
}

/**
 * Atomically write/delete multiple files in one commit via the Git Data API.
 * content: string = write (utf8), null = delete.
 */
export async function commitMany(
  files: { path: string; content: string | null }[],
  message: string
): Promise<void> {
  const r = repo();
  const refRes = await gh(`/repos/${r}/git/ref/heads/${branch()}`);
  if (!refRes.ok) throw new Error(`GitHub get ref: ${refRes.status}`);
  const baseSha = ((await refRes.json()) as { object: { sha: string } }).object.sha;

  const treeRes = await gh(`/repos/${r}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseSha,
      tree: files.map((f) => ({
        path: f.path,
        mode: "100644",
        type: "blob",
        ...(f.content === null ? { sha: null } : { content: f.content }),
      })),
    }),
  });
  if (!treeRes.ok) throw new Error(`GitHub create tree: ${treeRes.status} ${await treeRes.text()}`);
  const treeSha = ((await treeRes.json()) as { sha: string }).sha;

  const commitRes = await gh(`/repos/${r}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: treeSha, parents: [baseSha] }),
  });
  if (!commitRes.ok) throw new Error(`GitHub create commit: ${commitRes.status}`);
  const commitSha = ((await commitRes.json()) as { sha: string }).sha;

  const updateRes = await gh(`/repos/${r}/git/refs/heads/${branch()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commitSha }),
  });
  if (!updateRes.ok) throw new Error(`GitHub update ref: ${updateRes.status} ${await updateRes.text()}`);
}

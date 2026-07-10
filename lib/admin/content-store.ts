// The only module admin code should use to read/write content.
// Backend: local dev writes the working tree (you review + commit yourself);
// on Vercel every write is a git commit to GITHUB_CONTENT_BRANCH, which
// triggers a production rebuild. Reads on Vercel go to GitHub so the admin
// always sees the latest commit, even before the redeploy finishes.
import fs from "node:fs/promises";
import path from "node:path";
import type { Project } from "@/lib/content-types";
import { projectsSchema } from "@/lib/content/schemas";
import * as github from "@/lib/admin/github";

type Backend = "fs" | "github";

function backend(): Backend {
  const override = process.env.ADMIN_CONTENT_BACKEND;
  if (override === "fs" || override === "github") return override;
  return process.env.VERCEL ? "github" : "fs";
}

export function backendLabel(): string {
  return backend() === "github"
    ? `git → ${process.env.GITHUB_CONTENT_BRANCH || "main"}`
    : "local fs";
}

function abs(relPath: string): string {
  return path.join(process.cwd(), relPath);
}

export async function readTextFile(relPath: string): Promise<string | null> {
  if (backend() === "github") {
    const file = await github.getFile(relPath);
    return file?.text ?? null;
  }
  try {
    return await fs.readFile(abs(relPath), "utf8");
  } catch {
    return null;
  }
}

export async function writeTextFile(
  relPath: string,
  content: string,
  message: string
): Promise<void> {
  if (backend() === "github") {
    await github.putFile(relPath, { text: content }, message);
    return;
  }
  await fs.mkdir(path.dirname(abs(relPath)), { recursive: true });
  await fs.writeFile(abs(relPath), content, "utf8");
}

export async function writeBinaryFile(
  relPath: string,
  base64: string,
  message: string
): Promise<void> {
  if (backend() === "github") {
    await github.putFile(relPath, { base64 }, message);
    return;
  }
  await fs.writeFile(abs(relPath), Buffer.from(base64, "base64"));
}

export async function deleteContentFile(
  relPath: string,
  message: string
): Promise<void> {
  if (backend() === "github") {
    await github.deleteFile(relPath, message);
    return;
  }
  await fs.rm(abs(relPath), { force: true });
}

/** Write + delete several files as one commit (one fs pass locally). */
export async function writeManyFiles(
  files: { path: string; content: string | null }[],
  message: string
): Promise<void> {
  if (backend() === "github") {
    await github.commitMany(files, message);
    return;
  }
  for (const file of files) {
    if (file.content === null) await fs.rm(abs(file.path), { force: true });
    else await fs.writeFile(abs(file.path), file.content, "utf8");
  }
}

export async function listContentDir(relPath: string): Promise<string[]> {
  if (backend() === "github") return github.listDir(relPath);
  try {
    return await fs.readdir(abs(relPath));
  } catch {
    return [];
  }
}

/* ---- Typed helpers ----------------------------------------------------- */

const PROJECTS_PATH = "content/projects.json";

export async function readProjects(): Promise<Project[]> {
  const raw = await readTextFile(PROJECTS_PATH);
  if (!raw) throw new Error(`${PROJECTS_PATH} not found`);
  return projectsSchema.parse(JSON.parse(raw)) as Project[];
}

export async function writeProjects(
  projects: Project[],
  message: string
): Promise<void> {
  const validated = projectsSchema.parse(projects);
  await writeTextFile(
    PROJECTS_PATH,
    JSON.stringify(validated, null, 2) + "\n",
    message
  );
}

export async function readJsonFile<T>(relPath: string): Promise<T> {
  const raw = await readTextFile(relPath);
  if (!raw) throw new Error(`${relPath} not found`);
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(
  relPath: string,
  data: unknown,
  message: string
): Promise<void> {
  await writeTextFile(relPath, JSON.stringify(data, null, 2) + "\n", message);
}

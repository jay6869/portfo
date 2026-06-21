import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ---- Types -----------------------------------------------------------------

export type ProjectType = "TOOL" | "RESEARCH" | "PLATFORM";
export type ProjectTag = "Web" | "ICS/OT" | "Detection" | "Tooling" | "Network" | "Research";

export interface ProjectMeta {
  slug: string;
  title: string;
  type: ProjectType;
  date: string;
  oneLiner: string;
  description: string;
  tags: ProjectTag[];
  stack: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  problem: string;
  approach: string[];
  outcome: string[];
}

export interface WriteupMeta {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
}

export interface Loaded<T> {
  meta: T;
  content: string;
}

// ---- Filesystem helpers ----------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const WRITEUPS_DIR = path.join(CONTENT_DIR, "writeups");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function listSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readFile(dir: string, slug: string): string | null {
  // Guard against path traversal — slugs are strictly kebab-case.
  if (!SLUG_RE.test(slug)) return null;
  const fp = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fp)) return null;
  return fs.readFileSync(fp, "utf8");
}

// Newest first.
function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

// ---- Projects --------------------------------------------------------------

export function getProjectSlugs(): string[] {
  return listSlugs(PROJECTS_DIR);
}

export function getAllProjects(): ProjectMeta[] {
  return getProjectSlugs()
    .map((slug) => {
      const raw = readFile(PROJECTS_DIR, slug)!;
      const { data } = matter(raw);
      return { slug, ...(data as Omit<ProjectMeta, "slug">) };
    })
    .sort(byDateDesc);
}

export function getProject(slug: string): Loaded<ProjectMeta> | null {
  const raw = readFile(PROJECTS_DIR, slug);
  if (raw === null) return null;
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<ProjectMeta, "slug">) }, content };
}

export function getProjectTags(): ProjectTag[] {
  return Array.from(new Set(getAllProjects().flatMap((p) => p.tags))).sort();
}

// ---- Writeups --------------------------------------------------------------

export function getWriteupSlugs(): string[] {
  return listSlugs(WRITEUPS_DIR);
}

export function getAllWriteups(): WriteupMeta[] {
  return getWriteupSlugs()
    .map((slug) => {
      const raw = readFile(WRITEUPS_DIR, slug)!;
      const { data } = matter(raw);
      return { slug, ...(data as Omit<WriteupMeta, "slug">) };
    })
    .sort(byDateDesc);
}

export function getWriteup(slug: string): Loaded<WriteupMeta> | null {
  const raw = readFile(WRITEUPS_DIR, slug);
  if (raw === null) return null;
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<WriteupMeta, "slug">) }, content };
}

export function getWriteupTags(): string[] {
  return Array.from(new Set(getAllWriteups().flatMap((w) => w.tags))).sort();
}

// ---- Cross-linking ---------------------------------------------------------

// Writeups whose tags overlap (fuzzily) with a project's tags.
export function relatedWriteups(project: ProjectMeta, limit = 3): WriteupMeta[] {
  return getAllWriteups()
    .filter((w) =>
      w.tags.some((t) =>
        project.tags.some(
          (pt) =>
            pt.toLowerCase().includes(t.toLowerCase()) ||
            t.toLowerCase().includes(pt.toLowerCase()),
        ),
      ),
    )
    .slice(0, limit);
}

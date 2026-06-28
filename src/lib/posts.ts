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

export interface CheatsheetMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  // Count of `##` sections in the body — surfaced as the card metric.
  sections: number;
}

export interface Loaded<T> {
  meta: T;
  content: string;
}

// ---- Filesystem helpers ----------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const WRITEUPS_DIR = path.join(CONTENT_DIR, "writeups");
const CHEATSHEETS_DIR = path.join(CONTENT_DIR, "cheatsheets");

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

// Auto reading time from the MDX body (~200 wpm, min 1 min).
function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
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
      const { data, content } = matter(raw);
      // readingTime is computed from the body, not authored in frontmatter.
      return { slug, ...(data as Omit<WriteupMeta, "slug">), readingTime: readingTime(content) };
    })
    .sort(byDateDesc);
}

export function getWriteup(slug: string): Loaded<WriteupMeta> | null {
  const raw = readFile(WRITEUPS_DIR, slug);
  if (raw === null) return null;
  const { data, content } = matter(raw);
  return {
    meta: { slug, ...(data as Omit<WriteupMeta, "slug">), readingTime: readingTime(content) },
    content,
  };
}

export function getWriteupTags(): string[] {
  return Array.from(new Set(getAllWriteups().flatMap((w) => w.tags))).sort();
}

// ---- Cheatsheets -----------------------------------------------------------

// Number of top-level `##` sections in the body — the card's at-a-glance metric.
function countSections(content: string): number {
  return (content.match(/^##\s+/gm) ?? []).length;
}

export function getCheatsheetSlugs(): string[] {
  return listSlugs(CHEATSHEETS_DIR);
}

export function getAllCheatsheets(): CheatsheetMeta[] {
  return getCheatsheetSlugs()
    .map((slug) => {
      const raw = readFile(CHEATSHEETS_DIR, slug)!;
      const { data, content } = matter(raw);
      return { slug, ...(data as Omit<CheatsheetMeta, "slug" | "sections">), sections: countSections(content) };
    })
    .sort(byDateDesc);
}

export function getCheatsheet(slug: string): Loaded<CheatsheetMeta> | null {
  const raw = readFile(CHEATSHEETS_DIR, slug);
  if (raw === null) return null;
  const { data, content } = matter(raw);
  return {
    meta: { slug, ...(data as Omit<CheatsheetMeta, "slug" | "sections">), sections: countSections(content) },
    content,
  };
}

export function getCheatsheetTags(): string[] {
  return Array.from(new Set(getAllCheatsheets().flatMap((c) => c.tags))).sort();
}

// ---- Cross-linking ---------------------------------------------------------

// Fuzzy tag overlap used for cross-linking in both directions.
function tagsOverlap(a: string[], b: string[]): boolean {
  return a.some((x) =>
    b.some(
      (y) =>
        x.toLowerCase().includes(y.toLowerCase()) ||
        y.toLowerCase().includes(x.toLowerCase()),
    ),
  );
}

// Writeups whose tags overlap with a project's tags.
export function relatedWriteups(project: ProjectMeta, limit = 3): WriteupMeta[] {
  return getAllWriteups()
    .filter((w) => tagsOverlap(w.tags, project.tags))
    .slice(0, limit);
}

// Projects whose tags overlap with a writeup's tags (reverse cross-link).
export function relatedProjects(writeup: WriteupMeta, limit = 3): ProjectMeta[] {
  return getAllProjects()
    .filter((p) => tagsOverlap(p.tags, writeup.tags))
    .slice(0, limit);
}

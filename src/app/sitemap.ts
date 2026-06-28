import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllProjects, getAllWriteups, getAllCheatsheets } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/writeups`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/cheatsheets`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const writeupRoutes: MetadataRoute.Sitemap = getAllWriteups().map((w) => ({
    url: `${SITE_URL}/writeups/${w.slug}`,
    lastModified: new Date(w.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cheatsheetRoutes: MetadataRoute.Sitemap = getAllCheatsheets().map((c) => ({
    url: `${SITE_URL}/cheatsheets/${c.slug}`,
    lastModified: new Date(c.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...writeupRoutes, ...cheatsheetRoutes];
}

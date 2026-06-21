import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllProjects, getAllWriteups } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/writeups`, changeFrequency: "weekly", priority: 0.9 },
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

  return [...staticRoutes, ...projectRoutes, ...writeupRoutes];
}

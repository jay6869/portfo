"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectMeta } from "@/lib/posts";

const typeColor: Record<ProjectMeta["type"], string> = {
  TOOL: "text-[color:var(--signal)] border-[color:var(--signal)]/40 bg-[color:var(--signal)]/5",
  RESEARCH: "text-[color:var(--info)] border-[color:var(--info)]/40 bg-[color:var(--info)]/5",
  PLATFORM: "text-[color:var(--warn)] border-[color:var(--warn)]/40 bg-[color:var(--warn)]/5",
};

export function ProjectCard({ project, index = 0 }: { project: ProjectMeta; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.38, delay: index * 0.045, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="hover-lift hairline block h-full rounded-lg bg-[color:var(--surface)] p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={`mono inline-flex items-center rounded border px-2 py-0.5 text-[10px] tracking-widest ${typeColor[project.type]}`}
          >
            {project.type}
          </span>
          <ArrowUpRight
            className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--signal)]"
            aria-hidden
          />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.oneLiner}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

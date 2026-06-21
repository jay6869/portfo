"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import type { ProjectMeta, ProjectTag } from "@/lib/posts";

const FILTERS: (ProjectTag | "All")[] = ["All", "Tooling", "Detection", "Network", "Research", "Web", "ICS/OT"];

export function ProjectsView({ projects }: { projects: ProjectMeta[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter as ProjectTag))),
    [filter, projects],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="ls ~/projects"
        title="Everything I've shipped."
        description="Filter by domain. Each card opens a longer-form writeup of the problem, approach, and outcome."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`mono rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                active
                  ? "border-[color:var(--signal)]/60 bg-[color:var(--signal)]/10 text-[color:var(--signal)] shadow-[0_0_18px_-6px_var(--signal)]"
                  : "border-border bg-[color:var(--surface)] text-muted-foreground hover:border-[color:var(--signal)]/40 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {filtered.map((p, i) => (
            <motion.div key={p.slug} layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ProjectCard project={p} index={0} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="mono mt-10 rounded-md border border-dashed border-border bg-[color:var(--surface)] p-8 text-center text-sm text-muted-foreground">
          <span className="text-[color:var(--signal)]">$</span> grep -r &quot;{filter}&quot; ./projects → no matches
        </div>
      )}
    </div>
  );
}

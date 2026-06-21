import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { writeups } from "@/lib/data";

export const Route = createFileRoute("/writeups")({
  head: () => ({
    meta: [
      { title: "Writeups — Janith Godage" },
      { name: "description", content: "Long-form notes on offensive security, detection engineering, and research." },
      { property: "og:title", content: "Writeups — Janith Godage" },
      { property: "og:url", content: "/writeups" },
    ],
    links: [{ rel: "canonical", href: "/writeups" }],
  }),
  component: WriteupsIndex,
});

function WriteupsIndex() {
  const allTags = useMemo(
    () => Array.from(new Set(writeups.flatMap((w) => w.tags))).sort(),
    [],
  );
  const [tag, setTag] = useState<string | null>(null);
  const filtered = useMemo(
    () => (tag ? writeups.filter((w) => w.tags.includes(tag)) : writeups),
    [tag],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="cat ~/writeups/*.md"
        title="Notes from the lab."
        description="Detection ideas, exploit walkthroughs, hardware research. Written for the next person who has to read them."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setTag(null)}
          className={`mono rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-wider ${
            tag === null
              ? "border-[color:var(--signal)]/60 bg-[color:var(--signal)]/10 text-[color:var(--signal)]"
              : "border-border bg-[color:var(--surface)] text-muted-foreground hover:text-foreground"
          }`}
        >
          all
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`mono rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-wider ${
              tag === t
                ? "border-[color:var(--signal)]/60 bg-[color:var(--signal)]/10 text-[color:var(--signal)]"
                : "border-border bg-[color:var(--surface)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4 md:grid-cols-2">
          {filtered.map((w, i) => (
            <motion.div key={w.slug} layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to="/writeups/$slug"
                params={{ slug: w.slug }}
                className="hover-lift hairline block h-full rounded-lg bg-[color:var(--surface)] p-5"
              >
                <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <time>{w.date}</time>
                  <span className="opacity-50">·</span>
                  <span>{w.readingTime}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {w.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

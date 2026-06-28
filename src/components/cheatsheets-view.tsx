"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import type { CheatsheetMeta } from "@/lib/posts";

export function CheatsheetsView({ cheatsheets }: { cheatsheets: CheatsheetMeta[] }) {
  const allTags = useMemo(
    () => Array.from(new Set(cheatsheets.flatMap((c) => c.tags))).sort(),
    [cheatsheets],
  );
  const [tag, setTag] = useState<string | null>(null);
  const filtered = useMemo(
    () => (tag ? cheatsheets.filter((c) => c.tags.includes(tag)) : cheatsheets),
    [tag, cheatsheets],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="ls ~/cheatsheets/"
        title="Cheat sheets."
        description="Dense, scan-first reference cards — payloads, commands, and methodology flows pulled out for when you need them mid-engagement, not a story."
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
          {filtered.map((c, i) => (
            <motion.div key={c.slug} layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                href={`/cheatsheets/${c.slug}`}
                className="hover-lift hairline group block h-full overflow-hidden rounded-xl bg-[color:var(--surface)]"
              >
                {/* terminal window title bar */}
                <div className="flex items-center gap-1.5 border-b border-border bg-[color:var(--surface-2)] px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f56]/70" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]/70" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]/70" />
                  <span className="mono ml-2 truncate text-[11px] text-muted-foreground">
                    {c.slug}.sheet
                  </span>
                  <span className="mono ml-auto shrink-0 text-[10px] text-[color:var(--signal)]/70">
                    {c.sections} §
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-[color:var(--signal)] transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

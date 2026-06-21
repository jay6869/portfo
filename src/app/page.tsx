import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Terminal as TerminalIcon } from "lucide-react";
import { Typewriter } from "@/components/typewriter";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { skillGroups, certs } from "@/lib/data";
import { getAllProjects, getAllWriteups } from "@/lib/posts";

export const metadata: Metadata = {
  title: { absolute: "Janith Godage — Offensive Security & Tooling" },
  description:
    "Cybersecurity undergraduate building offensive security tooling — breaking things ethically, then engineering the defenses.",
  openGraph: {
    title: "Janith Godage — Offensive Security & Tooling",
    description: "Penetration testing, detection engineering, and security research.",
    url: "/",
  },
};

export default function Home() {
  const featured = getAllProjects().filter((p) => p.featured);
  const writeups = getAllWriteups();
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--signal)_18%,transparent),transparent_60%)]" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <Reveal>
            <div className="mono mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--signal)]/30 bg-[color:var(--signal)]/5 px-3 py-1 text-[11px] tracking-wider text-[color:var(--signal)]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--signal)] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[color:var(--signal)]" />
              </span>
              Available for internships · Sri Lanka
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mono text-xs text-muted-foreground sm:text-sm">
              <span className="text-[color:var(--signal)]">$</span> hello_world.init()
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Janith Godage.
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mono mt-6 min-h-[1.6em] text-base sm:text-lg md:text-xl">
              <span className="text-muted-foreground">role:</span>{" "}
              <Typewriter
                words={[
                  "penetration tester",
                  "security tooling builder",
                  "CTF player",
                ]}
              />
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cybersecurity undergraduate building offensive security tooling — breaking
              things ethically, then engineering the defenses. I care about clean exploit
              code, honest writeups, and detection logic that actually fires.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="mono group inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-black shadow-[0_0_30px_-6px_var(--signal)] transition-all hover:shadow-[0_0_40px_-4px_var(--signal)]"
              >
                view projects
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#"
                className="mono hairline inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs uppercase tracking-wider text-foreground transition-colors hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]"
              >
                <Download className="size-3.5" />
                download cv
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mono mt-12 grid max-w-2xl grid-cols-3 gap-4 text-xs">
              {[
                ["uptime", "3y · learning"],
                ["focus", "offsec · detection"],
                ["region", "lk · remote-ok"],
              ].map(([k, v]) => (
                <div key={k} className="hairline rounded-md bg-[color:var(--surface)] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                  <div className="mt-1 text-foreground">{v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="featured projects"
          title="Things I've built, broken, and shipped."
          description="A small, opinionated selection — offensive tooling, blue-team infrastructure, and one piece of hardware research."
        />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/projects"
            className="mono group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-[color:var(--signal)]"
          >
            see all projects
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-y border-border bg-[color:var(--surface)]/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="skills · by domain"
            title="Tooling I reach for."
            description="Grouped by what I'd actually use them for in a kill chain — recon, exploit, detect, reverse."
          />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g) => (
              <StaggerItem key={g.domain} className="hairline rounded-lg bg-[color:var(--surface)] p-5">
                <div className="mono mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[color:var(--signal)]/80">
                  <span className="h-px w-4 bg-[color:var(--signal)]/40" />
                  {g.domain}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((i) => <span key={i} className="chip">{i}</span>)}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="learning roadmap"
          title="Certifications in flight."
        />
        <Stagger className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {certs.map((c) => (
            <StaggerItem key={c.name} className="hairline rounded-lg bg-[color:var(--surface)] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.provider}
                  </div>
                  <div className="mt-1 truncate text-sm font-medium text-foreground sm:text-base">{c.name}</div>
                </div>
                <span className={`mono shrink-0 rounded border px-2 py-0.5 text-[10px] tracking-widest ${
                  c.status === "In progress"
                    ? "border-[color:var(--signal)]/40 text-[color:var(--signal)] bg-[color:var(--signal)]/5"
                    : "border-border text-muted-foreground"
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
                  <div
                    className="h-full rounded-full bg-[color:var(--signal)] shadow-[0_0_10px_var(--signal)]"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <div className="mono mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>progress</span><span>{c.progress}%</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* WRITEUPS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="latest writeups"
            title="Notes from the lab."
          />
          <Stagger className="grid gap-4 md:grid-cols-3">
            {writeups.slice(0, 3).map((w) => (
              <StaggerItem key={w.slug}>
                <Link
                  href={`/writeups/${w.slug}`}
                  className="hover-lift hairline block h-full rounded-lg bg-[color:var(--surface)] p-5"
                >
                  <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <time>{w.date}</time>
                    <span className="opacity-50">·</span>
                    <span>{w.readingTime}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-foreground sm:text-lg">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {w.tags.slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="signal-border relative overflow-hidden rounded-xl bg-[color:var(--surface)] p-6 sm:p-10">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mono mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[color:var(--signal)]/80">
                  <TerminalIcon className="size-3.5" />
                  open channel
                </div>
                <h3 className="text-2xl font-semibold sm:text-3xl">Let&apos;s talk shop.</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Internship, collab, or CTF team — drop a line. PGP available on request.
                </p>
              </div>
              <Link
                href="/contact"
                className="mono group inline-flex w-fit items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-black shadow-[0_0_30px_-6px_var(--signal)] hover:shadow-[0_0_40px_-4px_var(--signal)]"
              >
                initiate handshake
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

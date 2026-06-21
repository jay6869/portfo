import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Reveal } from "@/components/motion-primitives";
import { projects, writeups } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.oneLiner,
    openGraph: {
      title: project.title,
      description: project.oneLiner,
      type: "article",
      url: `/projects/${slug}`,
    },
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = writeups
    .filter((w) =>
      w.tags.some((t) =>
        project.tags.some(
          (pt) =>
            pt.toLowerCase().includes(t.toLowerCase()) ||
            t.toLowerCase().includes(pt.toLowerCase()),
        ),
      ),
    )
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/projects" className="mono inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--signal)]">
        <ArrowLeft className="size-3.5" /> ../projects
      </Link>

      <Reveal>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mono inline-flex items-center rounded border border-[color:var(--signal)]/40 bg-[color:var(--signal)]/5 px-2 py-0.5 text-[10px] tracking-widest text-[color:var(--signal)]">
            {project.type}
          </span>
          {project.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer noopener"
               className="hairline mono inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
              <Github className="size-3.5" /> source
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer noopener"
               className="hairline mono inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
              <ExternalLink className="size-3.5" /> live demo
            </a>
          )}
        </div>
      </Reveal>

      <Section title="01 · problem">
        <p>{project.problem}</p>
      </Section>

      <Section title="02 · approach">
        <ul className="list-none space-y-2.5">
          {project.approach.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className="mono shrink-0 pt-1 text-[10px] text-[color:var(--signal)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="03 · stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      </Section>

      {project.code && (
        <Section title="04 · code">
          <CodeBlock title={project.code.title} lang={project.code.lang}>{project.code.body}</CodeBlock>
        </Section>
      )}

      <Section title="05 · outcome">
        <ul className="list-none space-y-2.5">
          {project.outcome.map((o, i) => (
            <li key={i} className="flex gap-3">
              <span className="mono shrink-0 pt-1 text-[color:var(--signal)]">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="screenshots">
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="hairline scanlines aspect-video overflow-hidden rounded-lg bg-[color:var(--surface)]">
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground mono">
                screenshot · {i + 1}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {related.length > 0 && (
        <Section title="related writeups">
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((w) => (
              <Link key={w.slug} href={`/writeups/${w.slug}`}
                className="hover-lift hairline group block rounded-lg bg-[color:var(--surface)] p-4">
                <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{w.date}</div>
                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground">{w.title}</h3>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-[color:var(--signal)]" />
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="mt-14">
        <h2 className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-[color:var(--signal)]/80">
          <span className="mr-2 h-px w-6 inline-block align-middle bg-[color:var(--signal)]/40" />
          {title}
        </h2>
        <div className="prose prose-invert max-w-none text-sm leading-relaxed text-foreground/90 sm:text-base">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

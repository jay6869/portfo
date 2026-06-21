import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Reveal } from "@/components/motion-primitives";
import { writeups } from "@/lib/data";

export function generateStaticParams() {
  return writeups.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writeup = writeups.find((w) => w.slug === slug);
  if (!writeup) return {};
  return {
    title: { absolute: `${writeup.title} — Writeups` },
    description: writeup.excerpt,
    openGraph: {
      title: writeup.title,
      description: writeup.excerpt,
      type: "article",
      url: `/writeups/${slug}`,
    },
    alternates: { canonical: `/writeups/${slug}` },
  };
}

export default async function WriteupDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = writeups.find((w) => w.slug === slug);
  if (!writeup) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/writeups" className="mono inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--signal)]">
        <ArrowLeft className="size-3.5" /> ../writeups
      </Link>

      <Reveal>
        <div className="mono mt-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <time>{writeup.date}</time>
          <span className="opacity-50">·</span>
          <span>{writeup.readingTime}</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{writeup.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {writeup.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      </Reveal>

      <div className="mt-10 space-y-6 text-[15px] leading-[1.75] text-foreground/90">
        {writeup.body.map((block, i) => {
          if (block.type === "p") return <p key={i}>{block.text}</p>;
          if (block.type === "h2")
            return (
              <h2 key={i} className="mt-12 text-xl font-semibold text-foreground sm:text-2xl">
                <span className="mono mr-2 text-[color:var(--signal)]/70">§</span>
                {block.text}
              </h2>
            );
          if (block.type === "code")
            return (
              <CodeBlock key={i} lang={block.lang}>
                {block.text}
              </CodeBlock>
            );
          if (block.type === "list")
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items?.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mono shrink-0 pt-1 text-[color:var(--signal)]">▸</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          if (block.type === "callout")
            return (
              <aside key={i} className="hairline flex gap-3 rounded-lg border-l-2 border-l-[color:var(--warn)] bg-[color:var(--surface)] p-4 text-sm">
                <ShieldAlert className="size-5 shrink-0 text-[color:var(--warn)]" />
                <div>
                  <div className="mono mb-1 text-[10px] uppercase tracking-widest text-[color:var(--warn)]">
                    responsible disclosure
                  </div>
                  <p className="text-muted-foreground">{block.text}</p>
                </div>
              </aside>
            );
          return null;
        })}
      </div>
    </article>
  );
}

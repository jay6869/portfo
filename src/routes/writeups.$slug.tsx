import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Reveal } from "@/components/motion-primitives";
import { writeups, type Writeup } from "@/lib/data";

export const Route = createFileRoute("/writeups/$slug")({
  loader: ({ params }): { writeup: Writeup } => {
    const writeup = writeups.find((w) => w.slug === params.slug);
    if (!writeup) throw notFound();
    return { writeup };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.writeup.title} — Writeups` },
          { name: "description", content: loaderData.writeup.excerpt },
          { property: "og:title", content: loaderData.writeup.title },
          { property: "og:description", content: loaderData.writeup.excerpt },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/writeups/${params.slug}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `/writeups/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mono text-sm text-muted-foreground">writeup not found.</div>
      <Link to="/writeups" className="mono mt-4 inline-block text-[color:var(--signal)]">← back to writeups</Link>
    </div>
  ),
  component: WriteupDetail,
});

function WriteupDetail() {
  const { writeup } = Route.useLoaderData() as { writeup: Writeup };

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link to="/writeups" className="mono inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--signal)]">
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

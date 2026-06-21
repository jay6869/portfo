import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { mdxComponents } from "@/components/mdx";
import { getWriteup, getWriteupSlugs, relatedProjects } from "@/lib/posts";
import { prettyCodeOptions } from "@/lib/mdx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriteupSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getWriteup(slug);
  if (!found) return {};
  const { meta } = found;
  return {
    title: { absolute: `${meta.title} — Writeups` },
    description: meta.excerpt,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
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
  const found = getWriteup(slug);
  if (!found) notFound();
  const { meta: writeup, content } = found;
  const related = relatedProjects(writeup);

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

      <div className="mdx mt-10">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </div>

      {related.length > 0 && (
        <Reveal>
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-[color:var(--signal)]/80">
              <span className="mr-2 inline-block h-px w-6 align-middle bg-[color:var(--signal)]/40" />
              related projects
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`}
                  className="hover-lift hairline group block rounded-lg bg-[color:var(--surface)] p-4">
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{p.type}</div>
                  <div className="mt-1.5 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-[color:var(--signal)]" />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{p.oneLiner}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </article>
  );
}

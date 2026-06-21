import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { mdxComponents } from "@/components/mdx";
import { getWriteup, getWriteupSlugs } from "@/lib/posts";
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
    </article>
  );
}

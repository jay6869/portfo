import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { mdxComponents } from "@/components/mdx";
import { getCheatsheet, getCheatsheetSlugs } from "@/lib/posts";
import { prettyCodeOptions } from "@/lib/mdx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCheatsheetSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getCheatsheet(slug);
  if (!found) return {};
  const { meta } = found;
  return {
    title: { absolute: `${meta.title} — Cheat Sheets` },
    description: meta.excerpt,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      url: `/cheatsheets/${slug}`,
    },
    alternates: { canonical: `/cheatsheets/${slug}` },
  };
}

export default async function CheatsheetDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getCheatsheet(slug);
  if (!found) notFound();
  const { meta: sheet, content } = found;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/cheatsheets" className="mono inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--signal)]">
        <ArrowLeft className="size-3.5" /> ../cheatsheets
      </Link>

      {/* Terminal-window header — the cheat sheet's visual signature. */}
      <Reveal>
        <div className="hairline mt-6 overflow-hidden rounded-xl bg-[color:var(--surface)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-[color:var(--surface-2)] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#ff5f56]/70" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]/70" />
            <span className="size-2.5 rounded-full bg-[#27c93f]/70" />
            <span className="mono ml-2 truncate text-[11px] text-muted-foreground">{slug}.sheet</span>
            <span className="mono ml-auto shrink-0 text-[10px] text-[color:var(--signal)]/70">{sheet.sections} §</span>
          </div>
          <div className="px-5 py-5 sm:px-6">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              cheat sheet · {sheet.date}
            </div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{sheet.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{sheet.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {sheet.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mdx mt-8">
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

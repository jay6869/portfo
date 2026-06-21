import { SITE, SITE_URL } from "@/lib/site";
import { getAllWriteups } from "@/lib/posts";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const dynamic = "force-static";

export function GET() {
  const writeups = getAllWriteups();
  const updated = writeups[0]?.date ?? new Date().toISOString();

  const items = writeups
    .map((w) => {
      const url = `${SITE_URL}/writeups/${w.slug}`;
      return `    <item>
      <title>${escape(w.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(w.date).toUTCString()}</pubDate>
      <description>${escape(w.excerpt)}</description>
${w.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)} — Writeups</title>
    <link>${SITE_URL}/writeups</link>
    <description>${escape(SITE.ogDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

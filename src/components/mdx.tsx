import Link from "next/link";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { ShieldAlert } from "lucide-react";

// Heading with the signal-green § marker used throughout the site.
function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 className="mt-12 text-xl font-semibold text-foreground sm:text-2xl" {...props}>
      <span className="mono mr-2 text-[color:var(--signal)]/70">§</span>
      {children}
    </h2>
  );
}

function H3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 className="mt-8 text-lg font-semibold text-foreground" {...props}>
      {children}
    </h3>
  );
}

// Internal links use next/link; external links open safely in a new tab.
function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} className="text-[color:var(--signal)] underline decoration-[color:var(--signal)]/30 underline-offset-2 hover:decoration-[color:var(--signal)]">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="text-[color:var(--signal)] underline decoration-[color:var(--signal)]/30 underline-offset-2 hover:decoration-[color:var(--signal)]" {...props}>
      {children}
    </a>
  );
}

// Responsible-disclosure / warning callout. Authored in MDX as:
//   <Callout>…</Callout>  or  <Callout title="note" tone="info">…</Callout>
export function Callout({
  children,
  title = "responsible disclosure",
  tone = "warn",
}: {
  children: ReactNode;
  title?: string;
  tone?: "warn" | "info";
}) {
  const color = tone === "info" ? "var(--info)" : "var(--warn)";
  return (
    <aside
      className="hairline my-6 flex gap-3 rounded-lg border-l-2 bg-[color:var(--surface)] p-4 text-sm"
      style={{ borderLeftColor: color }}
    >
      <ShieldAlert className="size-5 shrink-0" style={{ color }} />
      <div>
        <div className="mono mb-1 text-[10px] uppercase tracking-widest" style={{ color }}>
          {title}
        </div>
        <div className="text-muted-foreground [&>p]:mt-0">{children}</div>
      </div>
    </aside>
  );
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  a: Anchor,
  Callout,
};

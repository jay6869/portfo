import type { ReactNode } from "react";

export function CodeBlock({
  title,
  lang,
  children,
}: {
  title?: string;
  lang?: string;
  children: ReactNode;
}) {
  return (
    <div className="hairline overflow-hidden rounded-lg bg-[color:var(--surface)]">
      <div className="flex items-center justify-between border-b border-border bg-[color:var(--surface-2)] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
        </div>
        <div className="mono text-[11px] text-muted-foreground">
          {title}
          {lang && <span className="ml-2 text-[color:var(--signal)]/70">{lang}</span>}
        </div>
        <div className="w-9" />
      </div>
      <pre className="mono overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-foreground/90">
        <code>{children}</code>
      </pre>
    </div>
  );
}

import { Reveal } from "./motion-primitives";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div className={`mb-10 flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""}`}>
        <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--signal)]/80">
          <span className="h-px w-6 bg-[color:var(--signal)]/40" />
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
    </Reveal>
  );
}

import { Reveal } from "./motion-primitives";
import type { ReactNode } from "react";

/**
 * The section head used by every interior route.
 *
 * Set in the same display system as the home surface — `.display-section` over
 * a short supporting line — so the site reads as one world rather than as a
 * redesigned homepage bolted to older pages.
 *
 * There is deliberately no eyebrow/kicker slot. A label stacked above a heading
 * is the one layout pattern the craft floor bans outright; the heading carries
 * its own weight.
 */
export function SectionHeading({
  title,
  description,
  align = "left",
  as: Tag = "h1",
  children,
}: {
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  /** h1 for the page's own title; h2 for a later section on the same page. */
  as?: "h1" | "h2";
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div
        className={`mb-12 flex flex-col gap-5 ${
          align === "center" ? "items-center text-center" : ""
        }`}
      >
        <Tag className="display display-section text-balance text-foreground">
          {title}
        </Tag>
        {description && (
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
    </Reveal>
  );
}

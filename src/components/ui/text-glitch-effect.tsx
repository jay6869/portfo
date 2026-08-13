"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * A contact row whose value decodes out of noise while a solid plate wipes
 * across it from the centre line.
 *
 * Adapted from a generic text-glitch component. Changes from the original,
 * beyond palette:
 *
 * - Renders an <a> row, not an <h1>. Three headings inside a section that
 *   already has one would break the document outline.
 * - The value stays fully legible at rest. The source dimmed the base text to
 *   ~20% opacity and revealed it on hover, which is fine for decorative display
 *   type and wrong for an email address someone needs to read and copy.
 * - The scrambling text is aria-hidden with the real value carried on the
 *   link's accessible name; otherwise a screen reader announces noise.
 * - Charset matches the content (lowercase, digits, url punctuation) instead of
 *   A–Z only, so the glitch keeps the same visual weight as the real string.
 * - Timers are typed for the browser and cleared on unmount; the original left
 *   an interval running if the component unmounted mid-hover.
 * - No entrance animation: these rows already arrive on the page's shared
 *   ScrollTrigger stagger, and a second entrance would fight it.
 */

const SCRAMBLE = "abcdefghijklmnopqrstuvwxyz0123456789@./-_<>[]{}#*";

type Props = {
  label: string;
  text: string;
  href: string;
  external?: boolean;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function TextGlitch({
  label,
  text,
  href,
  external = false,
  className = "",
  ...rest
}: Props) {
  const [display, setDisplay] = useState(text);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  };

  // Always release the timer — a row unmounted mid-hover would otherwise keep
  // an interval alive setting state on a dead component.
  useEffect(() => stop, []);

  const onEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    let i = 0;
    interval.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, idx) => {
            if (idx < i) return text[idx];
            // Keep separators steady so the string stays recognisably an
            // address rather than dissolving into a block of noise.
            if (ch === " " || ch === "@" || ch === ".") return ch;
            return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          })
          .join(""),
      );
      if (i >= text.length) stop();
      i += 1 / 3;
    }, 30);
  };

  const onLeave = () => {
    stop();
    setDisplay(text);
  };

  return (
    <a
      {...rest}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      aria-label={`${label}: ${text}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={`glitch-row group ${className}`}
    >
      <span className="min-w-0">
        <span className="label block text-[color:var(--signal)]/70">{label}</span>

        <span className="glitch-stack mt-2" aria-hidden="true">
          <span className="glitch-base">{display}</span>
          {/* The plate carries the same string so the wipe reads as the text
              being painted over, not as a bar sliding across it. */}
          <span className="glitch-plate">
            <span className="glitch-plate-text">{display}</span>
          </span>
        </span>
      </span>

      <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--signal)]" />
    </a>
  );
}

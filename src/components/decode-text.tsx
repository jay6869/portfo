"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#01";

/**
 * Text that resolves out of noise, the way a decoded string does.
 *
 * The finished text is what renders server-side and what assistive tech reads;
 * the scramble is a purely visual pass that runs once, after mount, only when
 * motion is welcome and only when the element is on screen.
 */
export function DecodeText({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const total = 28 + text.length * 1.6;
          let frame = 0;
          const tick = () => {
            const progress = frame / total;
            const revealed = Math.floor(progress * text.length * 1.35);
            let s = "";
            for (let i = 0; i < text.length; i++) {
              if (text[i] === " ") { s += " "; continue; }
              if (i < revealed) s += text[i];
              else s += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            setOut(s);
            frame += 1;
            if (frame <= total) raf = requestAnimationFrame(tick);
            else setOut(null);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {out === null ? (
        text
      ) : (
        <>
          <span aria-hidden="true">{out}</span>
          <span className="sr-only">{text}</span>
        </>
      )}
    </Tag>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** ms between glyph swaps. Swapping every frame reads as flicker, not letters. */
const STEP = 55;
/** How many swaps before the first letter settles, and the stagger after it. */
const LEAD = 7;
const STAGGER = 3;

/**
 * Display text that shuffles through letters and settles left to right, the
 * way the reference resolves its project titles.
 *
 * Each slot is sized by its final glyph (invisible, but in flow); the shuffling
 * glyph floats over it — so a wide W passing through a narrow I never shoves
 * the rest of the word sideways.
 *
 * Runs every time the text comes into view, and again on hover. The finished
 * word is what renders server-side and what assistive tech reads; the shuffle
 * never runs under reduced motion.
 */
export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string[]>(() => [...text]);
  const running = useRef(false);
  const run = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    let timer = 0;

    run.current = () => {
      if (running.current) return;
      running.current = true;
      let step = 0;
      const tick = () => {
        step += 1;
        const next = chars.map((c, i) => {
          if (c === " " || step >= LEAD + i * STAGGER) return c;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        });
        setShown(next);
        if (step < LEAD + (chars.length - 1) * STAGGER) {
          timer = window.setTimeout(tick, STEP);
        } else {
          running.current = false;
        }
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) run.current();
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      running.current = false;
      setShown(chars);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} onPointerEnter={() => run.current()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="scramble">
        {[...text].map((c, i) => (
          <span key={i} className="scramble-cell">
            <span className="scramble-final">{c}</span>
            <span>{shown[i]}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

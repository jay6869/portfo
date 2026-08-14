"use client";

import { useEffect, useRef } from "react";

/**
 * Proximity-driven variable-font lettering for the hero name.
 *
 * Adapted from React Bits' <TextPressure/>. Each character reads its distance
 * to the cursor and rides the font's `wght` and `wdth` axes accordingly, so the
 * whole line deforms with a falloff rather than one letter flipping on hover.
 *
 * Changes from the source, beyond palette:
 *
 * - The two lines run OPPOSITE. `light` sits at normal weight and thickens
 *   toward the cursor; `solid` sits ultra-bold and thins. That inversion is the
 *   established behaviour of this hero and is preserved here.
 * - Reads and writes are batched into two passes per frame. The source calls
 *   getBoundingClientRect and then writes a style per character in the same
 *   loop, forcing a synchronous layout on every single character, every frame.
 *   Measuring all of them first and then writing all of them costs one layout.
 * - The RAF loop only runs while the hero is on screen and the tab is visible;
 *   the source animates forever.
 * - Font size and layout stay with the page's own CSS. The source computes a
 *   font size from container width in JS, which would fight the fluid clamp
 *   this hero already uses.
 * - The real string is exposed once to assistive tech; the split characters are
 *   aria-hidden, so a screen reader never spells the name out letter by letter.
 * - Under prefers-reduced-motion nothing is tracked at all: the letters simply
 *   hold their resting axis values.
 */

type Variant = "light" | "solid";

// Resting and peak weight, per line. Rubik ships a weight axis and nothing
// else, so this is the whole instrument — which is also the right one: weight
// is what the eye reads as pressure, while a width swing scales the
// letterforms sideways and reads as distortion rather than emphasis.
const AXES: Record<Variant, { wght: [number, number] }> = {
  // Light at rest, black under the cursor.
  light: { wght: [300, 900] },
  // Black at rest, light under the cursor — the inverse gesture.
  solid: { wght: [900, 300] },
};

export function TextPressure({
  text,
  variant,
  className = "",
}: {
  text: string;
  variant: Variant;
  className?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const { wght } = AXES[variant];
    const cursor = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };

    const onMove = (e: PointerEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      if (eased.x < -9000) {
        eased.x = cursor.x;
        eased.y = cursor.y;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = false;
    let visible = true;

    const frame = () => {
      if (!running) return;

      eased.x += (cursor.x - eased.x) / 12;
      eased.y += (cursor.y - eased.y) / 12;

      // Pass 1 — read every rect before touching a single style. Interleaving
      // reads and writes is what makes the original stall.
      const rect = root.getBoundingClientRect();
      const maxDist = Math.max(rect.width / 2, 1);
      const centers: { x: number; y: number }[] = [];
      for (const span of spans.current) {
        if (!span) {
          centers.push({ x: 0, y: 0 });
          continue;
        }
        const r = span.getBoundingClientRect();
        centers.push({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
      }

      // Pass 2 — write.
      for (let i = 0; i < spans.current.length; i++) {
        const span = spans.current[i];
        if (!span) continue;
        const c = centers[i];
        const dx = eased.x - c.x;
        const dy = eased.y - c.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        // Smoothstep falloff — a linear ramp reads as a hard cone.
        const t = Math.min(d / maxDist, 1);
        const k = 1 - t * t * (3 - 2 * t);

        const w = Math.round(wght[0] + (wght[1] - wght[0]) * k);
        span.style.fontVariationSettings = `"wght" ${w}`;
      }

      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) kick();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(root);

    const onVis = () => {
      visible = !document.hidden;
      if (visible) kick();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    kick();

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [variant, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        ref={rootRef}
        aria-hidden="true"
        className={`pressure pressure--${variant} ${className}`}
      >
        {Array.from(text).map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              spans.current[i] = el;
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}

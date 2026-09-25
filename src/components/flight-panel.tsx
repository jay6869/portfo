"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The Work card's visual: aircraft crossing an open sky, with the company
 * lockup in the middle — the treatment the reference gives a client panel.
 *
 * The centre is AASL's own logo, supplied by Janith and recoloured to the
 * band charcoal (public/logos/aasl.png).
 *
 * How the motion works: the sky layer is oversized and turned 45°, so every
 * lane inside it only ever moves straight "up" and the planes fly north-east
 * across the panel whatever its aspect ratio. Each lane is one composited
 * translate. Paused off screen, pausable by hand (WCAG 2.2.2), and parked in
 * place under reduced motion — the resting positions are the same frame the
 * animation starts on, so nothing jumps either way.
 */

type Depth = "far" | "mid" | "near";

// x: lane position across the turned layer (the panel covers roughly 25–75).
// size in px. dur in seconds — nearer planes cross faster. phase: 0–1, where in
// its crossing the plane starts, so the sky is already busy on first view.
const FLIGHTS: { x: number; size: number; dur: number; phase: number; depth: Depth }[] = [
  { x: 27, size: 24, dur: 17, phase: 0.18, depth: "far" },
  { x: 33, size: 46, dur: 12, phase: 0.62, depth: "mid" },
  { x: 40, size: 20, dur: 19, phase: 0.84, depth: "far" },
  { x: 46, size: 30, dur: 15, phase: 0.34, depth: "far" },
  { x: 55, size: 120, dur: 8, phase: 0.27, depth: "near" },
  { x: 61, size: 40, dur: 13, phase: 0.07, depth: "mid" },
  { x: 68, size: 22, dur: 18, phase: 0.55, depth: "far" },
  { x: 74, size: 52, dur: 11, phase: 0.43, depth: "mid" },
];

/** Top-down airliner, nose up. Drawn for this panel. */
export function PlaneGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 1c.9 0 1.4 1 1.4 2.2V9l8.6 5v2l-8.6-2.6V19l2.6 2v1.6l-4-1-4 1V21l2.6-2v-5.6L2 16v-2l8.6-5V3.2C10.6 2 11.1 1 12 1Z" />
    </svg>
  );
}

export function FlightPanel({
  logo,
  caption,
}: {
  logo: { src: string; alt: string; w: number; h: number };
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [still, setStill] = useState(false);

  // Read on mount, not at render, so server and first client pass agree.
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !paused && inView && !still;

  return (
    <div ref={ref} className="sky" data-running={running ? "" : undefined}>
      <div className="sky-layer" aria-hidden>
        {FLIGHTS.map((f) => (
          <span
            key={f.x}
            className={`sky-lane sky-lane--${f.depth}`}
            style={
              {
                left: `${f.x}%`,
                width: f.size,
                marginLeft: -f.size / 2,
                "--p": f.phase,
                animationDuration: `${f.dur}s`,
                animationDelay: `${-f.phase * f.dur}s`,
              } as React.CSSProperties
            }
          >
            <span className="sky-craft">
              <PlaneGlyph className="sky-plane" />
            </span>
          </span>
        ))}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.w}
        height={logo.h}
        className="sky-logo"
        decoding="async"
        draggable={false}
      />
      <span className="sky-caption label">{caption}</span>

      {!still && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume animation" : "Pause animation"}
          className="about-media-toggle sky-toggle"
        >
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
        </button>
      )}
    </div>
  );
}

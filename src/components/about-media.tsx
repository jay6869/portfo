"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The About band's video.
 *
 * Rendered raw — no duotone, no halftone, no filter of any kind — so the
 * footage reads exactly as shot.
 *
 * Three things this needs beyond a plain <video> tag:
 *
 * 1. A pause control. WCAG 2.2.2 requires a mechanism to pause, stop or hide
 *    any motion that starts automatically and runs longer than five seconds;
 *    this clip is ten and loops, so an autoplaying tag alone would fail.
 * 2. Playback tied to visibility. The file is ~1.1MB and sits well below the
 *    fold, so it neither downloads nor decodes until it is actually on screen,
 *    and it stops again once it leaves.
 * 3. prefers-reduced-motion handling: it holds on the first frame instead of
 *    autoplaying, and the control becomes an opt-in rather than an opt-out.
 */
export function AboutMedia({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  // Read once on mount rather than at render, so the server and first client
  // pass agree and hydration stays clean.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView && !paused) {
      // Autoplay can still be refused (power saving, platform policy); the
      // poster frame simply stays and the control remains available.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, paused]);

  return (
    <div className="about-media aspect-[4/5] w-full max-w-lg">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="about-media-toggle"
      >
        {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
      </button>
    </div>
  );
}

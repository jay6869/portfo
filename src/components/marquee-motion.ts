"use client";

import { useEffect, type RefObject } from "react";

/**
 * Continuous marquee travel that scroll accelerates.
 *
 * This replaces the pure scroll-scrub the bands used to run on. That version
 * only moved while the wheel did — a band sitting still on a static page reads
 * as broken rather than as restraint — and it also meant the two bands could
 * never differ in tempo, because both were locked to the same scroll.
 *
 * The model is momentum, not position. A constant base speed always runs, and
 * scrolling injects velocity that decays back to the baseline over about a
 * second. Scroll down and the band surges forward; stop, and it eases back to
 * its own pace rather than halting.
 *
 * The wrap is exact rather than approximate: the caller renders its content
 * TWICE, so translating by half the track's width lands the second copy
 * precisely where the first began and the loop has no seam at any speed.
 *
 * Everything is written straight to `transform` inside one rAF. Driving this
 * through React state would re-render the band on every frame to move a single
 * element, and the site already learned that lesson with the telemetry bar.
 */
export function useMarqueeMotion(
  wrapRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  {
    /** Baseline travel in px/second, running whether or not anyone scrolls.
     *  Zero makes the band purely scroll-driven: still on a still page. */
    speed,
    /** Px of extra velocity per px scrolled. Zero decouples the band from the
     *  scroll entirely, leaving it on its baseline at a constant pace. */
    boost,
    /** Off leaves the band parked at its resting offset, costing no rAF at
     *  all. Most bands on the page are static; motion is the exception, so
     *  that a moving band means something rather than being wallpaper. */
    enabled = true,
  }: { speed: number; boost: number; enabled?: boolean },
) {
  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    // Reduced motion gets a static band. It is a decorative strip, and the
    // content is legible standing still.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let velocity = 0;
    let half = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let running = false;

    // Half the track, because the caller duplicates its content exactly once.
    const measure = () => {
      const next = track.scrollWidth / 2;
      // Carry the visual position across a resize rather than snapping: offset
      // is meaningless on its own, only as a fraction of the loop.
      if (half > 0 && next > 0) offset *= next / half;
      half = next;
    };
    measure();
    // Pick up where the CSS resting position leaves off (-7% of the full
    // track, which is 14% of half), so enabling motion does not jump the band.
    offset = half * 0.14;
    track.style.willChange = "transform";

    const onScroll = () => {
      const y = window.scrollY;
      velocity += (y - lastY) * boost;
      lastY = y;
    };

    const frame = (now: number) => {
      if (!running) return;
      // Clamped so a backgrounded tab returning does not jump the band a
      // screen forward on its first frame.
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // Frame-rate independent decay: the same ~12%-per-60Hz-frame falloff
      // whether the display runs at 60 or 144.
      velocity *= Math.pow(0.88, dt * 60);
      offset += (speed + velocity) * dt;

      if (half > 0) {
        offset %= half;
        if (offset < 0) offset += half;
      }
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastT = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Off-screen bands cost nothing, and neither does a hidden tab.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      track.style.willChange = "";
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [wrapRef, trackRef, speed, boost, enabled]);
}

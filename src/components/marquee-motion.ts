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
    /** How much of the reader's scroll speed the band borrows, as a ratio.
     *  0.2 means scrolling at 1000 px/s adds 200 px/s of travel. Zero
     *  decouples the band from the scroll entirely. */
    scrollFactor,
    /** Hard ceiling on that borrowed speed, in px/second. Without one, a
     *  trackpad flick or a Page Down hands the band a scroll rate no reader
     *  can follow. */
    scrollCap = 0,
    /** Off leaves the band parked at its resting offset, costing no rAF at
     *  all. Most bands on the page are static; motion is the exception, so
     *  that a moving band means something rather than being wallpaper. */
    enabled = true,
  }: {
    speed: number;
    scrollFactor: number;
    scrollCap?: number;
    enabled?: boolean;
  },
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
    /** The smoothed contribution the scroll is currently making, in px/s. */
    let velocity = 0;
    let half = 0;
    let pageY = window.scrollY;
    let lastY = pageY;
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

    // The listener only records where the page is. Everything derived from it
    // happens in the frame, so a wheel firing twenty events per frame cannot
    // contribute twenty times.
    const onScroll = () => {
      pageY = window.scrollY;
    };

    const frame = (now: number) => {
      if (!running) return;
      // Clamped so a backgrounded tab returning does not jump the band a
      // screen forward on its first frame.
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // How fast the reader is scrolling RIGHT NOW, in px/second — not how far
      // they have scrolled. The previous version accumulated distance into
      // velocity, so it had no bound: a 300px wheel scroll injected 4800 px/s
      // against a 72 px/s baseline, and the band bolted before easing back.
      const rawScroll = dt > 0 ? (pageY - lastY) / dt : 0;
      lastY = pageY;

      // Asymmetric smoothing: fast to answer, slow to let go.
      //
      // A symmetric filter was the real fault here. At 60fps a 130ms constant
      // moves ~12% of the way to target per frame, and a wheel gesture lasts
      // about six frames — so the band reached 1-0.88^6 = 54% of the speed
      // asked of it, and barely a third on a quick flick. Every constant was
      // being roughly halved before it reached the screen, which is why
      // raising them kept not helping.
      //
      // Rising uses a 45ms constant, so the band is at ~90% within six frames.
      // Falling uses 280ms, which keeps the tail. The test is on magnitude,
      // not sign, so a frame that simply carried no scroll event coasts on the
      // release curve instead of yanking velocity to zero.
      const target = rawScroll * scrollFactor;
      const tau = Math.abs(target) > Math.abs(velocity) ? 0.045 : 0.28;
      velocity += (target - velocity) * (1 - Math.exp(-dt / tau));

      // Signed, so scrolling back up carries the band back the way it came,
      // then clamped so no input can outrun the cap.
      const borrowed = Math.max(-scrollCap, Math.min(scrollCap, velocity));
      offset += (speed + borrowed) * dt;

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
      // Re-baseline on resume: while the band was parked the page may have
      // moved a long way, and that gap is not motion the band should replay.
      pageY = window.scrollY;
      lastY = pageY;
      velocity = 0;
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
  }, [wrapRef, trackRef, speed, scrollFactor, scrollCap, enabled]);
}

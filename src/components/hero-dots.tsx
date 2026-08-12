"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

/**
 * The hero's dot field: a grid that drifts like cloud cover and swells under
 * the cursor.
 *
 * Two layers, deliberately running at different rates:
 *
 *   CLOUD  — 3D simplex noise sampled per dot, the third axis being time, so
 *            the field breathes rather than scrolls. It changes slowly, so it
 *            is rendered into an offscreen canvas ~14×/sec and blitted, not
 *            rebuilt every frame.
 *   CURSOR — only the dots inside the interaction radius, redrawn at full
 *            frame rate on top.
 *
 * What keeps it cheap where the naive version stalls:
 *
 * 1. Cursor dots are addressed by column/row range off the regular grid, so no
 *    distance test runs outside that box — ~1,900 candidates instead of
 *    ~32,000, and the cost stops scaling with viewport size.
 * 2. Each layer batches every dot into ONE path with a single fill, rather
 *    than a beginPath/arc/fill triple per dot.
 * 3. Noise is evaluated only when the cloud layer regenerates, cached in a
 *    Float32Array, and read back by the cursor pass for free.
 * 4. Positions derive from the grid index; nothing stores 32k objects.
 *
 * It stops entirely when the hero scrolls away or the tab is hidden, and skips
 * both the drift and the interaction under prefers-reduced-motion.
 */

const SPACING = 11; // px between dots
const DOT_SIZE = 3.6; // max drawn diameter under the cursor
const MIN_RATIO = 0.15; // floor size as a fraction of DOT_SIZE
const REST_RATIO = 0.56; // how large the cloud alone can push a dot
const RADIUS = 140; // cursor influence radius
const EASE = 0.16; // cursor follow damping
const CLOUD_SCALE = 0.0021; // spatial frequency — larger blobs at lower values
const CLOUD_SPEED = 0.095; // drift rate through the noise field
const CLOUD_MS = 70; // cloud layer refresh interval
const CLOUD_ALPHA = 0.68; // opacity of the resting field
// Exponent applied after the smoothstep. Higher = darker, tighter highlights;
// at 2.0 the midtones collapsed and the cloud all but vanished.
const CLOUD_CONTRAST = 0.8;

export function HeroDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // Read the accent from the token so the field can never drift from the
    // rest of the palette.
    const signal =
      getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() ||
      "#00ff9c";

    const noise3D = createNoise3D();

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cloud = new Float32Array(0);
    let dpr = 1;

    const cloudCanvas = document.createElement("canvas");
    const cloudCtx = cloudCanvas.getContext("2d");
    if (!cloudCtx) return;

    const maxSize = DOT_SIZE * 0.72;
    const minSize = maxSize * MIN_RATIO;
    const restSize = maxSize * REST_RATIO;

    let tx = -9999;
    let ty = -9999;
    let cx = -9999;
    let cy = -9999;
    let strength = 0;
    let targetStrength = 0;

    let raf = 0;
    let running = false;
    let visible = true;
    let lastCloud = -Infinity;
    const start = performance.now();

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      for (const c of [canvas, cloudCanvas]) {
        c.width = Math.floor(width * dpr);
        c.height = Math.floor(height * dpr);
      }
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cloudCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / SPACING) + 2;
      rows = Math.ceil(height / SPACING) + 2;
      cloud = new Float32Array(cols * rows);
      lastCloud = -Infinity;
    };

    /** Resample the noise field and redraw the resting layer. */
    const drawCloud = (t: number) => {
      const z = t * CLOUD_SPEED;

      cloudCtx.clearRect(0, 0, width, height);
      cloudCtx.fillStyle = signal;
      cloudCtx.globalAlpha = CLOUD_ALPHA;
      cloudCtx.beginPath();

      for (let r = 0; r < rows; r++) {
        const y = r * SPACING - SPACING;
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING - SPACING;

          // -1..1 → 0..1, then curved so bright patches stay sparse and the
          // field reads as cloud rather than even static.
          let v = (noise3D(x * CLOUD_SCALE, y * CLOUD_SCALE, z) + 1) * 0.5;
          v = v * v * (3 - 2 * v);
          v = Math.pow(v, CLOUD_CONTRAST);

          const size = minSize + (restSize - minSize) * v;
          cloud[r * cols + c] = size;

          const rad = size / 2;
          cloudCtx.moveTo(x + rad, y);
          cloudCtx.arc(x, y, rad, 0, Math.PI * 2);
        }
      }

      cloudCtx.fill();
      cloudCtx.globalAlpha = 1;
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(cloudCanvas, 0, 0, width, height);

      if (strength <= 0.01) return;

      // Address the affected dots directly — no distance test outside the box.
      const c0 = Math.max(0, Math.floor((cx - RADIUS + SPACING) / SPACING));
      const c1 = Math.min(cols - 1, Math.ceil((cx + RADIUS + SPACING) / SPACING));
      const r0 = Math.max(0, Math.floor((cy - RADIUS + SPACING) / SPACING));
      const r1 = Math.min(rows - 1, Math.ceil((cy + RADIUS + SPACING) / SPACING));
      if (c1 < c0 || r1 < r0) return;

      const radiusSq = RADIUS * RADIUS;
      ctx.fillStyle = signal;
      ctx.beginPath();

      for (let r = r0; r <= r1; r++) {
        const y = r * SPACING - SPACING;
        const dy = cy - y;
        const dySq = dy * dy;
        if (dySq > radiusSq) continue;

        for (let c = c0; c <= c1; c++) {
          const x = c * SPACING - SPACING;
          const dx = cx - x;
          const dSq = dx * dx + dySq;
          if (dSq > radiusSq) continue;

          const base = cloud[r * cols + c];

          // Smoothstep falloff — a linear ramp reads as a hard cone.
          const t = Math.sqrt(dSq) / RADIUS;
          const influence = 1 - t * t * (3 - 2 * t);

          // Never draw below the cloud, or a resting dot would poke out from
          // under its own highlight at the edge of the radius.
          const size = Math.max(base, base + (maxSize - base) * influence * strength);
          if (size <= base + 0.02) continue;

          const rad = size / 2;
          ctx.moveTo(x + rad, y);
          ctx.arc(x, y, rad, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const frame = () => {
      const now = performance.now();
      const t = (now - start) / 1000;

      if (!reduced && now - lastCloud >= CLOUD_MS) {
        lastCloud = now;
        drawCloud(t);
      }

      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      strength += (targetStrength - strength) * EASE;

      paint();

      // With the cloud drifting there is always something to draw, so the loop
      // only yields when the section is off screen or motion is unwanted.
      if (!visible || reduced) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      tx = e.clientX - box.left;
      ty = e.clientY - box.top;
      if (cx < -9000) {
        cx = tx;
        cy = ty;
      }
      targetStrength = 1;
    };

    const onPointerLeave = () => {
      targetStrength = 0;
    };

    const onResize = () => {
      build();
      drawCloud((performance.now() - start) / 1000);
      paint();
    };

    build();
    drawCloud(0);
    paint();

    if (!reduced && fine) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }
    window.addEventListener("resize", onResize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) kick();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    canvas.style.opacity = "1";
    if (!reduced) kick();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700"
    />
  );
}

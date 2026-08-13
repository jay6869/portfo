"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES, THEME_EVENT, applyTheme, readTheme } from "@/lib/theme";

/**
 * Fixed telemetry bar.
 *
 * Scroll progress, cursor position, the section currently in view, and the
 * accent switch.
 *
 * The numeric readouts are written straight to the DOM inside one rAF loop
 * rather than held in React state. Cursor and scroll both fire far faster than
 * 60Hz, and putting them through state would re-render this bar — and its
 * subtree — on every pointer move for the sake of two text nodes.
 */
export function Hud() {
  const scrlRef = useRef<HTMLSpanElement>(null);
  const crsrRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const [section, setSection] = useState("00 — INDEX");
  const [accent, setAccent] = useState(THEMES[0].hex);

  // Adopt whatever the pre-paint script already applied, so the swatch agrees
  // with the page instead of flashing the default.
  useEffect(() => {
    setAccent(readTheme());
    const onChange = (e: Event) => setAccent((e as CustomEvent<string>).detail);
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  useEffect(() => {
    const pointer = { x: 0, y: 0 };
    let raf = 0;
    let lastScrl = "";
    let lastCrsr = "";

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const frame = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

      const scrl = p.toFixed(2);
      if (scrl !== lastScrl && scrlRef.current) {
        scrlRef.current.textContent = scrl;
        lastScrl = scrl;
      }

      // Formatted as the reference does: integer X, fractional Y.
      const crsr = `${Math.round(pointer.x)}.${Math.round(pointer.y)}`;
      if (crsr !== lastCrsr && crsrRef.current) {
        crsrRef.current.textContent = crsr;
        lastCrsr = crsr;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  // Section readout. Whichever labelled band covers the viewport middle wins.
  useEffect(() => {
    const marked = Array.from(document.querySelectorAll<HTMLElement>("[data-hud]"));
    if (!marked.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSection(entry.target.getAttribute("data-hud") || "");
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    marked.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Local wall clock with UTC offset, matching the reference's format.
  useEffect(() => {
    const tick = () => {
      if (!timeRef.current) return;
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      const off = -d.getTimezoneOffset() / 60;
      const sign = off >= 0 ? "+" : "−";
      const offStr = `${sign}${String(Math.abs(off)).padStart(2, "0")}`;
      timeRef.current.textContent = `${hh}:${mm}:${ss} ${offStr}`;
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const cycle = () => {
    const i = THEMES.findIndex((t) => t.hex.toLowerCase() === accent.toLowerCase());
    applyTheme(THEMES[(i + 1) % THEMES.length].hex);
  };

  const current = THEMES.find((t) => t.hex.toLowerCase() === accent.toLowerCase());

  return (
    <div className="hud" role="status" aria-live="off">
      <div className="hud-side">
        <span className="hud-pair">
          <span className="hud-key">Scrl</span>
          <span ref={scrlRef} className="hud-val tabular-nums">
            0.00
          </span>
        </span>
        <span className="hud-pair">
          <span className="hud-key">Crsr</span>
          <span ref={crsrRef} className="hud-val tabular-nums">
            0.0
          </span>
        </span>
      </div>

      <span className="hud-center">{section}</span>

      <div className="hud-side hud-side--end">
        <button
          type="button"
          onClick={cycle}
          className="hud-theme"
          aria-label={`Accent colour: ${current?.name ?? accent}. Activate to change.`}
        >
          <span className="hud-key">Theme</span>
          <span className="hud-swatch" style={{ background: accent }} aria-hidden />
          <span className="hud-val tabular-nums">{accent.toUpperCase()}</span>
        </button>
        <span ref={timeRef} className="hud-val tabular-nums hidden sm:inline" />
      </div>
    </div>
  );
}

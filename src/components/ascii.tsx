"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ---------- Banners ---------- */

// 3D / "Isometric" — "JANITH" (top line)
export const ASCII_JANITH = String.raw`    ___  ________  ________   ___  _________  ___  ___
   |\  \|\   __  \|\   ___  \|\  \|\___   ___\\  \|\  \
   \ \  \ \  \|\  \ \  \\ \  \ \  \|___ \  \_\ \  \\\  \
 __ \ \  \ \   __  \ \  \\ \  \ \  \   \ \  \ \ \   __  \
|\  \\_\  \ \  \ \  \ \  \\ \  \ \  \   \ \  \ \ \  \ \  \
\ \________\ \__\ \__\ \__\\ \__\ \__\   \ \__\ \ \__\ \__\
 \|________|\|__|\|__|\|__| \|__|\|__|    \|__|  \|__|\|__|`;

// 3D / "Isometric" — "GODAGE" (bottom line)
export const ASCII_GODAGE = String.raw` ________  ________  ________  ________  ________  _______
|\   ____\|\   __  \|\   ___ \|\   __  \|\   ____\|\  ___ \
\ \  \___|\ \  \|\  \ \  \_|\ \ \  \|\  \ \  \___|\ \   __/|
 \ \  \  __\ \  \\\  \ \  \ \\ \ \   __  \ \  \  __\ \  \_|/__
  \ \  \|\  \ \  \\\  \ \  \_\\ \ \  \ \  \ \  \|\  \ \  \_|\ \
   \ \_______\ \_______\ \_______\ \__\ \__\ \_______\ \_______\
    \|_______|\|_______|\|_______|\|__|\|__|\|_______|\|_______|`;

export const ASCII_404 = String.raw`  _  _    ___  _  _
 | || |  / _ \| || |
 | || |_| | | | || |_
 |__   _| | | |__   _|
    | | | |_| |  | |
    |_|  \___/   |_|`;

/**
 * Reveal an ASCII art block line-by-line with a soft glow ramp.
 * SR-only label provides a real h1 for accessibility/SEO.
 */
export function AsciiBanner({
  art,
  label,
  className = "",
  glow = true,
}: {
  art: string;
  label?: string;
  className?: string;
  glow?: boolean;
}) {
  const reduced = useReducedMotion();
  const lines = art.split("\n");
  return (
    <div className={`relative ${className}`} aria-hidden={!!label}>
      {label && <span className="sr-only">{label}</span>}
      <pre
        className="mono whitespace-pre overflow-x-auto text-[7px] leading-[1.05] xs:text-[8px] sm:text-[10px] md:text-[12px] lg:text-[13px]"
        style={
          glow
            ? {
                color: "var(--signal)",
                textShadow:
                  "0 0 14px color-mix(in oklab, var(--signal) 45%, transparent)",
              }
            : undefined
        }
      >
        {lines.map((line, i) => (
          <motion.span
            key={i}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: reduced ? 0 : 0.05 * i,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            style={{ display: "block" }}
          >
            {line || " "}
          </motion.span>
        ))}
      </pre>
    </div>
  );
}

/* ---------- Section divider ---------- */
export function AsciiDivider({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`mono pointer-events-none flex select-none items-center gap-3 text-[10px] tracking-widest text-muted-foreground/70 ${className}`}
      aria-hidden="true"
    >
      <span className="text-[color:var(--signal)]/60">┌─</span>
      <span className="flex-1 overflow-hidden whitespace-nowrap text-[color:var(--signal)]/30">
        ─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·
      </span>
      {label && (
        <span className="px-2 text-[color:var(--signal)]/80">
          [ {label} ]
        </span>
      )}
      <span className="flex-1 overflow-hidden whitespace-nowrap text-[color:var(--signal)]/30">
        ─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·
      </span>
      <span className="text-[color:var(--signal)]/60">─┐</span>
    </div>
  );
}

/* ---------- Scramble / decode word animation ----------
 * Cycles through words. Each transition scrambles random
 * characters before settling — like a decode/decrypt effect.
 */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#abcdef0123456789";

export function ScrambleText({
  words,
  className = "",
  interval = 2400,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [output, setOutput] = useState(words[0] ?? "");
  useEffect(() => {
    if (reduced) {
      setOutput(words[index] ?? "");
      const t = setTimeout(
        () => setIndex((i) => (i + 1) % words.length),
        interval,
      );
      return () => clearTimeout(t);
    }
    const from = output;
    const to = words[index] ?? "";
    const length = Math.max(from.length, to.length);
    const queue: { from: string; to: string; start: number; end: number }[] =
      [];
    for (let i = 0; i < length; i++) {
      const f = from[i] ?? "";
      const t = to[i] ?? "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18) + 8;
      queue.push({ from: f, to: t, start, end });
    }
    let frame = 0;
    let raf = 0;
    const step = () => {
      let str = "";
      let done = 0;
      for (let i = 0; i < queue.length; i++) {
        const { from: f, to: t, start, end } = queue[i];
        if (frame >= end) {
          done++;
          str += t;
        } else if (frame >= start) {
          str +=
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          str += f;
        }
      }
      setOutput(str);
      if (done < queue.length) {
        frame++;
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    const next = setTimeout(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(next);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reduced]);
  return (
    <span className={`mono ${className}`}>
      <span className="text-muted-foreground/60">[</span>
      <span className="signal-text px-1">{output}</span>
      <span className="text-muted-foreground/60">]</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

/* ---------- Tiny ASCII signature box (footer / hero / 404) ---------- */
export function AsciiSignature({ className = "" }: { className?: string }) {
  return (
    <pre
      aria-hidden="true"
      className={`mono select-none whitespace-pre text-[10px] leading-tight text-[color:var(--signal)]/70 ${className}`}
    >
      {String.raw`╔══════════════════════════════════════════╗
║  > janith.godage // offensive security   ║
║  > sliit · sri lanka · gmt+5:30          ║
╚══════════════════════════════════════════╝`}
    </pre>
  );
}

"use client";

import { useRef } from "react";
import { useMarqueeMotion } from "./marquee-motion";
import { TOOL_MARKS, TOOL_BAND } from "@/lib/tool-marks";

/**
 * The toolchain strip: a light band cut into the dark page.
 *
 * The inversion is the point. Everything else on this site sits on #121212, so
 * a single paper-coloured band reads as a different surface entirely — the one
 * place the page opens up — and it lets the brand marks render the way their
 * owners intend, as dark artwork on light, instead of being knocked out white.
 *
 * Content comes from TOOL_MARKS itself, so the band can only ever contain
 * tools that publish an official mark. Everything in the stack without one —
 * sqlmap, ffuf, Nmap, Ghidra, VSCode — is absent by construction rather than
 * by a filter someone has to remember to keep in sync.
 *
 * Travel is slower than the display band below it, so the two never look like
 * the same object moving at two speeds.
 */
export function ToolMarquee({ note }: { note: string }) {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tools = TOOL_BAND;

  // scrollFactor 0: this band is deliberately deaf to the scroll. It keeps one
  // unvarying pace while the display bands react, so the page has a constant
  // to read the scroll-driven motion against instead of everything surging at
  // once.
  useMarqueeMotion(wrapRef, trackRef, { speed: 34, scrollFactor: 0 });

  return (
    <section ref={wrapRef} className="tool-band" aria-label="Toolchain">
      <p className="tool-band-note">{note}</p>

      <div className="tool-band-viewport">
        <div ref={trackRef} className="tool-band-track">
          {/* Two identical passes: the wrap distance is half the track. */}
          {[0, 1].map((pass) =>
            tools.map((tool) => (
              <span
                key={`${pass}-${tool}`}
                className="tool-item"
                aria-hidden={pass === 1 ? "true" : undefined}
              >
                {/* Unconditional: TOOL_BAND is the key set of TOOL_MARKS, so
                    a mark is guaranteed for every entry. */}
                <svg
                  className="tool-mark"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d={TOOL_MARKS[tool]} />
                </svg>
                <span className="tool-name">{tool}</span>
                {/* Every item carries a trailing separator, including the last.
                    Skipping it there would leave the join between the two
                    passes narrower than every other gap — a visible hitch
                    arriving once per loop, exactly at the wrap. */}
                <span className="tool-sep" aria-hidden />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}

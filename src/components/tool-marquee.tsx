"use client";

import { useRef } from "react";
import { useMarqueeMotion } from "./marquee-motion";
import { TOOL_LOGOS } from "@/lib/tool-marks";

/**
 * The toolchain strip: a light band cut into the dark page.
 *
 * The inversion is the point. Everything else on this site sits on the dark
 * ground, so a single paper-coloured band reads as a different surface
 * entirely — the one place the page opens up — and the official logos render
 * as dark artwork on light, in one charcoal ink. See lib/tool-marks for where
 * each logo comes from.
 *
 * Travel is slower than the display band below it, so the two never look like
 * the same object moving at two speeds.
 */
export function ToolMarquee({ note }: { note: string }) {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
            TOOL_LOGOS.map((tool) => (
              <span
                key={`${pass}-${tool.name}`}
                className="tool-item"
                style={{ "--logo-scale": tool.scale } as React.CSSProperties}
                aria-hidden={pass === 1 ? "true" : undefined}
              >
                {/* Plain <img>: these are static SVGs, which next/image would
                    pass through unoptimised anyway. The name is the alt text
                    unless it is also set as a word beside the mark. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.src}
                  alt={tool.word ? "" : tool.name}
                  width={tool.w}
                  height={tool.h}
                  className="tool-logo"
                  decoding="async"
                  draggable={false}
                />
                {tool.word && (
                  <span className={`tool-word ${tool.word.className}`}>{tool.word.text}</span>
                )}
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

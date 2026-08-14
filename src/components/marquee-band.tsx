"use client";

import { useRef } from "react";
import { useMarqueeMotion } from "./marquee-motion";

/**
 * A full-bleed section title that travels horizontally.
 *
 * The band breaks the page container deliberately: it runs off both edges and
 * is never meant to be read whole, so the repeats read as a strip passing
 * through rather than as a phrase with a beginning and an end.
 *
 * It drifts on its own and surges when the page scrolls — see marquee-motion.
 * The set of repeats is rendered twice so the loop can wrap on exactly half the
 * track width with no seam.
 *
 * Only the very first repeat is real text; every other is aria-hidden, so the
 * heading is announced once however many times it is drawn.
 */

/** Total character advance a band aims for, so short and long titles travel at
 *  a comparable speed — travel is a percentage of track width, so a short word
 *  with the same repeat count would sweep far slower. */
const TARGET_ADVANCE = 78;

export function MarqueeBand({
  text,
  motion = "scroll",
  className = "",
}: {
  text: string;
  /**
   * - `scroll` — still on a still page, travels only while the reader scrolls.
   *   The band becomes an instrument for the scroll rather than a loop running
   *   on its own, which is why four of the five use it.
   * - `drift`  — always travelling, and scroll pushes it faster. Reserved for
   *   the one band that should read as the page's moving part.
   */
  motion?: "scroll" | "drift";
  className?: string;
}) {
  const wrapRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);

  // These are px/second, and px/second means nothing without the type size.
  // This band sets at up to 304px, where a letter is roughly 200px wide — so
  // 900px/s, which sounds quick, is four letters a second and reads as a crawl.
  // Calibrated in letter-widths instead: a normal wheel moves the band about
  // five or six letters a second, a hard flick about twelve, and the cap keeps
  // a trackpad flick and a Page Down landing in the same place.
  useMarqueeMotion(wrapRef, trackRef, {
    speed: motion === "drift" ? 120 : 0,
    scrollFactor: motion === "drift" ? 0.85 : 1.3,
    scrollCap: motion === "drift" ? 1700 : 2600,
  });

  // Forced even: the solid/outline alternation has to survive the wrap, and an
  // odd count would put two solids side by side at the seam.
  const raw = Math.max(4, Math.round(TARGET_ADVANCE / text.length));
  const run = Array.from({ length: raw % 2 === 0 ? raw : raw + 1 });

  return (
    <h2
      ref={wrapRef}
      className={`display display-band scrub-marquee text-foreground ${className}`}
    >
      <span ref={trackRef} className="scrub-marquee-track">
        {/* Two identical passes: the wrap distance is half the track. */}
        {[0, 1].map((pass) =>
          run.map((_, i) => (
            <span
              key={`${pass}-${i}`}
              aria-hidden={pass === 0 && i === 0 ? undefined : "true"}
              className={
                i % 2 === 1
                  ? "scrub-marquee-item display-outline"
                  : "scrub-marquee-item"
              }
            >
              {text}
            </span>
          )),
        )}
      </span>
    </h2>
  );
}

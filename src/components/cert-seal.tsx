"use client";

import { useId } from "react";
import { ShieldCheck } from "lucide-react";

/**
 * A stamped seal, drawn in type.
 *
 * The credentials band had no visual identity of its own — it was a list that
 * happened to be about certificates. This is the thing a certificate actually
 * is: an issued mark. Text runs around a ring the way it does on a stamp, and
 * the mark is either struck (checkable, signal, shield in the centre) or blank
 * (held, muted, empty centre). The state is legible from across the room,
 * before a single word is read.
 *
 * Two details make it hold up:
 *
 * - `textLength` + `lengthAdjust="spacing"` force the ring text to fill the
 *   circumference exactly. Hand-tuning font-size against a path length is a
 *   guess that breaks the moment the font falls back to a different metric;
 *   this is exact by construction, in any face, at any size.
 * - Only the ring rotates. The shield stays upright — a mark whose centre
 *   spins reads as a loading spinner, which is the one thing this must not
 *   look like.
 *
 * Decorative: the row states "Verifiable" or "On file" in text, so the seal is
 * aria-hidden rather than duplicating that into the accessibility tree.
 */

// Circumference of the r=37 ring inside the 100-unit viewBox: 2πr = 232.478.
const RING_LENGTH = 232;

export function CertSeal({ checkable }: { checkable: boolean }) {
  // useId, not the array index: two seals sharing a path id would make every
  // ring after the first resolve its textPath against the wrong element.
  // Stripped to alphanumerics: useId's delimiters differ between React
  // versions (":r0:" then "«r0»"), and both need escaping inside the href
  // fragment that resolves this path.
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const ring = checkable
    ? "VERIFIED · CHECKABLE · VERIFIED · CHECKABLE · "
    : "ON FILE · NOT PUBLICLY LISTED · HELD · ";

  return (
    <span className={`seal ${checkable ? "seal--struck" : ""}`} aria-hidden>
      <svg className="seal-svg" viewBox="0 0 100 100" role="presentation">
        <defs>
          {/* Two arcs rather than a <circle>: a circle element cannot carry a
              textPath, and splitting the sweep keeps the start of the text at
              the top of the ring instead of the right edge. */}
          <path
            id={pathId}
            fill="none"
            d="M 50,13 a 37,37 0 1,1 0,74 a 37,37 0 1,1 0,-74"
          />
        </defs>

        <circle className="seal-edge" cx="50" cy="50" r="48" />
        <circle className="seal-edge seal-edge--inner" cx="50" cy="50" r="29" />

        <text className="seal-text">
          <textPath
            href={`#${pathId}`}
            textLength={RING_LENGTH}
            lengthAdjust="spacing"
          >
            {ring}
          </textPath>
        </text>
      </svg>

      {checkable && <ShieldCheck className="seal-mark" />}
    </span>
  );
}

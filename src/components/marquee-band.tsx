/**
 * A full-bleed section title that scrubs horizontally with the scroll.
 *
 * The band breaks the page container deliberately: it runs off both edges and
 * is never meant to be read whole, so the repeats read as a strip passing
 * through rather than as a phrase with a beginning and an end.
 *
 * Motion is driven by ScrollChoreography, which finds the track by its
 * `data-scrub-marquee` attribute — this stays a server component with no
 * client JS of its own.
 *
 * Only the first repeat is real text; the rest are aria-hidden, so the heading
 * is announced once however many times it is drawn.
 */

/** Total character advance a band aims for, so short and long titles travel at
 *  a comparable speed — travel is a percentage of track width, so a short word
 *  with the same repeat count would sweep far slower. */
const TARGET_ADVANCE = 78;

export function MarqueeBand({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const repeats = Math.max(4, Math.round(TARGET_ADVANCE / text.length));

  return (
    <h2 className={`display display-band scrub-marquee text-foreground ${className}`}>
      <span data-scrub-marquee className="scrub-marquee-track">
        <span className="scrub-marquee-item">{text}</span>
        {Array.from({ length: repeats - 1 }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={
              i % 2 === 0
                ? "scrub-marquee-item display-outline"
                : "scrub-marquee-item"
            }
          >
            {text}
          </span>
        ))}
      </span>
    </h2>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download } from "lucide-react";

/**
 * The CV download, with an acknowledgement.
 *
 * This is the single action the whole site is built to produce, and it happened
 * in complete silence: the browser writes a file into a download shelf the
 * visitor may never look at, and the page gave no sign anything occurred. The
 * contact form — a smaller moment — confirmed itself. This one did not.
 *
 * Three rules the confirmation obeys:
 *
 * - The anchor stays a real `<a download>`. The file is reachable with
 *   scripting off, and the acknowledgement is purely additive.
 * - Nothing is faked. The byte count is measured off disk at build time, and
 *   the message says the transfer STARTED — that is all a native download
 *   reports. "Complete" would be a guess, and wrong on a slow connection.
 * - The meta line is useful before the click, not only after: knowing it is a
 *   27 KB PDF is worth something to a recruiter deciding whether to open it on
 *   mobile data.
 */
export function CvDownload({
  href,
  filename,
  size,
  className = "",
  ...rest
}: {
  href: string;
  filename: string;
  size: string | null;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const [taken, setTaken] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const acknowledge = () => {
    setTaken(true);
    window.clearTimeout(timer.current);
    // Long enough to read and glance at the browser's download shelf, short
    // enough that the control is back to its job before a second visit.
    timer.current = window.setTimeout(() => setTaken(false), 5000);
  };

  return (
    <span className={`cv-dl ${className}`} {...rest}>
      <a
        href={href}
        download={filename}
        onClick={acknowledge}
        className="label group inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-3 text-black transition-shadow hover:shadow-[0_0_34px_-6px_var(--signal)]"
      >
        {taken ? (
          <Check className="cv-dl-check size-3.5" aria-hidden />
        ) : (
          <Download
            className="size-3.5 transition-transform group-hover:translate-y-0.5"
            aria-hidden
          />
        )}
        {taken ? "Transfer started" : "Download CV"}
      </a>

      {/* Always mounted so assistive tech observes the region rather than
          having it appear mid-announcement and get missed. */}
      <span role="status" aria-live="polite" className="label cv-dl-meta">
        {taken ? "Check your downloads" : size ? `pdf · ${size}` : "pdf"}
      </span>
    </span>
  );
}

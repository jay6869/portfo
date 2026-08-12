"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";

declare global {
  interface Window {
    __revealFailsafe?: ReturnType<typeof setTimeout>;
  }
}

// reducedMotion="user" makes every framer-motion animation honor the OS
// prefers-reduced-motion setting (transform/opacity animations are reduced to
// instant). This covers page transitions, card reveals, filter grids, and the
// mobile menu — none of which the CSS-only reduced-motion block can stop, since
// framer-motion animates via JS, not CSS transitions.
export function Providers({ children }: { children: ReactNode }) {
  // Reaching this effect proves the bundle hydrated, so framer-motion will
  // reveal the SSR'd opacity:0 content itself. Cancel the layout's failsafe
  // before it can stamp `.js-failed` onto a perfectly healthy page.
  useEffect(() => {
    if (window.__revealFailsafe) {
      clearTimeout(window.__revealFailsafe);
      window.__revealFailsafe = undefined;
    }
    document.documentElement.classList.remove("js-failed");
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

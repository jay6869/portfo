"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// reducedMotion="user" makes every framer-motion animation honor the OS
// prefers-reduced-motion setting (transform/opacity animations are reduced to
// instant). This covers page transitions, card reveals, filter grids, and the
// mobile menu — none of which the CSS-only reduced-motion block can stop, since
// framer-motion animates via JS, not CSS transitions.
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

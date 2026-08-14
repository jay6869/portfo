"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cross-route morphing via the View Transitions API.
 *
 * Replaces the framer-motion PageTransition this file supersedes. That one
 * faded the whole page out and the next one in, with `mode="wait"` holding the
 * new route back until the exit finished — a quarter-second of nothing between
 * every click. It also wrapped ALL page content in a motion.div whose `initial`
 * state serialized into the SSR markup as opacity:0, which is the single
 * biggest reason this codebase needs a hydration failsafe at all. Removing it
 * takes the wrapper off every route.
 *
 * What replaces it: a real shared-element transition. Click a project row and
 * the row's title IS the detail page's heading — one element that travels and
 * resizes, with the rest of the page cross-fading underneath it.
 *
 * ── How it works ──────────────────────────────────────────────────────────
 *
 * One delegated listener in the CAPTURE phase. Capture matters: next/link
 * attaches its own click handler to the anchor, and a bubble-phase listener
 * would run after the router had already navigated, so the transition would
 * capture a DOM that had moved on. Catching the click on the way down lets us
 * stop it before Link ever sees it.
 *
 * startViewTransition needs to know when the new DOM is committed. React's
 * router.push gives no such signal, so the callback returns a promise that is
 * resolved from a layout effect on the next pathname — after commit, before
 * paint, which is exactly when the browser should snapshot the new state.
 *
 * ── What it refuses to touch ──────────────────────────────────────────────
 *
 * Downloads (the CV), new tabs, external origins, mailto:/tel:, hash links on
 * the current page, and modified clicks all fall through to the browser
 * untouched. So does any browser without the API, and any visitor who asked
 * for reduced motion — in both cases the site navigates exactly as it does
 * today. The morph is additive, never load-bearing.
 */

// The commit signal has to fire after the DOM is updated but before paint, or
// the new route paints once on its own and then again inside the transition.
// That is useLayoutEffect's slot — but calling it during SSR earns a React
// warning, and this component is server-rendered like every client component.
const useCommitEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Chrome shipped this in 111; the type is not in this project's lib target.
type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

export function ViewTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Set while a transition is waiting for the router; called once the new
  // route has committed.
  const commit = useRef<(() => void) | null>(null);
  // The element whose name was borrowed for the morph, so it can be released.
  const morphed = useRef<HTMLElement | null>(null);

  useCommitEffect(() => {
    commit.current?.();
    commit.current = null;
  }, [pathname]);

  useEffect(() => {
    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      // Left button, unmodified only — everything else is the user asking for
      // a new tab or a context menu, and hijacking that is hostile.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.dataset.noVt !== undefined) return;
      if (anchor.origin !== window.location.origin) return;
      if (anchor.protocol !== "http:" && anchor.protocol !== "https:") return;
      // Same-document jumps (#contact) never change the pathname, so the
      // commit promise would never resolve and the transition would hang.
      if (anchor.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();

      // The morph target is named only for the duration of the transition.
      // Naming every row up front would pull each one out of the root
      // snapshot as its own group, and the rows that were not clicked would
      // animate away independently — a page full of departing headlines.
      const source = anchor.querySelector<HTMLElement>("[data-vt-name]");
      const name = source?.dataset.vtName;
      if (source && name) {
        source.style.viewTransitionName = name;
        morphed.current = source;
      }

      const href = anchor.pathname + anchor.search + anchor.hash;

      const transition = doc.startViewTransition!(
        () =>
          new Promise<void>((resolve) => {
            // Safety net: if the route never commits, release the transition
            // rather than leaving the page frozen under a snapshot.
            const bail = window.setTimeout(resolve, 2000);
            commit.current = () => {
              window.clearTimeout(bail);
              resolve();
            };
            router.push(href);
          }),
      );

      transition.finished.finally(() => {
        if (morphed.current) {
          morphed.current.style.viewTransitionName = "";
          morphed.current = null;
        }
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return <>{children}</>;
}

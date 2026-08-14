"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The page's one orchestrated motion pass.
 *
 * Everything animates with gsap.from(), which writes its start state at runtime.
 * Nothing ships as opacity:0 in the SSR markup, so the page is complete and
 * readable with this component inert — the constraint the whole codebase is
 * built around.
 */
export function ScrollChoreography({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero: the lettering rises out of the graph behind it.
      gsap.from("[data-hero-line]", {
        yPercent: 108,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.09,
        delay: 0.15,
      });
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.7,
      });

      // The hero lettering drifts up and dims as the page scrolls past it.
      gsap.to("[data-hero-parallax]", {
        yPercent: -26,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Marquee bands used to be scrubbed from here — position tied directly to
      // scroll, which meant they stood still on a static page. They now run
      // their own momentum loop (see marquee-motion.ts), so writing transform
      // on those tracks from GSAP as well would put two owners on one property.

      // Section titles wipe up from behind their own baseline.
      gsap.utils.toArray<HTMLElement>("[data-reveal-title]").forEach((el) => {
        gsap.from(el, {
          yPercent: 100,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Rows arrive in sequence, like results landing.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(group.querySelectorAll("[data-reveal-item]"), {
          opacity: 0,
          y: 26,
          duration: 0.72,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      // Credential seals turn with the scroll rather than spinning on a timer.
      // A continuous rotation would be decoration that never stops — and past
      // five seconds it would owe the visitor a pause control under WCAG 2.2.2.
      // Tied to scroll it is motion the reader is driving, and it stops the
      // instant they do. Only the ring moves; the shield in the centre is
      // outside this element and stays upright.
      gsap.utils.toArray<HTMLElement>("[data-seal] .seal-svg").forEach((seal) => {
        gsap.fromTo(
          seal,
          { rotate: -14 },
          {
            rotate: 14,
            ease: "none",
            scrollTrigger: {
              trigger: seal.closest("[data-seal]") ?? seal,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      // Foundation cards: the shared row reveal plus a touch of scale, so a
      // bordered card settles rather than simply sliding. Kept on its own hook
      // so the scale never leaks onto the plain list rows.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const cards = group.querySelectorAll("[data-card-reveal]");
        if (!cards.length) return;
        gsap.from(cards, {
          opacity: 0,
          y: 22,
          scale: 0.985,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });

      // Each row's dotted rule draws itself left-to-right as the row lands.
      // Animating the custom property lets a pseudo-element be driven from JS;
      // its CSS fallback is 1, so the rule is simply present without this.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const rows = group.querySelectorAll<HTMLElement>(".about-row, .glitch-row");
        if (!rows.length) return;
        gsap.fromTo(
          rows,
          { "--rule-x": 0 },
          {
            "--rule-x": 1,
            duration: 0.75,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}

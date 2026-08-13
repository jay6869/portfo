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

      // Scrubbed marquee bands: the track's horizontal position is tied to the
      // section's passage through the viewport, so the type moves only while
      // the reader is scrolling. `scrub` smooths it over 0.5s so a flicked
      // wheel glides rather than snapping.
      gsap.utils.toArray<HTMLElement>("[data-scrub-marquee]").forEach((track) => {
        const section = track.closest("section") ?? track;
        // Starts already offset so the band is cut off at BOTH edges from the
        // first frame — it should read as a strip passing through, never as a
        // phrase that begins at the left margin. The end value keeps the last
        // repeat on screen at the widest viewport, so no gap can open up.
        gsap.fromTo(
          track,
          { xPercent: -8 },
          {
            xPercent: -46,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });

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

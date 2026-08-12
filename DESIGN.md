# Design

<!-- impeccable:design-schema 1 -->

Recorded from the built world after the JANITH(1) build (seed `6c87b2b6`). This
describes what ships, not what was intended.

## Visual World

An attack surface being mapped, with the name at architectural scale on top of
it. The home surface opens on a full-viewport Three.js node/edge graph carrying
a scan pulse, overlaid with the name set enormous in monospace — one line solid,
one outlined in stroke. Below it the page runs as full-bleed rows separated by
hairlines, each scan-wiping on hover, with a continuously scrolling toolchain
band between movements.

The identity is binding (see PRODUCT.md, Brand Commitments). Redesigns evolve
this world; they do not replace it.

**The governing move is scale contrast inside one voice.** Everything is
JetBrains Mono. Display type runs at up to `14.5vw` with `-0.055em` tracking;
supporting type runs at `10.5px` with `0.24em` tracking, uppercase. The distance
between those two registers is the art direction — a previous iteration set the
entire page at one 13.5px size and read as a terminal dump rather than a
designed surface. Never flatten the scale range.

## Color

Single dark theme, no light variant. `color-scheme: dark` is declared and the
`dark` class is fixed on `<html>`.

| Token | Value | Role |
|---|---|---|
| `--background` | `#121212` | Page ground |
| `--surface` | `#191919` | Raised panels, code, cards |
| `--surface-2` | `#1f1f1f` | Panel chrome, title bars |
| `--card` | `#171717` | Chips, inline code |
| `--foreground` | `oklch(0.95 0.005 180)` | Body text — 16.2:1 |
| `--muted-foreground` | `oklch(0.68 0.01 180)` | Secondary text — 6.5:1 |
| `--signal` | `oklch(0.88 0.22 155)` | The one accent — 14.0:1 |
| `--warn` | `oklch(0.78 0.17 75)` | Warnings — 8.6:1 on surface |
| `--info` | `oklch(0.78 0.13 220)` | Info — 9.1:1 on surface |
| `--destructive` | `oklch(0.66 0.22 25)` | Errors — 5.1:1 on surface |
| `--border` | `oklch(1 0 0 / 0.08)` | Hairlines |

The ground is `#121212`, not pure black. **The elevation ramp moves with it** —
raising the background without raising `--surface` would leave panels reading
*darker* than the page they sit on. Every step above the ground is defined
relative to it, so a future change to `--background` must carry the whole ramp.

Raising the ground also lowers every contrast ratio. `--destructive` had to move
from `0.62` to `0.66` lightness to stay above AA (it fell to 4.33:1). Re-measure
after any ground change rather than assuming the ratios hold.

Strategy is **Restrained**: near-black ground, one saturated signal green. The
accent carries emphasis, state, and wayfinding — never decoration. Ratios above
are measured, not estimated; keep every text pairing at or above 4.5:1.

**Never stack `opacity-*` on `--muted-foreground` for text.** The token alone is
6.9:1; at `opacity-60` it computes to 3.12:1 and fails AA. Opacity is for
hover-reveal affordances, not for dimming type.

## Typography

| Family | Variable | Use |
|---|---|---|
| JetBrains Mono | `--font-mono` | The whole home surface: display type, labels, commands, metadata |
| Space Grotesk | `--font-display` | `h1`–`h4` on interior routes |
| Inter | `--font-sans` | Body copy |

Monospace is the medium, not a costume — the subject is commands, tooling, and
scan output, and the display type earns its scale rather than signalling
"technical" at body size.

| Utility | Size | Tracking | Use |
|---|---|---|---|
| `.display-hero` | `clamp(3.1rem, 14.5vw, 15rem)` | `-0.055em` | The name only |
| `.display-section` | `clamp(2.1rem, 7.5vw, 5.5rem)` | `-0.055em` | Section titles |
| `.display` (inline) | `clamp(1.15rem, 4.6vw, 3.4rem)` | `-0.055em` | Row titles |
| `.label` | `10.5px` | `0.24em` | Every label, index, meta line |

`.display-outline` is the hollow counterpart to the solid display line, and the
only effect the display type carries. Its stroke is **em-based**
(`max(1.2px, 0.016em)`, signal at 95%) so it stays proportional across the
hero's fluid range — a fixed `1px` read as a hairline against 240px lettering
and effectively vanished. A 12% signal fill gives the letterform a body, and
`paint-order: stroke fill` keeps the stroke outside the glyph rather than eating
half its weight inward. Any future outlined type scales its stroke the same way.

**No glow on text.** Type is never given a `text-shadow`; scale, weight, and the
outline stroke carry the emphasis on their own. Glow belongs to elements —
button surfaces, the nav status dot, the row scan-line, panel borders — where it
reads as emitted light rather than as blurred lettering.

Interior headings carry `-0.02em` tracking. Form inputs are `16px` on mobile and
`14px` from `640px` — under 16px, iOS Safari force-zooms on focus.

## Layout & Spacing

Home runs full-bleed inside `max-w-[1600px]` at `px-5` / `sm:px-8`, with
`.band` (`clamp(5rem, 13vw, 11rem)` block padding) setting the scroll rhythm
between movements. Interior routes use `max-w-6xl` for indexes, `max-w-4xl` for
about, `max-w-3xl` for project detail, and `max-w-2xl` for writeups. Radius base
is `0.5rem`.

Every route opens with `SectionHeading`, which sets its title in
`.display-section` — the same register as the home surface — so a visitor moving
from the homepage into an index does not cross into a different design. It takes
`as="h2"` for a second heading on the same page; it has **no eyebrow slot**, and
must not regain one.

## Components

- `.row-link` — the primary content unit. A full-bleed row on a hairline rule
  that, on hover or focus, washes a left-weighted signal gradient across itself,
  wipes a glowing 1px scan line along its base, and slides its title right while
  turning it signal green. Projects and writeups both use it; it replaces cards
  entirely.
- `.marquee` — the toolchain as a continuously scrolling band at 44s per cycle,
  paused on hover, frozen under reduced motion. Duplicated once for a seamless
  loop; the accessible copy is a single `sr-only` list.
- `SynopsisCommand` / `.cta-cv` — the CV download as a terminal command that
  types itself behind a caret on first view, with a copy control. Composed so
  the command is the loud element: an oversized signal `$` and the command at
  `1.02rem`, with download and copy demoted to a footer row beneath a hairline.
  This is the conversion element; treat it as signature material, never as a
  generic button.
- `.hero-veil` — radial + linear vignette that keeps the lettering legible over
  whatever the graph is doing behind it.
- `chip`, `kbd`, `hairline`, `hover-lift`, `signal-border`, `scanlines` —
  interior-route utilities carried over unchanged.

Icons come from `lucide-react` at consistent stroke. Unicode glyphs never stand
in for an icon.

## Motion

One orchestrated pass, `expo.out` throughout, all of it GSAP + ScrollTrigger:

- Hero lettering rises from behind its own overflow mask, line by line.
- Hero content parallaxes up and dims to 12% as the page scrolls past it.
- Section titles wipe up from their baseline, once each.
- Rows arrive in staggered sequence, like results landing.
- `DecodeText` resolves strings out of noise; the CV command types itself.

**Reveals must use `gsap.from()`, never `gsap.set()` or CSS.** `from()` writes
its start state at runtime, so nothing ships as `opacity:0` in the SSR markup.
This is load-bearing: the site once rendered 42 elements at `opacity:0` and went
blank without JavaScript. The homepage now ships 3, all covered by the failsafe.

`prefers-reduced-motion` is honored in five places — a global CSS block,
`MotionConfig reducedMotion="user"` for framer-motion on interior routes, and
explicit guards in the choreography, the hero graph, and the decode/type effects.

## The hero graph

`HeroNetwork` (Three.js) is a node/edge topology on a jittered fibonacci sphere:
hosts as additive round points, discovered links as lines, and a scan pulse
expanding from the origin every 8 seconds that lights nodes as it reaches them
and decays behind. It is the picture of the subject — a network being mapped —
not ambience.

Three performance tiers by viewport and `hardwareConcurrency`: 90 / 150 / 230
nodes, DPR capped at 1.5 or 2, antialias off on the low tier. Reduced motion
renders one composed still rather than removing the graph. Paused while the tab
is hidden; disposed fully on unmount; falls through to the CSS ground if WebGL
throws.

**Three.js is loaded via `next/dynamic` with `ssr: false`.** It must never enter
the initial bundle — the hero's lettering and CV command paint first, and the
graph fades in behind them. This keeps the homepage at 155 kB First Load instead
of 289 kB.

## Accessibility floor

WCAG AA is the established floor and is enforced, not aspired to:

- One unlayered `:focus-visible` ring in signal green for every interactive
  element, defined outside `@layer` so it beats layered utilities.
- Skip-to-content link.
- Interactive state is announced, never color-only: `aria-pressed` on filters,
  `aria-invalid` + `aria-describedby` + `role="alert"` on form fields,
  `role="status"` regions for send results, search counts, and copy feedback.
- Live regions are scoped to the newest message; never wrap a scrollback.
- Targets meet 24×24 CSS px (WCAG 2.2 SC 2.5.8).
- Decorative layers — the CRT canvas, prompt glyphs, carets — are `aria-hidden`.

## Non-negotiables

1. Content renders server-side and stays visible without JavaScript. The
   `<noscript>` reveal and the hydration failsafe in `app/layout.tsx` are safety
   nets, not licence to ship hidden content.
2. The Content-Security-Policy is strict and allowlisted per-origin. Any new
   script, font, image host, or analytics endpoint must be added explicitly or
   it fails silently in production.
3. Effects are gated by capability and motion preference, and degrade to
   nothing.
4. No placeholder frames standing in for assets that do not exist. There are no
   project screenshots and no photograph; compose for absence.
5. Claims stay checkable — public repos and credential URLs. No invented
   metrics, testimonials, or logos.

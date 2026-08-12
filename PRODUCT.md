# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — internship recruiters and hiring managers.** Security-team leads, technical
recruiters, and university placement contacts who arrive from a CV link, a LinkedIn profile, or
a referral. They are screening, not browsing: they spend roughly a minute deciding whether this
candidate is worth an interview slot, often on a phone, often with several other tabs open. They
are the conversion audience.

**Secondary — security practitioners.** Peers, researchers, students, and CTF players who arrive
from search, Reddit, or the RSS feed looking for one specific writeup or cheat sheet. They are
the audience that builds reputation and drives the traffic recruiters eventually encounter. They
read deeply, return, and share — but they are not the ones being converted.

The priority order is fixed: recruiters first, readers second. Where the two conflict, the
recruiter's 90-second scan wins, but never by hollowing out the technical depth that earns the
practitioners' attention in the first place.

## Product Purpose

A personal portfolio that turns Janith Godage's self-directed security work — offensive tooling,
lab writeups, and reference cheat sheets — into credible, checkable evidence of employability,
with the goal of landing a cybersecurity internship.

**Success is a CV download.** The PDF at `/janith-godage-cv.pdf` is the real handoff; the site is
the credibility wrapper that earns it, and follow-up happens off-site (email, LinkedIn). Every
surface is ultimately in service of a recruiter reaching that download convinced it is worth
opening.

## Positioning

A cybersecurity undergraduate who ships the full loop rather than one half of it: builds the
offensive tool, writes the honest walkthrough, then writes the detection logic that catches his
own exploit. The stated position is "breaking things ethically, then engineering the defenses" —
red, blue, or purple, with working code and public repos behind each claim.

The differentiator is verifiability. Where most student portfolios list tools and coursework,
this one points at public repositories, credential links, and long-form technical writing that
can be read and judged directly.

## Operating Context

- The dominant entry path is a link handed to someone, not organic discovery — CV, LinkedIn, or
  application form. First impressions frequently happen on mobile.
- Recruiters commonly evaluate in parallel with other candidates and rarely scroll a full page.
- Practitioners arrive deep-linked to a single writeup or cheat sheet and may never see the
  homepage. Shared links (LinkedIn, Twitter/X, Slack, Discord) are a real distribution surface.
- The site publishes an RSS feed at `/rss.xml` and a `.well-known/security.txt` inviting
  coordinated disclosure — visitors may probe the site itself, and its own security posture is
  read as part of the work sample.
- Content is authored as MDX files in `/content` (projects, writeups, cheatsheets) and rendered
  statically; publishing means adding a file and redeploying.

## Capabilities and Constraints

**Confirmed content and functionality**

- Routes: home, projects (+ detail), writeups (+ detail), cheatsheets (+ detail), about, contact,
  plus `sitemap.xml`, `robots.txt`, `rss.xml`, and a generated OpenGraph card.
- Current content inventory: 3 projects (ASPE, port-scanner, sec-misconfig-finder), 5 writeups,
  3 cheat sheets. Content volume is small and grows slowly — designs must look intentional at
  this scale, not sparse while waiting to fill up.
- Projects and writeups cross-link automatically via tag overlap.
- Client-side tag/domain filtering on the projects and writeups indexes.
- An interactive simulated shell on the about page (commands, history, tab completion).
- Contact form delivering through Pageclip, alongside direct email, GitHub, and LinkedIn links.

**Technical constraints**

- Next.js App Router with static generation; a strict Content-Security-Policy is set in
  `next.config.mjs`. Any third-party script, font, image host, or analytics endpoint must be
  added to the CSP explicitly or it will be silently blocked in production.
- Known defect at time of writing: the CSP does not allow `s.pageclip.co` or `send.pageclip.co`,
  so the contact form fails on every submission in production. The primary contact path is
  currently broken.
- No analytics or telemetry is installed. CV downloads — the defined success metric — are
  therefore not measured today.
- Deployed at `https://janithgodage.live`.

**Explicitly undecided**

- Whether analytics will be added (would require a CSP change and a privacy decision).
- Graduation date and internship availability window are not stated anywhere on the site.
- Academic standing is currently rendered as the vague string "gpa: solid"; the real figure is
  unconfirmed and should not be invented.

## Brand Commitments

- **Name and identity:** Janith Godage. Domain `janithgodage.live`.
- **Verified channels:** email `janithzgodage@gmail.com`, GitHub `github.com/jay6869`,
  LinkedIn `linkedin.com/in/janith-godage-6953s`.
- **Factual biography:** third-year BSc (Hons) Information Technology — Cybersecurity student at
  SLIIT, Sri Lanka. Based in Sri Lanka, GMT+5:30, remote-friendly. Speaks English and Sinhala.
- **Ethical posture:** the site invites coordinated disclosure, labels its simulated port scan as
  simulated, and carries responsible-disclosure callouts in offensive writeups. This restraint is
  part of the professional argument and must survive any redesign.
- **Visual identity (confirmed binding, 2026-08-12):** the terminal world — green signal on
  near-black, monospace command-line grammar, lowercase shell-inflected voice (`$ echo`,
  `ls ~/projects`) — is the brand. Redesigns evolve this world to a higher craft level; they do
  not replace it. Site structure, narrative order, and copy are free to change (user approved
  full restructure); the world is not.
- **Design red line (confirmed, 2026-08-12):** no style over substance. Motion, shaders, and
  interaction must carry domain meaning — signal, scanning, decoding, detection — or be cut.
  Decoration that could belong to any portfolio is failure.

## Evidence on Hand

**Real and usable**

- Public GitHub repositories — the primary external proof. Repos, commit history, and READMEs are
  presentable and can be surfaced or linked as verifiable evidence.
- Two verifiable credentials with public URLs: OPSWAT Academy "Introduction to CIP"
  (`learn.opswatacademy.com`) and AWS Educate "Introduction to Cloud 101" (Credly badge).
- A CV PDF at `public/janith-godage-cv.pdf` — the defined conversion asset.
- Substantive original long-form writing: 5 technical writeups and 3 cheat sheets in `/content`,
  plus detailed problem/approach/outcome records for 3 projects.

**Confirmed absent — must never be fabricated**

- **No project screenshots, demo recordings, or UI captures exist.** The project detail template
  currently renders empty placeholder boxes labelled "screenshot · 1" and "screenshot · 2"; these
  are stand-ins for assets that do not exist and must not be presented as real.
- **No photograph of the person exists**, and none is available for use.
- No testimonials, references, employers, client work, or press.
- No usage metrics, download counts, stars, benchmarks, or performance figures have been
  established. Numbers must come from a real source or not appear.
- No logos of employers, universities, or partners are cleared for use.

## Product Principles

1. **Recruiters first, readers second — without thinning the depth.** Every surface must pay off
   for someone who will not scroll and may be on a phone, while the long-form technical substance
   that earns practitioners' respect remains fully intact underneath.
2. **The CV download is the conversion.** It is the one action that defines success, and it should
   be reachable from anywhere a recruiter forms a positive impression — not parked on a single
   page or buried below the fold.
3. **Proof over claim.** Public repos and credential links are the only external evidence
   available, so anything assertable should be checkable. A tool list is a claim; a linked repo
   is proof.
4. **Design for absence, never for placeholders.** With no screenshots and no photo, layouts must
   be composed to look complete without imagery. Empty frames waiting on assets read as an
   abandoned site and cost more credibility than they hold space for.
5. **The site is itself a work sample.** For a security candidate, a blocked contact form, a
   broken banner, drifted content, or a failing contrast ratio is not cosmetic — it is
   counter-evidence. Correctness and craft on this site are part of the argument it makes.

## Accessibility & Inclusion

No standard was imposed by the user, but the incumbent codebase demonstrates a deliberate,
self-imposed WCAG AA target: contrast ratios are documented in comments and tuned against the
canvas, a single `:focus-visible` ring is enforced site-wide, `prefers-reduced-motion` is honored
in both CSS and JS animation, and a skip-to-content link is present. Treat AA as the established
floor and preserve these mechanisms; known gaps against it (notably low-contrast footer text and
form errors not wired to their inputs) are defects to fix, not precedent to follow.

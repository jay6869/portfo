import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Bug,
  Radar,
  MapPin,
  Crosshair,
  Flag,
  GraduationCap,
  ShieldCheck,
  Binary,
  Terminal,
} from "lucide-react";
import { HeroDither } from "@/components/hero-dither";
import { DecodeText } from "@/components/decode-text";
import { ScrollChoreography } from "@/components/scroll-choreography";
import { MarqueeBand } from "@/components/marquee-band";
import { ToolMarquee } from "@/components/tool-marquee";
import { ContactForm } from "@/components/contact-form";
import { TextGlitch } from "@/components/ui/text-glitch-effect";
import { AboutMedia } from "@/components/about-media";
import { CertSeal } from "@/components/cert-seal";
import { TextPressure } from "@/components/ui/text-pressure";
import { CvDownload } from "@/components/cv-download";
import { CV_HREF, CV_DOWNLOAD_NAME, CV_SIZE } from "@/lib/cv";
import { skillGroups, certs } from "@/lib/data";
import { getAllProjects, getAllWriteups } from "@/lib/posts";

/**
 * Decorative media for the About band.
 *
 * Drop a file into /public named `about-visual.*` — video (mp4/webm) or image
 * (jpg/png/webp/avif/gif) — and it appears automatically. Resolved against the
 * filesystem at build time rather than hardcoded, so a missing file renders
 * nothing instead of a broken frame; the column is composed to stand alone.
 *
 * Treated as decoration, not a portrait: empty alt, no location caption. It is
 * currently a flower clip, and captioning it as if it depicted the person
 * would be exactly the small dishonesty this site's argument rests on avoiding.
 * Video is rendered raw, with no filter or duotone.
 */
const ABOUT_MEDIA = (() => {
  try {
    const file = fs
      .readdirSync(path.join(process.cwd(), "public"))
      .find((f) => /^about-visual\.(mp4|webm|jpe?g|png|webp|avif|gif)$/i.test(f));
    if (!file) return undefined;
    return { file, video: /\.(mp4|webm)$/i.test(file) };
  } catch {
    return undefined;
  }
})();

/**
 * The verification identifier, read out of the credential URL itself.
 *
 * Never hand-written: the ID and the link it is printed beside come from one
 * string, so the page cannot display a number that does not resolve. Handles
 * the two shapes in use — a query parameter (`?id=…`) and a path segment,
 * where Credly appends `/public_url` after the badge's own identifier.
 */
function credentialId(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const fromQuery = u.searchParams.get("id");
    if (fromQuery) return fromQuery;
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts.at(-1);
    return (last === "public_url" ? parts.at(-2) : last) ?? null;
  } catch {
    return null;
  }
}

/** One icon per skill group, in the order they are declared in lib/data.
 *  Kept positional rather than keyed by name so adding a group cannot leave a
 *  row with no icon — it wraps instead. */
const COMPETENCY_ICONS = [Bug, Radar, ShieldCheck, Binary, Terminal] as const;

/** Section index and its trailing note, joined by a dotted rule. Every major
 *  band opens with one, so the numbers read as a spine down the page. */
function SectionMeta({
  index,
  children,
}: {
  index: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-5 flex max-w-[1600px] items-center gap-4 px-5 sm:px-8">
      <span className="label shrink-0 text-[color:var(--signal)]/70">{index}</span>
      <span className="dotted-rule min-w-6 flex-1" aria-hidden />
      {children}
    </div>
  );
}

/** A sub-heading with its rule underneath rather than beside it.
 *
 *  Running the rule inline next to a short label makes its length depend on the
 *  label's rendered width, so it re-flows at every breakpoint and drifts out of
 *  alignment with the rows below. Stacking it keeps the rule full-width and
 *  locked to the same edges as the record rows at any size. */
function LabelRule({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="label block text-[color:var(--signal)]/70">{children}</span>
      <span className="dotted-rule mt-2.5 block w-full" aria-hidden />
    </div>
  );
}

export const metadata: Metadata = {
  title: { absolute: "Janith Godage — Offensive Security & Tooling" },
  description:
    "Cybersecurity undergraduate building offensive security tooling — breaking things ethically, then engineering the defenses.",
  openGraph: {
    title: "Janith Godage — Offensive Security & Tooling",
    description: "Penetration testing, detection engineering, and security research.",
    url: "/",
  },
  alternates: { canonical: "/" },
};

export default function Home() {
  const projects = getAllProjects();
  const writeups = getAllWriteups();
  const earned = certs.filter((c) => c.status === "Complete");
  // Not every credential has a public verification URL, so the count states
  // both figures rather than claiming the whole set is checkable.
  const verifiable = earned.filter((c) => c.credentialUrl).length;

  return (
    <ScrollChoreography>
      {/* ═══ HERO ═══ */}
      <section
        data-hero
        data-hud="00 — INDEX"
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      >
        <HeroDither />
        <div className="hero-veil pointer-events-none absolute inset-0 z-10" aria-hidden />

        <div
          data-hero-parallax
          className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col justify-between px-5 pb-16 pt-28 sm:px-8 sm:pb-20"
        >
          {/* Top — the role. */}
          <div data-hero-fade>
            <p className="text-[clamp(1.1rem,2.1vw,1.75rem)] text-[color:var(--signal)]">
              Cybersecurity undergraduate
            </p>
            <p className="label mt-2.5">
              <DecodeText text="Penetration testing · SOC · Security analysis" />
            </p>
          </div>

          {/* Bottom — the name, then the standing facts. */}
          <div>
            <h1 className="display-hero">
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  <TextPressure text="Janith" variant="light" />
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  <TextPressure text="Godage" variant="solid" />
                </span>
              </span>
            </h1>

            <ul
              data-hero-fade
              className="mt-10 flex flex-wrap gap-x-9 gap-y-3"
            >
              {[
                "Web & network exploitation",
                "Detection engineering",
                "Sri Lanka · GMT+5:30",
              ].map((f) => (
                <li key={f} className="label flex items-center gap-2.5">
                  <span
                    className="size-1.5 shrink-0 bg-[color:var(--signal)]"
                    aria-hidden
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-hero-fade
          className="label absolute bottom-6 right-5 z-20 flex items-center gap-3 sm:right-8"
          aria-hidden
        >
          Scroll
          <span className="h-px w-10 bg-[color:var(--signal)]/50" />
        </div>
      </section>

      {/* ═══ TOOLCHAIN ═══ */}
      <ToolMarquee note="Some of the tools I work in" />

      {/* ═══ WORK ═══ */}
      <section className="band" data-hud="01 — WORK">
        {/* Meta row stays on the container grid; the band below breaks it. */}
        <SectionMeta index="01">
          <Link
            href="/projects"
            className="label group inline-flex shrink-0 items-center gap-2 transition-colors hover:text-[color:var(--signal)]"
          >
            All projects
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionMeta>

        {/* The only band that travels under its own power. The other four are
            scroll-driven, so this one reads as the page's moving part. */}
        <MarqueeBand text="Selected work" motion="drift" className="mb-14" />

        <div data-reveal-group className="row-stack mx-auto max-w-[1600px] px-5 sm:px-8">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              data-reveal-item
              className="row-link group"
            >
              <div className="row-body">
                <div className="row-meta label">
                  <span className="text-[color:var(--signal)]/70">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span>{p.type}</span>
                  <span>{p.stack.slice(0, 2).join(" · ")}</span>
                </div>

                <div className="min-w-0">
                  {/* Paired with the detail page's h1. The name is applied at
                      click time by ViewTransitions, not here — see that file. */}
                  <h3
                    data-vt-name={`rec-${p.slug}`}
                    className="row-title display display-lead text-foreground"
                  >
                    {p.title}
                  </h3>
                  <p className="row-desc text-sm leading-relaxed text-muted-foreground">
                    {p.oneLiner}
                  </p>
                </div>

                <span className="row-cta label text-[color:var(--signal)]">
                  Read
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ WRITING ═══ */}
      <section className="band" data-hud="02 — WRITEUPS">
        <SectionMeta index="02">
          <Link
            href="/writeups"
            className="label group inline-flex shrink-0 items-center gap-2 transition-colors hover:text-[color:var(--signal)]"
          >
            All writeups
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionMeta>

        <MarqueeBand text="From the lab" className="mb-14" />

        <div data-reveal-group className="row-stack mx-auto max-w-[1600px] px-5 sm:px-8">
          {writeups.slice(0, 4).map((w, i) => (
            <Link
              key={w.slug}
              href={`/writeups/${w.slug}`}
              data-reveal-item
              className="row-link group"
            >
              <div className="row-body">
                <div className="row-meta label">
                  <span className="text-[color:var(--signal)]/70">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <time dateTime={w.date}>{w.date}</time>
                  <span>{w.readingTime}</span>
                </div>

                <div className="min-w-0">
                  <h3
                    data-vt-name={`rec-${w.slug}`}
                    className="row-title display display-lead text-foreground"
                  >
                    {w.title}
                  </h3>
                  <p className="row-desc text-sm leading-relaxed text-muted-foreground">
                    {w.excerpt}
                  </p>
                </div>

                <span className="row-cta label text-[color:var(--signal)]">
                  Read
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CREDENTIALS ═══ */}
      <section className="band border-t border-border" data-hud="03 — VERIFIED">
        <SectionMeta index="03">
          <span className="label shrink-0">
            {earned.length} earned · {verifiable} verifiable
          </span>
        </SectionMeta>

        <MarqueeBand text="Verified" className="mb-14" />

        {/* The ledger.
            This section used to opt out of every strong move the page owns: it
            ran at display-sub — the SMALLEST display role — in a band whose
            entire job is proof, while Work above it ran at display-lead. It now
            uses the same full-bleed row-link skeleton as Work, at the same
            scale, so the evidence reads as loudly as the claims it backs.

            The one thing this band shows that nothing else on the site does is
            the actual verification ID. A recruiter can read HV-CORE-L1RRIFZQ
            straight off the page, and the fingerprint framing is the audience's
            own idiom — this is a reader who checks key fingerprints and commit
            SHAs by eye. It is also the honest structure: rows that can be
            independently checked carry an ID and an action, and the one that
            cannot says so plainly rather than borrowing the same authority. */}
        <div data-reveal-group className="row-stack mx-auto max-w-[1600px] px-5 sm:px-8">
          {earned.map((c) => {
            const id = credentialId(c.credentialUrl);
            const checkable = Boolean(c.credentialUrl && id);

            const body = (
              <div className="row-body">
                {/* The seal carries the state visually; the sr-only text
                    carries it for anyone the seal cannot reach. */}
                <div data-seal className="row-meta">
                  <CertSeal checkable={checkable} />
                  <span className="sr-only">
                    {checkable ? "Verifiable credential" : "Held on file"}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3
                    className={`row-title display display-lead ${
                      checkable ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {c.name}
                  </h3>
                  <p className="row-desc text-sm leading-relaxed text-muted-foreground">
                    {c.provider}
                  </p>

                  <div className="label mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {checkable ? (
                      <>
                        <span className="text-[color:var(--signal)]/70">ID</span>
                        <span className="cred-id">{id}</span>
                      </>
                    ) : (
                      <span>Certificate held · no public verification URL</span>
                    )}
                  </div>
                </div>

                {checkable && (
                  <span className="row-cta label text-[color:var(--signal)]">
                    Verify
                    <ArrowUpRight className="size-3" />
                  </span>
                )}
              </div>
            );

            const shell = "row-link group";

            // Only the checkable rows are links, so the accent wipe and the
            // pointer are promises the row can actually keep.
            return checkable ? (
              <a
                key={c.name}
                href={c.credentialUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-reveal-item
                className={shell}
              >
                {body}
              </a>
            ) : (
              <div key={c.name} data-reveal-item className={shell}>
                {body}
              </div>
            );
          })}

          <p data-reveal-item className="mt-10 max-w-xl text-sm text-muted-foreground">
            Public repositories are the rest of the evidence — every project above
            links to its source.
          </p>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="band border-t border-border" data-hud="04 — ABOUT">
        <SectionMeta index="04">
          <span className="label shrink-0">Background</span>
        </SectionMeta>

        <MarqueeBand text="About me" className="mb-14" />

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="grid gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-20">
            {/* Left — the visual when one is present, then the standing facts. */}
            <div data-reveal>
              {ABOUT_MEDIA &&
                (ABOUT_MEDIA.video ? (
                  /* Source is 720x900 — already 4:5, so the frame crops
                     nothing. Rendered raw, no treatment. */
                  <div className="mb-9">
                    <AboutMedia src={`/${ABOUT_MEDIA.file}`} />
                  </div>
                ) : (
                  <div className="about-visual mb-9 aspect-[4/5] w-full max-w-sm" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/${ABOUT_MEDIA.file}`} alt="" loading="lazy" decoding="async" />
                  </div>
                ))}

              <p className="about-lede text-pretty">
                I got into security by breaking something I shouldn&apos;t have. I
                stayed because writing the rule that catches your own exploit is
                the best feedback loop in this field.
              </p>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Red, blue, or purple — I care more about the people and the work
                than the colour of the team.
              </p>

              {/* Icons rather than emoji: the site runs lucide at one stroke
                  weight, and emoji would read as a different site pasted in. */}
              <dl className="quick-facts mt-9">
                {[
                  { Icon: MapPin, k: "Based", v: "Sri Lanka · GMT+5:30" },
                  { Icon: Crosshair, k: "Focus", v: "Pentesting · SOC · Analysis" },
                  { Icon: GraduationCap, k: "Studying", v: "SLIIT · 3rd year" },
                  { Icon: Flag, k: "Weekends", v: "CTFs and HackTheBox" },
                ].map(({ Icon, k, v }) => (
                  <div key={k} className="quick-fact">
                    <Icon
                      className="size-3.5 shrink-0 text-[color:var(--signal)]"
                      aria-hidden
                    />
                    <dt className="label">{k}</dt>
                    <dd className="label text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right — the record. Study and focus only: there is no employment
                history to show, and inventing one is not on the table. */}
            <div data-reveal-group>
              <LabelRule className="mb-1">Study</LabelRule>
              <div className="about-group">
                <div data-reveal-item className="about-row">
                  <div className="min-w-0">
                    <div className="display display-row text-foreground">
                      SLIIT
                    </div>
                    <div className="about-role mt-1 text-sm">
                      BSc (Hons) Information Technology — Cybersecurity
                    </div>
                  </div>
                  <span className="label shrink-0">[3rd year]</span>
                </div>
              </div>

              <LabelRule className="mb-1 mt-12">Focus</LabelRule>
              <div className="about-group">
                {[
                  {
                    name: "Offensive",
                    role: "Web exploitation, network attack paths, and the tooling that automates the boring half of both",
                    tag: "[red]",
                  },
                  {
                    name: "Detection",
                    role: "Sigma rules, Suricata signatures, and Wazuh pipelines — written against attacks I ran myself",
                    tag: "[blue]",
                  },
                  {
                    name: "Tooling",
                    role: "Python and TypeScript utilities that take the repetitive part of an engagement off the table",
                    tag: "[build]",
                  },
                  {
                    name: "Labs",
                    role: "PortSwigger Academy, HackTheBox, and CTF play — the reps behind everything above",
                    tag: "[ongoing]",
                  },
                  {
                    name: "Research",
                    role: "Wi-Fi beamforming feedback and the embedded side. Early days; the writeups are where it shows",
                    tag: "[open]",
                  },
                ].map((f) => (
                  <div key={f.name} data-reveal-item className="about-row">
                    <div className="min-w-0">
                      <div className="display display-row text-foreground">
                        {f.name}
                      </div>
                      <div className="about-role mt-1 text-sm">{f.role}</div>
                    </div>
                    <span className="label shrink-0">{f.tag}</span>
                  </div>
                ))}
              </div>

              <LabelRule className="mb-4 mt-12">In-depth look</LabelRule>
              <CvDownload
                data-reveal-item
                href={CV_HREF}
                filename={CV_DOWNLOAD_NAME}
                size={CV_SIZE}
              />
            </div>
          </div>

          {/* How the work is done — moved in from its own section so the whole
              picture of the person sits in one place. */}
          <h3 className="display display-section mb-10 mt-20 overflow-hidden text-foreground sm:mb-14 sm:mt-28">
            <span data-reveal-title className="block">
              Break it,
              <br />
              <span className="display-outline">then catch it.</span>
            </span>
          </h3>

          <LabelRule className="mb-8">Core foundations</LabelRule>
          <div
            data-reveal-group
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                k: "01",
                t: "Recon & exploit",
                d: "Web exploitation, network attack paths, and tooling that automates the boring parts of both. Burp, sqlmap, ffuf, Nmap, Metasploit.",
              },
              {
                k: "02",
                t: "Detection",
                d: "Sigma rules, Suricata signatures, and Wazuh pipelines — written against attacks I ran myself, so I know exactly what they have to catch.",
              },
              {
                k: "03",
                t: "The loop",
                d: "Writing a rule that catches your own exploit is a uniquely satisfying loop. Each side sharpens the other, which is why I want to work purple.",
              },
              {
                k: "04",
                t: "Written down",
                d: `Every lab and finding gets a walkthrough — ${writeups.length} of them so far, plus reference sheets, written for the next person who has to read them.`,
              },
            ].map((c) => (
              <div
                key={c.k}
                data-card-reveal
                className="foundation-card hairline rounded-lg bg-[color:var(--surface)]/40 p-5 sm:p-6"
              >
                <div className="label mb-5 text-[color:var(--signal)]/70">{c.k}</div>
                <h4 className="display mb-3 display-sub text-foreground">
                  {c.t}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>

          {/* Competencies read straight off skillGroups, so this list and the
              toolchain band can never disagree about what the toolkit is. */}
          <LabelRule className="mb-2 mt-16 sm:mt-24">Core competencies</LabelRule>
          <div data-reveal-group className="about-group">
            {skillGroups.map((g, i) => {
              const Icon = COMPETENCY_ICONS[i % COMPETENCY_ICONS.length];
              return (
                <div
                  key={g.domain}
                  data-reveal-item
                  className="about-row group flex-col items-start gap-2 md:flex-row md:items-baseline md:gap-6"
                >
                  <span className="flex min-w-0 items-center gap-3.5 md:gap-4">
                    <Icon
                      className="size-4 shrink-0 text-[color:var(--signal)]/70 transition-colors duration-300 group-hover:text-[color:var(--signal)] md:size-5"
                      aria-hidden
                    />
                    <span className="display display-row text-foreground">
                      {g.domain}
                    </span>
                  </span>
                  {/* Stacked under the title on phones rather than hidden — the
                      toolkit is the substance of the row, not decoration. */}
                  <span className="label pl-[1.9rem] leading-relaxed text-muted-foreground md:max-w-[46%] md:shrink-0 md:pl-0 md:text-right">
                    {g.items.join(" · ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" data-hud="05 — CONTACT" className="band scroll-mt-20 border-t border-border">
        <SectionMeta index="05">
          <span className="label shrink-0">Reply within 48h</span>
        </SectionMeta>

        <MarqueeBand text="Let’s talk" className="mb-14" />

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Channels — value decodes under a signal plate on hover. */}
          <div data-reveal-group>
            {[
              {
                label: "Email",
                text: "janithzgodage@gmail.com",
                href: "mailto:janithzgodage@gmail.com",
                external: false,
              },
              {
                label: "LinkedIn",
                text: "linkedin.com/in/janith-godage-6953s",
                href: "https://www.linkedin.com/in/janith-godage-6953s/",
                external: true,
              },
              {
                label: "GitHub",
                text: "github.com/jay6869",
                href: "https://github.com/jay6869",
                external: true,
              },
            ].map((c) => (
              <TextGlitch
                key={c.label}
                data-reveal-item
                label={c.label}
                text={c.text}
                href={c.href}
                external={c.external}
              />
            ))}
          </div>

          <p data-reveal className="contact-ask mt-10">
            Open to penetration testing, security analysis, and SOC work.
          </p>

          <p
            data-reveal
            className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            Engagements, research collaboration, or a CTF team — drop a line. I
            read everything and reply within 48 hours. PGP on request.
          </p>

          <div data-reveal className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </ScrollChoreography>
  );
}

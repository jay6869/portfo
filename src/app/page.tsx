import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Download } from "lucide-react";
import { HeroDots } from "@/components/hero-dots";
import { DecodeText } from "@/components/decode-text";
import { ScrollChoreography } from "@/components/scroll-choreography";
import { MarqueeBand } from "@/components/marquee-band";
import { ContactForm } from "@/components/contact-form";
import { skillGroups, certs } from "@/lib/data";
import { getAllProjects, getAllWriteups } from "@/lib/posts";

/**
 * Portrait for the About band. Drop the file into /public and set this to its
 * path (e.g. "/janith.jpg") — the duotone treatment and caption come with it.
 * Left null until a real photograph exists: an empty frame waiting on an asset
 * reads as an abandoned site, so the column is composed to stand without one.
 */
const PORTRAIT: string | null = null;

/** The hero name, one hover target per letter.
 *  Pure markup and CSS — no client JS. The real string is read once by
 *  assistive tech; the split copy is decorative. */
function SplitLetters({
  text,
  variant,
}: {
  text: string;
  variant: "light" | "solid";
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) =>
          ch === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <span key={i} className={`hero-letter hero-letter--${variant}`}>
              {ch}
            </span>
          ),
        )}
      </span>
    </>
  );
}

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

/** A label with the same dotted rule running out to the right — the record
 *  sheet's own sub-heading. */
function LabelRule({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="label shrink-0 text-[color:var(--signal)]/70">{children}</span>
      <span className="dotted-rule min-w-6 flex-1" aria-hidden />
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
  const tools = skillGroups.flatMap((g) => g.items);

  return (
    <ScrollChoreography>
      {/* ═══ HERO ═══ */}
      <section
        data-hero
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      >
        <HeroDots />
        {PORTRAIT && (
          <div className="hero-portrait" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" />
          </div>
        )}
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
              <DecodeText text="Offensive tooling · Detection engineering · Research" />
            </p>
          </div>

          {/* Bottom — the name, then the standing facts. */}
          <div>
            <h1 className="display display-hero">
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  <SplitLetters text="Janith" variant="light" />
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  <SplitLetters text="Godage" variant="solid" />
                </span>
              </span>
            </h1>

            <ul
              data-hero-fade
              className="mt-9 flex flex-wrap gap-x-9 gap-y-3"
            >
              {[
                "Available for internships",
                "Based in Sri Lanka",
                "Open to remote",
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

      {/* ═══ TOOLCHAIN MARQUEE ═══ */}
      <section className="relative overflow-hidden border-y border-border py-6">
        <h2 className="sr-only">Toolchain</h2>
        <div className="marquee" aria-hidden>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {tools.map((t) => (
                <span key={`${dup}-${t}`} className="flex items-center">
                  <span className="display px-6 text-[clamp(1.1rem,2.4vw,2rem)] text-foreground/25">
                    {t}
                  </span>
                  <span className="size-1 rounded-full bg-[color:var(--signal)]/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">{tools.join(", ")}</p>
      </section>

      {/* ═══ WORK ═══ */}
      <section className="band">
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

        <MarqueeBand text="Selected work" className="mb-14" />

        <div data-reveal-group className="mx-auto max-w-[1600px] px-5 sm:px-8">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              data-reveal-item
              className="row-link group py-8 sm:py-11"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
                <span className="label shrink-0 text-[color:var(--signal)]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="row-title display min-w-0 flex-1 text-[clamp(1.7rem,4.6vw,3.4rem)] text-foreground">
                  {p.title}
                </h3>

                <div className="flex shrink-0 items-center gap-6 md:w-[34%]">
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.oneLiner}
                  </p>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--signal)]" />
                </div>
              </div>

              <div className="label mt-5 flex flex-wrap gap-x-5 gap-y-2 md:pl-[calc(3.5rem)]">
                <span className="text-[color:var(--signal)]/70">{p.type}</span>
                {p.stack.slice(0, 5).map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ APPROACH ═══ */}
      <section className="band border-t border-border bg-[color:var(--surface)]/40">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <h2 className="display display-section mb-16 overflow-hidden text-foreground">
            <span data-reveal-title className="block">
              Break it,
              <br />
              <span className="display-outline">then catch it.</span>
            </span>
          </h2>

          <div data-reveal-group className="grid gap-x-12 gap-y-12 md:grid-cols-3">
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
            ].map((c) => (
              <div key={c.k} data-reveal-item>
                <div className="label mb-5 text-[color:var(--signal)]/70">{c.k}</div>
                <h3 className="display mb-4 text-[clamp(1.3rem,2.6vw,2rem)] text-foreground">
                  {c.t}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WRITING ═══ */}
      <section className="band">
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

        <div data-reveal-group className="mx-auto max-w-[1600px] px-5 sm:px-8">
          {writeups.slice(0, 4).map((w) => (
            <Link
              key={w.slug}
              href={`/writeups/${w.slug}`}
              data-reveal-item
              className="row-link group py-7"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
                <time className="label shrink-0 md:w-28" dateTime={w.date}>
                  {w.date}
                </time>
                <h3 className="row-title display min-w-0 flex-1 text-[clamp(1.15rem,2.6vw,2rem)] text-foreground">
                  {w.title}
                </h3>
                <span className="label shrink-0">{w.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CREDENTIALS ═══ */}
      <section className="band border-t border-border">
        <SectionMeta index="03">
          <span className="label shrink-0">
            {earned.length} earned · {verifiable} verifiable
          </span>
        </SectionMeta>

        <MarqueeBand text="Verified" className="mb-14" />

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div data-reveal-group className="grid gap-6">
            {earned.map((c) => (
              <div
                key={c.name}
                data-reveal-item
                className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-6"
              >
                <div className="min-w-0">
                  <div className="label mb-2">{c.provider}</div>
                  <div className="display text-[clamp(1rem,2vw,1.5rem)] text-foreground">
                    {c.name}
                  </div>
                </div>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label group inline-flex items-center gap-2 text-[color:var(--signal)] transition-opacity hover:opacity-70"
                  >
                    Verify
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            ))}
            <p data-reveal-item className="text-sm text-muted-foreground">
              Public repositories are the rest of the evidence — every project above
              links to its source.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="band border-t border-border">
        <SectionMeta index="04">
          <span className="label shrink-0">Background</span>
        </SectionMeta>

        <MarqueeBand text="About me" className="mb-14" />

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
          <div className="grid gap-14 md:grid-cols-2 md:gap-20">
            {/* Left — portrait when one exists, then the standing facts. */}
            <div data-reveal>
              {PORTRAIT && (
                <figure className="mb-8">
                  <div className="portrait aspect-[4/5] w-full max-w-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PORTRAIT} alt="Janith Godage" />
                  </div>
                  <figcaption className="label mt-3">
                    Sri Lanka — GMT+5:30
                  </figcaption>
                </figure>
              )}

              <p className="text-pretty text-[clamp(1.05rem,2vw,1.5rem)] italic leading-snug text-foreground/90">
                Third-year cybersecurity undergraduate who ships the whole loop —
                builds the offensive tool, writes the honest walkthrough, then writes
                the detection that catches it.
              </p>

              <dl className="mt-8 grid gap-2.5">
                {[
                  ["Location", "Sri Lanka — remote-friendly"],
                  ["Availability", "Open for internships"],
                  ["Languages", "English · Sinhala"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="label">{k} —</dt>
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
                    <div className="display text-[clamp(1.2rem,2.4vw,1.9rem)] text-foreground">
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
                  role: "Web exploitation, network attack paths, and the tooling that automates both",
                  tag: "[red]",
                },
                {
                  name: "Detection",
                  role: "Sigma rules, Suricata signatures, and Wazuh pipelines",
                  tag: "[blue]",
                },
                {
                  name: "Labs",
                  role: "PortSwigger Academy, HackTheBox, and CTF play",
                  tag: "[ongoing]",
                },
                ].map((f) => (
                  <div key={f.name} data-reveal-item className="about-row">
                    <div className="min-w-0">
                      <div className="display text-[clamp(1.2rem,2.4vw,1.9rem)] text-foreground">
                        {f.name}
                      </div>
                      <div className="about-role mt-1 text-sm">{f.role}</div>
                    </div>
                    <span className="label shrink-0">{f.tag}</span>
                  </div>
                ))}
              </div>

              <LabelRule className="mb-4 mt-12">In-depth look</LabelRule>
              <a
                data-reveal-item
                href="/janith-godage-cv.pdf"
                download="Janith-Godage-CV.pdf"
                className="label group inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-3 text-black transition-shadow hover:shadow-[0_0_34px_-6px_var(--signal)]"
              >
                <Download className="size-3.5 transition-transform group-hover:translate-y-0.5" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="band scroll-mt-20 border-t border-border">
        <SectionMeta index="05">
          <span className="label shrink-0">Open to roles</span>
        </SectionMeta>

        <MarqueeBand text="Let’s talk" className="mb-14" />

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Channels, as the record rows used elsewhere. */}
          <div data-reveal-group className="about-group">
            {[
              {
                k: "Email",
                v: "janithzgodage@gmail.com",
                href: "mailto:janithzgodage@gmail.com",
                ext: false,
              },
              {
                k: "LinkedIn",
                v: "linkedin.com/in/janith-godage-6953s",
                href: "https://www.linkedin.com/in/janith-godage-6953s/",
                ext: true,
              },
              {
                k: "GitHub",
                v: "github.com/jay6869",
                href: "https://github.com/jay6869",
                ext: true,
              },
            ].map((c) => (
              <a
                key={c.k}
                data-reveal-item
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="about-row group"
              >
                <span className="min-w-0">
                  <span className="label block text-[color:var(--signal)]/70">{c.k}</span>
                  <span className="display mt-2 block break-all text-[clamp(1.15rem,3.2vw,2.4rem)] text-foreground transition-colors group-hover:text-[color:var(--signal)]">
                    {c.v}
                  </span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[color:var(--signal)]" />
              </a>
            ))}
          </div>

          <p data-reveal className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Internship, collaboration, or a CTF team — drop a line. I read
            everything and reply within 48 hours. PGP available on request.
          </p>

          <div data-reveal className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </ScrollChoreography>
  );
}

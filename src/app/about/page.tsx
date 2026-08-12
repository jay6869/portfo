import type { Metadata } from "next";
import { Download, GraduationCap, Globe, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion-primitives";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cybersecurity undergraduate at SLIIT, focused on offensive security and detection engineering.",
  openGraph: { title: "About — Janith Godage", url: "/about" },
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        title="The short version."
        description="I'm a third-year cybersecurity undergraduate at SLIIT in Sri Lanka. My focus is offensive security — but I write detection logic with the same rigor I write exploit code."
      />

      {/* Facts as hairline rows in the site's own language, replacing a
          third-party spotlight card that carried its own hsl() colour map,
          registered a document-level pointermove listener per instance, and
          injected a duplicate <style> block for each one. */}
      <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {[
          { Icon: GraduationCap, k: "education", v: "SLIIT · BSc (Hons) IT", sub: "Cybersecurity, 3rd year" },
          { Icon: Globe, k: "languages", v: "English · Sinhala", sub: "working proficiency in both" },
          { Icon: MapPin, k: "based", v: "Sri Lanka", sub: "remote-friendly · GMT+5:30" },
        ].map(({ Icon, k, v, sub }, i) => (
          <Reveal key={k} delay={i * 0.06}>
            <div className="h-full bg-[color:var(--surface)] p-5 transition-colors hover:bg-[color:var(--surface-2)]">
              <Icon className="size-4 text-[color:var(--signal)]" aria-hidden />
              <dt className="label mt-3">{k}</dt>
              <dd className="mt-1.5 text-sm text-foreground">
                {v}
                <span className="mt-0.5 block text-xs text-muted-foreground">{sub}</span>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <Reveal>
        <div className="prose prose-invert mt-10 max-w-none text-[15px] leading-[1.75] text-foreground/90">
          <p>
            I got into security the same way most people do — broke something I
            shouldn&apos;t have, got curious, kept going. The difference is what stuck:
            not just the &quot;getting in&quot; part, but the engineering on the other
            side. Writing a Suricata rule that catches your own exploit is a
            uniquely satisfying loop.
          </p>
          <p>
            Day to day I&apos;m grinding PortSwigger Academy and HackTheBox boxes,
            building tools in TypeScript and Python, and slowly accumulating the
            embedded-systems knowledge to do meaningful WiFi and IoT research.
          </p>
          <p>
            I&apos;m looking for an internship where I can work on real targets with
            people who care about doing it well. I&apos;m happy with red, blue, or
            purple — what matters is the people and the work.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <a
          href="/janith-godage-cv.pdf"
          download="Janith-Godage-CV.pdf"
          className="mono mt-8 inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-black shadow-[0_0_30px_-6px_var(--signal)] hover:shadow-[0_0_40px_-4px_var(--signal)]"
        >
          <Download className="size-3.5" /> download cv · pdf
        </a>
      </Reveal>

    </div>
  );
}

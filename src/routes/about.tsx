import { createFileRoute } from "@tanstack/react-router";
import { Download, GraduationCap, Globe, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion-primitives";
import { InteractiveTerminal } from "@/components/interactive-terminal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Janith Godage" },
      { name: "description", content: "Cybersecurity undergraduate at SLIIT, focused on offensive security and detection engineering." },
      { property: "og:title", content: "About — Janith Godage" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="cat ~/about.md"
        title="The short version."
        description="I'm a third-year cybersecurity undergraduate at SLIIT in Sri Lanka. My focus is offensive security — but I write detection logic with the same rigor I write exploit code."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Reveal>
          <div className="hairline rounded-lg bg-[color:var(--surface)] p-5">
            <GraduationCap className="size-4 text-[color:var(--signal)]" />
            <div className="mono mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">education</div>
            <div className="mt-1 text-sm text-foreground">SLIIT · BSc (Hons) IT</div>
            <div className="text-xs text-muted-foreground">Cybersecurity, 3rd year</div>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="hairline rounded-lg bg-[color:var(--surface)] p-5">
            <Globe className="size-4 text-[color:var(--signal)]" />
            <div className="mono mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">languages</div>
            <div className="mt-1 text-sm text-foreground">English · Sinhala</div>
            <div className="text-xs text-muted-foreground">working proficiency in both</div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="hairline rounded-lg bg-[color:var(--surface)] p-5">
            <MapPin className="size-4 text-[color:var(--signal)]" />
            <div className="mono mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">based</div>
            <div className="mt-1 text-sm text-foreground">Sri Lanka</div>
            <div className="text-xs text-muted-foreground">remote-friendly · GMT+5:30</div>
          </div>
        </Reveal>
      </div>

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
        <a href="#" className="mono mt-8 inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-black shadow-[0_0_30px_-6px_var(--signal)] hover:shadow-[0_0_40px_-4px_var(--signal)]">
          <Download className="size-3.5" /> download cv · pdf
        </a>
      </Reveal>

      <div className="mt-16">
        <SectionHeading
          eyebrow="interactive"
          title="Poke around."
          description="A small shell. Try whoami, cat skills, ls projects, or help."
        />
        <Reveal>
          <InteractiveTerminal />
        </Reveal>
      </div>
    </div>
  );
}

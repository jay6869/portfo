"use client";

import { useEffect, useRef, useState } from "react";
import {
  Globe,
  Network,
  Cable,
  Smartphone,
  Cloud,
  Users,
  ArrowUpRight,
  AlertTriangle,
  Bug,
  Terminal,
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium";

type Project = {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
  tags: string[];
  findings: number;
  severity: Severity;
  code: string;
  year: string;
};

const projects: Project[] = [
  {
    Icon: Globe,
    title: "Web Application Penetration Test",
    description:
      "Conducted a comprehensive security assessment on a production e-commerce platform.",
    tags: ["OWASP Top 10", "SQL Injection", "XSS", "Authentication"],
    findings: 15,
    severity: "Critical",
    code: "WAPT-001",
    year: "2025",
  },
  {
Icon: Terminal,
title: "Custom Port Scanner",
description:
  "Python-based port scanner with multi-threading and service detection capabilities.",
tags: ["Python", "Networking", "Threading", "Recon"],
findings: 0,
severity: "High",
code: "CPS-001",
year: "2025",
  },
  {
    Icon: Cable,
    title: "API Security Testing",
    description:
      "REST API security testing and authentication mechanism evaluation.",
    tags: ["API Security", "Token Bypass", "Rate Limiting", "Validation"],
    findings: 12,
    severity: "High",
    code: "API-003",
    year: "2024",
  },
  {
    Icon: Smartphone,
    title: "Mobile App Security Analysis",
    description:
      "Reverse engineering and security assessment of a production Android application.",
    tags: ["Mobile", "Reverse Engineering", "Data Storage", "Encryption"],
    findings: 9,
    severity: "Critical",
    code: "MSA-004",
    year: "2024",
  },
  {
    Icon: Cloud,
    title: "Cloud Infrastructure Assessment",
    description:
      "AWS cloud environment security audit and misconfiguration detection.",
    tags: ["Cloud", "AWS", "IAM", "S3 Buckets"],
    findings: 11,
    severity: "High",
    code: "CIA-005",
    year: "2024",
  },
  {
    Icon: Users,
    title: "ISO27001 Security Assessment",
    description:
      "Phishing simulation and employee security awareness testing at scale.",
    tags: ["Social Eng.", "Phishing", "Awareness", "Training"],
    findings: 350,
    severity: "Medium",
    code: "SEC-006",
    year: "2026",
  },
];

const severityMap: Record<
  Severity,
  { hex: string; glow: string; soft: string; label: string }
> = {
  Critical: {
    hex: "#f43f5e",
    glow: "rgba(244,63,94,0.35)",
    soft: "rgba(244,63,94,0.10)",
    label: "critical",
  },
  High: {
    hex: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    soft: "rgba(251,146,60,0.10)",
    label: "high",
  },
  Medium: {
    hex: "#facc15",
    glow: "rgba(250,204,21,0.30)",
    soft: "rgba(250,204,21,0.10)",
    label: "medium",
  },
};

const PROJECTS_KEYFRAMES = `
@keyframes proj-scan {
  0% { transform: translateY(-100%); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(900%); opacity: 0; }
}
@keyframes proj-blink {
  0%, 60%, 100% { opacity: 1; }
  30% { opacity: 0.15; }
}
@keyframes proj-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes proj-ping {
  75%, 100% { transform: scale(2.2); opacity: 0; }
}
@keyframes proj-rise {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

function CountUp({ to, active, delay = 0 }: { to: number; active: boolean; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, delay]);
  return <>{v}</>;
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.2);
  const rowRef = useRef<HTMLDivElement>(null);
  const sev = severityMap[project.severity];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      style={{
        animation: seen ? `proj-rise 700ms ${index * 80}ms cubic-bezier(0.22,1,0.36,1) both` : "none",
      }}
    >
      <div
        ref={rowRef}
        onMouseMove={handleMove}
        className="group relative rounded-xl p-px overflow-hidden transition-transform duration-500"
        style={{
          background:
            "linear-gradient(140deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.06))",
        }}
      >
        <div className="relative rounded-xl bg-[#0a0a0d] overflow-hidden">
          {/* mouse glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(500px circle at var(--mx,50%) var(--my,50%), ${sev.glow}, transparent 45%)`,
            }}
          />
          {/* left severity bar */}
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{
              background: `linear-gradient(180deg, transparent, ${sev.hex}, transparent)`,
              boxShadow: `0 0 18px ${sev.glow}`,
            }}
          />

          {/* terminal header strip */}
          <div className="relative flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: sev.hex, boxShadow: `0 0 8px ${sev.glow}` }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/30">
                ~ / reports / {project.code.toLowerCase()}.md
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
              <span>{project.year}</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">{project.code}</span>
            </div>
          </div>

          {/* body */}
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 p-5 md:p-7">
            {/* left: content */}
            <div className="min-w-0">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="relative shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    background: sev.soft,
                    boxShadow: `inset 0 0 0 1px ${sev.glow}`,
                  }}
                >
                  <project.Icon
                    className="w-[18px] h-[18px]"
                    style={{ color: sev.hex } as React.CSSProperties}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-sm"
                      style={{
                        color: sev.hex,
                        background: sev.soft,
                        boxShadow: `inset 0 0 0 1px ${sev.glow}`,
                      }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.2} />
                      {sev.label}
                    </span>
                    <span
                      className="w-1 h-1 rounded-full bg-white/30"
                      style={{ animation: "proj-blink 1.6s ease-in-out infinite" }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      resolved
                    </span>
                  </div>
                  <h3 className="text-[17px] md:text-[19px] font-semibold text-white tracking-tight leading-tight">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] text-white/45 leading-relaxed max-w-[58ch]">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-1.5 pl-[60px]">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10.5px] text-white/55 px-2 py-1 rounded-md border border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:text-white/80 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* right: findings panel */}
            <div className="relative md:border-l md:border-white/[0.06] md:pl-7 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 min-w-[140px]">
              {/* scan line */}
              <div
                aria-hidden
                className="hidden md:block absolute left-7 right-0 top-0 h-px overflow-hidden"
              >
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${sev.hex}, transparent)`,
                    animation: `proj-scan 4s ${index * 0.4}s linear infinite`,
                  }}
                />
              </div>

              <div className="flex items-center gap-2 md:gap-1.5 md:flex-row-reverse">
                <Bug className="w-3.5 h-3.5 text-white/30" strokeWidth={2} />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
                  findings
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-mono text-[44px] md:text-[52px] font-bold leading-none tabular-nums"
                  style={{
                    color: "transparent",
                    background: `linear-gradient(180deg, #fff, ${sev.hex})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  <CountUp to={project.findings} active={seen} delay={index * 80 + 200} />
                </span>
                <span className="font-mono text-[11px] text-white/30 uppercase tracking-wider">
                  iss.
                </span>
              </div>

              <button
                type="button"
                className="group/btn inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors"
              >
                <span>view report</span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const totalFindings = projects.reduce((a, p) => a + p.findings, 0);

  return (
    <section className="relative py-24 px-6 md:px-10 bg-black overflow-hidden">
      <style>{PROJECTS_KEYFRAMES}</style>

      {/* header */}
      <div className="relative max-w-6xl mx-auto mb-14">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
              <span className="relative flex w-1.5 h-1.5">
                <span
                  className="absolute inline-flex w-full h-full rounded-full bg-rose-400 opacity-75"
                  style={{ animation: "proj-ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }}
                />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-rose-400" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
                case files / classified
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Field Operations
              </span>
            </h2>
            <p className="mt-4 text-[15px] text-white/45 leading-relaxed max-w-xl">
              A redacted dossier of penetration tests, audits, and offensive
              engagements — each report, signed and shipped.
            </p>
          </div>

          {/* stats panel */}
          <div className="flex items-stretch gap-px rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02]">
            {[
              { k: "engagements", v: projects.length.toString().padStart(2, "0") },
              { k: "findings", v: totalFindings.toString() },
              { k: "critical", v: projects.filter((p) => p.severity === "Critical").length.toString().padStart(2, "0") },
            ].map((s) => (
              <div key={s.k} className="px-5 py-3 bg-[#0a0a0d] min-w-[96px]">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35 mb-1">
                  {s.k}
                </div>
                <div className="font-mono text-2xl font-bold text-white tabular-nums">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* marquee divider */}
        <div className="relative mt-10 h-px overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 h-px w-[200%] flex"
            style={{ animation: "proj-marquee 40s linear infinite" }}
          >
            {[0, 1].map((g) => (
              <div key={g} className="flex items-center gap-6 w-1/2 shrink-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/15 whitespace-nowrap"
                  >
                    ✦ confidential · authorized personnel only · do not distribute
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* list */}
      <div className="relative max-w-6xl mx-auto flex flex-col gap-4">
        {projects.map((p, i) => (
          <ProjectRow key={p.code} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export default Projects;

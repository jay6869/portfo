"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Terminal, ClipboardCheck, Brain, ArrowUpRight } from "lucide-react";

type SkillColor = "orange" | "violet" | "emerald" | "sky";

type Skill = {
  color: SkillColor;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  tag: string;
  num: string;
  items: { label: string; pct: number }[];
};

const skills: Skill[] = [
  {
    color: "orange",
    Icon: Shield,
    title: "Web Security",
    tag: "offense",
    num: "01",
    items: [
      { label: "OWASP Top 10", pct: 92 },
      { label: "SQL Injection", pct: 88 },
      { label: "XSS / CSRF", pct: 85 },
      { label: "Auth Bypass", pct: 80 },
      { label: "API Security", pct: 78 },
    ],
  },
  {
    color: "violet",
    Icon: Terminal,
    title: "Tools & Platforms",
    tag: "arsenal",
    num: "02",
    items: [
      { label: "Kali Linux", pct: 95 },
      { label: "Burp Suite Pro", pct: 90 },
      { label: "Metasploit", pct: 85 },
      { label: "Wireshark", pct: 82 },
      { label: "OWASP ZAP", pct: 75 },
    ],
  },
  {
    color: "emerald",
    Icon: ClipboardCheck,
    title: "Methodologies",
    tag: "process",
    num: "03",
    items: [
      { label: "Pen Testing", pct: 90 },
      { label: "Vuln Assessment", pct: 88 },
      { label: "Security Auditing", pct: 82 },
      { label: "Threat Modeling", pct: 76 },
      { label: "Lab Environments", pct: 85 },
    ],
  },
  {
    color: "sky",
    Icon: Brain,
    title: "Knowledge Areas",
    tag: "domain",
    num: "04",
    items: [
      { label: "Network Security", pct: 86 },
      { label: "Ethical Hacking", pct: 92 },
      { label: "Threat Analysis", pct: 80 },
      { label: "Cloud Security", pct: 70 },
      { label: "Incident Response", pct: 74 },
    ],
  },
];

const palette: Record<
  SkillColor,
  { hex: string; soft: string; glow: string; text: string }
> = {
  orange: { hex: "#fb923c", soft: "rgba(251,146,60,0.10)", glow: "rgba(251,146,60,0.35)", text: "text-[#fb923c]" },
  violet: { hex: "#a78bfa", soft: "rgba(167,139,250,0.10)", glow: "rgba(167,139,250,0.35)", text: "text-[#a78bfa]" },
  emerald: { hex: "#34d399", soft: "rgba(52,211,153,0.10)", glow: "rgba(52,211,153,0.35)", text: "text-[#34d399]" },
  sky: { hex: "#60a5fa", soft: "rgba(96,165,250,0.10)", glow: "rgba(96,165,250,0.35)", text: "text-[#60a5fa]" },
};

const SKILLS_KEYFRAMES = `
@keyframes skills-scanX {
  0%, 100% { transform: translateX(-100%); opacity: 0; }
  50% { transform: translateX(100%); opacity: 1; }
}
@keyframes skills-pulseRing {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.35); opacity: 0; }
}
@keyframes skills-shimmer {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(400%); }
}
@keyframes skills-ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
`;

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function CountUp({ to, active, delay = 0 }: { to: number; active: boolean; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1100;
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

function CornerBracket({ className = "", color }: { className?: string; color: string }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M0 3V0H3" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const cardRef = useRef<HTMLDivElement>(null);
  const c = palette[skill.color];
  const baseDelay = index * 120;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${baseDelay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        className="group relative rounded-2xl p-px overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${c.glow}, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.02) 65%, ${c.glow})`,
        }}
      >
        <div className="relative rounded-2xl bg-[#0b0b0e] p-6 overflow-hidden h-full">
          {/* mouse-follow glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), ${c.glow}, transparent 45%)`,
            }}
          />
          {/* grid bg */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse at top right, black 0%, transparent 70%)",
            }}
          />
          {/* scan line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${c.hex}, transparent)`,
              animation: `skills-scanX 3.4s ${index * 0.3}s ease-in-out infinite`,
            }}
          />

          <CornerBracket className="absolute top-2 left-2" color={c.hex} />
          <CornerBracket className="absolute top-2 right-2 rotate-90" color={c.hex} />
          <CornerBracket className="absolute bottom-2 left-2 -rotate-90" color={c.hex} />
          <CornerBracket className="absolute bottom-2 right-2 rotate-180" color={c.hex} />

          <div className="relative flex items-start justify-between mb-6">
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: c.soft,
                boxShadow: `inset 0 0 0 1px ${c.glow}, 0 0 28px -8px ${c.glow}`,
              }}
            >
              <skill.Icon className={`w-5 h-5 ${c.text}`} strokeWidth={1.8} />
              <span
                className="absolute inset-0 rounded-xl"
                style={{
                  boxShadow: `0 0 0 1px ${c.glow}`,
                  animation: `skills-pulseRing 2.4s ${index * 0.2}s ease-out infinite`,
                }}
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span
                className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 rounded-md border"
                style={{ color: c.hex, borderColor: c.glow, background: c.soft }}
              >
                {skill.tag}
              </span>
              <ArrowUpRight
                className="w-3.5 h-3.5 text-white/20 group-hover:text-white/70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                strokeWidth={2}
              />
            </div>
          </div>

          <h3 className="relative text-[17px] font-semibold text-white tracking-tight mb-1">
            {skill.title}
          </h3>
          <p className="relative text-[11px] font-mono text-white/30 mb-6">
            {skill.items.length} competencies
          </p>

          <div className="relative flex flex-col gap-3">
            {skill.items.map((item, i) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: c.hex, boxShadow: `0 0 8px ${c.hex}` }}
                    />
                    <span className="text-[11.5px] text-white/60 font-mono tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className="text-[10.5px] font-mono tabular-nums"
                    style={{ color: c.hex }}
                  >
                    <CountUp to={item.pct} active={inView} delay={baseDelay + 300 + i * 90} />%
                  </span>
                </div>
                <div className="relative h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: inView ? `${item.pct}%` : "0%",
                      background: `linear-gradient(90deg, ${c.hex}, ${c.hex}cc)`,
                      transition: `width 1100ms cubic-bezier(0.22,1,0.36,1) ${
                        baseDelay + 300 + i * 90
                      }ms`,
                      boxShadow: `0 0 12px ${c.glow}`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 w-1/3 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${c.hex}, transparent)`,
                      animation: "skills-shimmer 1.8s linear infinite",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <span
            className="absolute -bottom-3 -right-1 font-mono font-black leading-none select-none"
            style={{
              fontSize: "92px",
              background: `linear-gradient(180deg, ${c.glow}, transparent)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.55,
            }}
          >
            {skill.num}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section className="relative py-24 px-6 md:px-10 bg-black overflow-hidden">
      {/* inlined keyframes — keeps this component self-contained */}
      <style>{SKILLS_KEYFRAMES}</style>

      {/* ambient bg */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(96,165,250,0.08), transparent 70%), radial-gradient(40% 40% at 80% 100%, rgba(167,139,250,0.06), transparent 70%)",
        }}
      />

      <div className="relative text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
          <span className="relative flex w-1.5 h-1.5">
            <span
              className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: "skills-ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
            technical stack / v4.0
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Skills & Expertise
          </span>
        </h2>
        <p className="text-[15px] text-white/45 leading-relaxed max-w-xl mx-auto">
          A measured arsenal of competencies across offensive security,
          penetration testing, and vulnerability research.
        </p>
        <div
          aria-hidden
          className="mx-auto mt-8 h-px w-40"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((s, i) => (
          <SkillCard key={s.title} skill={s} index={i} />
        ))}
      </div>
    </section>
  );
}

export default Skills;

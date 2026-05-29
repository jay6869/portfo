"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Compass,
  Terminal,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ---------- inlined keyframes (self-contained) ---------- */
const ABOUT_KEYFRAMES = `
@keyframes about-scanX {
  0%, 100% { transform: translateX(-100%); opacity: 0; }
  50% { transform: translateX(100%); opacity: 1; }
}
@keyframes about-pulseRing {
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.4); opacity: 0; }
}
@keyframes about-ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
@keyframes about-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes about-gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes about-caret { 50% { opacity: 0; } }
`;

/* ---------- hooks ---------- */
function useInView<T extends HTMLElement>(threshold = 0.18) {
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

function CountUp({
  to,
  active,
  delay = 0,
  suffix = "",
}: {
  to: number;
  active: boolean;
  delay?: number;
  suffix?: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, delay]);
  return (
    <>
      {v}
      {suffix}
    </>
  );
}

/* ---------- palette ---------- */
type Tone = "emerald" | "sky" | "violet";
const tones: Record<Tone, { hex: string; soft: string; glow: string; text: string }> = {
  emerald: {
    hex: "#34d399",
    soft: "rgba(52,211,153,0.10)",
    glow: "rgba(52,211,153,0.35)",
    text: "text-[#34d399]",
  },
  sky: {
    hex: "#60a5fa",
    soft: "rgba(96,165,250,0.10)",
    glow: "rgba(96,165,250,0.35)",
    text: "text-[#60a5fa]",
  },
  violet: {
    hex: "#a78bfa",
    soft: "rgba(167,139,250,0.10)",
    glow: "rgba(167,139,250,0.35)",
    text: "text-[#a78bfa]",
  },
};

/* ---------- decorative corner ---------- */
function CornerBracket({
  className = "",
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
    >
      <path d="M0 3V0H3" stroke={color} strokeOpacity="0.55" strokeWidth="1" />
    </svg>
  );
}

/* ---------- feature card ---------- */
type FeatureCard = {
  tone: Tone;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tag: string;
  title: string;
  body: string;
  bullets: { text: string; mark: "check" | "arrow" }[];
  index: number;
};

function FeatureCard({ card }: { card: FeatureCard }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const cardRef = useRef<HTMLDivElement>(null);
  const c = tones[card.tone];
  const baseDelay = card.index * 120;

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
        className="group relative rounded-2xl p-px overflow-hidden h-full"
        style={{
          background: `linear-gradient(140deg, ${c.glow}, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.02) 65%, ${c.glow})`,
        }}
      >
        <div className="relative rounded-2xl bg-[#0b0b0e] p-7 overflow-hidden h-full">
          {/* mouse follow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(440px circle at var(--mx,50%) var(--my,50%), ${c.glow}, transparent 45%)`,
            }}
          />
          {/* faint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse at top right, black 0%, transparent 70%)",
            }}
          />
          {/* scan line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${c.hex}, transparent)`,
              animation: `about-scanX 3.6s ${card.index * 0.4}s ease-in-out infinite`,
            }}
          />

          <CornerBracket className="absolute top-2 left-2" color={c.hex} />
          <CornerBracket className="absolute top-2 right-2 rotate-90" color={c.hex} />
          <CornerBracket
            className="absolute bottom-2 left-2 -rotate-90"
            color={c.hex}
          />
          <CornerBracket
            className="absolute bottom-2 right-2 rotate-180"
            color={c.hex}
          />

          {/* header */}
          <div className="relative flex items-start justify-between mb-6">
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: c.soft,
                boxShadow: `inset 0 0 0 1px ${c.glow}, 0 0 28px -8px ${c.glow}`,
              }}
            >
              <card.Icon className={`w-5 h-5 ${c.text}`} strokeWidth={1.8} />
              <span
                className="absolute inset-0 rounded-xl"
                style={{
                  boxShadow: `0 0 0 1px ${c.glow}`,
                  animation: `about-pulseRing 2.6s ${card.index * 0.3}s ease-out infinite`,
                }}
              />
            </div>
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 rounded-md border"
              style={{ color: c.hex, borderColor: c.glow, background: c.soft }}
            >
              {card.tag}
            </span>
          </div>

          <h3 className="relative text-[18px] font-semibold text-white tracking-tight mb-2.5">
            {card.title}
          </h3>
          <p className="relative text-[13.5px] text-white/50 leading-relaxed mb-6">
            {card.body}
          </p>

          <ul className="relative flex flex-col gap-2.5">
            {card.bullets.map((b, i) => (
              <li
                key={b.text}
                style={{
                  transitionDelay: `${baseDelay + 280 + i * 80}ms`,
                }}
                className={`flex items-start gap-3 text-[13px] text-white/65 transition-all duration-500 ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
              >
                <span
                  className="w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0 mt-px"
                  style={{
                    background: c.soft,
                    boxShadow: `inset 0 0 0 1px ${c.glow}`,
                    color: c.hex,
                  }}
                >
                  {b.mark === "check" ? (
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                  )}
                </span>
                <span className="leading-relaxed">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- bottom showcase ---------- */
function ProfessionalBackground() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const stats: { num: number; suffix?: string; label: string }[] = [
    { num: 10, suffix: "+", label: "Bug Bounty Reports" },
    { num: 200, suffix: "+", label: "Kali Lab Hours" },
    { num: 6, suffix: "", label: "Projects Completed" },
  ];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: "240ms" }}
      className={`max-w-5xl mx-auto transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        className="group relative rounded-2xl p-px overflow-hidden"
        style={{
          background:
            "linear-gradient(140deg, rgba(96,165,250,0.45), rgba(167,139,250,0.18) 40%, rgba(52,211,153,0.18) 70%, rgba(96,165,250,0.45))",
          backgroundSize: "200% 200%",
          animation: "about-gradient-shift 8s ease infinite",
        }}
      >
        <div className="relative rounded-2xl bg-[#0a0a0d] p-8 md:p-10 overflow-hidden">
          {/* mouse follow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(520px circle at var(--mx,50%) var(--my,50%), rgba(96,165,250,0.18), transparent 50%)",
            }}
          />
          {/* ambient orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(96,165,250,0.18), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(167,139,250,0.14), transparent 70%)",
            }}
          />
          {/* grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            }}
          />

          <CornerBracket className="absolute top-3 left-3" color="#60a5fa" />
          <CornerBracket
            className="absolute top-3 right-3 rotate-90"
            color="#60a5fa"
          />
          <CornerBracket
            className="absolute bottom-3 left-3 -rotate-90"
            color="#60a5fa"
          />
          <CornerBracket
            className="absolute bottom-3 right-3 rotate-180"
            color="#60a5fa"
          />

          <div className="relative flex gap-7 flex-wrap items-start">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#60a5fa] flex-shrink-0"
              style={{
                background: "rgba(96,165,250,0.10)",
                boxShadow:
                  "inset 0 0 0 1px rgba(96,165,250,0.30), 0 0 36px -8px rgba(96,165,250,0.55)",
                animation: "about-float 5s ease-in-out infinite",
              }}
            >
              <Terminal className="w-6 h-6" strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#60a5fa]/80">
                  // background
                </span>
                <span
                  className="inline-block w-1.5 h-3 bg-[#60a5fa] align-middle"
                  style={{ animation: "about-caret 1s steps(1) infinite" }}
                />
              </div>
              <h3 className="text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-3">
                Professional Background
              </h3>
              <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">
                Hands-on experience in web application security, SQL injection,
                network configuration, and custom tooling. Comfortable working
                from both offensive and defensive perspectives — from initial
                recon to writing up findings.
              </p>

              <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className="relative pl-4"
                    style={{ transitionDelay: `${400 + i * 100}ms` }}
                  >
                    <span
                      className="absolute left-0 top-1 bottom-1 w-px"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent, rgba(96,165,250,0.6), transparent)",
                      }}
                    />
                    <div className="flex items-baseline gap-0.5">
                      <span
                        className="text-[28px] md:text-[32px] font-bold tabular-nums leading-none"
                        style={{
                          background:
                            "linear-gradient(180deg, #fff, rgba(96,165,250,0.7))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        <CountUp
                          to={s.num}
                          active={inView}
                          delay={400 + i * 120}
                          suffix={s.suffix ?? ""}
                        />
                      </span>
                    </div>
                    <span className="block font-mono text-[10px] mt-2 text-white/40 tracking-[0.16em] uppercase">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */
export function About() {
  const cards: FeatureCard[] = [
    {
      tone: "emerald",
      Icon: ShieldCheck,
      tag: "mission",
      title: "What I Do",
      body: "I find and analyze security vulnerabilities across web applications and infrastructure — translating technical findings into clear, actionable insights.",
      bullets: [
        { text: "Web application penetration testing", mark: "check" },
        { text: "Vulnerability assessment & reporting", mark: "check" },
        { text: "Security research & bug bounty hunting", mark: "check" },
      ],
      index: 0,
    },
    {
      tone: "sky",
      Icon: Compass,
      tag: "method",
      title: "My Approach",
      body: "Every test is conducted legally, with proper authorization, following industry-standard methodologies to ensure thorough coverage and meaningful results.",
      bullets: [
        { text: "Structured reconnaissance & enumeration", mark: "arrow" },
        { text: "Hands-on testing with industry-standard tools", mark: "arrow" },
        { text: "Clear documentation & remediation guidance", mark: "arrow" },
      ],
      index: 1,
    },
  ];

  return (
    <section className="relative py-24 px-6 md:px-10 bg-black overflow-hidden">
      <style>{ABOUT_KEYFRAMES}</style>

      {/* ambient bg */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(96,165,250,0.08), transparent 70%), radial-gradient(40% 40% at 80% 100%, rgba(167,139,250,0.06), transparent 70%)",
        }}
      />

      {/* header */}
      <div className="relative text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
          <span className="relative flex w-1.5 h-1.5">
            <span
              className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75"
              style={{
                animation: "about-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <Sparkles className="w-3 h-3 text-white/40" strokeWidth={2} />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
            whoami / identity
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            About Me
          </span>
        </h2>
        <p className="text-[15px] text-white/50 leading-relaxed max-w-2xl mx-auto">
          Cybersecurity student with hands-on experience in penetration
          testing, vulnerability assessment, and ethical hacking. Focused on
          practical skills, responsible disclosure, and building a solid
          foundation in offensive security.
        </p>
        <div
          aria-hidden
          className="mx-auto mt-8 h-px w-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </div>

      {/* feature cards */}
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-4 mb-4">
        {cards.map((card) => (
          <FeatureCard key={card.title} card={card} />
        ))}
      </div>

      {/* bottom showcase */}
      <ProfessionalBackground />
    </section>
  );
}

export default About;

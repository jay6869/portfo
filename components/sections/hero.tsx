"use client";

import { ArrowRight, Mail } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <Card className="h-[900px] md:h-screen bg-black relative overflow-hidden border-0 rounded-none">
      <div className="relative flex h-full overflow-hidden bg-black">
        <div className="relative z-10 flex flex-col justify-center p-10 md:p-14 flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5 backdrop-blur-sm w-fit mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-200">
              available for opportunities
            </span>
          </div>

          <p className="font-mono text-sm tracking-wider text-white/40">
            <span className="text-emerald-400">{">"}</span> hello_world.init() <span className="text-white/25">//</span> hi, i&apos;m
          </p>

          <h1
            className="mt-3 text-[clamp(3rem,8vw,6.2rem)] font-bold leading-[0.95] tracking-tight"
          >
            <span className="block text-white">Janith</span>
            <span className="block text-white">Godage.</span>
          </h1>

          <div className="mt-5 flex items-center gap-2 font-mono text-base sm:text-lg text-white/70">
            <span className="text-white/30">const role =</span>
            <span className="text-emerald-300">&quot;penetration tester.&quot;</span>
            <span className="inline-block h-5 w-[2px] bg-emerald-300 animate-pulse" />
          </div>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/55">
            Cybersecurity enthusiast chasing <span className="text-white/90">exploits</span>, breaking things <span className="text-emerald-300">ethically</span>, and leveling up in penetration testing.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              { t: "pentest", c: "#10b981" },
              { t: "red team", c: "#ef4444" },
              { t: "ctf player", c: "#38bdf8" },
              { t: "vuln research", c: "#a78bfa" },
            ].map((tag) => (
              <span
                key={tag.t}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${tag.c}33`, background: `${tag.c}0d`, color: tag.c }}
              >
                <span className="h-1 w-1 rounded-full" style={{ background: tag.c, boxShadow: `0 0 8px ${tag.c}` }} />
                {tag.t}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: "0 20px 40px -15px rgba(255,255,255,0.4)" }}
            >
              <span>View Projects</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              <Mail className="h-4 w-4 text-emerald-300" />
              Contact Me
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
            {[
              { k: "CTFs", v: "40+" },
              { k: "Reports", v: "120+" },
              { k: "CVEs", v: "12" },
            ].map((s) => (
              <div key={s.k} className="bg-[#070709] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {s.k}
                </div>
                <div className="mt-1 text-xl font-semibold text-white">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}

export default Hero

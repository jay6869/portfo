"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  // Github and Linkedin not available in this lucide build — use substitutes
  // (replaced below in channels list)
  Shield,
  Send,
  Lock,
  Radio,
  Terminal,
  Globe,
  Clock,
  KeyRound,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT — "SECURE CHANNEL" TERMINAL
   Self-contained: keyframes, hooks, styling — all in one file.
   Aesthetic: encrypted ops console / handshake protocol.
   ──────────────────────────────────────────────────────────────────────────── */

const CSS = `
@keyframes ct-rise { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0);} }
@keyframes ct-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes ct-scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(1200%)} }
@keyframes ct-pulse-ring {
  0%{ box-shadow:0 0 0 0 rgba(74,222,128,.45);}
  70%{ box-shadow:0 0 0 12px rgba(74,222,128,0);}
  100%{ box-shadow:0 0 0 0 rgba(74,222,128,0);}
}
@keyframes ct-grid-drift {
  0%{ background-position: 0 0, 0 0;}
  100%{ background-position: 40px 40px, 40px 40px;}
}
@keyframes ct-shine {
  0%{ transform: translateX(-120%);}
  100%{ transform: translateX(220%);}
}
@keyframes ct-cipher {
  0%,100%{ opacity:.25; transform: translateY(0);}
  50%{ opacity:.9; transform: translateY(-2px);}
}
@keyframes ct-bar {
  0%{ transform: scaleX(0); transform-origin: left;}
  100%{ transform: scaleX(1); transform-origin: left;}
}
@keyframes ct-marquee {
  0%{ transform: translateX(0);}
  100%{ transform: translateX(-50%);}
}

.ct-rise { animation: ct-rise .7s cubic-bezier(.2,.7,.2,1) both; }
.ct-mono { font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace; }

/* .ct-grid-bg removed — square pattern omitted */

.ct-input {
  width: 100%;
  background: rgba(10,12,16,.6);
  border: 1px solid rgba(255,255,255,.08);
  color: #e6edf3;
  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace;
  font-size: 13px;
  padding: 12px 14px 12px 38px;
  border-radius: 8px;
  outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ct-input::placeholder { color: rgba(255,255,255,.25); }
.ct-input:focus {
  border-color: rgba(74,222,128,.55);
  background: rgba(10,16,12,.7);
  box-shadow: 0 0 0 4px rgba(74,222,128,.08), inset 0 0 0 1px rgba(74,222,128,.2);
}
.ct-textarea { padding-left: 14px; min-height: 130px; resize: vertical; }

.ct-field-label {
  display:flex; align-items:center; justify-content:space-between;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 10px; letter-spacing:.18em; text-transform:uppercase;
  color: rgba(255,255,255,.4); margin-bottom:6px;
}

.ct-shine::after{
  content:""; position:absolute; top:0; bottom:0; width:40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
  transform: translateX(-120%);
  animation: ct-shine 3.2s ease-in-out infinite;
  pointer-events:none;
}
`;

/* ─── helpers ───────────────────────────────────────────────────────── */

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function Cipher({ value, length = 18 }: { value: string; length?: number }) {
  const masked = value
    ? value.slice(0, length).replace(/./g, "•").padEnd(length, "·")
    : "·".repeat(length);
  return (
    <span className="ct-mono text-[11px] text-emerald-300/70 tracking-widest">
      {masked}
    </span>
  );
}

/* ─── component ─────────────────────────────────────────────────────── */

export function Contact() {
  const { ref, seen } = useInView<HTMLElement>();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [time, setTime] = useState("");

  useEffect(() => {
    const t = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC"
      );
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const channels = [
    { icon: Mail, label: "Primary", title: "Email", value: "contact@janithgodage.com", link: "mailto:contact@janithgodage.com", color: "#4ade80" },
    // LinkedIn icon omitted (not exported); use Globe as a neutral network icon
    { icon: Globe, label: "Network", title: "LinkedIn", value: "/in/janithgodage", link: "https://www.linkedin.com/in/janith-godage-6953s/", color: "#60a5fa" },
    // GitHub icon omitted (not exported); use ArrowUpRight as external/source indicator
    { icon: ArrowUpRight, label: "Source", title: "GitHub", value: "@janithgodage", link: "https://github.com/jay6869", color: "#c084fc" },
    {
      icon: Shield,
      label: "CTF",
      title: "HackTheBox",
      value: "htb/profile",
      link: "https://hackthebox.com",
      color: "#f59e0b",
    },
  ];

  const filled =
    Object.values(form).filter((v) => v.trim().length > 0).length;
  const integrity = Math.round((filled / 4) * 100);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden bg-black py-24 px-4"
    >
      <style>{CSS}</style>

      {/* ambient grid + radial glow */}
      {/* grid background removed per request */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(74,222,128,.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(96,165,250,.06), transparent 50%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div
          className={seen ? "ct-rise" : "opacity-0"}
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center gap-3 ct-mono text-[10px] tracking-[0.25em] uppercase text-emerald-400/80 mb-4">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            secure_channel // open
            <span className="text-white/30">·</span>
            <span className="text-white/50">{time}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-3">
            Establish{" "}
            <span className="relative inline-block">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#4ade80,#34d399,#60a5fa)",
                }}
              >
                Contact
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            </span>
          </h2>
          <p className="text-white/50 max-w-xl text-sm md:text-base">
            Transmissions are end-to-end encrypted. Drop a packet — engagements,
            collaborations, or signals from the field.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          {/* ── FORM PANEL ─────────────────────────────────────────── */}
          <form
            action="https://send.pageclip.co/lvIFqS0kTXGC3DIV3ZPJgpKmr5MtnoSC"
            className={`pageclip-form relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur ${
              seen ? "ct-rise" : "opacity-0"
            }`}
            method="post"
            autoComplete="on"
            style={{ animationDelay: "120ms" }}
          >
            {/* terminal chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <Terminal className="ml-3 h-3.5 w-3.5 text-white/40" />
                <span className="ct-mono text-[11px] text-white/50">
                  ~/transmit/compose.sh
                </span>
              </div>
              <div className="flex items-center gap-2 ct-mono text-[10px] text-emerald-400/70 uppercase tracking-widest">
                <Lock className="h-3 w-3" /> tls 1.3
              </div>
            </div>

            {/* scan line */}
            <div className="relative">
              <div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none"
                style={{ animation: "ct-scan 6s linear infinite", top: 0 }}
              />

              <div className="p-6 md:p-8 space-y-5">
                {/* row: name + email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <div className="ct-field-label">
                      <span>01 // identifier</span>
                      <Cipher value={form.name} length={10} />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="agent_name"
                        className="ct-input"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="ct-field-label">
                      <span>02 // callback</span>
                      <Cipher value={form.email} length={10} />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="user@domain.tld"
                        className="ct-input"
                      />
                    </div>
                  </div>
                </div>

                {/* subject */}
                <div>
                  <div className="ct-field-label">
                    <span>03 // payload header</span>
                    <Cipher value={form.subject} length={14} />
                  </div>
                  <div className="relative">
                    <Radio className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      required
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      placeholder="re: pentest engagement"
                      className="ct-input"
                    />
                  </div>
                </div>

                {/* message */}
                <div>
                  <div className="ct-field-label">
                    <span>04 // payload body</span>
                    <span className="ct-mono text-[10px] text-white/40">
                      {form.message.length} bytes
                    </span>
                  </div>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="> compose transmission..."
                    className="ct-input ct-textarea"
                  />
                </div>

                {/* integrity bar */}
                <div>
                  <div className="ct-field-label">
                    <span>packet integrity</span>
                    <span className="ct-mono text-[10px] text-emerald-400/80">
                      {integrity}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${integrity}%`,
                        background:
                          "linear-gradient(90deg,#4ade80,#34d399,#60a5fa)",
                        boxShadow: "0 0 12px rgba(74,222,128,.5)",
                      }}
                    />
                  </div>
                </div>

                {/* submit */}
                <button
                  type="submit"
                  className="pageclip-form__submit ct-shine relative w-full overflow-hidden group rounded-lg border border-emerald-400/30 bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/15 hover:from-emerald-500/25 hover:to-emerald-500/25 transition px-5 py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-90"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(74,222,128,.1), 0 10px 40px -10px rgba(74,222,128,.45)",
                  }}
                >
                  <Send className="h-4 w-4 text-emerald-300" />
                  <span className="ct-mono text-[12px] uppercase tracking-[0.2em] text-emerald-200">
                    transmit packet
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </button>

                {/* footer log */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="ct-mono text-[10px] text-white/40 flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
                      style={{ animation: "ct-blink 1.4s infinite" }}
                    />
                    handshake_ok · peer_verified
                  </div>
                  <div className="ct-mono text-[10px] text-white/40">
                    fingerprint:{" "}
                    <span className="text-emerald-400/70">
                      9F:2A:B1:7C:E0:44
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* ── SIDE PANEL ─────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Channels */}
            <div
              className={`rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 ${
                seen ? "ct-rise" : "opacity-0"
              }`}
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="ct-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  alt_channels
                </div>
                <div className="ct-mono text-[10px] text-emerald-400/70">
                  {channels.length} routes
                </div>
              </div>

              <div className="space-y-2">
                {channels.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.title}
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-3 rounded-lg border border-white/[0.06] bg-black/30 p-3 hover:border-white/20 hover:bg-black/50 transition"
                      style={{
                        animation: seen
                          ? `ct-rise .6s ${260 + i * 70}ms both`
                          : undefined,
                      }}
                    >
                      <div
                        className="relative flex h-10 w-10 items-center justify-center rounded-lg border"
                        style={{
                          borderColor: `${c.color}40`,
                          background: `${c.color}10`,
                        }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: c.color }}
                        />
                        <span
                          className="absolute inset-0 rounded-lg"
                          style={{
                            boxShadow: `0 0 18px -4px ${c.color}80`,
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">
                            {c.title}
                          </span>
                          <span
                            className="ct-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                            style={{
                              color: c.color,
                              background: `${c.color}15`,
                              border: `1px solid ${c.color}30`,
                            }}
                          >
                            {c.label}
                          </span>
                        </div>
                        <div className="ct-mono text-[11px] text-white/40 truncate">
                          {c.value}
                        </div>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white/80 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* SLA / response */}
            <div
              className={`relative overflow-hidden rounded-2xl border border-emerald-400/20 p-5 ${
                seen ? "ct-rise" : "opacity-0"
              }`}
              style={{
                animationDelay: "340ms",
                background:
                  "linear-gradient(135deg, rgba(16,185,129,.12), rgba(59,130,246,.06) 60%, transparent)",
              }}
            >
              <div
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(74,222,128,.35), transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-400/30"
                  style={{ animation: "ct-pulse-ring 2.4s infinite" }}
                >
                  <Clock className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <div className="ct-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80 mb-1">
                    response_sla
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    &lt; 24h average reply
                  </h4>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Critical security incidents are triaged on priority. Tag
                    subject as{" "}
                    <span className="ct-mono text-emerald-300/90">
                      [URGENT]
                    </span>{" "}
                    for same-day response.
                  </p>
                </div>
              </div>

              {/* mini stats */}
              <div className="relative mt-4 grid grid-cols-3 gap-2">
                {[
                  { k: "uptime", v: "99.9%" },
                  { k: "reply", v: "<24h" },
                  { k: "tz", v: "GMT+5:30" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-md border border-white/[0.08] bg-black/30 px-2.5 py-2"
                  >
                    <div className="ct-mono text-[9px] uppercase tracking-widest text-white/40">
                      {s.k}
                    </div>
                    <div className="ct-mono text-xs text-emerald-300">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* region / geo */}
            <div
              className={`rounded-2xl border border-white/[0.08] bg-black/30 p-4 flex items-center gap-3 ${
                seen ? "ct-rise" : "opacity-0"
              }`}
              style={{ animationDelay: "440ms" }}
            >
              <Globe className="h-4 w-4 text-blue-400" />
              <div className="flex-1">
                <div className="ct-mono text-[10px] uppercase tracking-widest text-white/40">
                  operating_region
                </div>
                <div className="text-white/80 text-sm">
                  Colombo, LK · remote worldwide
                </div>
              </div>
              <span className="ct-mono text-[10px] text-emerald-400/80">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom telemetry marquee */}
        <div className="relative mt-10 overflow-hidden border-y border-white/[0.06] py-2">
          <div
            className="flex gap-10 whitespace-nowrap ct-mono text-[10px] uppercase tracking-[0.25em] text-white/30"
            style={{ animation: "ct-marquee 40s linear infinite", width: "200%" }}
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-10">
                <span>· secure_channel established</span>
                <span className="text-emerald-400/60">· tls 1.3 / aes-256-gcm</span>
                <span>· peer_fingerprint verified</span>
                <span className="text-blue-400/60">· latency 42ms</span>
                <span>· integrity sha-256 ok</span>
                <span className="text-emerald-400/60">· awaiting transmission</span>
                <span>· logs → /var/log/secure</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

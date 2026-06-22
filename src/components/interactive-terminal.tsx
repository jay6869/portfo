"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tone = "out" | "accent" | "warn" | "error";
interface Line {
  kind: "in" | "out";
  text: string;
  tone?: Tone;
  /** Render as a no-wrap monospace block (ASCII art) with horizontal scroll. */
  block?: boolean;
  /** Prompt path captured at the time an input line was entered. */
  path?: string;
}

const BANNER = ` ██╗ █████╗ ███╗   ██╗██╗████████╗██╗  ██╗
 ██║██╔══██╗████╗  ██║██║╚══██╔══╝██║  ██║
 ██║███████║██╔██╗ ██║██║   ██║   ███████║
 ██║██╔══██║██║╚██╗██║██║   ██║   ██╔══██║
██████╗██║  ██║██║ ╚████║██║   ██║   ██║  ██║
╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝`;

const NEOFETCH = `      ▄▄▄▄▄        janith@portfolio
    ▄█████████▄      ─────────────────
   ██▀  ▄▄▄  ▀██     os       Kali GNU/Linux (rolling)
   ██  █▀ ▀█  ██     shell    zsh 5.9
   ██  █▄▄▄█  ██     role     penetration tester (jr)
   ▀██▄▄▄▄▄▄▄██▀     focus    offsec · detection eng
     ▀███████▀       editor   nvim · vscode
       ▀▀▀▀▀         uptime   3y · still learning
                     certs    OPSWAT Academy · Intro to CIP`;

// help text is generated from this registry so it never drifts.
const MANUAL: Record<string, string> = {
  help: "list available commands",
  whoami: "short bio",
  "cat skills": "skill summary by domain",
  "ls projects": "list project repos",
  projects: "alias for `ls projects`",
  education: "academic background",
  contact: "how to reach me",
  neofetch: "system info, hacker style",
  banner: "print the name banner",
  date: "current date and time",
  "echo <text>": "print text back",
  pwd: "print working directory",
  "cd <dir>": "change directory (try `cd projects`)",
  "uname -a": "kernel / system string",
  "nmap <host>": "run a (simulated) port scan",
  history: "show command history",
  sudo: "elevate privileges (good luck)",
  coffee: "brew a cup",
  "man <cmd>": "manual page for a command",
  clear: "clear the screen",
};

// commands offered for Tab-completion and the quick-chip row.
const COMPLETIONS = [
  "help", "whoami", "cat skills", "ls projects", "projects", "education",
  "contact", "neofetch", "banner", "date", "echo", "pwd", "cd", "uname -a",
  "nmap", "history", "sudo", "coffee", "man", "clear",
];
const CHIPS = ["whoami", "neofetch", "cat skills", "ls projects", "nmap localhost", "help"];

const RESPONSES: Record<string, string> = {
  whoami: "janith godage · cybersecurity undergraduate at sliit · sri lanka\naspiring penetration tester · builder of detection tooling",
  "cat skills": "offensive: burp, sqlmap, ffuf, metasploit\nrecon:     nmap, wireshark, responder\ndetection: wazuh, suricata, sigma\nenv:       kali, docker, tmux",
  "ls projects": "sec-misconfig-finder/   port-scanner/",
  projects: "sec-misconfig-finder/   port-scanner/",
  education: "sliit · bsc (hons) information technology — cybersecurity\n3rd year · gpa: solid · focus: offensive security & detection",
  contact: "email:    hello@example.com\ngithub:   github.com/janith\nlinkedin: linkedin.com/in/janith\npgp:      on request",
  pwd: "/home/janith",
  "uname -a": "Linux portfolio 6.8.0-kali #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",
};

function nmapScan(target: string): Line[] {
  const host = target || "localhost";
  return [
    { kind: "out", text: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${host} (127.0.0.1)\nHost is up (0.00012s latency).\n` },
    { kind: "out", tone: "accent", text: "PORT     STATE SERVICE" },
    { kind: "out", text: "22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n1337/tcp open  waste" },
    { kind: "out", tone: "warn", text: "Note: this is a simulated scan. Do not scan hosts you don't own." },
  ];
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", tone: "accent", text: "janith@portfolio — interactive shell" },
    { kind: "out", text: "type 'help' for commands · 'neofetch' for vibes · ↑/↓ for history · Tab to complete" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const helpText = useMemo(() => {
    const rows = Object.entries(MANUAL).map(
      ([cmd, desc]) => `  ${cmd.padEnd(14)}— ${desc}`,
    );
    return "available commands:\n" + rows.join("\n");
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [lines]);

  const exec = (raw: string): Line[] | "clear" => {
    const trimmed = raw.trim();
    const cmd = trimmed.toLowerCase();
    const [head, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");
    const out = (text: string, tone?: Tone, block?: boolean): Line[] => [{ kind: "out", text, tone, block }];

    if (cmd === "") return [];
    if (cmd === "clear" || cmd === "cls") return "clear";
    if (cmd === "help" || cmd === "?") return out(helpText);
    if (cmd === "banner") return out(BANNER, "accent", true);
    if (cmd === "neofetch" || cmd === "screenfetch") return out(NEOFETCH, "accent", true);
    if (cmd === "date") return out(new Date().toString());
    if (cmd === "history") {
      return out(history.length ? history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`).join("\n") : "(no history yet)");
    }
    if (head.toLowerCase() === "echo") return out(arg || "");
    if (head.toLowerCase() === "nmap") return nmapScan(arg);
    if (head.toLowerCase() === "sudo") return out(`[sudo] password for janith: \nSorry, try again. (nice try though 😏)`, "warn");
    if (cmd === "coffee" || cmd === "make coffee") return out("HTTP 418: I'm a teapot. ☕ brewing denied.", "warn");
    if (cmd === "exit" || cmd === "quit") return out("there is no escape. (you're hired though — try `contact`)", "accent");
    if (head.toLowerCase() === "man") {
      const key = Object.keys(MANUAL).find((k) => k.split(" ")[0] === arg.toLowerCase());
      return out(key ? `${arg} — ${MANUAL[key]}` : `No manual entry for ${arg || "''"}`);
    }
    if (head.toLowerCase() === "cd") {
      let next = cwd;
      if (!arg || arg === "~") next = "~";
      else if (arg === "..") next = cwd === "~" ? "~" : "~";
      else if (["projects", "writeups", "skills"].includes(arg.toLowerCase())) next = `~/${arg.toLowerCase()}`;
      else return out(`cd: no such file or directory: ${arg}`, "error");
      setCwd(next);
      return [];
    }
    if (head.toLowerCase() === "ls" && (arg === "-la" || arg === "-l" || arg === "-al")) {
      return out("drwxr-xr-x  projects/\ndrwxr-xr-x  writeups/\n-rw-r--r--  about.md\n-rw-------  flag.txt");
    }
    if (cmd in RESPONSES) return out(RESPONSES[cmd]);

    return out(`bash: ${head}: command not found · try 'help'`, "error");
  };

  const run = (raw: string) => {
    const inLine: Line = { kind: "in", text: raw, path: cwd };
    if (raw.trim() !== "") setHistory((h) => [...h, raw]);
    const result = exec(raw);
    if (result === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [...prev, inLine, ...result]);
    }
  };

  const submit = () => {
    run(input);
    setCursor(history.length + (input.trim() ? 1 : 0));
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = Math.max(0, (cursor === history.length ? history.length : cursor) - 1);
      setCursor(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const i = Math.min(history.length, cursor + 1);
      setCursor(i);
      setInput(i === history.length ? "" : history[i]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = input.toLowerCase();
      if (!v) return;
      const matches = COMPLETIONS.filter((c) => c.startsWith(v));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { kind: "in", text: input, path: cwd },
          { kind: "out", text: matches.join("   ") },
        ]);
      }
    }
  };

  const Prompt = ({ path }: { path: string }) => (
    <>
      <span className="text-[color:var(--signal)]">janith@portfolio</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-[color:var(--info)]">{path}</span>
      <span className="text-muted-foreground">$ </span>
    </>
  );

  const toneClass: Record<Tone, string> = {
    out: "text-muted-foreground",
    accent: "text-[color:var(--signal)]",
    warn: "text-[color:var(--warn)]",
    error: "text-destructive",
  };

  return (
    <div
      className="hairline scanlines overflow-hidden rounded-lg bg-[color:var(--surface)] transition-shadow focus-within:border-[color:var(--signal)]/40 focus-within:shadow-[var(--glow-signal-soft)]"
      onClick={() => inputRef.current?.focus()}
      role="group"
      aria-label="Interactive terminal — type a command and press Enter"
    >
      <div className="flex items-center justify-between border-b border-border bg-[color:var(--surface-2)] px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f56]/70" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]/70" />
          <span className="size-2.5 rounded-full bg-[#27c93f]/70" />
        </div>
        <div className="mono text-[11px] text-muted-foreground">janith@portfolio: {cwd}</div>
        <div className="w-9" />
      </div>

      <div
        ref={scrollRef}
        className="mono max-h-[380px] overflow-y-auto p-4 text-[12.5px] leading-relaxed"
        aria-live="polite"
      >
        {lines.map((l, i) =>
          l.kind === "in" ? (
            <div key={i} className="text-foreground">
              <Prompt path={l.path ?? "~"} />
              {l.text}
            </div>
          ) : (
            <pre
              key={i}
              className={`mt-1 ${l.block ? "overflow-x-auto whitespace-pre" : "whitespace-pre-wrap"} ${toneClass[l.tone ?? "out"]}`}
            >
              {l.text}
            </pre>
          ),
        )}
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-2 flex items-center">
          <Prompt path={cwd} />
          <input
            ref={inputRef}
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="terminal input — ↑/↓ for history, Tab to complete"
            className="mono flex-1 bg-transparent text-foreground caret-[color:var(--signal)] outline-none"
          />
        </form>
      </div>

      {/* Quick command chips — discoverable + clickable */}
      <div className="flex flex-wrap gap-1.5 border-t border-border bg-[color:var(--surface-2)]/50 px-3 py-2.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => { e.stopPropagation(); run(c); inputRef.current?.focus(); }}
            className="mono rounded border border-border px-2 py-0.5 text-[10.5px] text-muted-foreground transition-colors hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

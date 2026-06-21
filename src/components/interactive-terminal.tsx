import { useEffect, useRef, useState } from "react";

interface Line { kind: "in" | "out"; text: string }

const HELP = `available commands:
  whoami       — short bio
  cat skills   — skill summary
  ls projects  — list projects
  education    — academic background
  contact      — how to reach me
  clear        — clear the screen
  help         — show this message`;

const RESPONSES: Record<string, string> = {
  whoami: "janith godage · cybersecurity undergraduate at sliit · sri lanka\naspiring penetration tester · builder of detection tooling",
  "cat skills": "offensive: burp, sqlmap, ffuf, metasploit\nrecon:     nmap, wireshark, responder\ndetection: wazuh, suricata, sigma\nenv:       kali, docker, tmux",
  "ls projects": "dns-exfil-sentinel/   soc-platform/\nwifi-csi-research/    nmap-scanner-api/",
  education: "sliit · bsc (hons) information technology — cybersecurity\n3rd year · gpa: solid · focus: offensive security & detection",
  contact: "email:    hello@example.com\ngithub:   github.com/janith\nlinkedin: linkedin.com/in/janith\npgp:      on request",
};

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "session started · type 'help' to see commands" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const next: Line[] = [...lines, { kind: "in", text: raw }];
    if (cmd === "") { setLines(next); return; }
    if (cmd === "clear") { setLines([]); return; }
    if (cmd === "help") { setLines([...next, { kind: "out", text: HELP }]); return; }
    if (cmd in RESPONSES) { setLines([...next, { kind: "out", text: RESPONSES[cmd] }]); return; }
    setLines([...next, { kind: "out", text: `bash: ${cmd}: command not found · try 'help'` }]);
  };

  return (
    <div
      className="hairline scanlines overflow-hidden rounded-lg bg-[color:var(--surface)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-border bg-[color:var(--surface-2)] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="size-2.5 rounded-full bg-[#3a3a3a]" />
        </div>
        <div className="mono text-[11px] text-muted-foreground">janith@portfolio:~</div>
        <div className="w-9" />
      </div>
      <div ref={scrollRef} className="mono max-h-[360px] overflow-y-auto p-4 text-[12.5px] leading-relaxed">
        {lines.map((l, i) =>
          l.kind === "in" ? (
            <div key={i} className="text-foreground">
              <span className="text-[color:var(--signal)]">janith@portfolio</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-[color:var(--info)]">~</span>
              <span className="text-muted-foreground">$ </span>
              {l.text}
            </div>
          ) : (
            <pre key={i} className="mt-1 whitespace-pre-wrap text-muted-foreground">{l.text}</pre>
          ),
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
          className="mt-2 flex items-center"
        >
          <span className="text-[color:var(--signal)]">janith@portfolio</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-[color:var(--info)]">~</span>
          <span className="mr-1 text-muted-foreground">$</span>
          <input
            ref={inputRef}
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="terminal input"
            className="mono flex-1 bg-transparent text-foreground caret-[color:var(--signal)] outline-none"
          />
        </form>
      </div>
    </div>
  );
}

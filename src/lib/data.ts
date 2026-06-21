export type ProjectType = "TOOL" | "RESEARCH" | "PLATFORM";
export type ProjectTag = "Web" | "ICS/OT" | "Detection" | "Tooling" | "Network" | "Research";

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  oneLiner: string;
  description: string;
  tags: ProjectTag[];
  stack: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  problem: string;
  approach: string[];
  outcome: string[];
  code?: { lang: string; title: string; body: string };
}

export const projects: Project[] = [
  {
    slug: "dns-exfil-sentinel",
    title: "DNS Exfil Sentinel",
    type: "TOOL",
    oneLiner: "Entropy-based detector for DNS tunneling and data exfiltration.",
    description:
      "A passive sensor that watches DNS query streams and flags subdomains whose character entropy, length distribution, and request cadence look like covert channels — not human traffic.",
    tags: ["Detection", "Network", "Tooling"],
    stack: ["Python", "Scapy", "Shannon Entropy", "SQLite", "Grafana"],
    github: "https://github.com",
    featured: true,
    problem:
      "Most DNS exfiltration toolchains (iodine, dnscat2, custom C2) defeat naive blocklists because the payload rides legitimate-looking subdomain queries. Defenders need a behavioural signal, not an IOC list.",
    approach: [
      "Capture queries with Scapy, normalise the leftmost label and compute Shannon entropy.",
      "Score on a weighted combination of entropy, label length, NXDOMAIN ratio and per-second query cadence per source.",
      "Stream rolling scores into SQLite with a Grafana panel for analyst triage.",
      "Tunable allowlist for CDN and telemetry domains to keep false positives low."
    ],
    outcome: [
      "Detected a simulated dnscat2 channel within 14 seconds of first beacon.",
      "False positive rate under 0.4% across a week of home-lab baseline traffic."
    ],
    code: {
      lang: "python",
      title: "scoring.py",
      body: `def entropy(label: str) -> float:
    counts = Counter(label)
    n = len(label) or 1
    return -sum((c / n) * math.log2(c / n) for c in counts.values())

def score(query: DnsQuery) -> float:
    e   = entropy(query.leftmost_label)
    ln  = len(query.leftmost_label)
    cad = query.source.qps_window(30)
    # Normalised, weighted, clipped to [0, 1]
    return min(1.0, 0.55 * (e / 4.5) + 0.25 * (ln / 50) + 0.20 * (cad / 40))`,
    },
  },
  {
    slug: "soc-platform",
    title: "SOC Platform",
    type: "PLATFORM",
    oneLiner: "Lightweight blue-team workbench: Wazuh SIEM, scanner API, unified dashboard.",
    description:
      "A self-hosted SOC starter kit that wires Wazuh, a Node.js scanning service, and a single operator dashboard into a coherent workflow for small teams and student labs.",
    tags: ["Detection", "Tooling", "Network"],
    stack: ["Wazuh", "Node.js", "Fastify", "Docker", "React", "PostgreSQL"],
    github: "https://github.com",
    featured: true,
    problem:
      "Open-source SOC stacks ship powerful primitives but expect operators to glue them together themselves. Students lose days on wiring before they learn detection engineering.",
    approach: [
      "Docker Compose stack: Wazuh manager, indexer, dashboard plus a Fastify scanner API.",
      "Single React console aggregates alerts, scan results and asset inventory.",
      "Webhook bridge turns scanner findings into Wazuh custom rules.",
      "First-run wizard provisions agents and seeds detection content."
    ],
    outcome: [
      "Bring-up time from ~4 hours of manual config to under 8 minutes.",
      "Used as the lab spine for an intro-to-blue-team workshop (24 students)."
    ],
  },
  {
    slug: "wifi-csi-security",
    title: "WiFi-CSI Security Research",
    type: "RESEARCH",
    oneLiner: "Channel State Information spoofing and replay on ESP32-S3.",
    description:
      "Hands-on research exploring whether WiFi CSI — increasingly used for presence detection and gesture sensing — can be spoofed or replayed by a low-cost attacker holding an ESP32-S3.",
    tags: ["Research", "Network"],
    stack: ["ESP32-S3", "ESP-IDF", "C", "NumPy", "Matplotlib"],
    featured: true,
    problem:
      "CSI-based sensing is moving into commercial products (occupancy, fall detection) under the assumption that the underlying radio metadata is hard to forge. That assumption deserves scrutiny.",
    approach: [
      "Captured baseline CSI from a controlled 2.4GHz environment with ESP-IDF.",
      "Replayed crafted frames timed against the AP beacon to inject synthetic CSI snapshots.",
      "Compared spectrograms of legitimate vs. spoofed presence events.",
      "Followed responsible-disclosure flow before publishing technical detail."
    ],
    outcome: [
      "Reproduced a 'phantom presence' against an off-the-shelf CSI-based occupancy demo.",
      "Writeup accepted for an internal university security seminar."
    ],
  },
  {
    slug: "nmap-scanner-api",
    title: "Nmap Scanner API",
    type: "TOOL",
    oneLiner: "Production-shaped Node.js service that wraps Nmap with auth, queueing and structured output.",
    description:
      "A small but opinionated REST API that turns ad-hoc nmap invocations into a queued, authenticated, JSON-first service suitable for embedding in larger security platforms.",
    tags: ["Tooling", "Network"],
    stack: ["Node.js", "TypeScript", "Fastify", "BullMQ", "Redis", "Zod"],
    github: "https://github.com",
    featured: true,
    problem:
      "Teams keep re-implementing the same thin wrapper around nmap — usually badly, with shell injection, no rate limiting and unstructured output.",
    approach: [
      "Typed request schemas with Zod; the CLI is never reachable from user input.",
      "BullMQ job queue with per-tenant concurrency and timeout budgets.",
      "Streaming progress over SSE; final result normalised into a stable JSON schema.",
      "API-key auth with scoped permissions (`scan:read`, `scan:write`)."
    ],
    outcome: [
      "Powers the scanner module of the SOC Platform.",
      "Sustains ~30 concurrent scans on a 2-vCPU node with predictable latency."
    ],
    code: {
      lang: "typescript",
      title: "routes/scan.ts",
      body: `const ScanInput = z.object({
  target: z.string().regex(CIDR_OR_HOST),
  profile: z.enum(["quick", "service", "vuln"]),
  ports: z.string().regex(/^[0-9,\\-]+$/).optional(),
});

app.post("/scans", { preHandler: requireScope("scan:write") }, async (req) => {
  const input = ScanInput.parse(req.body);
  const job = await scanQueue.add("nmap", input, {
    attempts: 1,
    removeOnComplete: 200,
  });
  return { id: job.id, status: "queued" };
});`,
    },
  },
];

export interface Writeup {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
  body: { type: "p" | "h2" | "code" | "callout" | "list"; text?: string; items?: string[]; lang?: string }[];
}

export const writeups: Writeup[] = [
  {
    slug: "shannon-entropy-dns-tunnels",
    title: "Catching DNS Tunnels with Shannon Entropy",
    date: "2025-04-18",
    readingTime: "7 min",
    excerpt:
      "Why string entropy is a surprisingly effective first filter for DNS exfiltration — and where it falls down.",
    tags: ["Detection", "DNS", "Blue Team"],
    body: [
      { type: "p", text: "DNS makes a great covert channel because it's nearly always allowed outbound. The defender's problem is that the bytes look like names, and names look like anything." },
      { type: "h2", text: "The signal" },
      { type: "p", text: "Human-friendly domains cluster around low-to-mid Shannon entropy. Encoded payloads — base32, base64-ish — sit much higher because their character distribution is closer to uniform." },
      { type: "code", lang: "python", text: `def entropy(s: str) -> float:
    n = len(s) or 1
    return -sum((c / n) * math.log2(c / n) for c in Counter(s).values())` },
      { type: "h2", text: "Where it breaks" },
      { type: "list", items: [
        "CDNs and analytics platforms emit high-entropy hostnames legitimately.",
        "Short labels make entropy noisy — combine with length and cadence.",
        "Attackers can throttle and pad to dodge naive thresholds."
      ]},
      { type: "callout", text: "Responsible disclosure: any analysis in this post was performed on traffic I generated in my own lab. Do not point detectors at networks you don't own." },
    ],
  },
  {
    slug: "esp32-csi-replay",
    title: "Notes on Spoofing WiFi CSI from an ESP32-S3",
    date: "2025-03-02",
    readingTime: "9 min",
    excerpt: "Field notes from a small research project replaying channel-state-information frames against a commercial occupancy sensor.",
    tags: ["Research", "WiFi", "Hardware"],
    body: [
      { type: "p", text: "Channel State Information has quietly become the sensing fabric behind a generation of presence and gesture products. This post documents what happens when you treat it as untrusted input." },
      { type: "h2", text: "Setup" },
      { type: "p", text: "One ESP32-S3 as a passive sniffer, a second as a crafted-frame transmitter, both clocked against the same AP beacon. A laptop captures CSI snapshots for offline comparison." },
      { type: "callout", text: "I worked with the affected vendor before publishing implementation specifics. Timelines and exact payload shapes are intentionally omitted." },
    ],
  },
  {
    slug: "nmap-as-a-service",
    title: "Designing Nmap-as-a-Service Without Footguns",
    date: "2025-01-21",
    readingTime: "6 min",
    excerpt: "Wrapping a CLI tool in an HTTP API is a magnet for shell injection and resource exhaustion. Here's the shape that worked.",
    tags: ["Tooling", "Node.js", "API Design"],
    body: [
      { type: "p", text: "Every team eventually wants 'just an endpoint that runs nmap'. The honest version of that endpoint has more moving parts than you'd think." },
      { type: "h2", text: "Never touch the shell" },
      { type: "p", text: "Zod-validated inputs map onto an allowlist of nmap flags. The CLI is invoked via spawn with an argv array — there is no string template anywhere in the request path." },
    ],
  },
];

export interface SkillGroup {
  domain: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { domain: "Web Exploitation", items: ["Burp Suite", "sqlmap", "ffuf", "OWASP Top 10", "JWT abuse"] },
  { domain: "Network & Recon", items: ["Nmap", "Wireshark", "Metasploit", "Responder", "Bloodhound"] },
  { domain: "Detection / Blue Team", items: ["Wazuh", "Suricata", "Sigma", "ELK", "MITRE ATT&CK"] },
  { domain: "Crypto & Reversing", items: ["Ghidra", "radare2", "pwntools", "GDB", "Frida"] },
  { domain: "Environments", items: ["Kali", "Docker", "Linux", "VSCode", "tmux"] },
];

export interface Cert {
  name: string;
  provider: string;
  progress: number;
  status: "In progress" | "Planned" | "Complete";
}

export const certs: Cert[] = [
  { name: "Web Security Academy", provider: "PortSwigger", progress: 62, status: "In progress" },
  { name: "Pentester Path", provider: "HackTheBox Academy", progress: 48, status: "In progress" },
  { name: "Certified in Cybersecurity (CC)", provider: "ISC2", progress: 30, status: "In progress" },
  { name: "OSCP", provider: "OffSec", progress: 0, status: "Planned" },
];

// Static site config that is NOT long-form content. Projects and writeups now
// live in /content/*.mdx and are read via @/lib/posts.

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

export interface Role {
  /** The short form, set at display scale on the card. */
  org: string;
  /** Spelled out beneath it — recruiters outside Sri Lanka won't know the acronym. */
  orgFull: string;
  title: string;
  /** "YYYY-MM". Month precision only — the record does not hold a day. */
  start: string;
  /** Omit while the role is ongoing. */
  end?: string;
  summary: string;
  areas: { code: string; label: string }[];
}

export const currentRole: Role = {
  org: "AASL",
  orgFull: "Airport & Aviation Services (Sri Lanka)",
  title: "Cybersecurity Intern",
  start: "2026-09",
  summary:
    "I'm interning on the security side at the company that runs Sri Lanka's airports. Most of my time goes into monitoring, vulnerability assessments and network work.",
  areas: [
    { code: "SOC", label: "Security monitoring" },
    { code: "VULN", label: "Vulnerability assessment" },
    { code: "NET", label: "Network & infrastructure" },
  ],
};

export interface Cert {
  name: string;
  provider: string;
  progress: number;
  status: "In progress" | "Planned" | "Complete";
  /** Public verification / badge link for earned credentials. */
  credentialUrl?: string;
}

export const certs: Cert[] = [
  {
    name: "Certified Cybersecurity Foundations",
    provider: "Hackviser",
    progress: 100,
    status: "Complete",
    credentialUrl: "https://hackviser.com/verify?id=HV-CORE-L1RRIFZQ",
  },
  {
    // No public verification link for this one — the field is omitted rather
    // than set to "", so the UI simply renders no Verify affordance instead of
    // an empty link. Add the URL here if one becomes available.
    name: "AWS Security Fundamentals",
    provider: "Amazon Web Services (AWS)",
    progress: 100,
    status: "Complete",
  },
  {
    name: "AWS Educate Introduction to Cloud 101",
    provider: "AWS Educate",
    progress: 100,
    status: "Complete",
    credentialUrl: "https://www.credly.com/badges/24559688-eabe-4309-a372-fa485fdf7a05/public_url",
  },
  {
    name: "Python Essentials 1",
    provider: "Cisco",
    progress: 100,
    status: "Complete",
    credentialUrl: "https://www.credly.com/badges/e9e3aca2-e1f0-4d30-9353-34d064326fb2/public_url",
  },
  {
    name: "Introduction to CIP",
    provider: "OPSWAT Academy",
    progress: 100,
    status: "Complete",
    credentialUrl: "https://learn.opswatacademy.com/certificate/U6ckeSIWaw",
  },
];

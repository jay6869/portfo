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
    name: "Introduction to CIP",
    provider: "OPSWAT Academy",
    progress: 100,
    status: "Complete",
    credentialUrl: "https://learn.opswatacademy.com/certificate/U6ckeSIWaw",
  },
];

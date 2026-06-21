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
}

export const certs: Cert[] = [
  { name: "Web Security Academy", provider: "PortSwigger", progress: 62, status: "In progress" },
  { name: "Pentester Path", provider: "HackTheBox Academy", progress: 48, status: "In progress" },
  { name: "Certified in Cybersecurity (CC)", provider: "ISC2", progress: 30, status: "In progress" },
  { name: "OSCP", provider: "OffSec", progress: 0, status: "Planned" },
];

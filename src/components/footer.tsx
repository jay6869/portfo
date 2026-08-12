import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        {/* No opacity stacking here: opacity-60 over --muted-foreground
            computed to 3.12:1, under AA. The token alone measures 6.9:1. */}
        <div className="mono text-xs text-muted-foreground">
          <span className="text-[color:var(--signal)]/80">$</span> echo &quot;built with care · secured by default&quot;
          <div className="mt-1 text-[11px]">
            © {new Date().getFullYear()} Janith Godage · all rights reserved
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/jay6869" target="_blank" rel="noreferrer noopener"
             className="hairline hover-lift inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
             aria-label="GitHub">
            <Github className="size-4" />
          </a>
          <a href="https://www.linkedin.com/in/janith-godage-6953s/" target="_blank" rel="noreferrer noopener"
             className="hairline hover-lift inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
             aria-label="LinkedIn">
            <Linkedin className="size-4" />
          </a>
          <a href="mailto:janithzgodage@gmail.com"
             className="hairline hover-lift inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
             aria-label="Email">
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

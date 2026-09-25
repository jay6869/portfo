import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const iconLink =
  "hairline hover-lift inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 pt-10 sm:px-6 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-12">
        <div>
          <div className="brand-mark" aria-hidden>
            J<span className="display-outline">G</span>
          </div>
          <p className="label mt-3 text-muted-foreground">
            © {new Date().getFullYear()} Janith Godage · Sri Lanka
          </p>
        </div>

        {/* For a security portfolio, an open invitation to find bugs in the
            site itself says more than a tagline would. It points at the
            security.txt the site already publishes. */}
        <a
          href="/.well-known/security.txt"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Found a bug in this site? Tell me
          <ArrowUpRight className="size-3.5 text-[color:var(--signal)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <div className="flex items-center gap-2">
          <a href="https://github.com/jay6869" target="_blank" rel="noreferrer noopener" className={iconLink} aria-label="GitHub">
            <Github className="size-4" />
          </a>
          <a href="https://www.linkedin.com/in/janith-godage-6953s/" target="_blank" rel="noreferrer noopener" className={iconLink} aria-label="LinkedIn">
            <Linkedin className="size-4" />
          </a>
          <a href="mailto:janithzgodage@gmail.com" className={iconLink} aria-label="Email">
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

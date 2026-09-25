import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center px-5 py-16 sm:px-8">
      <p className="label text-[color:var(--signal)]/70">404</p>
      <h1 className="display display-section mt-4 text-foreground">
        Nothing
        <br />
        <span className="display-outline">here.</span>
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        This page doesn&apos;t exist, or it moved. The links below go somewhere real.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {[
          { href: "/", label: "Home" },
          { href: "/projects", label: "Projects" },
          { href: "/writeups", label: "Writeups" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="label group inline-flex items-center gap-2 transition-colors hover:text-[color:var(--signal)]"
          >
            {l.label}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="hairline w-full max-w-xl rounded-lg bg-[color:var(--surface)] p-6 sm:p-8">
        <div className="mono text-[11px] uppercase tracking-widest text-[color:var(--signal)]/80">
          status · 404
        </div>
        <h1 className="mono mt-3 text-2xl text-foreground sm:text-3xl">
          <span className="text-[color:var(--signal)]">$</span> {`{cwd}: command not found`}
        </h1>
        <p className="mono mt-3 text-sm text-muted-foreground">
          bash: the page you were looking for is not on this host.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            cd ~/home
          </Link>
          <Link href="/projects" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            ls projects/
          </Link>
        </div>
      </div>
    </div>
  );
}

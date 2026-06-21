"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="hairline w-full max-w-xl rounded-lg bg-[color:var(--surface)] p-6 sm:p-8">
        <div className="mono text-[11px] uppercase tracking-widest text-destructive">
          panic · runtime
        </div>
        <h1 className="mono mt-3 text-xl text-foreground sm:text-2xl">
          <span className="text-destructive">!</span> uncaught exception in render path
        </h1>
        <p className="mono mt-3 text-sm text-muted-foreground">
          Try again, or head back to a known-good route.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => reset()}
            className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]"
          >
            retry()
          </button>
          {/* Intentional hard navigation: a full document reload resets any
              corrupted client state left by the render-path exception. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            cd ~/home
          </a>
        </div>
      </div>
    </div>
  );
}

import { Stagger, StaggerItem } from "@/components/motion-primitives";
import type { Cert } from "@/lib/data";

const dotByStatus: Record<Cert["status"], string> = {
  Complete: "bg-[color:var(--signal)] border-[color:var(--signal)] shadow-[0_0_10px_var(--signal)]",
  "In progress": "bg-[color:var(--signal)]/20 border-[color:var(--signal)]",
  Planned: "bg-[color:var(--surface)] border-border",
};

const pillByStatus: Record<Cert["status"], string> = {
  Complete: "border-[color:var(--signal)]/40 text-[color:var(--signal)] bg-[color:var(--signal)]/5",
  "In progress": "border-[color:var(--signal)]/40 text-[color:var(--signal)] bg-[color:var(--signal)]/5",
  Planned: "border-border text-muted-foreground",
};

export function CertRoadmap({ certs }: { certs: Cert[] }) {
  return (
    <Stagger className="relative">
      {/* vertical spine */}
      <span
        className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[color:var(--signal)]/40 via-border to-transparent"
        aria-hidden
      />
      <ol className="space-y-5">
        {certs.map((c) => (
          <StaggerItem key={c.name}>
            <li className="relative pl-9">
              {/* node */}
              <span
                className={`absolute left-0 top-1 inline-flex size-[15px] items-center justify-center rounded-full border ${dotByStatus[c.status]}`}
                aria-hidden
              >
                {c.status === "In progress" && (
                  <span className="size-1.5 animate-ping rounded-full bg-[color:var(--signal)]" />
                )}
              </span>

              <div className="hairline rounded-lg bg-[color:var(--surface)] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.provider}
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground sm:text-base">
                      {c.name}
                    </div>
                  </div>
                  <span className={`mono shrink-0 rounded border px-2 py-0.5 text-[10px] tracking-widest ${pillByStatus[c.status]}`}>
                    {c.status}
                  </span>
                </div>

                {c.status !== "Planned" && (
                  <div className="mt-4">
                    <div
                      className="h-1 w-full overflow-hidden rounded-full bg-[#1a1a1a]"
                      role="progressbar"
                      aria-valuenow={c.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${c.name} progress`}
                    >
                      <div
                        className="h-full rounded-full bg-[color:var(--signal)] shadow-[0_0_10px_var(--signal)]"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <div className="mono mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>progress</span><span>{c.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </StaggerItem>
        ))}
      </ol>
    </Stagger>
  );
}

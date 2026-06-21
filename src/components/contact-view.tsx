"use client";

import { useState } from "react";
import { z } from "zod";
import { Github, Linkedin, Mail, Lock, Send, Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion-primitives";

const schema = z.object({
  name: z.string().trim().min(1, "name is required").max(100),
  email: z.string().trim().email("invalid email").max(255),
  message: z.string().trim().min(10, "message is too short").max(2000),
});

const channels = [
  { Icon: Mail, label: "email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { Icon: Github, label: "github", value: "github.com/janith", href: "https://github.com" },
  { Icon: Linkedin, label: "linkedin", value: "linkedin.com/in/janith", href: "https://linkedin.com" },
];

export function ContactView() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="initiate handshake"
        title="Open a channel."
        description="Internship, collab, research idea — say hi. I read everything."
      />

      <Reveal>
        <div className="hairline overflow-hidden rounded-lg bg-[color:var(--surface)]">
          {channels.map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="group mono flex items-center gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-[color:var(--surface-2)]"
            >
              <Icon className="size-4 text-[color:var(--signal)]" />
              <span className="w-20 shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <span className="truncate text-foreground group-hover:text-[color:var(--signal)]">
                {value}
              </span>
              <span className="ml-auto text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mono mt-6 flex items-start gap-3 rounded-md border border-border bg-[color:var(--surface)] p-4 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-[color:var(--signal)]" />
          <p>
            <span className="text-foreground">reach me securely:</span> PGP key available
            on request. For sensitive disclosures, email me to coordinate before sending
            details.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-5">
          <Field label="name" name="name" error={errors.name} />
          <Field label="email" name="email" type="email" error={errors.email} />
          <Field label="message" name="message" textarea error={errors.message} />

          <button
            type="submit"
            disabled={sent}
            className="mono group inline-flex w-fit items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-black shadow-[0_0_30px_-6px_var(--signal)] transition-all hover:shadow-[0_0_40px_-4px_var(--signal)] disabled:opacity-60"
          >
            {sent ? <><Check className="size-3.5" /> message queued</> : <><Send className="size-3.5" /> send</>}
          </button>

          {sent && (
            <p className="mono text-xs text-[color:var(--signal)]">
              <span className="text-muted-foreground">$</span> 200 OK — i&apos;ll reply within 48h.
            </p>
          )}
        </form>
      </Reveal>
    </div>
  );
}

function Field({
  label, name, type = "text", textarea, error,
}: { label: string; name: string; type?: string; textarea?: boolean; error?: string }) {
  const id = `f-${name}`;
  const base = "mono w-full rounded-md border border-border bg-[color:var(--surface)] px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-[color:var(--signal)]/60 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--signal)_15%,transparent)]";
  return (
    <label htmlFor={id} className="block">
      <div className="mono mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest">
        <span className="text-muted-foreground">
          <span className="text-[color:var(--signal)]/70">&gt;</span> {label}
        </span>
        {error && <span className="text-destructive">{error}</span>}
      </div>
      {textarea ? (
        <textarea id={id} name={name} rows={5} className={base} placeholder={`enter ${label}...`} />
      ) : (
        <input id={id} name={name} type={type} className={base} placeholder={`enter ${label}...`} />
      )}
    </label>
  );
}

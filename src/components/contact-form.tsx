"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { ArrowRight, Check, Send } from "lucide-react";

declare global {
  interface Window {
    Pageclip?: {
      send: (
        siteKey: string,
        formName: string | null,
        data: unknown,
        cb: (error: Error | null, response?: unknown) => void,
      ) => void;
    };
  }
}

// Limits are mirrored onto the inputs as maxLength so a field physically cannot
// exceed what validation accepts — the writer is stopped at the keystroke
// rather than at submit, after they have already written too much.
const LIMITS = { name: 100, email: 255, message: 2000 } as const;

/** Hand-rolled rather than a schema library: three fields with two rules each
 *  does not justify shipping ~15kB of validator onto the home page, which is
 *  the one route where first paint matters most. */
type Fields = { name: string; email: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Fields): Record<string, string> {
  const e: Record<string, string> = {};

  if (!v.name) e.name = "name is required";
  else if (v.name.length > LIMITS.name) e.name = `under ${LIMITS.name} characters`;

  if (!v.email) e.email = "email is required";
  else if (!EMAIL_RE.test(v.email)) e.email = "invalid email";
  else if (v.email.length > LIMITS.email) e.email = "email is too long";

  if (v.message.length < 10) e.message = "too short — 10 characters minimum";
  else if (v.message.length > LIMITS.message) e.message = `under ${LIMITS.message} characters`;

  return e;
}

const FIELD_ORDER = ["name", "email", "message"] as const;

// Pageclip site key — the public, browser-safe identifier from the form action
// URL (https://send.pageclip.co/<siteKey>). NOT the secret `api_…` key.
const PAGECLIP_SITE_KEY = "lvIFqS0kTXGC3DIV3ZPJgpKmr5MtnoSC";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  // Distinguishes "the library never arrived" from "the request failed", so the
  // copy can name the actual problem instead of a generic failure.
  const [blocked, setBlocked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Any edit after a terminal state returns the form to submittable, so a
  // second message is possible and a stale error never sits over fresh input.
  const onInput = () =>
    setStatus((s) => (s === "sent" || s === "error" ? "idle" : s));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // capture before any await — React nulls currentTarget
    const fd = new FormData(form);
    const values: Fields = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    const errs = validate(values);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setStatus("idle");
      // Focus the first failed field in visual order — otherwise a keyboard or
      // screen-reader user is left at the button with no idea what to fix.
      const firstBad = FIELD_ORDER.find((f) => errs[f]);
      if (firstBad) {
        formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      }
      return;
    }
    setErrors({});

    const pageclip = window.Pageclip;
    if (!pageclip) {
      setBlocked(true);
      setStatus("error");
      return;
    }

    setBlocked(false);
    setStatus("sending");
    pageclip.send(PAGECLIP_SITE_KEY, null, values, (error) => {
      if (error) {
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    });
  };

  return (
    <div className="rounded-lg border border-border p-6 sm:p-8">
      {/* onError fires when the request is blocked (ad blocker, CSP, offline);
          knowing that up front lets the form explain itself before a submit. */}
      <Script
        src="https://s.pageclip.co/v1/pageclip.js"
        strategy="afterInteractive"
        onError={() => setBlocked(true)}
      />

      <div className="label mb-7 text-[color:var(--signal)]/70">Send a message</div>

      <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className="grid gap-7">
        <Field label="Name" name="name" error={errors.name} maxLength={LIMITS.name} autoComplete="name" />
        <Field label="Email" name="email" type="email" error={errors.email} maxLength={LIMITS.email} autoComplete="email" />
        <Field label="Message" name="message" textarea error={errors.message} maxLength={LIMITS.message} />

        <div className="flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={status === "sending"}
            className="label group inline-flex items-center gap-2 rounded-md bg-[color:var(--signal)] px-4 py-2.5 text-black transition-shadow hover:shadow-[0_0_30px_-6px_var(--signal)] disabled:opacity-60"
          >
            {status === "sent" ? (
              <>
                Sent <Check className="size-3.5" />
              </>
            ) : status === "sending" ? (
              <>
                Sending <Send className="size-3.5 animate-pulse" />
              </>
            ) : (
              <>
                Send
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Always mounted so assistive tech observes the region rather than
              having it appear mid-announcement and get missed. */}
          <p role="status" aria-live="polite" className="label empty:hidden">
            {status === "sent" && (
              <span className="text-[color:var(--signal)]">Got it — reply within 48h</span>
            )}
            {status === "error" && (
              <span className="text-destructive">
                {blocked ? "Form script blocked" : "Send failed"} — email me directly
              </span>
            )}
          </p>
        </div>
      </form>

      <p className="label mt-7 text-muted-foreground">
        Or write direct to{" "}
        <a
          href="mailto:janithzgodage@gmail.com"
          className="text-[color:var(--signal)] hover:underline"
        >
          janithzgodage@gmail.com
        </a>
      </p>
    </div>
  );
}

function Field({
  label, name, type = "text", textarea, error, maxLength, autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  maxLength: number;
  autoComplete?: string;
}) {
  const id = `f-${name}`;
  const errorId = `${id}-error`;
  // text-base on mobile: iOS Safari force-zooms any focused input under 16px,
  // which shoves the layout sideways mid-typing. Desktop keeps the tighter 14px.
  const base =
    "field-dotted mono w-full bg-transparent pb-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-sm";
  const shared = {
    id,
    name,
    maxLength,
    autoComplete,
    className: `${base} ${error ? "field-dotted--error" : ""}`,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <label htmlFor={id} className="block">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <span className="label">{label}</span>
        {error && (
          <span id={errorId} role="alert" className="label text-right text-destructive">
            {error}
          </span>
        )}
      </div>
      {textarea ? <textarea {...shared} rows={4} /> : <input {...shared} type={type} />}
    </label>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// `contact` is a section of the home page, not a route of its own. Linking to
// the fragment means it scrolls when you are already home and navigates-then-
// scrolls from anywhere else, with no extra JS.
const links = [
  { to: "/", label: "home" },
  { to: "/projects", label: "projects" },
  { to: "/writeups", label: "writeups" },
  { to: "/cheatsheets", label: "cheatsheets" },
  { to: "/about", label: "about" },
  { to: "/#contact", label: "contact" },
] as const;

/** A fragment link is never the "current page", so it must be excluded from
 *  the active test — otherwise `/#contact` marks home as active too. */
function isActive(to: string, pathname: string) {
  if (to.includes("#")) return false;
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape closes the panel and returns focus to the control that opened it —
  // without this a keyboard user has to tab through every link to get out.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="mono group inline-flex items-center gap-2 text-sm">
          <span className="size-1.5 rounded-full bg-[color:var(--signal)] shadow-[0_0_10px_var(--signal)]" />
          <span className="text-foreground">janith</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">portfolio</span>
          <span className="text-[color:var(--signal)]">:~$</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActive(l.to, pathname);
            return (
              <Link
                key={l.to}
                href={l.to}
                aria-current={active ? "page" : undefined}
                className="mono group relative px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="text-[color:var(--signal)]/70 mr-1">{active ? "▸" : "·"}</span>
                {l.label}
                <span
                  className={`pointer-events-none absolute inset-x-3 -bottom-px h-px bg-[color:var(--signal)] transition-all ${
                    active ? "opacity-100 shadow-[0_0_8px_var(--signal)]" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <button
          ref={toggleRef}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className="hairline inline-flex size-11 items-center justify-center rounded-md md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => {
                const active = isActive(l.to, pathname);
                return (
                  <Link
                    key={l.to}
                    href={l.to}
                    aria-current={active ? "page" : undefined}
                    className="mono flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-[color:var(--surface)] hover:text-foreground"
                  >
                    <span className="text-[color:var(--signal)]/70">{active ? "▸" : "·"}</span>
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

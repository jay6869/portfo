import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

function NotFoundComponent() {
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
          <Link to="/" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            cd ~/home
          </Link>
          <Link to="/projects" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            ls projects/
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
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
            onClick={() => { router.invalidate(); reset(); }}
            className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]"
          >
            retry()
          </button>
          <a href="/" className="hairline mono rounded-md px-3 py-2 text-xs hover:border-[color:var(--signal)]/50 hover:text-[color:var(--signal)]">
            cd ~/home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a0a" },
      { title: "Janith Godage — Cybersecurity & Offensive Tooling" },
      { name: "description", content: "Portfolio of Janith Godage — cybersecurity undergraduate, aspiring penetration tester, and builder of offensive-security tooling." },
      { name: "author", content: "Janith Godage" },
      { property: "og:title", content: "Janith Godage — Cybersecurity & Offensive Tooling" },
      { property: "og:description", content: "Penetration testing, detection engineering, and security research." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Janith Godage" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-[color:var(--signal)] focus:px-3 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="min-h-[calc(100vh-3.5rem)]">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </QueryClientProvider>
  );
}

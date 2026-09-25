import type { Metadata, Viewport } from "next";
import { Montserrat, Rubik } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ViewTransitions } from "@/components/view-transitions";
import { Providers } from "@/components/providers";
import { Hud } from "@/components/hud";
import { SITE, SITE_URL } from "@/lib/site";

// One family, display through body: Rubik Variable on its weight axis, plus
// italic. This replaces the previous Archivo + JetBrains Mono pairing, which
// cost two webfont downloads to do what one does here.
//
// No `weight` loads the variable font as a single file spanning 300-900 —
// which this site needs end to end, from the 300 of the hero's light line to
// the 900 of every heading and marquee.
//
// Rubik has NO width axis. The old display face did, and the type system leaned
// on it; every `font-variation-settings: "wdth" …` has been removed rather than
// left to fail silently, and weight alone now carries the contrast.
const rubik = Rubik({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-rubik",
  display: "swap",
});

// Wordmark stand-in for the two toolchain logos that ship no vector lettering
// (Burp Suite, osquery). Not preloaded: it is only ever needed below the hero.
const wordmark = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-wordmark",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: "%s — Janith Godage",
  },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    title: SITE.title,
    description: SITE.ogDescription,
    type: "website",
    siteName: SITE.name,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "Janith Godage — Writeups" }],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1d1c1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required, not cosmetic: the accent script
    // below writes style="--signal:…" onto this element before React hydrates,
    // so the server markup and the live DOM legitimately differ. The flag
    // applies one level deep — it silences this element's own attributes and
    // nothing within it.
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${rubik.variable} ${wordmark.variable}`}
    >
      <body>
        {/* Framer Motion renders its `initial` state into the SSR markup, so ~40
            elements per page (including the wrapper around ALL page content)
            ship as opacity:0 and are revealed only once the client bundle
            hydrates. These two escape hatches make that reveal non-fatal:
            <noscript> covers scripting being switched off, and the failsafe
            timer covers the bundle failing to load or hydrate at all. Providers
            clears the timer on mount, so it never fires on a healthy load. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>[style*="opacity:0"]{opacity:1!important;transform:none!important}</style>',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.__revealFailsafe=setTimeout(function(){document.documentElement.classList.add('js-failed')},4000)",
          }}
        />
        {/* Accent is restored before first paint. Applying it from an effect
            would flash the default colour across the whole page on every load,
            because every token on the site derives from --signal. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var a=localStorage.getItem('jg-accent');if(a)document.documentElement.style.setProperty('--signal',a)}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-[color:var(--signal)] focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main" className="min-h-[calc(100vh-3.5rem)]">
            <ViewTransitions>{children}</ViewTransitions>
          </main>
          <Footer />
          <Hud />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Archivo } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { Providers } from "@/components/providers";
import { Hud } from "@/components/hud";
import { SITE, SITE_URL } from "@/lib/site";

// Display face: Archivo, requested with its width axis so headings can run
// genuinely extended rather than being scaled sideways. wght 100-900 gives the
// hero its light/black contrast, and wdth 62-125 the extended setting used for
// every marquee and heading.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-sans",
  display: "swap",
});

// Body and UI voice. No `weight` array loads the VARIABLE font as one file,
// which the display type needs anyway — it asks for 700, and the old static
// set never loaded it, so browsers were faking synthetic bold.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
  themeColor: "#121212",
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
      className={`dark ${jetbrainsMono.variable} ${archivo.variable}`}
    >
      <body>
        {/* Direction contract, emitted as a real HTML comment so it survives the
            production build and stays greppable in the shipped output. */}
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: A live attack-surface graph the visitor stands inside, with the name at
architectural scale on top of it. Refuses the dev-portfolio card grid and the
austere all-one-size terminal dump alike.
OWN-WORLD: Signal green oklch(0.88 0.22 155) on #121212. One monospace voice at
two extreme registers: JetBrains Mono 700 at 14.5vw, tracking -0.055em, half
outlined in stroke; against 10.5px labels tracked 0.24em. Phosphor bloom, hairline
rules, full-bleed rows that scan-wipe on hover.
STORY: A recruiter meets the name at scale over a network being mapped, reads
the loop (break it, then catch it), and takes the CV from the hero itself.
FIRST VIEWPORT: 100svh Three.js node/edge graph with a scan pulse; availability
label, JANITH / GODAGE stacked huge (second line outlined), positioning line and
the curl CV command bottom-right.
FORM: attack-surface graph + editorial scale, candidate 4 of 7, seed 6c87b2b6.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
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
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Hud />
        </Providers>
      </body>
    </html>
  );
}

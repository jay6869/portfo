/**
 * The toolchain band: official logos, recoloured to one charcoal ink.
 *
 * Files live in /public/logos, processed once from their sources (below):
 * every coloured fill set to #2d2c2a, white or tinted fills knocked back to the
 * band's paper so outlines survive, export filters stripped, and each cropped
 * to its drawn bounds. No SVG here carries script or external references.
 *
 *   kali.svg       dragon (Commons, Kali-dragon-icon.svg, CC BY-SA 4.0) set
 *                  beside the boxed wordmark (Commons, Kali_Linux_2.0_wordmark)
 *   burp.svg       Commons, BurpSuite_logo.svg (CC0)
 *   wireshark.svg  Commons, Wireshark_Logo.svg (GPL-2.0+, from Wireshark's source)
 *   nmap.png       nmap.org/images/sitelogo.png — raster only; its brightness
 *                  became the alpha, so the dark ground drops out
 *   wazuh.svg      Commons, Wazuh-2022-Logo.svg (from Wazuh's brand assets)
 *   snort.svg      vectorlogo.zone, snort-ar21.svg (third-party redraw)
 *   osquery.svg    github.com/gilbarbara/logos (third-party redraw)
 *
 * Burp Suite and osquery publish no vector wordmark, so their names are set
 * in Montserrat as a close match — `word` below. Everything else is the
 * vendor's own lettering.
 */
export interface ToolLogo {
  name: string;
  src: string;
  /** Intrinsic size, for the <img> width/height (no layout shift on load). */
  w: number;
  h: number;
  /** Optical height relative to the band's base logo height. Wide wordmarks
   *  sit smaller and compact marks larger, so the row reads as even. */
  scale: number;
  /** Name set beside the mark, for tools with no vector wordmark. */
  word?: { text: string; className: string };
}

export const TOOL_LOGOS: ToolLogo[] = [
  { name: "Kali Linux", src: "/logos/kali.svg", w: 272.47, h: 100.04, scale: 1.4 },
  {
    name: "Burp Suite",
    src: "/logos/burp.svg",
    w: 640,
    h: 640,
    scale: 0.78,
    word: { text: "Burp Suite", className: "tool-word--burp" },
  },
  { name: "Wireshark", src: "/logos/wireshark.svg", w: 393.6, h: 106.5, scale: 0.8 },
  { name: "Nmap", src: "/logos/nmap.png", w: 494, h: 270, scale: 1.25 },
  { name: "Wazuh", src: "/logos/wazuh.svg", w: 1892, h: 388, scale: 0.58 },
  { name: "Snort", src: "/logos/snort.svg", w: 89.5, h: 42, scale: 1.1 },
  {
    name: "osquery",
    src: "/logos/osquery.svg",
    w: 256,
    h: 255,
    scale: 0.78,
    word: { text: "osquery", className: "tool-word--osquery" },
  },
];

/**
 * Accent palette.
 *
 * The whole site runs on a single accent token, `--signal`, so switching the
 * theme is one custom property write — every border, glow, label, rule, marquee
 * outline and the hero dither shader follow from it.
 *
 * Every entry is verified against the #121212 ground and as a black-on-accent
 * button fill; the lowest of the five is lavender at 10.17:1 and 11.40:1, both
 * comfortably past WCAG AA. Do not add a colour here without measuring it.
 */
export type Theme = { hex: string; name: string };

export const THEMES: Theme[] = [
  { hex: "#9affc9", name: "mint" },
  { hex: "#c4b5ff", name: "lavender" },
  { hex: "#c3fffc", name: "ice" },
  { hex: "#ffb3d1", name: "rose" },
  { hex: "#d8ff7a", name: "lime" },
];

export const THEME_KEY = "jg-accent";
export const THEME_EVENT = "jg-accentchange";

/** Applied to <html> so it cascades to every token that references --signal. */
export function applyTheme(hex: string) {
  document.documentElement.style.setProperty("--signal", hex);
  try {
    localStorage.setItem(THEME_KEY, hex);
  } catch {
    /* private mode — the choice simply does not persist */
  }
  // Canvas work reads the token once at init, so it needs telling.
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: hex }));
}

export function readTheme(): string {
  try {
    return localStorage.getItem(THEME_KEY) || THEMES[0].hex;
  } catch {
    return THEMES[0].hex;
  }
}

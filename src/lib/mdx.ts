import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

// Syntax-highlight theme. keepBackground:false lets the site's own surface
// color show through (styled in globals.css under .mdx), so code blocks match
// the terminal aesthetic instead of the theme's own background.
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: false,
  defaultLang: "plaintext",
};

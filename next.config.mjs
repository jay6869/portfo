// Content-Security-Policy. 'unsafe-inline' is required for script/style because
// Next's App Router emits inline bootstrap/streaming scripts and next/font emits
// an inline <style>; a nonce-based policy would force every page to be dynamic
// (defeating SSG). For a static content site this is the pragmatic strong policy.
//
// Dev needs extra grants: `next dev` (webpack/React Refresh) evaluates modules
// via eval() — without 'unsafe-eval' the client JS never runs, hydration fails,
// and because every page reveals from opacity:0 the result is a blank screen.
// HMR also uses a websocket. These relaxations apply to dev only.
const isDev = process.env.NODE_ENV !== "production";

// Dev-only allowance so impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

// Pageclip delivers the contact form. The library is fetched from s.pageclip.co
// and submissions POST to send.pageclip.co — both must be allowed explicitly or
// the form fails silently on every submission (the library never defines
// window.Pageclip, so every send takes the "library missing" branch).
const PAGECLIP_SCRIPT = "https://s.pageclip.co";
const PAGECLIP_SEND = "https://send.pageclip.co";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  `script-src 'self' 'unsafe-inline' ${PAGECLIP_SCRIPT}${isDev ? " 'unsafe-eval'" : ""}${__impeccableLiveDev}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${PAGECLIP_SEND}${isDev ? " ws: http:" : ""}${__impeccableLiveDev}`,
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // /contact was a route until the section moved onto the home page. It was in
  // the sitemap and may be linked from a CV or an application form, so it
  // redirects rather than 404s.
  async redirects() {
    return [{ source: "/contact", destination: "/#contact", permanent: true }];
  },
};

export default nextConfig;

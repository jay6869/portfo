import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide OpenGraph card, terminal-styled to match the portfolio. Uses system
// fonts (no remote font fetch) so it renders fast and offline at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,156,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,156,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#00ff9c", fontSize: 28 }}>
          <span style={{ marginRight: 16 }}>$</span>
          <span style={{ color: "#8c9492" }}>whoami</span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#ebf0ee",
            fontSize: 92,
            fontWeight: 700,
            marginTop: 24,
            letterSpacing: "-0.03em",
          }}
        >
          Janith Godage
        </div>
        <div style={{ display: "flex", color: "#8c9492", fontSize: 34, marginTop: 16 }}>
          Cybersecurity &amp; Offensive Tooling
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            color: "#00ff9c",
            fontSize: 24,
            border: "1px solid rgba(0,255,156,0.35)",
            borderRadius: 10,
            padding: "12px 22px",
            alignSelf: "flex-start",
            boxShadow: "0 0 40px -8px rgba(0,255,156,0.4)",
          }}
        >
          penetration testing · detection engineering · research
        </div>
      </div>
    ),
    { ...size },
  );
}

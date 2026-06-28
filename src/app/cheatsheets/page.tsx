import type { Metadata } from "next";
import { CheatsheetsView } from "@/components/cheatsheets-view";
import { getAllCheatsheets } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Cheat Sheets",
  description: "Scan-first reference cards for offensive security — payloads, commands, and methodology flows.",
  openGraph: { title: "Cheat Sheets — Janith Godage", url: "/cheatsheets" },
  alternates: { canonical: "/cheatsheets" },
};

export default function CheatsheetsPage() {
  return <CheatsheetsView cheatsheets={getAllCheatsheets()} />;
}

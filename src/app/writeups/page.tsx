import type { Metadata } from "next";
import { WriteupsView } from "@/components/writeups-view";
import { getAllWriteups } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writeups",
  description: "Long-form notes on offensive security, detection engineering, and research.",
  openGraph: { title: "Writeups — Janith Godage", url: "/writeups" },
  alternates: { canonical: "/writeups" },
};

export default function WriteupsPage() {
  return <WriteupsView writeups={getAllWriteups()} />;
}

import type { Metadata } from "next";
import { ContactView } from "@/components/contact-view";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach me by email, GitHub, LinkedIn, or the form on this page. PGP available on request.",
  openGraph: { title: "Contact — Janith Godage", url: "/contact" },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}

import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description: "Offensive security tooling, blue-team platforms, and research projects.",
  openGraph: { title: "Projects — Janith Godage", url: "/projects" },
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}

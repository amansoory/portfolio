import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectList } from "@/components/project-list";
import { otherProjects, profile } from "@/lib/portfolio";

const description = "Game development and hackathon projects, from turn-based puzzles to arcade racing.";

export const metadata: Metadata = {
  title: "Other Projects",
  description,
  alternates: { canonical: "/projects/other" },
  openGraph: { title: `Other Projects | ${profile.name}`, description, url: "/projects/other" },
  twitter: { title: `Other Projects | ${profile.name}`, description },
};

export default function OtherProjectsPage() {
  return (
    <main id="main-content" className="case-study other-projects-page">
      <div className="section-shell">
        <Link href="/#work" className="back-link">
          <ArrowLeft size={15} /> Back to Projects
        </Link>
        <header className="case-header">
          <p className="eyebrow">MORE TO EXPLORE</p>
          <h1>Other Projects</h1>
          <p>{description}</p>
        </header>
        <ProjectList projects={otherProjects} />
      </div>
    </main>
  );
}

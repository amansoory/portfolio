import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitFork } from "lucide-react";
import { projects, profile, siteUrl } from "@/lib/portfolio";
import { ProjectVisual } from "@/components/project-visual";
import { Contact, ResourceLink, SectionLabel } from "@/components/portfolio-ui";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const description = project.placeholder
    ? `${project.category} — case study awaiting project details.`
    : project.description;
  return {
    title: project.name,
    description,
    robots: {
      index: !profile.draft && !project.placeholder,
      follow: !profile.draft,
    },
    alternates: siteUrl ? { canonical: `/projects/${slug}` } : {},
    openGraph: {
      title: `${project.name} | ${profile.name}`,
      description,
      type: "article",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "From source to system. Software engineering portfolio.",
        },
      ],
    },
    twitter: { card: "summary_large_image", title: project.name, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main-content" className={`case-study theme-${project.accent}`}>
      <div className="section-shell">
        <Link href="/#work" className="back-link">
          <ArrowLeft size={15} />
          Back to selected work
        </Link>
        <header className="case-header">
          <SectionLabel number={project.number}>
            {project.category.toUpperCase()}
          </SectionLabel>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {project.placeholder && (
            <p className="draft-note">
              Content placeholder — project details and results to be added.
            </p>
          )}
          <div className="case-meta">
            <div>
              <span>ROLE</span>
              <p>{project.role}</p>
            </div>
            <div>
              <span>YEAR</span>
              <p>{project.year}</p>
            </div>
            <div>
              <span>DURATION</span>
              <p>{project.duration}</p>
            </div>
            <div className="case-resources">
              <ResourceLink href={project.github}>
                <GitFork size={15} />
                Source
              </ResourceLink>
              <ResourceLink href={project.live}>Live project</ResourceLink>
            </div>
          </div>
        </header>
        <div className="case-art">
          <ProjectVisual project={project} />
        </div>
        <div className="case-body">
          {[
            ["01", "The problem", project.problem],
            ["02", "Inside the build", project.approach],
            ["03", "The outcome", project.outcome],
            ["04", "What comes next", project.lessons],
          ].map(([number, title, text]) => (
            <Reveal key={number}>
              <section className="case-chapter">
                <span className="chapter-number">/{number}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}>
          <div>
            <span className="eyebrow">NEXT PROJECT / {next.number}</span>
            <h2>{next.name}</h2>
          </div>
          <ArrowUpRight size={40} strokeWidth={1} />
        </Link>
      </div>
      <Contact />
    </main>
  );
}

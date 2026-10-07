import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { copy } from "@/lib/copy";
import type { Project } from "@/lib/portfolio";
import { ProjectVisual } from "@/components/project-visual";
import { ResourceLink } from "@/components/portfolio-ui";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
          <div className="project-list">
            {projects.map((project) => (
              <Reveal key={project.slug}>
                <article
                  className={`project-row theme-${project.accent}${project.featured ? " project-featured" : ""}`}
                  data-flow
                  data-file={`projects/${project.number}-${project.slug}.tsx`}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="project-card-link"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <Link
                    href={`/projects/${project.slug}`}
                    className="project-preview-link"
                    data-enter="visual"
                    aria-label={`${copy.work.open} ${project.name}`}
                  >
                    <ProjectVisual project={project} />
                    <span className="preview-open">
                      <ArrowUpRight size={21} />
                    </span>
                  </Link>
                  <div className="project-copy">
                    <div className="project-category" data-enter>
                      <span>/{project.number}</span>
                      {project.category}
                      {project.year && <time className="project-year" dateTime={project.year}>{project.year}</time>}
                    </div>
                    <h3 data-enter>
                      <Link href={`/projects/${project.slug}`}>
                        {project.name}
                      </Link>
                    </h3>
                    <p data-enter>{project.description}</p>
                    {project.metrics?.length ? (
                      <ul className="project-metrics" data-enter aria-label={`${project.name} results`}>
                        {project.metrics.map((metric) => (
                          <li key={metric}>{metric}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="project-contribution" data-enter><span>My work</span>{project.role}</p>
                    <div className="project-tags" data-enter>
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="project-actions" data-enter>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="case-link"
                      >
                        {copy.work.caseLink} <ArrowUpRight size={17} />
                      </Link>
                      {project.live ? (
                        <ResourceLink href={project.live} className="project-live-link">
                          {project.liveLabel ?? (project.slug === "vibesafe" || project.featured
                            ? copy.work.demo
                            : copy.work.live)}
                        </ResourceLink>
                      ) : (
                        <ResourceLink href={project.github}>
                          {copy.links.viewCode}
                        </ResourceLink>
                      )}
                      {project.accessNote && (
                        <span className="project-access-note">{project.accessNote}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
  );
}

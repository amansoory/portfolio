import { copy } from "@/lib/copy";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Code2,
  Cpu,
  Database,
  MapPin,
} from "lucide-react";
import { HeroExperience } from "@/components/hero-experience";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectVisual } from "@/components/project-visual";
import { Contact, ResourceLink, SectionLabel } from "@/components/portfolio-ui";
import { Reveal } from "@/components/reveal";
import { ScrollJourney } from "@/components/scroll-journey";
import { Badge } from "@/components/ui/badge";
import {
  coursework,
  experience,
  portfolioCopy,
  profile,
  projects,
  skills,
} from "@/lib/portfolio";

export default function Home() {
  return (
    <ScrollJourney>
      <main id="main-content">
        <div className="hero-sequence">
          <section className="hero section-shell" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="status-dot" />
                <span>{profile.role.toUpperCase()}</span>
                <span className="kicker-divider">/</span>
                <span>{copy.hero.edition}</span>
              </div>
              <p className="hero-name">
                {copy.hero.greeting} {profile.name}.
              </p>
              <p className="hero-education">{copy.hero.education}</p>
              <h1 id="hero-title">
                {copy.hero.title[0]}
                <br />
                <span>{copy.hero.title[1]}</span>
              </h1>
              <p className="hero-description">
                {copy.hero.subtitle}
              </p>
              <ul className="hero-work-preview" aria-label="Experience at a glance">
                {experience.map((item) => (
                  <li key={item.id}>
                    <Link href={`#experience-${item.id}`}>
                      {item.role} <span>@ <span className="company-glow">{item.shortCompany}</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="hero-actions">
                <Link href="#work" className="primary-link">
                  {copy.hero.work} <ArrowDown size={17} />
                </Link>
                <Link href="#about" className="quiet-link">
                  {copy.hero.about} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <HeroExperience />
            <div className="hero-bottom">
              <span>
                <span className="scroll-line" />
                {copy.hero.scroll}
              </span>
              <span className="hero-coordinates">{copy.hero.path}</span>
            </div>
          </section>

        </div>
        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <Reveal>
            <SectionLabel number="01">{copy.work.label}</SectionLabel>
            <div className="section-heading">
              <h2 id="work-title">
                {copy.work.title[0]} <span>{copy.work.title[1]}</span>
              </h2>
              <p>
                {copy.work.intro[0]}
                <br />
                {copy.work.intro[1]}
              </p>
            </div>
            <p className="draft-note">
              <span className="tiny-dot" />
              {portfolioCopy.workNote}
            </p>
          </Reveal>
          <div className="project-list">
            {projects.map((project) => (
              <Reveal key={project.slug}>
                <article
                  className={`project-row theme-${project.accent}${project.featured ? " project-featured" : ""}`}
                  data-flow
                  data-file={`work/${project.number}-${project.slug}.tsx`}
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
                        <ResourceLink href={project.live}>
                          {project.slug === "vibesafe" || project.featured
                            ? copy.work.demo
                            : copy.work.live}
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
        </section>
        <section
          className="experience-section section-shell"
          id="experience"
          aria-labelledby="experience-title"
        >
          <Reveal>
            <SectionLabel number="02">{copy.experience.label}</SectionLabel>
            <div className="section-heading">
              <h2 id="experience-title">
                {copy.experience.title[0]} <span>{copy.experience.title[1]}</span>
              </h2>
              <p>{copy.experience.intro.join(" ")}</p>
            </div>
          </Reveal>
          <ExperienceSection />
        </section>
        <section
          className="skills-section section-shell"
          id="skills"
          aria-labelledby="skills-title"
        >
          <Reveal>
            <SectionLabel number="03">{copy.skills.label}</SectionLabel>
            <div className="section-heading">
              <h2 id="skills-title">
                {copy.skills.title[0]}
                <br />
                <span>{copy.skills.title[1]}</span>
              </h2>
              <p>{portfolioCopy.skillsNote}</p>
            </div>
            <div className="skills-grid" data-flow>
              {skills.map((group, i) => {
                const Icon = [Code2, Braces, Cpu, Database][i];
                return (
                  <div
                    className="skill-group"
                    key={group.id}
                    data-enter
                    data-flow
                  >
                    <div className="skill-top">
                      <Icon size={22} strokeWidth={1.4} />
                      <span>/{group.id}</span>
                    </div>
                    <h3>{group.name}</h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>
                          {item.split(" / ").map((tool, index) => (
                            <span key={tool}>
                              {index > 0 && " / "}
                              <span className={group.emphasis.includes(tool) ? "skill-emphasis" : undefined}>{tool}</span>
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <details className="coursework">
              <summary>{portfolioCopy.courseworkLabel}</summary>
              <ul>
                {coursework.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </details>
          </Reveal>
        </section>
        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <Reveal>
            <SectionLabel number="04">{copy.about.label}</SectionLabel>
            <div className="about-grid">
              <div
                className="about-art"
                aria-hidden="true"
                data-enter="visual"
                data-flow
              >
                <div className="about-art-grid" />
                <div className="code-sculpture">
                  <span>{"{"}</span>
                  <i />
                  <span>{"}"}</span>
                </div>
                <span className="about-art-label">{copy.about.art}</span>
                <span className="about-art-index">{copy.about.index}</span>
              </div>
              <div className="about-copy">
                <h2 id="about-title" data-enter>
                  {copy.about.title[0]}
                  <br />
                  <span>{copy.about.title[1]}</span>
                </h2>
                <p className="about-intro" data-enter>
                  {profile.introduction}
                </p>
                <p data-enter>{profile.about}</p>
                <div className="about-meta" data-enter>
                  <span>
                    <MapPin size={15} />
                    {profile.location}
                  </span>
                  <span>{profile.degree}</span>
                  <span>
                    <span className="status-dot" />
                    {profile.availability}
                  </span>
                </div>
                {profile.resume && <ResourceLink href={profile.resume}>
                  {copy.about.resume}
                </ResourceLink>}
              </div>
            </div>
          </Reveal>
        </section>
        <Contact />
      </main>
    </ScrollJourney>
  );
}

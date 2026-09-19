import { copy } from "@/lib/copy";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Code2,
  Cpu,
  Database,
  GitBranch,
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
              <h1 id="hero-title">
                {copy.hero.title[0]}
                <br />
                {copy.hero.title[1]}
                <br />
                <span>
                  {copy.hero.title[2]}
                  <br className="mobile-break" /> {copy.hero.title[3]}
                </span>
              </h1>
              <p className="hero-description">
                {profile.heroLines[0]}
                <br className="desktop-break" /> {profile.heroLines[1]}
              </p>
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
          <nav className="career-overview section-shell" aria-label="Experience at a glance">
            <a href="#experience"><span>Machine Learning Intern</span><strong>Timing</strong><p>LLM agents, retrieval, PostgreSQL and Redis</p></a>
            <a href="#experience"><span>Software Engineering Intern</span><strong>Vogro</strong><p>Python automation, APIs and React</p></a>
            <a href="#experience"><span>Teaching Assistant</span><strong>200+ students</strong><p>Python labs, debugging and office hours</p></a>
          </nav>
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
                >
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
                    </div>
                    <h3 data-enter>
                      <Link href={`/projects/${project.slug}`}>
                        {project.name}
                      </Link>
                    </h3>
                    <p data-enter>{project.description}</p>
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
            <div className="split-section">
              <div>
                <h2 id="experience-title">
                  {copy.experience.title[0]}
                  <br />
                  <span>{copy.experience.title[1]}</span>
                </h2>
                <p className="section-description">
                  {copy.experience.intro[0]}
                  <br />
                  {copy.experience.intro[1]}
                </p>
                <div className="small-terminal">
                  <span>
                    <GitBranch size={14} /> career / main
                  </span>
                  <code>$ git log --oneline</code>
                  <span className="muted">{portfolioCopy.experienceNote}</span>
                </div>
                <ExperienceSection />
              </div>
              <ol className="timeline" data-flow>
                {experience.map((item, i) => (
                  <li key={i} data-enter data-flow data-experience-index={i}>
                    <span
                      className={`timeline-dot ${item.current ? "current" : ""}`}
                    />
                    <div className="timeline-period">
                      {item.period}
                      {item.current && (
                        <span className="timeline-current">
                          {copy.experience.latest}
                        </span>
                      )}
                    </div>
                    <h3>{item.company}</h3>
                    <p className="timeline-company">{item.role}</p>
                    <p>{item.detail}</p>
                    {item.signals && (
                      <div
                        className="experience-signals"
                        aria-label={item.signals.join(" to ")}
                      >
                        {item.signals.map((signal) => (
                          <span key={signal}>{signal}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
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
                      {group.items.map((item, index) => (
                        <li key={index}>{item}</li>
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

import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Code2,
  Cpu,
  GitBranch,
  MapPin,
} from "lucide-react";
import { HeroExperience } from "@/components/hero-experience";
import { ProjectVisual } from "@/components/project-visual";
import { Contact, ResourceLink, SectionLabel } from "@/components/portfolio-ui";
import { Reveal } from "@/components/reveal";
import { ScrollJourney } from "@/components/scroll-journey";
import { Badge } from "@/components/ui/badge";
import { experience, profile, projects, skills } from "@/lib/portfolio";

export default function Home() {
  return (
    <ScrollJourney>
      <main id="main-content">
        <div className="hero-sequence">
          <section className="hero section-shell" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="status-dot" />
                <span>SOFTWARE ENGINEER</span>
                <span className="kicker-divider">/</span>
                <span>PORTFOLIO — 2026</span>
              </div>
              <p className="hero-name">Hello, I’m {profile.name}.</p>
              <h1 id="hero-title">
                From a line
                <br />
                of code.
                <br />
                <span>
                  To a world
                  <br className="mobile-break" /> of possibility.
                </span>
              </h1>
              <p className="hero-description">
                Exploring the space between thoughtful code
                <br className="desktop-break" /> and things that make a
                difference.
              </p>
              <div className="hero-actions">
                <Link href="#work" className="primary-link">
                  Explore my work <ArrowDown size={17} />
                </Link>
                <Link href="#about" className="quiet-link">
                  The person behind it <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <HeroExperience />
            <div className="hero-bottom">
              <span>
                <span className="scroll-line" />
                SCROLL TO FOLLOW THE SIGNAL
              </span>
              <span className="hero-coordinates">SOURCE → SYSTEM → IMPACT</span>
            </div>
          </section>
          <div
            className="process-strip section-shell"
            aria-label="Engineering process"
          >
            <span className="process-intro">
              <GitBranch size={15} /> A THOUGHT BECOMES A SYSTEM
            </span>
            <span className="process-step step-write">
              <span>01</span> Write.
            </span>
            <i />
            <span className="process-step step-connect">
              <span>02</span> Connect.
            </span>
            <i />
            <span className="process-step step-ship">
              <span>03</span> Ship.
            </span>
            <span className="process-end">↵</span>
          </div>
        </div>
        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <Reveal>
            <SectionLabel number="01">SELECTED WORK</SectionLabel>
            <div className="section-heading">
              <h2 id="work-title">
                Ideas, made <span>real.</span>
              </h2>
              <p>
                A closer look at the build.
                <br />
                The problem. The decisions. The result.
              </p>
            </div>
            <p className="draft-note">
              <span className="tiny-dot" />
              Project details will be added from my resume. Visuals below are
              conceptual.
            </p>
          </Reveal>
          <div className="project-list">
            {projects.map((project) => (
              <Reveal key={project.slug}>
                <article
                  className={`project-row theme-${project.accent}`}
                  data-flow
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="project-preview-link"
                    data-enter="visual"
                    aria-label={`Open ${project.name} case study`}
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
                        Explore case study <ArrowUpRight size={17} />
                      </Link>
                      <ResourceLink href={project.live}>Live</ResourceLink>
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
            <SectionLabel number="02">THE JOURNEY</SectionLabel>
            <div className="split-section">
              <div>
                <h2 id="experience-title">
                  Always
                  <br />
                  <span>in progress.</span>
                </h2>
                <p className="section-description">
                  Every chapter adds a new perspective.
                  <br />
                  Here’s where mine have come from.
                </p>
                <div className="small-terminal">
                  <span>
                    <GitBranch size={14} /> career / main
                  </span>
                  <code>$ git log --oneline</code>
                  <span className="muted"># experience to be added</span>
                </div>
              </div>
              <ol className="timeline" data-flow>
                {experience.map((item, i) => (
                  <li key={i} data-enter data-flow>
                    <span
                      className={`timeline-dot ${item.current ? "current" : ""}`}
                    />
                    <div className="timeline-period">
                      {item.period}
                      {item.current && (
                        <span className="timeline-current">LATEST</span>
                      )}
                    </div>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company}</p>
                    <p>{item.detail}</p>
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
            <SectionLabel number="03">THE TOOLKIT</SectionLabel>
            <div className="section-heading">
              <h2 id="skills-title">
                Different tools.
                <br />
                <span>One curious mind.</span>
              </h2>
              <p>
                The right tool for the problem.
                <br />
                My technical skills, once added.
              </p>
            </div>
            <div className="skills-grid" data-flow>
              {skills.map((group, i) => {
                const Icon = [Code2, Braces, Cpu, GitBranch][i];
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
          </Reveal>
        </section>
        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <Reveal>
            <SectionLabel number="04">BEHIND THE TERMINAL</SectionLabel>
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
                <span className="about-art-label">
                  STILL CURIOUS. STILL BUILDING.
                </span>
                <span className="about-art-index">HUMAN / 001</span>
              </div>
              <div className="about-copy">
                <h2 id="about-title" data-enter>
                  A person.
                  <br />
                  <span>Not just a prompt.</span>
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
                  <span>
                    <span className="status-dot" />
                    {profile.availability}
                  </span>
                </div>
                <ResourceLink href={profile.resume}>
                  Download resume
                </ResourceLink>
              </div>
            </div>
          </Reveal>
        </section>
        <Contact />
      </main>
    </ScrollJourney>
  );
}

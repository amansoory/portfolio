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
import { CodeDrop } from "@/components/code-drop";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectList } from "@/components/project-list";
import { Contact, ResourceLink, SectionLabel } from "@/components/portfolio-ui";
import { Reveal } from "@/components/reveal";
import { ScrollJourney } from "@/components/scroll-journey";
import {
  coursework,
  experience,
  portfolioCopy,
  profile,
  mainProjects,
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
          <ProjectList projects={mainProjects} />
          <div className="other-projects-link-row">
            <Link href="/projects/other" className="other-projects-link">
              <span>Other Projects</span><ArrowUpRight size={16} aria-hidden="true" />
            </Link>
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
              <CodeDrop />
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

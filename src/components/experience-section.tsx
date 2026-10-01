import { experience } from "@/lib/portfolio";
import { Reveal } from "@/components/reveal";

export function ExperienceSection() {
  return (
    <ol className="experience-list" aria-label="Experience, most recent first">
      {experience.map((item) => (
        <li key={item.id} id={`experience-${item.id}`} className="experience-item" data-flow>
          <Reveal className="experience-entry">
            <header className="experience-heading" data-enter>
              <h3>{item.company}</h3>
              <p className="experience-role">{item.role}</p>
              {item.context && <p className="experience-context">{item.context}</p>}
              <p className="experience-period">{item.period}</p>
            </header>
            <div className="experience-contribution" data-enter>
              <ul className="experience-bullets">
                {item.contributions.map((text) => <li key={text}>{text}</li>)}
              </ul>
              <p className="experience-technologies"><span>Technologies</span>{item.tools.join(" \u00b7 ")}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

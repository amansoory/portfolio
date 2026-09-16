import { copy } from "@/lib/copy";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { portfolioCopy, visualData, type Project } from "@/lib/portfolio";

export function ProjectVisual({ project }: { project: Project }) {
  if (project.preview) {
    return (
      <div
        className={`project-visual project-screenshot theme-${project.accent}`}
      >
        <Image
          src={project.preview.src}
          alt={project.preview.alt}
          fill
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1400px) 90vw, 1280px"
          className="project-site-image"
        />
      </div>
    );
  }
  const labels = project.visualLabels;
  return (
    <div
      className={`project-visual visual-${project.visual} theme-${project.accent}`}
      role="img"
      aria-label={`${project.name}: ${project.category}. ${copy.preview.note}`}
    >
      <div className="visual-grid" />
      <div className="visual-topline">
        <span>
          <span className="tiny-dot" />
          {project.label}
        </span>
        <span>FIG. {project.number}</span>
      </div>
      {project.visual === "scan" && (
        <div className="demo-terminal scan-terminal">
          <div className="terminal-title">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>{project.name}</span>
            <Terminal size={13} />
          </div>
          <div className="terminal-code">
            <p>{labels[0]}</p>
            <p className="code-muted">{labels[1]}</p>
            <p className="scan-severity">
              {labels[2]} <span>→</span> {labels[3]}
            </p>
            <p>{labels[4]}</p>
            <div className="scan-progress">
              <i />
            </div>
          </div>
        </div>
      )}
      {project.visual === "chart" && (
        <>
          <svg
            className="technical-diagram resilience-chart"
            viewBox="0 0 410 200"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="diagram-baseline"
              d="M35 30V165H380M35 100H380M165 30V165"
            />
            <path className="chart-reference" d={visualData.chart} />
            <path
              className="chart-recovery"
              pathLength={1}
              d={visualData.chart}
            />
            <circle cx="165" cy="145" r="4" />
            <circle cx="375" cy="60" r="4" />
          </svg>
          <div className="diagram-legend">
            <span>{labels[0]}</span>
            <span>
              {labels[1]} → {labels[2]}
            </span>
          </div>
        </>
      )}
      {project.visual === "arcade" && (
        <>
          <svg
            className="technical-diagram arcade-field"
            viewBox="0 0 410 200"
            fill="none"
            aria-hidden="true"
          >
            <path className="diagram-baseline" d="M205 15V185M35 100H375" />
            <g className="arcade-enemy">
              <path d="m205 42-18-12v18l18 10 18-10V30Z" />
            </g>
            <g className="arcade-reticle">
              <path d="M174 34V23H186M224 23H236V34M174 53V65H186M224 65H236V53" />
            </g>
            <path className="arcade-shot" d="M205 135V122" />
            <path className="arcade-player" d="m205 146-17 33 17-8 17 8Z" />
          </svg>
          <div className="diagram-legend">
            <span>{labels[0]}</span>
            <span>{labels[1]}</span>
          </div>
        </>
      )}
      {project.visual === "grid" && (
        <>
          <svg
            className="technical-diagram dungeon-grid"
            viewBox="0 0 300 200"
            fill="none"
            aria-hidden="true"
          >
            <g className="diagram-baseline">
              {Array.from({ length: 7 }, (_, i) => (
                <path key={i} d={`M${30 + i * 40} 50V170`} />
              ))}
              {[50, 90, 130, 170].map((y) => (
                <path key={y} d={`M30 ${y}H270`} />
              ))}
            </g>
            {visualData.walls.map(([x, y]) => (
              <rect
                className="grid-wall"
                key={`${x}-${y}`}
                x={x - 13}
                y={y - 13}
                width="26"
                height="26"
                rx="2"
              />
            ))}
            <path
              className="grid-route"
              pathLength={1}
              d={visualData.gridPath}
            />
            <circle className="grid-player" cx="50" cy="150" r="7" />
            <path className="grid-enemy" d="m250 61 9 9-9 9-9-9Z" />
          </svg>
          <div className="diagram-legend">
            <span>{labels[0]}</span>
            <span>{labels[1]}</span>
          </div>
        </>
      )}
      {project.visual === "planner" && (
        <div className="planner-chat-preview" aria-label="Illustrative Degree Planner AI chatbot preview">
          <div className="planner-chat-topline">
            <span><span className="tiny-dot" /> DEGREE PLANNER AI</span>
            <span>ILLUSTRATIVE PREVIEW</span>
          </div>
          <div className="planner-question">
            <span className="planner-avatar">S</span>
            <p>What do I still need for my computer science major?</p>
          </div>
          <div className="planner-answer">
            <span className="planner-avatar planner-avatar-ai">AI</span>
            <div>
              <p>You still need the remaining major requirements listed below:</p>
              <ul>
                <li>Algorithms and Analysis</li>
                <li>Systems</li>
              </ul>
              <span className="planner-citation">CATALOG / COMPUTER SCIENCE / REQUIREMENTS ↗</span>
            </div>
          </div>
        </div>
      )}
      {project.visual === "racing" && (
        <div className="racing-preview" aria-label="Illustrative Initial D Racing Game preview">
          <div className="racing-preview-topline">
            <span><span className="tiny-dot" /> INITIAL D / UNITY</span>
            <span>ILLUSTRATIVE PREVIEW</span>
          </div>
          <svg viewBox="0 0 410 150" fill="none" aria-hidden="true">
            <path className="racing-mountain" d="M0 112 72 42 122 86 190 22 260 82 328 35 410 112" />
            <path className="racing-track" d="M-12 144C84 92 92 159 174 112S281 76 422 118" />
            <path className="racing-track-line" d="M-12 144C84 92 92 159 174 112S281 76 422 118" />
            <path className="racing-car" d="m189 101 20-7 22 8-3 10-37-1Z" />
            <circle className="racing-wheel" cx="198" cy="110" r="4" />
            <circle className="racing-wheel" cx="222" cy="111" r="4" />
          </svg>
          <div className="racing-preview-footer">
            <span>{labels[0]}</span>
            <span>{labels[1]} / {labels[2]}</span>
          </div>
        </div>
      )}
      <div className="visual-bottomline">
        <span>{portfolioCopy.visualFooter}</span>
        <span>〈 / 〉</span>
      </div>
    </div>
  );
}

import { Braces, Database, Globe2, Layers3, Terminal } from "lucide-react";
import type { Project } from "@/lib/portfolio";

export function ProjectVisual({ project }: { project: Project }) {
  return (
    <div
      className={`project-visual visual-${project.visual} theme-${project.accent}`}
      role="img"
      aria-label={`${project.category} conceptual illustration; replace with actual project imagery`}
    >
      <div className="visual-grid" />
      <div className="visual-topline">
        <span>
          <span className="tiny-dot" />
          {project.visual === "network"
            ? "SYSTEM ARCHITECTURE"
            : project.visual === "terminal"
              ? "DEVELOPER ENVIRONMENT"
              : "DATA FLOW"}
        </span>
        <span>FIG. {project.number}</span>
      </div>
      {project.visual === "network" && (
        <div className="network-diagram">
          <div className="diagram-node node-client">
            <Globe2 size={22} />
            <span>CLIENT</span>
          </div>
          <div className="diagram-wire wire-one" />
          <div className="diagram-node node-api">
            <Braces size={29} />
            <span>API</span>
            <small>request → response</small>
          </div>
          <div className="diagram-wire wire-two" />
          <div className="diagram-node node-data">
            <Database size={22} />
            <span>DATA</span>
          </div>
          <div className="network-orbit orbit-one" />
          <div className="network-orbit orbit-two" />
        </div>
      )}
      {project.visual === "terminal" && (
        <div className="demo-terminal">
          <div className="terminal-title">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>~/workspace</span>
            <Terminal size={13} />
          </div>
          <div className="terminal-code">
            <p>
              <span>❯</span> git switch -c next-idea
            </p>
            <p className="code-muted">
              Switched to a new branch &apos;next-idea&apos;
            </p>
            <p>
              <span>❯</span> git status --short
            </p>
            <p className="code-blue">&nbsp;M src/index.ts</p>
            <p className="code-blue">?? tests/</p>
            <p>
              <span>❯</span> <span className="code-cursor">▌</span>
            </p>
          </div>
        </div>
      )}
      {project.visual === "pipeline" && (
        <div className="pipeline-diagram">
          <div className="data-cloud">
            {Array.from({ length: 24 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${12 + ((i * 29) % 78)}%`,
                  top: `${12 + ((i * 37) % 78)}%`,
                  opacity: 0.2 + (i % 4) * 0.2,
                }}
              />
            ))}
          </div>
          <div className="pipeline-line" />
          <div className="pipeline-core">
            <Layers3 size={36} strokeWidth={1} />
            <span>TRANSFORM</span>
          </div>
          <div className="pipeline-line" />
          <div className="data-bars">
            {[32, 58, 42, 78, 60, 95, 76].map((height, i) => (
              <i key={i} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="pipeline-labels">
            <span>01 / INGEST</span>
            <span>02 / PROCESS</span>
            <span>03 / INSIGHT</span>
          </div>
        </div>
      )}
      <div className="visual-bottomline">
        <span>ILLUSTRATIVE PREVIEW</span>
        <span>〈 / 〉</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";
import { experience } from "@/lib/portfolio";

export function ExperienceSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const entries = Array.from(
      document.querySelectorAll<HTMLElement>("[data-experience-index]"),
    );
    const observer = new IntersectionObserver(
      (visible) => {
        const next = visible
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          ?.target.getAttribute("data-experience-index");
        if (next) {
          const nextIndex = Number(next);
          setActive(nextIndex);
          entries.forEach((entry) =>
            entry.classList.toggle(
              "experience-active",
              entry.getAttribute("data-experience-index") === next,
            ),
          );
        }
      },
      { rootMargin: "-28% 0px -42%", threshold: [0.1, 0.4, 0.8] },
    );
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, []);

  const item = experience[active];
  return (
      <div className="experience-panel" key={active} aria-live="polite">
        <div className="experience-panel-topline">
          <span><GitBranch size={14} /> ROLE / {String(active + 1).padStart(2, "0")}</span>
          <span>{item.company}</span>
        </div>
        <p className="experience-takeaway">{item.takeaway}</p>
        <div className="experience-panel-block">
          <span className="experience-panel-label">WHAT I DID</span>
          <ul>
            {item.built.map((entry) => <li key={entry}>{entry}</li>)}
          </ul>
        </div>
        <div className="experience-panel-block">
          <span className="experience-panel-label">TOOLS I USED</span>
          <div className="experience-tools">
            {item.tools.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </div>
      </div>
  );
}

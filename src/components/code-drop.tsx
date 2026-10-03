"use client";

import { useState } from "react";

const MESSAGE = 'yourNextEngineer = "Arman";';

export function CodeDrop() {
  const [count, setCount] = useState(0);
  const complete = count === MESSAGE.length;

  function drop() {
    setCount((previous) => {
      let next = Math.min(previous + 1, MESSAGE.length);
      while (MESSAGE[next] === " ") next++;
      return next;
    });
  }

  return (
    <div className="about-art code-drop" data-complete={complete} data-lens="off">
      <div className="about-art-grid" aria-hidden="true" />
      <button
        type="button"
        className="code-drop-surface"
        onClick={drop}
        disabled={complete}
        aria-label="Drop next character"
        aria-describedby="code-drop-status"
      >
        <span className="code-drop-top" aria-hidden="true">A LITTLE CODE, ONE CLICK AT A TIME</span>
        <span className="code-drop-hint" aria-hidden="true">
          {complete ? "Let’s build something together." : count ? "Keep going. You’re building something." : "Click or tap to build something."}
        </span>
        <span className="code-drop-line" aria-hidden="true">
          {Array.from(MESSAGE).map((character, index) => (
            <span className="code-drop-slot" key={index}>
              {index < count && (
                <span className={`code-drop-character${character === " " ? " code-drop-space" : ""}`}>
                  {character === " " ? "\u00a0" : character}
                </span>
              )}
            </span>
          ))}
        </span>
        <span className="code-drop-floor" aria-hidden="true" />
      </button>
      <p id="code-drop-status" className="code-drop-status" role="status">
        {complete ? `Complete — ${MESSAGE}` : `${count} / ${MESSAGE.length} characters`}
      </p>
      {count > 0 && (
        <button type="button" className="code-drop-reset" onClick={() => setCount(0)}>
          {complete ? "Run again" : "Reset"} <span aria-hidden="true">↻</span>
        </button>
      )}
    </div>
  );
}

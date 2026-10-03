"use client";

import { useEffect, useState } from "react";

const TEXT = "build something?";

export function ContactTypewriter() {
  const [length, setLength] = useState(TEXT.length);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let position = TEXT.length;
    let deleting = true;
    let hold = 18;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (reduced.matches || document.querySelector(".scroll-journey")?.getAttribute("data-motion") === "static") {
        position = TEXT.length;
        deleting = true;
        hold = 18;
        setLength(position);
        return;
      }
      if (hold > 0) { hold--; return; }
      position += deleting ? -1 : 1;
      setLength(position);
      if (position === 0) { deleting = false; hold = 4; }
      if (position === TEXT.length) { deleting = true; hold = 18; }
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="contact-typewriter" aria-hidden="true" data-lens="off">
      <span className="contact-typewriter-space">{TEXT}_</span>
      <span className="contact-typewriter-text">
        {TEXT.slice(0, Math.min(length, 6))}
        <span className="contact-typewriter-accent">{TEXT.slice(6, length)}</span>
        <span className="terminal-cursor">_</span>
      </span>
    </span>
  );
}

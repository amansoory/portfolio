"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ReadingRail() {
  const rail = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      const progress = Math.max(0, Math.min(1, height > 0 ? scrollY / height : 0));
      rail.current?.style.setProperty("--reading-progress", String(progress));
      rail.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, [pathname]);
  return <div ref={rail} className="reading-rail" role="progressbar" aria-label="Page reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
    <span className="reading-rail-fill" /><span className="reading-rail-cursor" />
  </div>;
}

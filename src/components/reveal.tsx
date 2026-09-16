"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "motion";
import { useJourney } from "@/components/scroll-journey";

/** One entrance per element. Focus, anchor jumps, and motion preferences win. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useRef(new WeakSet<HTMLElement>());
  const journey = useJourney();
  const enabled = journey?.enabled ?? true;
  const mobile = journey?.mobile ?? false;
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-enter], .section-heading > *, .split-section > div > h2, .section-description, .small-terminal",
      ),
    );
    if (!targets.length) targets.push(root);
    const animations = new Map<HTMLElement, ReturnType<typeof animate>>();
    const finish = (element: HTMLElement) => {
      animations.get(element)?.stop();
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.filter = "none";
      element.style.clipPath = "none";
    };
    if (!enabled || query.matches) {
      targets.forEach(finish);
      return;
    }
    const revealNow = () => {
      targets.forEach((element) => {
        entered.current.add(element);
        finish(element);
      });
    };
    const jump = (event: Event) => {
      const hash =
        event instanceof CustomEvent ? String(event.detail) : location.hash;
      if (!hash) return;
      let destination: HTMLElement | null = null;
      try {
        destination = document.getElementById(
          decodeURIComponent(hash.slice(1)),
        );
      } catch {
        return;
      }
      if (
        destination &&
        (destination.contains(root) || root.contains(destination))
      )
        revealNow();
    };
    // A deep link must not make visitors wait for its destination to become readable.
    if (location.hash) jump(new Event("hashchange"));
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (!entry.isIntersecting || entered.current.has(element)) return;
          entered.current.add(element);
          element.dataset.entered = "true";
          observer.unobserve(element);
          const visual = element.dataset.enter === "visual" && !mobile;
          animations.set(
            element,
            animate(
              element,
              {
                opacity: [0.45, 1],
                transform: [
                  `translateY(${mobile ? 10 : 18}px)`,
                  "translateY(0px)",
                ],
                ...(visual
                  ? {
                      filter: ["blur(3px)", "blur(0px)"],
                      clipPath: ["inset(0 0 7% 0)", "inset(0 0 0% 0)"],
                    }
                  : {}),
              },
              {
                duration: mobile ? 0.35 : 0.55,
                delay: Math.min(order++ * 0.07, 0.28),
                ease: [0.22, 1, 0.36, 1],
              },
            ),
          );
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );
    targets.forEach((element) => {
      if (!entered.current.has(element)) observer.observe(element);
    });
    const preferenceChange = () => {
      if (query.matches) {
        observer.disconnect();
        revealNow();
      }
    };
    root.addEventListener("focusin", revealNow);
    window.addEventListener("journey:jump", jump);
    window.addEventListener("hashchange", jump);
    query.addEventListener("change", preferenceChange);
    return () => {
      observer.disconnect();
      targets.forEach(finish);
      root.removeEventListener("focusin", revealNow);
      window.removeEventListener("journey:jump", jump);
      window.removeEventListener("hashchange", jump);
      query.removeEventListener("change", preferenceChange);
    };
  }, [enabled, mobile]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

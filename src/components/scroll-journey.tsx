"use client";
import { copy } from "@/lib/copy";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import { Pause, Play } from "lucide-react";

type Journey = {
  heroProgress: MotionValue<number>;
  enabled: boolean;
  reduced: boolean;
  mobile: boolean;
  paused: boolean;
};
const JourneyContext = createContext<Journey | null>(null);
export const useJourney = () => useContext(JourneyContext);
const clamp = (n: number) => Math.max(0, Math.min(1, n));

type Trace = {
  width: number;
  height: number;
  spine: number;
  path: string;
  start: number;
  turn: number;
  approach: number;
  end: number;
  branches: { path: string; y: number }[];
};

/** One scroll listener drives the DOM story and the lazy scene. No animation clock. */
export function ScrollJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const chapterNav = useRef<HTMLElement>(null);
  const activeTrace = useRef<SVGPathElement>(null);
  const signal = useRef<SVGCircleElement>(null);
  const heroProgress = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [preferences, setPreferences] = useState({
    ready: false,
    reduced: true,
    mobile: true,
    pin: false,
  });
  const [trace, setTrace] = useState<Trace | null>(null);
  const enabled = preferences.ready && !preferences.reduced && !paused;
  // SVG geometry commits after measurement; update its initial drawing once.
  useEffect(() => {
    if (trace) window.dispatchEvent(new Event("scroll"));
  }, [trace]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const pin = matchMedia("(min-width: 1024px) and (min-height: 900px)");
    const update = () =>
      setPreferences({
        ready: true,
        reduced: reduced.matches,
        mobile: mobile.matches,
        pin: pin.matches && !reduced.matches,
      });
    const frame = requestAnimationFrame(update);
    [reduced, mobile, pin].forEach((query) =>
      query.addEventListener("change", update),
    );
    return () => {
      cancelAnimationFrame(frame);
      [reduced, mobile, pin].forEach((query) =>
        query.removeEventListener("change", update),
      );
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let measureNeeded = true;
    let disposed = false;
    let rootTop = 0;
    let heroTop = 0;
    let heroDistance = 1;
    let totalScroll = 1;
    let traceGeometry: Trace | null = null;
    let flow: { element: HTMLElement; top: number; height: number }[] = [];
    let chapters: { element: HTMLElement; top: number; label: string }[] = [];
    const labelMap: Record<string, string> = {
      work: "PROJECTS",
      experience: "EXPERIENCE",
      skills: "SKILLS",
      about: "ABOUT",
      contact: "CONTACT",
    };
    const bounds = (node: Element) => {
      const r = node.getBoundingClientRect();
      return {
        x: r.left,
        y: r.top + window.scrollY - rootTop,
        width: r.width,
        height: r.height,
      };
    };

    function measure() {
      rootTop = element!.getBoundingClientRect().top + window.scrollY;
      totalScroll = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      const sequence = element!.querySelector<HTMLElement>(".hero-sequence");
      const traceOrigin = element!.querySelector<HTMLElement>("#work");
      const contact = element!.querySelector<HTMLElement>("#contact");
      if (sequence) {
        heroTop = bounds(sequence).y + rootTop;
        heroDistance = Math.max(
          1,
          preferences.pin
            ? sequence.offsetHeight - innerHeight + 84
            : sequence.offsetHeight * 0.72,
        );
      }
      flow = Array.from(
        element!.querySelectorAll<HTMLElement>("[data-flow]"),
      ).map((node) => ({
        element: node,
        top: bounds(node).y + rootTop,
        height: node.offsetHeight,
      }));
      chapters = Array.from(
        element!.querySelectorAll<HTMLElement>("main > section[id]"),
      ).map((node) => ({
        element: node,
        top: bounds(node).y + rootTop,
        label: labelMap[node.id] || "INTRO",
      }));
      if (traceOrigin && contact) {
        const originBounds = bounds(traceOrigin);
        const contactBounds = bounds(contact);
        const spine = Math.max(
          8,
          originBounds.x - (preferences.mobile ? 12 : 22),
        );
        const start = originBounds.y - (preferences.mobile ? 36 : 64);
        const elbow = originBounds.y - 16;
        const end = contactBounds.y + contactBounds.height - 60;
        const startX = originBounds.x + Math.min(160, originBounds.width * 0.25);
        const targets = Array.from(
          element!.querySelectorAll<HTMLElement>(
            ".project-row, main > section[id] > div > .section-label",
          ),
        );
        const branches = targets.map((node) => {
          const b = bounds(node);
          const y =
            b.y + (node.classList.contains("project-row") ? 32 : 6);
          return { path: `M ${spine} ${y} H ${b.x - 5}`, y };
        });
        traceGeometry = {
          width: element!.clientWidth,
          height: element!.offsetHeight,
          spine,
          path: `M ${startX} ${start} V ${elbow} H ${spine} V ${end}`,
          start,
          turn: elbow,
          approach: elbow - start + startX - spine,
          end,
          branches,
        };
        setTrace(traceGeometry);
      }
      measureNeeded = false;
    }

    function render() {
      frame = 0;
      if (disposed) return;
      if (measureNeeded) measure();
      const y = window.scrollY;
      const pageProgress = clamp(y / totalScroll);
      const lead = y + innerHeight * 0.66;
      const hero = clamp((y - heroTop + 84) / heroDistance);
      element!.style.setProperty("--page-progress", pageProgress.toFixed(4));
      // Telemetry always reflects the actual page location, even with motion paused.
      if (progressBar.current)
        progressBar.current.style.transform = `scaleX(${pageProgress})`;
      let chapter =
        "INTRO";
      for (const item of chapters) if (lead >= item.top) chapter = item.label;
      if (pageProgress > 0.995) chapter = "CONTACT";
      let activeChapter = "top";
      for (const item of chapters) {
        if (y + innerHeight * 0.35 >= item.top) activeChapter = item.element.id;
      }
      if (pageProgress > 0.995) activeChapter = "contact";
      chapterNav.current?.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        if (link.hash === `#${activeChapter}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (readout.current)
        readout.current.textContent = `${chapter} / ${Math.round(
          pageProgress * 100,
        )
          .toString()
          .padStart(2, "0")}%`;
      if (enabled) {
        heroProgress.set(hero);
        element!.style.setProperty("--hero-progress", hero.toFixed(4));
        for (const item of flow) {
          const p = clamp(
            (lead - item.top) /
              Math.max(130, Math.min(item.height * 0.75, innerHeight * 0.5)),
          );
          item.element.style.setProperty("--flow", p.toFixed(4));
          item.element.dataset.flowActive = String(
            p > 0.12 && y < item.top + item.height,
          );
        }
        const geometry = traceGeometry;
        if (geometry && activeTrace.current && signal.current) {
          const localLead = lead - rootTop;
          const totalLength = geometry.approach + geometry.end - geometry.turn;
          const traveled =
            localLead < geometry.turn + 120
              ? clamp(
                  (localLead - geometry.start) /
                    (geometry.turn + 120 - geometry.start),
                ) *
                (geometry.approach + 120)
              : geometry.approach + localLead - geometry.turn;
          const p = clamp(traveled / totalLength);
          const path = activeTrace.current;
          path.style.strokeDashoffset = String(1 - p);
          const point = path.getPointAtLength(totalLength * p);
          signal.current.setAttribute("cx", String(point.x));
          signal.current.setAttribute("cy", String(point.y));
          signal.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
          element!
            .querySelectorAll<SVGPathElement>(".trace-branch-active")
            .forEach((branch, i) => {
              const branchProgress = clamp(
                (localLead - geometry.branches[i].y) / 100,
              );
              branch.style.strokeDashoffset = String(1 - branchProgress);
            });
        }
      }
    }
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      measureNeeded = true;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    // Let reveals finish immediately when a navigation target or keyboard focus is requested.
    const jump = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (
        url.origin === location.origin &&
        url.pathname === location.pathname &&
        url.hash
      ) {
        window.dispatchEvent(
          new CustomEvent("journey:jump", { detail: url.hash }),
        );
      }
    };
    document.addEventListener("click", jump);
    document.fonts.ready.then(() => {
      if (!disposed) resize();
    });
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("click", jump);
    };
  }, [enabled, preferences.mobile, preferences.pin, heroProgress]);

  return (
    <JourneyContext.Provider
      value={{
        heroProgress,
        enabled,
        reduced: preferences.reduced,
        mobile: preferences.mobile,
        paused,
      }}
    >
      <div
        ref={root}
        className="scroll-journey"
        data-motion={enabled ? "active" : "static"}
        data-pin={preferences.ready && preferences.pin}
      >
        {preferences.ready && (
          <div className="scroll-telemetry">
            <div className="telemetry-track" aria-hidden="true">
              <div ref={progressBar} className="telemetry-fill" />
            </div>
            <div className="telemetry-console">
              <span
                ref={readout}
                className="telemetry-readout"
                aria-hidden="true"
              >
                INTRO / 00%
              </span>
              {!preferences.reduced && (
                <button
                  className="journey-toggle"
                  onClick={() => setPaused((value) => !value)}
                  aria-pressed={paused}
                  aria-label={paused ? copy.motion.resume : copy.motion.pause}
                  title={paused ? copy.motion.resumeAll : copy.motion.pauseAll}
                >
                  {paused ? <Play size={11} /> : <Pause size={11} />}
                  <span>{paused ? copy.motion.resume : copy.motion.pause}</span>
                </button>
              )}
            </div>
          </div>
        )}
        {preferences.ready && (
          <nav ref={chapterNav} className="journey-chapters" aria-label="Page sections">
            {[
              ["top", "Intro"],
              ["work", "Projects"],
              ["skills", "Skills"],
              ["about", "About"],
              ["experience", "Experience"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} aria-label={`Jump to ${label}`}>
                <span className="chapter-tooltip">{label}</span>
                <span className="chapter-dot" aria-hidden="true" />
              </a>
            ))}
          </nav>
        )}
        {trace && (
          <svg
            className="journey-trace"
            width={trace.width}
            height={trace.height}
            viewBox={`0 0 ${trace.width} ${trace.height}`}
            aria-hidden="true"
          >
            <path className="trace-track" d={trace.path} />
            <path
              ref={activeTrace}
              className="trace-active"
              d={trace.path}
              pathLength={1}
            />
            {trace.branches.map((branch, i) => (
              <g key={i}>
                <path className="trace-track" d={branch.path} />
                <path
                  className="trace-branch-active"
                  d={branch.path}
                  pathLength={1}
                />
                <circle
                  className="trace-terminal"
                  cx={trace.spine}
                  cy={branch.y}
                  r={2}
                />
              </g>
            ))}
            <circle ref={signal} className="trace-signal" r={3} />
          </svg>
        )}
        {children}
      </div>
    </JourneyContext.Provider>
  );
}

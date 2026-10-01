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
import { useMotionValue, useMotionValueEvent, type MotionValue } from "motion/react";
import { createPortal } from "react-dom";
import { Command, GitBranch, Pause, Play } from "lucide-react";

/** Section ids rendered as source files in the status bar. Projects use their own data-file. */
const sectionFiles: Record<string, string> = {
  top: "hero.tsx",
  work: "work/index.tsx",
  experience: "experience.ts",
  skills: "toolkit.ts",
  about: "about.md",
  contact: "contact.sh",
};
// The status bar counts the page in "lines" of this many CSS pixels.
const LINE_HEIGHT = 22;
const commit = process.env.NEXT_PUBLIC_COMMIT_SHA?.slice(0, 7) ?? "";

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
const sectionLinks = [
  ["top", "Introduction"],
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["about", "About"],
  ["contact", "Contact"],
] as const;

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

/** The chip scrubs directly with scroll position, without time-based catch-up. */
export function ScrollJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const fileName = useRef<HTMLSpanElement>(null);
  const lineReadout = useRef<HTMLSpanElement>(null);
  const percentReadout = useRef<HTMLSpanElement>(null);
  const statusFill = useRef<HTMLSpanElement>(null);
  const sectionNav = useRef<HTMLElement>(null);
  const activeTrace = useRef<SVGPathElement>(null);
  const signal = useRef<SVGCircleElement>(null);
  const heroProgress = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [preferences, setPreferences] = useState({
    ready: false,
    reduced: true,
    mobile: true,
  });
  const [trace, setTrace] = useState<Trace | null>(null);
  const enabled = preferences.ready && !preferences.reduced && !paused;
  useMotionValueEvent(heroProgress, "change", (value) => {
    root.current?.style.setProperty("--hero-progress", clamp(value).toFixed(4));
  });
  // The command palette can pause or resume motion too.
  useEffect(() => {
    const toggle = () => setPaused((value) => !value);
    window.addEventListener("journey:toggle-motion", toggle);
    return () => window.removeEventListener("journey:toggle-motion", toggle);
  }, []);
  // SVG geometry commits after measurement; update its initial drawing once.
  useEffect(() => {
    if (trace) window.dispatchEvent(new Event("scroll"));
  }, [trace]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const update = () =>
      setPreferences({
        ready: true,
        reduced: reduced.matches,
        mobile: mobile.matches,
      });
    const frame = requestAnimationFrame(update);
    [reduced, mobile].forEach((query) =>
      query.addEventListener("change", update),
    );
    return () => {
      cancelAnimationFrame(frame);
      [reduced, mobile].forEach((query) =>
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
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none;";
    document.body.appendChild(probe);
    let flow: { element: HTMLElement; top: number; height: number }[] = [];
    let chapters: { element: HTMLElement; top: number }[] = [];
    let files: { top: number; name: string }[] = [];
    let totalLines = 1;
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
      const scene = element!.querySelector<HTMLElement>(".scene-stage");
      const strip = element!.querySelector<HTMLElement>("#work");
      const contact = element!.querySelector<HTMLElement>("#contact");
      if (scene) {
        // The page always scrolls 1:1; the chip only reacts. It unfolds while the model is on screen:
        // from the moment the frame is fully visible until the raised top plate would reach the header.
        // The model sits ~25% down its frame and drifts another 12% (see .scene-stage layers in CSS).
        // Small-viewport height ignores mobile toolbar show/hide, so progress never shifts mid-scroll.
        probe.style.height = "100svh";
        const viewport = probe.offsetHeight || innerHeight;
        const headerHeight = preferences.mobile ? 68 : 84;
        const unfold = Math.min(340, Math.max(220, viewport * 0.38));
        const sceneTop = bounds(scene).y + rootTop;
        const height = scene.offsetHeight;
        const fullyVisible = sceneTop + height - viewport + 24;
        const leaving = sceneTop - headerHeight - 16 + height * 0.37;
        const slack = leaving - fullyVisible - unfold;
        heroTop = Math.max(0, slack >= 0 ? fullyVisible + slack * 0.25 : leaving - unfold);
        heroDistance = Math.max(160, Math.min(unfold, leaving - heroTop));
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
      }));
      // Status bar "files": each section, plus each project card while it is being read.
      files = [
        ...chapters.map((item) => ({ top: item.top, name: sectionFiles[item.element.id] ?? `${item.element.id}.tsx` })),
        ...Array.from(element!.querySelectorAll<HTMLElement>("[data-file]")).map((node) => ({
          top: bounds(node).y + rootTop,
          name: node.dataset.file ?? "",
        })),
      ].sort((a, b) => a.top - b.top);
      totalLines = Math.max(1, Math.ceil(document.documentElement.scrollHeight / LINE_HEIGHT));
      if (strip && contact) {
        const stripBounds = bounds(strip);
        const contactBounds = bounds(contact);
        const spine = Math.max(
          8,
          stripBounds.x - (preferences.mobile ? 12 : 22),
        );
        const start = stripBounds.y - (preferences.mobile ? 24 : 56);
        const elbow = stripBounds.y - 16;
        const end = contactBounds.y + contactBounds.height - 60;
        const startX = stripBounds.x + stripBounds.width * 0.76;
        const targets = Array.from(
          element!.querySelectorAll<HTMLElement>(
            ".project-preview-link, main > section[id] > div > .section-label",
          ),
        );
        const branches = targets.map((node) => {
          const b = bounds(node);
          const y =
            b.y + (node.classList.contains("project-preview-link") ? 32 : 6);
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
      // Content outside this root (footer, status bar padding, late-loading images) can change the
      // document height after the last measurement; re-measure positions when it does.
      if (Math.abs(document.documentElement.scrollHeight - innerHeight - totalScroll) > 2) measure();
      const pageProgress = y >= totalScroll - 2 ? 1 : clamp(y / totalScroll);
      const lead = y + innerHeight * 0.66;
      const hero = clamp((y - heroTop) / heroDistance);
      element!.style.setProperty("--page-progress", pageProgress.toFixed(4));
      // Telemetry always reflects the actual page location, even with motion paused.
      if (progressBar.current)
        progressBar.current.style.transform = `scaleX(${pageProgress})`;
      // Location markers follow reading position even when decorative motion is paused.
      const readingPosition = y + innerHeight * 0.35;
      let activeSection = "top";
      for (const item of chapters) if (readingPosition >= item.top) activeSection = item.element.id;
      if (pageProgress > 0.995) activeSection = "contact";
      let file = sectionFiles.top;
      for (const item of files) if (lead >= item.top) file = item.name;
      if (pageProgress > 0.995) file = sectionFiles.contact;
      if (fileName.current && fileName.current.textContent !== file) fileName.current.textContent = file;
      const line = `Ln ${(Math.floor(y / LINE_HEIGHT) + 1).toLocaleString("en-US")} / ${totalLines.toLocaleString("en-US")}`;
      if (lineReadout.current && lineReadout.current.textContent !== line) lineReadout.current.textContent = line;
      const percent = `${Math.round(pageProgress * 100)}%`;
      if (percentReadout.current && percentReadout.current.textContent !== percent) percentReadout.current.textContent = percent;
      if (statusFill.current) statusFill.current.style.transform = `scaleX(${pageProgress})`;
      sectionNav.current?.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        if (link.hash === `#${activeSection}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (enabled) {
        heroProgress.set(hero);
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
      probe.remove();
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("click", jump);
    };
  }, [enabled, preferences.mobile, heroProgress]);

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
      >
        {preferences.ready && createPortal(
          <div className="scroll-telemetry">
            <nav ref={sectionNav} className="section-dot-nav" aria-label="Section navigation">
              {sectionLinks.map(([id, label]) => (
                <a key={id} href={`#${id}`} aria-label={`Go to ${label}`} title={label}>
                  <span aria-hidden="true" />
                </a>
              ))}
            </nav>
            <div className="telemetry-track" aria-hidden="true">
              <div ref={progressBar} className="telemetry-fill" />
            </div>
            <div className="status-bar" role="group" aria-label={copy.status.label}>
              <span className="status-branch" aria-hidden="true">
                <GitBranch size={11} /> {copy.status.branch}
                {commit && <span className="status-commit">@{commit}</span>}
              </span>
              <button
                type="button"
                className="status-file"
                onClick={() => window.dispatchEvent(new Event("palette:open"))}
                aria-label={copy.status.palette}
              >
                <span className="status-root" aria-hidden="true">{copy.status.root}/</span>
                <span ref={fileName} aria-hidden="true">{sectionFiles.top}</span>
              </button>
              <span className="status-spacer" />
              <span ref={lineReadout} className="status-lines" aria-hidden="true">
                Ln 1 / 1
              </span>
              <span className="status-meter" aria-hidden="true">
                <span ref={statusFill} className="status-meter-fill" />
              </span>
              <span ref={percentReadout} className="status-percent" aria-hidden="true">
                0%
              </span>
              <span className="status-open" aria-hidden="true">
                <span className="status-dot" /> {copy.status.openToWork}
              </span>
              {!preferences.reduced && (
                <button
                  type="button"
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
              <button
                type="button"
                className="status-palette"
                onClick={() => window.dispatchEvent(new Event("palette:open"))}
                aria-label={copy.status.palette}
                title={copy.status.palette}
              >
                <Command size={11} aria-hidden="true" />
                <span>{copy.status.shortcut}</span>
              </button>
            </div>
          </div>,
          document.body,
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
                {!preferences.mobile && <circle
                  className="trace-terminal"
                  cx={trace.spine}
                  cy={branch.y}
                  r={2}
                />}
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

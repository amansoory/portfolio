"use client";

import { copy, sceneStages as stages } from "@/lib/copy";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionValueEvent } from "motion/react";
import { Terminal } from "lucide-react";
import { useJourney } from "@/components/scroll-journey";

const SystemScene = dynamic(() => import("@/components/system-scene"), {
  ssr: false,
});

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SystemPoster() {
  return (
    <svg
      className="system-poster"
      viewBox="0 0 640 520"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="plate"
          x1="160"
          y1="100"
          x2="480"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#263e36" />
          <stop offset="1" stopColor="#0d1915" />
        </linearGradient>
        <linearGradient
          id="chip"
          x1="260"
          y1="170"
          x2="370"
          y2="285"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b8f4c1" />
          <stop offset="1" stopColor="#51735c" />
        </linearGradient>
      </defs>
      <g stroke="#b5edbd" strokeOpacity=".1">
        <path d="M20 320 320 150 620 320 320 490Z" />
        <path d="M70 320 320 180 570 320 320 460Z" />
        <path d="M120 320 320 208 520 320 320 432Z" />
        <path d="M20 320H620M320 150V490" />
      </g>
      <g className="poster-traces" stroke="#9fdcae" strokeOpacity=".6">
        <path d="M90 270 170 316 252 270M550 270 470 316 388 270M160 160 220 195 275 163M480 160 420 195 365 163" />
        <path d="M92 354 190 410 292 350M548 354 450 410 350 350" />
      </g>
      <path
        className="poster-signal"
        pathLength={1}
        d="M90 270 170 316 252 270 320 310 388 270 470 316 550 270"
        stroke="#d4efc3"
        strokeWidth="2"
      />
      <path
        d="M168 284 320 198 472 284V309L320 398 168 309Z"
        fill="#111d18"
        stroke="#54765b"
      />
      <path
        d="M168 284 320 198 472 284 320 371Z"
        fill="url(#plate)"
        stroke="#6d9976"
      />
      <g className="poster-upper">
        <path
          d="M168 211 320 125 472 211V237L320 325 168 237Z"
          fill="#15291f"
          stroke="#658f6b"
        />
        <path
          d="M168 211 320 125 472 211 320 298Z"
          fill="url(#plate)"
          stroke="#b0d9b4"
        />
        <path
          d="M235 211 320 163 405 211 320 260Z"
          stroke="#80ba8c"
          strokeDasharray="3 5"
        />
        <path
          d="M272 203 320 176 368 203V220L320 249 272 220Z"
          fill="#47724e"
          stroke="#b9eec0"
        />
        <path d="M272 203 320 176 368 203 320 231Z" fill="url(#chip)" />
        <path
          d="m305 202-8 5 8 5m30-10 8 5-8 5m-11-15-8 19"
          stroke="#14291b"
          strokeWidth="2"
        />
      </g>
      {[
        [90, 254],
        [550, 254],
        [160, 144],
        [480, 144],
        [92, 338],
        [548, 338],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            d="m-23 0 23-13L23 0v13L0 27-23 13Z"
            fill="#15251d"
            stroke="#739d79"
          />
          <path d="m-23 0 23-13L23 0 0 13Z" fill="#273f2f" />
          <circle cy="0" r="3" fill="#c3f5bc" />
        </g>
      ))}
      <g fill="#b3d1b9" fontSize="10" fontFamily="monospace">
        <text x="63" y="306">
          CLIENT
        </text>
        <text x="523" y="306">
          SERVICE
        </text>
        <text x="294" y="430">
          RUNTIME
        </text>
      </g>
    </svg>
  );
}

export function HeroExperience() {
  const host = useRef<HTMLDivElement>(null);
  const journey = useJourney()!;
  const [stage, setStage] = useState(0);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setReady(false), []);
  useMotionValueEvent(journey.heroProgress, "change", (value) => {
    setStage(value < 0.35 ? 0 : value < 0.75 ? 1 : 2);
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      setEligible(
        desktopQuery.matches && !motionQuery.matches && !connection?.saveData,
      );
    };
    const frame = requestAnimationFrame(update);
    motionQuery.addEventListener("change", update);
    desktopQuery.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { threshold: 0 },
    );
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    if (host.current) observer.observe(host.current);
    return () => {
      cancelAnimationFrame(frame);
      motionQuery.removeEventListener("change", update);
      desktopQuery.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <div
      className="hero-experience"
      ref={host}
      data-paused={!journey.enabled}
      data-stage={journey.reduced ? 0 : stage}
    >
      <div className="scene-caption">
        <span className="crosshair">+</span> {copy.scene.caption}
        <span className="scene-caption-index">SYS.001</span>
      </div>
      <div className="scene-stage" role="img" aria-label={copy.scene.alt}>
        <div className="scene-halo" />
        <div
          className={`poster-layer ${ready && eligible ? "poster-hidden" : ""}`}
        >
          <SystemPoster />
        </div>
        {eligible && loaded && (
          <SceneBoundary>
            <SystemScene
              progress={journey.heroProgress}
              running={visible && journey.enabled && tabVisible}
              onReady={onReady}
              onLost={onLost}
            />
          </SceneBoundary>
        )}
        <span className="scene-corner corner-tl" />
        <span className="scene-corner corner-br" />
      </div>
      <div className="scene-status">
        <span>
          <span className="status-dot" />
          {stages[journey.reduced ? 0 : stage].label}
        </span>
        <span>{copy.scene.scroll}</span>
      </div>
      <div className="hero-terminal">
        <div className="hero-terminal-title">
          <span>
            <Terminal size={13} /> {copy.scene.terminal}
          </span>
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="hero-terminal-body">
          <code>
            {stages[journey.reduced ? 0 : stage].command}
            <span className="terminal-cursor">▌</span>
          </code>
          <span>{stages[journey.reduced ? 0 : stage].output}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive circuit grid behind the whole site.
 * - The dot grid itself is a CSS background on the canvas (no drawing cost at rest).
 * - Hover lights nearby nodes and routes traces along the cursor's row and column.
 * - Clicking empty background sends a short breadth-first-search wavefront (Manhattan rings).
 * - The layer sits behind all content and ignores cards, links, and controls.
 * Frames are drawn only while the pointer moves or a pulse is running; there is no idle loop.
 * Disabled for reduced motion, and while the page's "Pause motion" toggle is active.
 */

const SPACING = 26;
const RADIUS = 130;
const PULSE_STEP_MS = 30;
const PULSE_STEPS = 13;
const PULSE_TRAIL = 4;
const GLOW_FADE_MS = 700;

type Pulse = { col: number; row: number; start: number };

/** Interface surfaces the effect never lights up or starts from; it lives only in empty background. */
const SURFACES = [
  // Controls and media
  "a, button, input, textarea, select, label, summary, img, video, iframe, canvas, svg, [role='dialog'], [role='button']",
  // Text: never glow behind something being read
  "h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, pre, code, table, figure, time, kbd",
  // Page chrome and content blocks (home page and case studies)
  "header, footer, nav, article, .status-bar, .scroll-telemetry, .project-row, .experience-entry, .hero-experience, .hero-copy",
  ".case-header, .case-meta, .case-chapter, .case-resources, .case-art, .section-heading, .section-label, .project-tags, .project-metrics, [data-slot='badge']",
].join(", ");

const isBackground = (target: EventTarget | null) => !(target instanceof Element) || !target.closest(SURFACES);

export function CircuitField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let dpr = 1;
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointer: { x: number; y: number; at: number } | null = null;
    let pulses: Pulse[] = [];

    const paused = () => reduced.matches || document.querySelector<HTMLElement>(".scroll-journey")?.dataset.motion === "static";

    function resize() {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      width = innerWidth;
      height = innerHeight;
      element!.width = Math.round(width * dpr);
      element!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    }

    // Node centers sit at SPACING/2 + n*SPACING, matching the CSS dot grid.
    const nodeX = (col: number) => SPACING / 2 + col * SPACING;

    function draw(now: number) {
      frame = 0;
      context!.clearRect(0, 0, width, height);
      if (paused()) {
        pointer = null;
        pulses = [];
        return;
      }
      let keepGoing = false;

      if (pointer) {
        const age = now - pointer.at;
        const fade = finePointer.matches ? 1 : Math.max(0, 1 - age / GLOW_FADE_MS);
        if (fade > 0) {
          if (!finePointer.matches) keepGoing = true;
          const col = Math.round((pointer.x - SPACING / 2) / SPACING);
          const row = Math.round((pointer.y - SPACING / 2) / SPACING);
          const cx = nodeX(col);
          const cy = nodeX(row);
          const span = Math.ceil(RADIUS / SPACING);
          // Soft halo under the probe.
          const halo = context!.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, RADIUS * 0.85);
          halo.addColorStop(0, `rgba(131,210,124,${0.08 * fade})`);
          halo.addColorStop(1, "rgba(131,210,124,0)");
          context!.fillStyle = halo;
          context!.fillRect(pointer.x - RADIUS, pointer.y - RADIUS, RADIUS * 2, RADIUS * 2);
          // Traces along the snapped row and column, fading with distance.
          for (const [x1, y1, x2, y2] of [
            [cx - RADIUS, cy, cx + RADIUS, cy],
            [cx, cy - RADIUS, cx, cy + RADIUS],
          ]) {
            const gradient = context!.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, "rgba(131,210,124,0)");
            gradient.addColorStop(0.5, `rgba(131,210,124,${0.4 * fade})`);
            gradient.addColorStop(1, "rgba(131,210,124,0)");
            context!.strokeStyle = gradient;
            context!.lineWidth = 1;
            context!.beginPath();
            context!.moveTo(x1, y1);
            context!.lineTo(x2, y2);
            context!.stroke();
          }
          // Nodes light up with a soft falloff around the cursor.
          for (let dr = -span; dr <= span; dr++) {
            for (let dc = -span; dc <= span; dc++) {
              const x = nodeX(col + dc);
              const y = nodeX(row + dr);
              const distance = Math.hypot(x - pointer.x, y - pointer.y);
              if (distance > RADIUS) continue;
              const strength = (1 - distance / RADIUS) ** 1.4 * fade;
              context!.fillStyle = `rgba(196,236,174,${Math.min(0.85, 0.15 + 0.8 * strength)})`;
              const size = 1.6 + 2.8 * strength;
              context!.fillRect(x - size / 2, y - size / 2, size, size);
            }
          }
          // Probe: highlighted node plus a live coordinate readout.
          context!.strokeStyle = `rgba(182,220,161,${0.9 * fade})`;
          context!.strokeRect(cx - 4.5, cy - 4.5, 9, 9);
          if (finePointer.matches) {
            context!.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
            context!.fillStyle = `rgba(160,186,148,${0.75 * fade})`;
            const label = `[${String(col).padStart(2, "0")}, ${String(row).padStart(2, "0")}]`;
            context!.fillText(label, cx + 10, cy - 8);
          }
        }
      }

      // BFS wavefronts: cells at Manhattan distance == step from the origin.
      pulses = pulses.filter((pulse) => (now - pulse.start) / PULSE_STEP_MS < PULSE_STEPS + PULSE_TRAIL + 1);
      for (const pulse of pulses) {
        keepGoing = true;
        const step = (now - pulse.start) / PULSE_STEP_MS;
        const cx = nodeX(pulse.col);
        const cy = nodeX(pulse.row);
        for (let ring = Math.max(0, Math.floor(step) - PULSE_TRAIL); ring <= Math.floor(step); ring++) {
          const trail = 1 - (step - ring) / (PULSE_TRAIL + 1);
          const life = 1 - ring / PULSE_STEPS;
          const alpha = Math.max(0, trail * life);
          if (alpha <= 0) continue;
          // Wavefront outline: the set of nodes at this BFS depth forms a diamond.
          const reach = ring * SPACING;
          if (reach > 0) {
            context!.strokeStyle = `rgba(131,210,124,${0.45 * alpha})`;
            context!.lineWidth = 1;
            context!.beginPath();
            context!.moveTo(cx, cy - reach);
            context!.lineTo(cx + reach, cy);
            context!.lineTo(cx, cy + reach);
            context!.lineTo(cx - reach, cy);
            context!.closePath();
            context!.stroke();
          }
          context!.fillStyle = `rgba(206,242,184,${alpha})`;
          for (let dc = -ring; dc <= ring; dc++) {
            const dr = ring - Math.abs(dc);
            for (const sign of dr === 0 ? [1] : [1, -1]) {
              const x = nodeX(pulse.col + dc);
              const y = nodeX(pulse.row + dr * sign);
              if (x < -SPACING || y < -SPACING || x > width + SPACING || y > height + SPACING) continue;
              const size = 2.4 + 2.2 * alpha;
              context!.fillRect(x - size / 2, y - size / 2, size, size);
            }
          }
        }
      }

      if (keepGoing) schedule();
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      // Over cards, links, and other UI the probe switches off; it only follows empty background.
      pointer = isBackground(event.target) ? { x: event.clientX, y: event.clientY, at: performance.now() } : null;
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || paused()) return;
      // Clicking a card, link, or control does only that; pulses start from empty background.
      if (!isBackground(event.target)) return;
      pulses.push({
        col: Math.round((event.clientX - SPACING / 2) / SPACING),
        row: Math.round((event.clientY - SPACING / 2) / SPACING),
        start: performance.now(),
      });
      if (pulses.length > 4) pulses.shift();
      if (event.pointerType === "touch") pointer = { x: event.clientX, y: event.clientY, at: performance.now() };
      schedule();
    };
    // Content scrolls under a fixed grid; redraw the probe once so it stays under the cursor.
    const onScroll = () => {
      if (pointer && finePointer.matches) schedule();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return <canvas ref={canvas} className="circuit-field" aria-hidden="true" />;
}

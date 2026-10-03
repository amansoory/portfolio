"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive circuit grid behind the whole site.
 * - The static dot grid is a CSS background; this canvas only draws highlights.
 * - (Hover glow removed by request; only click pulses remain.)
 * - Previously: hover lights nearby nodes and routes traces along the cursor's row and column. It runs over empty
 *   background and the empty parts of cards (seen through their translucent surfaces), and fades out
 *   over text, links, and controls, where the text lens takes over.
 * - Clicking or tapping background and regular text sends a wavefront (Manhattan rings).
 *   Links, project cards, and controls never start a pulse.
 * Frames are drawn only while the pointer moves, a fade is in progress, or a pulse is running.
 * Disabled for reduced motion, and while the page's "Pause motion" toggle is active.
 */

const SPACING = 26;
const RADIUS = 150;
const PULSE_STEP_MS = 30;
const PULSE_STEPS = 17;
const PULSE_TRAIL = 4;
const FADE_MS = 200;
const TOUCH_GLOW_MS = 700;

type Pulse = { col: number; row: number; start: number };

/** Things being read or used. The glow fades out over these. */
const SURFACES = [
  "a:not(.project-card-link), button, input, textarea, select, label, summary, img, video, iframe, canvas, svg, [role='dialog'], [role='button']",
  "h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, pre, code, table, figure, time, kbd, [data-slot='badge']",
  "header, footer, nav, .status-bar, .scroll-telemetry, .hero-experience, .case-art",
].join(", ");

/** Clicks and taps can pulse over text, except navigable cards and controls. */
const PULSE_EXCLUDED = ".project-row, a, button, input, textarea, select, label, summary, [role='button'], [role='link'], [role='dialog'], [role='option'], [contenteditable='true']";

/** Full-card links are invisible overlays: look beneath them for what is actually under the cursor. */
function surfaceUnder(target: EventTarget | null, x: number, y: number) {
  if (!(target instanceof Element)) return false;
  if (!target.matches(".project-card-link")) return !!target.closest(SURFACES);
  return document.elementsFromPoint(x, y).some((element) => !element.matches(".project-card-link") && element.closest(SURFACES));
}

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
    let lastFrame = 0;
    let pointer: { x: number; y: number; at: number } | null = null;
    // Probe visibility eases toward its target so entering or leaving UI never cuts off abruptly.
    let visibility = 0;
    let targetVisibility = 0;
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
    const node = (index: number) => SPACING / 2 + index * SPACING;

    function drawProbe(x: number, y: number, fade: number) {
      const col = Math.round((x - SPACING / 2) / SPACING);
      const row = Math.round((y - SPACING / 2) / SPACING);
      const cx = node(col);
      const cy = node(row);
      const span = Math.ceil(RADIUS / SPACING);
      const halo = context!.createRadialGradient(x, y, 0, x, y, RADIUS);
      halo.addColorStop(0, `rgba(131,210,124,${0.1 * fade})`);
      halo.addColorStop(1, "rgba(131,210,124,0)");
      context!.fillStyle = halo;
      context!.fillRect(x - RADIUS, y - RADIUS, RADIUS * 2, RADIUS * 2);
      for (const [x1, y1, x2, y2] of [
        [cx - RADIUS, cy, cx + RADIUS, cy],
        [cx, cy - RADIUS, cx, cy + RADIUS],
      ]) {
        const gradient = context!.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "rgba(131,210,124,0)");
        gradient.addColorStop(0.5, `rgba(131,210,124,${0.42 * fade})`);
        gradient.addColorStop(1, "rgba(131,210,124,0)");
        context!.strokeStyle = gradient;
        context!.lineWidth = 1;
        context!.beginPath();
        context!.moveTo(x1, y1);
        context!.lineTo(x2, y2);
        context!.stroke();
      }
      for (let dr = -span; dr <= span; dr++) {
        for (let dc = -span; dc <= span; dc++) {
          const nx = node(col + dc);
          const ny = node(row + dr);
          const distance = Math.hypot(nx - x, ny - y);
          if (distance > RADIUS) continue;
          const strength = (1 - distance / RADIUS) ** 1.4 * fade;
          context!.fillStyle = `rgba(196,236,174,${Math.min(0.9, 0.12 + 0.85 * strength)})`;
          const size = 1.6 + 2.8 * strength;
          context!.fillRect(nx - size / 2, ny - size / 2, size, size);
        }
      }
      context!.strokeStyle = `rgba(182,220,161,${0.9 * fade})`;
      context!.strokeRect(cx - 4.5, cy - 4.5, 9, 9);
      if (finePointer.matches) {
        context!.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        context!.fillStyle = `rgba(160,186,148,${0.75 * fade})`;
        context!.fillText(`[${String(col).padStart(2, "0")}, ${String(row).padStart(2, "0")}]`, cx + 10, cy - 8);
      }
    }

    function drawPulses(now: number) {
      pulses = pulses.filter((pulse) => (now - pulse.start) / PULSE_STEP_MS < PULSE_STEPS + PULSE_TRAIL + 1);
      for (const pulse of pulses) {
        const step = (now - pulse.start) / PULSE_STEP_MS;
        const cx = node(pulse.col);
        const cy = node(pulse.row);
        for (let ring = Math.max(0, Math.floor(step) - PULSE_TRAIL); ring <= Math.floor(step); ring++) {
          const trail = 1 - (step - ring) / (PULSE_TRAIL + 1);
          const life = 1 - ring / PULSE_STEPS;
          const alpha = Math.max(0, trail * life);
          if (alpha <= 0) continue;
          // The nodes at one BFS depth form a diamond; outline it, then light its nodes.
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
              const x = node(pulse.col + dc);
              const y = node(pulse.row + dr * sign);
              if (x < -SPACING || y < -SPACING || x > width + SPACING || y > height + SPACING) continue;
              const size = 2.4 + 2.2 * alpha;
              context!.fillRect(x - size / 2, y - size / 2, size, size);
            }
          }
        }
      }
    }

    function draw(now: number) {
      frame = 0;
      const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 16;
      lastFrame = now;
      context!.clearRect(0, 0, width, height);
      if (paused()) {
        pointer = null;
        pulses = [];
        visibility = 0;
        lastFrame = 0;
        return;
      }
      let keepGoing = false;
      const step = elapsed / FADE_MS;
      visibility = targetVisibility > visibility ? Math.min(targetVisibility, visibility + step) : Math.max(targetVisibility, visibility - step);
      if (visibility !== targetVisibility) keepGoing = true;
      if (pointer && visibility > 0) {
        let fade = visibility;
        if (!finePointer.matches) {
          // Touch: a brief glow where the finger landed.
          fade *= Math.max(0, 1 - (now - pointer.at) / TOUCH_GLOW_MS);
          if (fade > 0) keepGoing = true;
        }
        if (fade > 0) drawProbe(pointer.x, pointer.y, fade);
      }
      drawPulses(now);
      if (pulses.length) keepGoing = true;
      if (keepGoing) schedule();
      else lastFrame = 0;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    const onLeave = () => {
      targetVisibility = 0;
      schedule();
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || paused()) return;
      // Keep navigation and controls free of pulses on both desktop and mobile.
      const target = event.target;
      if (target instanceof Element && target.closest(PULSE_EXCLUDED)) return;
      pulses.push({
        col: Math.round((event.clientX - SPACING / 2) / SPACING),
        row: Math.round((event.clientY - SPACING / 2) / SPACING),
        start: performance.now(),
      });
      if (pulses.length > 4) pulses.shift();
      schedule();
    };
    // Content scrolls under the fixed grid; re-check what is under a still cursor.
    const onScroll = () => {
      if (!pointer || !finePointer.matches) return;
      const under = document.elementFromPoint(pointer.x, pointer.y);
      targetVisibility = surfaceUnder(under, pointer.x, pointer.y) ? 0 : 1;
      schedule();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return <canvas ref={canvas} className="circuit-field" aria-hidden="true" />;
}

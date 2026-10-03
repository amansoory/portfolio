"use client";

import { useEffect } from "react";

/**
 * Hover lens for text: letters within a small radius of the cursor grow and lift with a smooth
 * falloff, like a magnifier passing over the page.
 * - Only the block under the cursor is split into letter spans, on demand; leaving it restores the
 *   original text nodes (the same node objects, so React's references stay valid).
 * - Transforms only: surrounding text never reflows.
 * - Fine pointers only; off for reduced motion and while the page's "Pause motion" is active.
 */

const RADIUS = 56;
const MAX_SCALE = 0.22;
const LIFT = 1.5;
const MAX_CHARS = 1400;
const RESTORE_DELAY = 220;

const EXCLUDED = "input, textarea, select, code, pre, svg, canvas, script, style, .status-bar, [role='dialog'], .command-palette, [data-lens='off']";

type Split = {
  element: HTMLElement;
  pieces: { original: Text; replacements: Node[] }[];
  chars: { span: HTMLSpanElement; x: number; y: number; active: boolean }[];
};

export function TextLens() {
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let current: Split | null = null;
    const leaving = new Map<HTMLElement, { split: Split; timer: number }>();
    let frame = 0;
    let pointer = { x: 0, y: 0 };

    const enabled = () =>
      fine.matches && !reduced.matches && document.querySelector<HTMLElement>(".scroll-journey")?.dataset.motion !== "static";

    const hasOwnText = (element: Element) =>
      Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim());

    /** Any text under the cursor: the element holding it, widened to its enclosing block. */
    function blockFor(target: EventTarget | null, x: number, y: number) {
      if (!(target instanceof HTMLElement) || target.closest(EXCLUDED)) return null;
      let textElement: HTMLElement | null = target;
      // Pointer events target the element that directly contains the hovered text. Invisible overlays
      // (like the full-card links on project cards) sit on top, so look beneath them for the text.
      if (!hasOwnText(target) && !target.closest("lens-word")) {
        textElement =
          document
            .elementsFromPoint(x, y)
            .find((element): element is HTMLElement => element instanceof HTMLElement && (hasOwnText(element) || !!element.closest("lens-word"))) ?? null;
        if (!textElement || textElement.closest(EXCLUDED)) return null;
      }
      let block: HTMLElement = textElement.closest<HTMLElement>("[data-lens-active]") ?? textElement;
      // Widen inline elements (links, emphasis, spans) to their paragraph or block container.
      while (block.parentElement && block.parentElement !== document.body && getComputedStyle(block).display.startsWith("inline")) {
        block = block.parentElement;
      }
      if (block.closest(EXCLUDED)) return null;
      const length = block.textContent?.length ?? 0;
      return length > 0 && length <= MAX_CHARS ? block : null;
    }

    function split(element: HTMLElement): Split {
      const pieces: Split["pieces"] = [];
      const chars: Split["chars"] = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.nodeValue?.trim() && !node.parentElement?.closest(EXCLUDED) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
      });
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      for (const original of textNodes) {
        // Keep each text run as one layout item. In flex/grid links, separate
        // word elements would each receive the gap intended for the link icon.
        const text = document.createElement("lens-text");
        const source = document.createElement("lens-source");
        source.className = "sr-only";
        source.textContent = original.nodeValue;
        const letters = document.createElement("lens-letters");
        letters.setAttribute("aria-hidden", "true");
        text.append(source, letters);
        const replacements: Node[] = [text];
        const range = document.createRange();
        let offset = 0;
        for (const part of (original.nodeValue ?? "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            letters.appendChild(document.createTextNode(part));
            offset += part.length;
            continue;
          }
          // Words stay unbreakable so line wrapping matches the original text.
          // Custom elements, so site CSS that targets <span> (e.g. colored heading lines) never applies.
          const word = document.createElement("lens-word");
          range.setStart(original, offset);
          let width = 0;
          for (const letter of Array.from(part)) {
            const span = document.createElement("lens-char") as HTMLSpanElement;
            span.textContent = letter;
            // Preserve the original font's kerning/spacing when letters become
            // inline blocks, so hovering never widens the link or shifts its icon.
            offset += letter.length;
            range.setEnd(original, offset);
            const nextWidth = range.getBoundingClientRect().width;
            span.style.width = `${nextWidth - width}px`;
            width = nextWidth;
            word.appendChild(span);
            chars.push({ span, x: 0, y: 0, active: false });
          }
          letters.appendChild(word);
        }
        const parent = original.parentNode;
        if (!parent) continue;
        for (const node of replacements) parent.insertBefore(node, original);
        parent.removeChild(original);
        pieces.push({ original, replacements });
      }
      element.dataset.lensActive = "true";
      measure(chars);
      return { element, pieces, chars };
    }

    // Letter centers in page coordinates, so scrolling doesn't require re-measuring.
    function measure(chars: Split["chars"]) {
      for (const char of chars) {
        const rect = char.span.getBoundingClientRect();
        char.x = rect.left + rect.width / 2 + scrollX;
        char.y = rect.top + rect.height / 2 + scrollY;
      }
    }

    function relax(target: Split) {
      for (const char of target.chars) {
        if (!char.active) continue;
        char.span.style.transform = "";
        char.active = false;
      }
    }

    function restore(target: Split) {
      for (const { original, replacements } of target.pieces) {
        const first = replacements[0];
        const parent = first?.parentNode;
        if (parent && first.isConnected) parent.insertBefore(original, first);
        for (const node of replacements) node.parentNode?.removeChild(node);
      }
      delete target.element.dataset.lensActive;
    }

    function release(target: Split) {
      relax(target);
      const timer = window.setTimeout(() => {
        leaving.delete(target.element);
        restore(target);
      }, RESTORE_DELAY);
      leaving.set(target.element, { split: target, timer });
    }

    function render() {
      frame = 0;
      if (!current) return;
      const px = pointer.x + scrollX;
      const py = pointer.y + scrollY;
      for (const char of current.chars) {
        const distance = Math.hypot(char.x - px, char.y - py);
        if (distance >= RADIUS) {
          if (char.active) {
            char.span.style.transform = "";
            char.active = false;
          }
          continue;
        }
        const strength = (1 - distance / RADIUS) ** 2;
        char.span.style.transform = `translateY(${(-LIFT * strength).toFixed(2)}px) scale(${(1 + MAX_SCALE * strength).toFixed(3)})`;
        char.active = true;
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      const block = enabled() ? blockFor(event.target, event.clientX, event.clientY) : null;
      if (block !== current?.element) {
        if (current) release(current);
        current = null;
        if (block) {
          const pending = leaving.get(block);
          if (pending) {
            // Re-entered before the restore ran: reuse the existing split.
            window.clearTimeout(pending.timer);
            leaving.delete(block);
            current = pending.split;
            measure(current.chars);
          } else {
            current = split(block);
          }
        }
      }
      if (current && !frame) frame = requestAnimationFrame(render);
    };

    const reset = () => {
      if (current) {
        relax(current);
        restore(current);
        current = null;
      }
      for (const { split: pending, timer } of leaving.values()) {
        window.clearTimeout(timer);
        restore(pending);
      }
      leaving.clear();
    };
    const onLeave = () => {
      if (current) release(current);
      current = null;
    };
    const onResize = () => current && measure(current.chars);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pagehide", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pagehide", reset);
      reset();
    };
  }, []);

  return null;
}

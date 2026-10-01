"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUp, Copy, CornerDownLeft, FileDown, Folder, GitFork, Hash, ContactRound, Pause } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { copy } from "@/lib/copy";
import { profile, projects } from "@/lib/portfolio";

type Command = {
  id: string;
  group: "navigate" | "projects" | "actions";
  label: string;
  hint: string;
  keywords: string;
  icon: typeof Hash;
  run: () => void | Promise<void>;
};

const sections = [
  ["top", "Introduction", "hero.tsx"],
  ["work", "Work", "work/index.tsx"],
  ["experience", "Experience", "experience.ts"],
  ["skills", "Skills", "toolkit.ts"],
  ["about", "About", "about.md"],
  ["contact", "Contact", "contact.sh"],
] as const;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Ctrl/⌘+K command palette: jump to sections and projects, or open contact links. */
export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      if (pathname !== "/") return router.push(id === "top" ? "/" : `/#${id}`);
      const target = id === "top" ? null : document.getElementById(id);
      const behavior: ScrollBehavior = reducedMotion() ? "instant" : "smooth";
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
      history.replaceState(history.state, "", id === "top" ? "/" : `#${id}`);
      // Finish entrance animations for the destination, as anchor clicks do.
      window.dispatchEvent(new CustomEvent("journey:jump", { detail: `#${id}` }));
    },
    [pathname, router],
  );

  const commands = useMemo<Command[]>(() => {
    const items: Command[] = sections.map(([id, label, file]) => ({
      id: `section-${id}`,
      group: "navigate",
      label,
      hint: file,
      keywords: `${id} ${label} ${file} section`,
      icon: Hash,
      run: () => goToSection(id),
    }));
    for (const project of projects.filter((item) => !item.placeholder)) {
      items.push({
        id: `project-${project.slug}`,
        group: "projects",
        label: project.name,
        hint: `/${project.number}`,
        keywords: `${project.name} ${project.category} ${project.tags.join(" ")}`,
        icon: Folder,
        run: () => router.push(`/projects/${project.slug}`),
      });
    }
    items.push(
      {
        id: "copy-email",
        group: "actions",
        label: copy.palette.copyEmail,
        hint: profile.email,
        keywords: "email contact mail copy",
        icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setNotice(copy.palette.copied);
          } catch {
            window.location.assign(`mailto:${profile.email}`);
          }
        },
      },
      ...(profile.resume
        ? [{ id: "resume", group: "actions" as const, label: copy.palette.resume, hint: "PDF", keywords: "resume cv pdf", icon: FileDown, run: () => void window.open(profile.resume!, "_blank", "noopener") }]
        : []),
      { id: "github", group: "actions", label: copy.palette.github, hint: "github.com", keywords: "github code repos", icon: GitFork, run: () => void window.open(profile.github, "_blank", "noopener") },
      { id: "linkedin", group: "actions", label: copy.palette.linkedin, hint: "linkedin.com", keywords: "linkedin contact", icon: ContactRound, run: () => void window.open(profile.linkedin, "_blank", "noopener") },
      ...(pathname === "/" && !reducedMotion()
        ? [{ id: "motion", group: "actions" as const, label: copy.motion.pauseAll + " / resume", hint: "motion", keywords: "pause resume animation motion", icon: Pause, run: () => void window.dispatchEvent(new Event("journey:toggle-motion")) }]
        : []),
      { id: "top", group: "actions", label: copy.palette.top, hint: "Home", keywords: "top home start", icon: ArrowUp, run: () => goToSection("top") },
    );
    return items;
  }, [goToSection, pathname, router]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return commands;
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.hint} ${command.keywords}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const execute = async (command: Command | undefined) => {
    if (!command) return;
    await command.run();
    if (command.id === "copy-email") {
      window.setTimeout(() => setOpen(false), 900);
    } else {
      setOpen(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((activeIndex + 1) % Math.max(1, results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((activeIndex - 1 + results.length) % Math.max(1, results.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      void execute(results[activeIndex]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery("");
          setActive(0);
          setNotice("");
        }
      }}
    >
      <DialogContent className="command-palette" showCloseButton={false}>
        <DialogTitle className="sr-only">{copy.palette.title}</DialogTitle>
        <DialogDescription className="sr-only">{copy.palette.description}</DialogDescription>
        <div className="palette-input">
          <span className="palette-prompt" aria-hidden="true">
            ❯
          </span>
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={copy.palette.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].id}` : undefined}
            aria-label={copy.palette.title}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="palette-kbd">esc</kbd>
        </div>
        <ul ref={list} id="palette-results" role="listbox" className="palette-results" aria-label={copy.palette.title}>
          {results.length === 0 && <li className="palette-empty">{copy.palette.empty}</li>}
          {results.map((command, index) => {
            const heading = index === 0 || results[index - 1].group !== command.group ? copy.palette.groups[command.group] : "";
            const Icon = command.icon;
            return (
              <li key={command.id} role="presentation">
                {heading && (
                  <div className="palette-group" role="presentation">
                    {heading}
                  </div>
                )}
                <div
                  id={`palette-${command.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  data-index={index}
                  className="palette-item"
                  onMouseMove={() => index !== activeIndex && setActive(index)}
                  onClick={() => void execute(command)}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span className="palette-label">{command.label}</span>
                  <span className="palette-hint">{command.hint}</span>
                  {index === activeIndex && <CornerDownLeft size={12} className="palette-enter" aria-hidden="true" />}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="palette-footer">
          <span aria-live="polite">{notice}</span>
          <span aria-hidden="true">
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate <kbd>↵</kbd> open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { copy } from "@/lib/copy";

import Link from "next/link";
import { ArrowUpRight, ContactRound, FileDown, GitFork, Menu, Terminal } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio";
import { ResourceLink } from "@/components/portfolio-ui";

const links = [
  [copy.nav.work, "/#work"],
  [copy.nav.experience, "/#experience"],
  [copy.nav.about, "/#about"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label={copy.nav.home}>
          <Terminal size={20} strokeWidth={1.6} />
          <span>
            {profile.initials}
            <span className="accent">.</span>DEV
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href], i) => (
            <Link key={label} href={href}>
              <span>0{i + 1}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-status" aria-label="Availability and contact links">
          <span className="header-status-label">
            <span className="status-dot" /> OPEN TO WORK
          </span>
          <div className="header-status-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
              <GitFork size={14} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
              <ContactRound size={14} /> LinkedIn
            </a>
            {profile.resume && (
              <ResourceLink href={profile.resume} className="header-resume" icon={false}>
                <FileDown size={14} /> Resume
              </ResourceLink>
            )}
          </div>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu"
                aria-label={copy.nav.open}
              />
            }
          >
            <Menu size={21} />
          </SheetTrigger>
          <SheetContent className="mobile-sheet">
            <SheetTitle className="font-mono">
              {profile.initials}.DEV / {copy.nav.title}
            </SheetTitle>
            <SheetDescription>{copy.nav.description}</SheetDescription>
            <nav aria-label="Mobile navigation" className="mobile-links">
              {[
                ...links,
                [copy.nav.skills, "/#skills"],
                [copy.nav.contact, "/#contact"],
              ].map(([label, href], i) => (
                <SheetClose key={label} render={<Link href={href} />}>
                  <span>0{i + 1}</span>
                  {label}
                  <ArrowUpRight size={20} />
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, Terminal } from "lucide-react";
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

const links = [
  ["Work", "/#work"],
  ["Experience", "/#experience"],
  ["About", "/#about"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="Portfolio home">
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
        <Link href="/#contact" className="header-contact">
          Let’s talk <ArrowUpRight size={15} />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu"
                aria-label="Open navigation"
              />
            }
          >
            <Menu size={21} />
          </SheetTrigger>
          <SheetContent className="mobile-sheet">
            <SheetTitle className="font-mono">SE.DEV / navigation</SheetTitle>
            <SheetDescription>Explore the portfolio.</SheetDescription>
            <nav aria-label="Mobile navigation" className="mobile-links">
              {[...links, ["Skills", "/#skills"], ["Contact", "/#contact"]].map(
                ([label, href], i) => (
                  <SheetClose key={label} render={<Link href={href} />}>
                    <span>0{i + 1}</span>
                    {label}
                    <ArrowUpRight size={20} />
                  </SheetClose>
                ),
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

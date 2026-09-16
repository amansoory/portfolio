import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  GitFork,
  ContactRound,
  Mail,
  FileDown,
  ArrowUp,
} from "lucide-react";
import { profile } from "@/lib/portfolio";
import { Reveal } from "@/components/reveal";

export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label" data-enter>
      <span>{number}</span>
      <span className="label-line" />
      {children}
    </div>
  );
}

export function ResourceLink({
  href,
  children,
  className = "",
  icon = true,
}: {
  href: string | null;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) {
  if (!href)
    return (
      <span
        className={`resource-link unavailable ${className}`}
        aria-disabled="true"
      >
        {children}
        <span className="pending-label">Not added</span>
      </span>
    );
  const external = /^https?:\/\//.test(href);
  return (
    <a
      className={`resource-link ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {icon && <ArrowUpRight size={16} aria-hidden="true" />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function Contact() {
  return (
    <section
      className="contact-section section-shell"
      id="contact"
      aria-labelledby="contact-title"
      data-flow
    >
      <Reveal>
        <SectionLabel number="05">THE NEXT CHAPTER</SectionLabel>
        <div className="contact-main">
          <div>
            <p className="eyebrow" data-enter>
              HAVE SOMETHING IN MIND?
            </p>
            <h2 id="contact-title" data-enter>
              Let’s build
              <br />
              something <span>good.</span>
              <span className="terminal-cursor" aria-hidden="true">
                _
              </span>
            </h2>
          </div>
          <div className="contact-side" data-enter>
            <p>Good work starts with a conversation.</p>
            <ResourceLink
              href={profile.email ? `mailto:${profile.email}` : null}
              className="contact-email"
            >
              <Mail size={18} />
              {profile.email ?? "[Your email]"}
            </ResourceLink>
            <span className="contact-location">{profile.location}</span>
          </div>
        </div>
        <div className="contact-links" data-enter>
          <ResourceLink href={profile.github}>
            <GitFork size={16} />
            GitHub
          </ResourceLink>
          <ResourceLink href={profile.linkedin}>
            <ContactRound size={16} />
            LinkedIn
          </ResourceLink>
          <ResourceLink href={profile.resume}>
            <FileDown size={16} />
            Resume
          </ResourceLink>
        </div>
      </Reveal>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer section-shell">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span className="footer-note">
        <span className="status-dot" />
        BUILT WITH INTENTION
      </span>
      <Link href="#top">
        Back to top <ArrowUp size={14} />
      </Link>
    </footer>
  );
}

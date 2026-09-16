# Source → System

A portfolio built around an interactive, scroll-responsive computing system. Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui Nova, React Three Fiber, Drei, Three.js, Motion, and Lucide.

## Run locally

Use Node.js 22.13+ (or Node.js 24 LTS). The existing Node 20.17 installation can build the site, but is below some installed development tools' supported versions.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Add your content

Edit `src/lib/portfolio.ts`. It contains Arman’s profile, contact URLs, projects, experience, skills, coursework, and schematic visual labels. Missing project URLs and dates remain null; no results or qualifications have been invented.

- Set `email`, `github`, `linkedin`, and `resume` to real values. Missing URLs render as non-clickable “Not added” labels.
- Add the supplied resume file at `public/Arman_Hassan_Resume.pdf`; its URL is already configured.
- Replace each project's text, tags, slug, dates, role, and URLs. Set `placeholder: false` when that case study is complete.
- Project illustrations communicate scanning, recovery, targeting, and pathfinding. They are explicitly schematic, not measured results or live output.
- Replace the introductory copy in `src/app/page.tsx` if desired.

## Publish

1. Add real content and validate external URLs and the resume.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, without a trailing slash (see `.env.example`).
3. Set `profile.draft` to `false`. Draft mode intentionally emits `noindex`, blocks crawling, and leaves the sitemap empty.
4. Run the checks below, then deploy to a Next.js-compatible Node host or Vercel. `npm run start` serves the production build.

Canonical URLs, Open Graph and Twitter metadata, a generated sharing image, robots.txt, a sitemap, and statically generated case studies are included. No analytics, forms, or third-party tracking are configured. Contact uses a direct email link once supplied.

## Verify

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

If Chrome is already installed, set `PLAYWRIGHT_CHANNEL=chrome` instead of downloading Chromium. In PowerShell: `$env:PLAYWRIGHT_CHANNEL='chrome'`.

Tests run against a production server on port 3100. They cover desktop WebGL and pause controls, mobile navigation and narrow viewports, reduced motion, missing WebGL, static content without JavaScript, case-study routes, and metadata. Screenshots and failure traces are written to ignored `test-results/`.

## Visual architecture

- Server-rendered page content stays available before 3D loads and without JavaScript.
- One dynamically imported canvas is mounted only for desktop visitors who have not requested reduced motion or data saving. Mobile uses an inline vector illustration; it does not download the scene module.
- A shared scroll controller drives the telemetry, processor, circuit trace, and section diagrams. Backward scrolling restores the same scene state. There are no looping packets or idle animations.
- The canvas renders on demand when its scroll input changes and stops offscreen, in a hidden tab, or when paused. Pixel density is capped at 1.5; processor pins are instanced. No external textures, postprocessing, or shadow maps are used.
- Scroll separates processor layers, rotates the assembly, adjusts the camera and lighting, and routes a conceptual request. A short sticky transition adds approximately 60% of a viewport between hero and projects on screens at least 1024px wide and 900px tall. Shorter screens keep normal document flow.
- A quiet circuit trace continues into the existing project windows, experience timeline, skills groups, and contact section. Project diagrams respond to local scroll progress. Entrances happen once, with a small stagger; masks and blur are limited to desktop illustrations.
- A scene error boundary and context-loss handling preserve the fallback illustration.
- Motion reveals enhance already-visible content. Anchor jumps and keyboard focus finish relevant entrances immediately. The global pause control stops the story; location telemetry continues to report actual reading progress.
- Phones use a gently separating vector processor and a simple trace, with no pinning or WebGL download. Reduced-motion users receive static compositions, no pinning, no blur, and normal anchor navigation; changing the OS preference during a visit is supported.
- The mobile menu uses the existing Nova Sheet primitive for focus management and Escape-to-close behavior.

The visual trace and project diagrams are illustrative, not live telemetry. Performance still depends on the visitor's GPU; measure on target hardware before making frame-rate claims.

The browser suite also checks exact reverse-scroll progression, sticky release, anchor and keyboard navigation, live reduced-motion changes, narrow-screen overflow, and actual WebGL draw-call counts while idle, paused, and offscreen.

type Profile = {
  name: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  degree: string;
  introduction: string;
  about: string;
  heroLines: [string, string];
  email: string;
  github: string;
  linkedin: string;
  resume: string | null;
  draft: boolean;
};

export const profile: Profile = {
  name: "Arman Hassan",
  initials: "AH",
  role: "CS student / engineer",
  location: "UNC Chapel Hill",
  availability: "Graduating May 2027",
  degree: "BS in Computer Science · Minor in Data Science",
  heroLines: [
    "Computer science at UNC Chapel Hill.",
    "Working on AI agents, backend systems, and interactive software.",
  ],
  introduction:
    "I’m a CS student at UNC Chapel Hill with a minor in Data Science, graduating in May 2027. Lately, a lot of what I work on comes back to AI. I like trying open source models and tools I find through Reddit or X, running them locally, and experimenting with them or turning them into small projects when something catches my attention. I like making things that make life easier for me and for others, or just genuinely interest me. I also enjoy working with other people, sharing ideas, and figuring things out together. Lately, I’ve been curious about distilling models and seeing how capable I can make smaller models run locally.",
  about:
    "But right now, I'm more focused on learning Go and Elixir because I want to better understand concurrency and fault tolerance, and how those are used to build a backend infrastructure that scales properly.",
  email: "armanmansoorhassan@gmail.com",
  github: "https://github.com/amansoory",
  linkedin: "https://linkedin.com/in/arman-hassan1",
  resume: "/Arman_Hassan_Resume.pdf",
  // Draft mode emits noindex, blocks crawling, and empties the sitemap.
  draft: false,
};

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  label: string;
  description: string;
  accent: "mint" | "blue" | "amber" | "sage";
  visual: "scan" | "chart" | "arcade" | "grid" | "planner" | "racing";
  visualLabels: string[];
  tags: string[];
  /** Short, verifiable results shown as badges on project cards and case studies. */
  metrics?: string[];
  year: string | null;
  role: string;
  duration: string | null;
  problem: string;
  approach: string;
  outcome: string;
  lessons: string;
  github: string | null;
  live: string | null;
  accessNote?: string;
  liveLabel?: string;
  details?: { title: string; text: string }[];
  sources?: { label: string; href: string }[];
  demoPreview?: string;
  featured?: boolean;
  placeholder: boolean;
  preview?: {
    src: string;
    alt: string;
    // Source-pixel crops preserve the original screenshot and its aspect ratio.
    crop?: { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
  };
};

export const projects: Project[] = [
  {
    slug: "jev-2048",
    number: "01",
    name: "Jev 2048",
    category: "Decision systems / interactive experiment",
    label: "JEV 2048",
    accent: "amber",
    visual: "grid",
    visualLabels: [],
    description: "Can a general-purpose AI classifier play 2048? Compare TypeSafe’s Jev model with a search algorithm and a pretrained reinforcement-learning bot, then inspect the information behind every move.",
    tags: ["TypeSafe Jev", "Next.js", "React", "TypeScript", "Expectimax", "TD learning", "C++", "Oracle Cloud", "Vercel"],
    // Figures as stated on the resume.
    metrics: ["Pilot mean score 796 → 34,276", "67.1M-weight C++ model", "77,928 API requests for $5.45"],
    year: "2026",
    role: "Game engine, experiment design, native integration, and deployment",
    duration: null,
    problem: "I started because I was curious how Jev would play 2048. Instead of asking it to classify arbitrary examples, I wanted a task with clear rules, measurable outcomes, and consequences that build up over hundreds of decisions. Could a fast general-purpose classifier compete with an algorithm built specifically for the game? And could that specialist help it make better choices?",
    approach: "The first version asked Jev to choose a direction. I moved that simulation into code: the engine calculates every legal resulting board, shuffles anonymous candidate labels, and asks Jev to choose an outcome. All current Jev variants use the same model without project-specific fine-tuning. They differ in what they receive: boards alone, calculated features, expectimax search summaries, pretrained n-tuple values, or both experts. Directions and expert recommendations stay hidden; Jev owns the final choice.",
    outcome: "The live app supports human play and side-by-side bot comparisons, including two simultaneous Jev boards. Each board keeps playing independently until game over. Inspect shows candidate boards, choice probabilities, supplied features, specialist agreement, token usage, and timing. Seeded restarts and saved decision traces make the comparisons repeatable. Choice probabilities describe Jev’s preferences, not the chance of winning.",
    lessons: "More expert information did not automatically mean better decisions. An earlier two-seed pilot improved from a mean score of 796 with raw Jev to 10,770 with calculated features and 34,276 with expectimax assistance, but the assisted version agreed with expectimax on 3,554 of 3,559 audited moves. That is evidence of strong influence, not independent planning. Later blinded arbitration did not demonstrate a benefit over always choosing one expert. The current anonymous-input variants have not completed a frozen multi-seed benchmark.",
    details: [
      { title: "The learned specialist: 67.1 million pattern weights", text: "N-tuple uses Hung Guei’s pretrained TDL2048+ 4×6 checkpoint: four tables of 16,777,216 float32 values, or 67,108,864 learned weights in total. These are temporal-difference-learned board-pattern values, not language-model parameters or weights I trained. The unchanged native selector greedily scores immediate reward plus the resulting board’s value. Jev can receive normalized values for all candidates alongside search measurements; the current combined version does not blend them into a fixed weighted recommendation." },
      { title: "What the specialist comparison showed", text: "Across five matched development seeds, n-tuple won all five comparisons: mean score 222,849.6 versus 45,553.6 for this app’s bounded JavaScript expectimax implementation. One n-tuple run reached 32,768. Both bots consumed the same tile-value and shuffled cell-priority sequences; actual spawn cells could differ after their boards diverged. Five seeds are descriptive evidence, not proof of general superiority, and these results do not represent every expectimax implementation." },
      { title: "From browser to native inference", text: "Next.js and React run on Vercel. Server-side routes call the TypeSafe SDK or an authenticated HTTPS n-tuple service on an Oracle Cloud ARM64 Ubuntu VM. A Python HTTP wrapper talks over stdin/stdout to one persistent C++ worker, loading the verified checkpoint once. Nginx terminates TLS with a Let’s Encrypt certificate; systemd supervises the loopback-only service. The native 32,768 tile encoding limit is explicit, and unsupported boards fail rather than silently switching bots. Hosted inference time includes network overhead, not just native computation." },
      { title: "Interfaces, tools, and reproducibility", text: "The interface uses Tailwind CSS, shadcn-style components with Radix UI, Lucide icons, Motion, Recharts, and locally bundled DM Sans. Web Workers and Node worker threads keep search and structural calculations off the main event loop. A TypeScript controller owns the game state, legal-move validation, seeded spawning, and stale-response protection. Playwright and focused Node tests cover controls, rules, adapters, and fixed-board native parity. JSON/JSONL traces, CSV summaries, and Python rollout analysis support the research. SHA-256 checks verify the downloaded checkpoint. Docker packaging is prepared; the live Oracle service uses a native Linux build. Upstash Redis and Cloudflare Turnstile integrations are optional, not prerequisites for this demo." },
      { title: "What I took from it", text: "The useful boundary was between calculation and judgment. Code can enumerate valid actions, calculate comparable properties, and enforce the rules. Jev can then choose from those structured options. I also explored fixed-weight combinations, uncertainty gates, and tail-risk interventions, but they did not establish an advantage worth claiming. This project made it possible to see when extra information changed a decision, when Jev followed a specialist, and when explicit search or learned game-specific values were already the stronger tool." }
    ],
    sources: [
      { label: "Methods, results, and limitations", href: "https://jev-2048.vercel.app/research" },
      { label: "Saved result data", href: "https://github.com/amansoory/JEV2048/blob/main/public/research-data.json" },
      { label: "TypeSafe Jev", href: "https://typesafe.ai" },
      { label: "TDL2048+ · Hung Guei · MIT", href: "https://github.com/moporgic/TDL2048" },
      { label: "TDL2048+ license and checkpoint provenance", href: "https://github.com/amansoory/JEV2048/tree/main/deploy/ntuple" },
      { label: "Expectimax adaptation · Robert Xiao and contributors · MIT", href: "https://github.com/amansoory/JEV2048/blob/main/SEARCH-SOLVER.md" },
      { label: "Third-party notices and license links", href: "https://github.com/amansoory/JEV2048/blob/main/THIRD_PARTY_NOTICES.md" }
    ],
    github: "https://github.com/amansoory/JEV2048",
    live: "https://jev-2048.vercel.app",
    demoPreview: "https://jev-2048.vercel.app/play",
    preview: { src: "/projects/jev-2048-preview.png", alt: "Jev 2048 live app with colorful boards, bot selection, seeded gameplay controls, and decision inspection." },
    accessNote: "Open the demo to play or compare bots. Jev uses a live API; service availability and credits can affect play.",
    featured: true,
    placeholder: false,
  },

  {
    slug: "coursecompass-ai",
    number: "02",
    name: "CourseCompass AI",
    category: "RAG chatbot / UNC degree planning",
    label: "RETRIEVE → CITE → EXPLAIN",
    accent: "mint",
    visual: "planner",
    visualLabels: ["UNC CATALOG", "PROGRAM ROUTING", "SOURCES CITED", "REQUIREMENTS"],
    description:
      "A degree-planning assistant for UNC students covering 200+ majors and minors plus general education. It answers from the official catalog with clickable citations and checks uploaded schedules against requirements.",
    tags: ["Next.js", "TypeScript", "AWS Bedrock", "Claude", "Titan embeddings", "S3 Vectors", "Python", "GitHub Actions", "Vercel"],
    metrics: ["Eval pass rate 11% → 100%", "200+ programs and tracks", "80+ offline tests in CI"],
    year: "2026",
    role: "Retrieval pipeline, guardrails, evals, UI, and deployment",
    duration: null,
    problem:
      "I built CourseCompass AI to help UNC students understand what they still need to graduate. They can ask about a major in plain language, or upload a photo of their schedule, and get an answer grounded in the official course catalog.",
    approach:
      "A Python scraper turns catalog pages for 202 majors, minors, and tracks plus the IDEAs in Action general education pages into structured documents, indexed with Titan embeddings in Amazon S3 Vectors through a Bedrock Knowledge Base. Most questions are routed to the right program in code; only unclear ones use a Claude classifier call. The routed program’s requirements are always included, sources are numbered, and every citation is verified on the server before it reaches the student.",
    outcome:
      "Answers lead with the direct answer, cite the exact catalog page, and ask one focused question when the program or degree is ambiguous. Students can add courses by photo, PDF, or pasted text; minimum-grade rules are checked in code, so a C- is never counted toward “C or better.” Rate limits and an AWS Budget action that blocks the app at $10 a month cap spending.",
    lessons:
      "Measuring changed how I built it. An 18-case live eval graded in code against catalog facts scored the first working version at 2 of 18 cases; the rebuilt pipeline passes all 18. The biggest fixes came from moving judgment the model kept getting wrong, like comparing letter grades, into deterministic code, and from sending less but more relevant context: about 58% fewer input tokens per answer.",
    details: [
      { title: "Guardrails", text: "Answers are grounded only in retrieved catalog text, and the bot says so when the catalog doesn’t cover a question. Retrieved text and uploads are treated as data, never instructions. Citation numbers that don’t match a real source are removed, off-topic requests are declined, and grade comparisons are computed rather than generated." },
      { title: "Testing and CI/CD", text: "Offline suites with mocked Bedrock calls cover routing, retrieval assembly, citations, grade checks, uploads, and spending limits. GitHub Actions runs lint, type checks, the tests, and a production build on every push and pull request, and Vercel deploys from GitHub. The live eval runs only on demand because it calls the model." },
    ],
    github: "https://github.com/amansoory/unc-degree-rag",
    live: "https://planuncdegree.site/",
    preview: {
      src: "/projects/coursecompass-homepage.png",
      alt: "CourseCompass AI homepage with its UNC catalog introduction, empty question field, and program exploration options.",
    },
    featured: true,
    placeholder: false,
  },
  {
    "slug": "arman-mb",
    "number": "08",
    "name": "Arman MB",
    "category": "Discord music / backend systems",
    "label": "MUSIC WITH FRIENDS",
    "accent": "blue",
    "visual": "arcade",
    "visualLabels": [],
    "description": "A free Discord music bot built for my friends, with Spotify imports, YouTube search, lyrics, and shared music controls. Runs on Oracle Cloud even when my laptop is off.",
    "tags": [
      "TypeScript",
      "Node.js",
      "discord.js",
      "Lavalink",
      "Spotify Web API",
      "Oracle Cloud"
    ],
    "metrics": [
      "19 slash commands",
      "Independent server queues",
      "Cloud-hosted playback"
    ],
    "year": "2026",
    "role": "Bot development, song matching, Discord UX, testing, and cloud deployment",
    "duration": null,
    "problem": "I knew friends who were willing to pay for a music-bot service just to get all the features they wanted. I built Arman MB so we could listen together and use those controls for free. It started as a private-server tool and became one of my most-used projects among friends. That made the everyday details matter: picking the right recording, keeping the queue intact, and making the controls easy to find.",
    "approach": "The TypeScript application separates Discord commands, Spotify metadata, source resolution, deterministic song matching, playback, and per-server queue state. Spotify identifies the song; it does not supply the audio or take over my personal Spotify playback. Lavalink and maintained source tools handle streaming into Discord. I kept custom code focused on recording selection, queue behavior, and the interface rather than building a YouTube extractor.",
    "outcome": "Friends can submit Spotify tracks, albums, and accessible playlists, YouTube links and playlists, or a plain-text search. A shared player menu supports pause, resume, skip, stop, queue navigation, and looping. Each Discord server has its own player and queue. The bot now runs alongside my Jev 2048 service on Oracle Cloud, with audible playback confirmed after migration and automatic startup enabled. Usage is based on my experience with friends, not a published user-count or uptime benchmark.",
    "lessons": "A search result, a resolved stream URL, and a TrackStart event are different milestones from audible music. Cloud deployment exposed that distinction: the same source that worked locally hit YouTube login checks on Oracle. Account cookies cleared authentication, but Lavalink still received HTTP 403. Comparing a small yt-dlp audio download with a direct audio request isolated a playback-context difference. The fix used documented upstream settings and a maintained token provider, followed by a real Discord listening test.",
    "details": [
      {
        "title": "Music controls people actually use",
        "text": "The bot has 19 slash commands: play, playnext, search, pause, resume, skip, stop, queue, nowplaying, skipto, remove, move, shuffle, clear, loop, volume, lyrics, menu, help. Search offers five selectable results. Queue pages are public and show ten upcoming tracks at a time. A compact, updating menu replaces giant YouTube previews and repeated control popups; controls require the user to share the bot’s voice channel. Lyrics from LRCLIB are shown without timestamps."
      },
      {
        "title": "Correct recordings before keyword matches",
        "text": "Spotify metadata supplies title, artists, album, duration, ISRC when available, artwork, and explicit status. Matching scores candidates deterministically using recording identity, duration, uploader information, and version keywords. Lyric uploads are preferred when the recording is correct; covers, slowed or sped-up edits, karaoke, and unintended live, remix, or instrumental versions are penalized. Explicit and clean versions needed special handling so a playlist would not silently choose a clean upload when an explicit match was available. No LLM or embeddings are involved."
      },
      {
        "title": "Cold requests and queue continuity",
        "text": "The design targets previously unseen Spotify links. Authentication is prewarmed, voice connection work overlaps resolution, and lyric and exact-recording searches run concurrently after metadata arrives. Playlist metadata imports progressively, while upcoming tracks are resolved ahead of playback. This is not a whole-song download or a guarantee of gapless transitions. Queue regression tests cover play-next insertion, skipping, reordering, looping, and stale asynchronous work so one control action does not erase the remaining playlist."
      },
      {
        "title": "The working stack",
        "text": "Node.js 24 and TypeScript run the application with discord.js 14, lavalink-client 2, and dotenv. Lavalink 4.2.2 runs on Java 21 with LavaSrc 4.8.3’s yt-dlp backend; the deployed extractor is yt-dlp 2026.08.19 with Deno 2.9.7 for JavaScript challenges. Spotify Web API uses Client Credentials for track metadata and user authorization for supported playlist access. LRCLIB supplies lyrics. The Oracle deployment adds bgutil-ytdlp-pot-provider 2.0.1 and its matching yt-dlp plugin. Opus audio is preferred. There is no database, Redis, Docker dependency, custom decoder, or FFmpeg process in the deployed stack."
      },
      {
        "title": "Moving from Windows to ARM64 Linux",
        "text": "I developed locally on Windows and PowerShell, then deployed to an Ubuntu ARM64 Oracle Always Free instance with 1 OCPU and 6 GB RAM already serving my C++ Jev 2048 evaluator. Linux runtime binaries were installed separately and available release checksums verified. Dedicated systemd services manage the bot, Lavalink, and token provider under an unprivileged account. Memory limits protect the shared machine; the token provider and Lavalink listen only on localhost. The local bot was stopped before the cloud bot connected, preventing duplicate processes using the same token. Jev remained running throughout."
      },
      {
        "title": "Why the first cloud playback failed",
        "text": "Anonymous YouTube requests returned LOGIN_REQUIRED on the cloud server. A PO-token provider alone did not help because the request failed before token generation. Separately authorized YouTube cookies cleared that stage. Cookies plus the provider let yt-dlp retrieve an audio sample, while an immediate direct request and Lavalink still failed with HTTP 403. Applying yt-dlp’s documented mweb use_ad_playback_context setting allowed a 16 KB HTTP 206 Opus response and a passing Lavalink preparation test. A listener then confirmed audio in Discord. This solved the tested deployment; it is not a permanent guarantee against future YouTube changes."
      },
      {
        "title": "Verification and operational limits",
        "text": "Focused Node tests cover song matching, Spotify authorization and parsing, playlists, queue transitions, Discord interactions, playback failures, and lyric formatting. performance.now() instrumentation records spotifyMetadataMs, searchMs, matchMs, voiceConnectMs, playbackStartMs, and totalPlayRequestMs. Track-start timings are proxies, not measured first-audible latency. Cookies may expire, source availability can change, and queues are in memory and reset on restart. Spotify playlist access depends on the authorized account and API restrictions. Concurrent server playback is supported, but this small shared VM has not been load-tested for a large public audience."
      },
      {
        "title": "Free to use, with a source download",
        "text": "The hosted bot has no feature subscription for my friends. Add to Discord installs it into a server; there is no desktop app to download. The GitHub source archive is available for developers who want to run their own instance with their own credentials. Free hosting still has resource limits and does not promise uninterrupted service."
      }
    ],
    "github": "https://github.com/amansoory/arman-mb",
    "live": "https://discord.com/oauth2/authorize?client_id=1557127638907097138&permissions=3165184&scope=bot%20applications.commands",
    "liveLabel": "Add to Discord",
    "sources": [
      {
        "label": "Download source ZIP",
        "href": "https://github.com/amansoory/arman-mb/archive/refs/heads/master.zip"
      },
      {
        "label": "Lavalink",
        "href": "https://github.com/lavalink-devs/Lavalink"
      },
      {
        "label": "LavaSrc",
        "href": "https://github.com/topi314/LavaSrc"
      },
      {
        "label": "yt-dlp",
        "href": "https://github.com/yt-dlp/yt-dlp"
      },
      {
        "label": "Maintained PO-token provider",
        "href": "https://github.com/Brainicism/bgutil-ytdlp-pot-provider"
      },
      {
        "label": "Cover illustration: TechPP",
        "href": "https://techpp.com/2023/10/24/best-discord-music-bots/"
      }
    ],
    "preview": {
      "src": "/projects/arman-mb.webp",
      "alt": "Discord music illustration with headphones and musical notes; cover artwork, not a screenshot of the bot."
    },
    "accessNote": "Free hosted bot. Add it to a server you can manage, join voice, and use /play. Source download available in the case study.",
    "featured": true,
    "placeholder": false
  },
  {
    slug: "vibesafe",
    number: "03",
    name: "VibeSafe",
    category: "AI security scanner agent",
    label: "CHECKING THE CODE",
    accent: "mint",
    visual: "scan",
    visualLabels: [
      "51 rules / 10 categories",
      "regex → config → LLM",
      "CRITICAL",
      "CI → BLOCK",
      "PR → FINDINGS",
    ],
    description:
      "VibeSafe scans repositories for security problems, posts findings on pull requests, and fails CI when it finds critical vulnerabilities. Built in collaboration with Humza Hassan.",
    tags: ["Python", "Claude API", "FastAPI", "Docker", "GitHub Actions"],
    metrics: ["51 rules / 10 vulnerability categories", "Fails CI on critical findings"],
    year: "2026",
    role: "Security scanner development",
    duration: null,
    problem:
      "VibeSafe checks code where it’s being reviewed. It looks for security problems in repositories and pull requests, then reports what it finds.",
    approach:
      "The Python scanner combines regex checks and configuration parsing with deeper Claude analysis across 51 rules and 10 vulnerability categories. FastAPI provides the interface, Docker packages the service, and GitHub Actions connects scans to pull requests.",
    outcome:
      "It posts findings directly on pull requests. Critical vulnerabilities fail CI, making the result part of the review workflow rather than a separate report.",
    lessons:
      "The interesting part is combining checks that follow fixed rules with LLM analysis. Severity then determines whether CI should fail.",
    github: "https://github.com/amansoory/VibeSafe",
    live: "https://vibe-safe-pt7v.vercel.app",
    preview: {
      src: "/projects/vibesafe-preview.png",
      alt: "VibeSafe website: Ship code fearlessly, with AI-powered security scanning.",
    },
    placeholder: false,
  },
  {
    slug: "industry-resilience",
    number: "04",
    name: "Industry Resilience Predictor",
    category: "Economic data / machine learning",
    label: "DISRUPTION → RECOVERY",
    accent: "blue",
    visual: "chart",
    visualLabels: ["90+ industries", "DRAWDOWN", "RECOVERY", "TIME →"],
    description:
      "An interactive dashboard and regression model that compare COVID-era drawdown and recovery across 90+ industries. Built during a hackathon.",
    tags: ["Python", "pandas", "scikit-learn", "Streamlit", "Docker"],
    metrics: ["90+ industries compared"],
    year: "2025",
    role: "Data pipeline, model & dashboard",
    duration: "Hackathon project",
    problem:
      "This project looks at two parts of COVID-era disruption: how far an industry fell and how it recovered. The dashboard lets people compare those patterns across industries.",
    approach:
      "The pipeline cleans time-series data with pandas and trains a regression model for drawdown and recovery. A Streamlit dashboard makes the industry comparisons interactive, with Docker packaging the project.",
    outcome:
      "The result is a tool for exploring 90+ industries side by side. People can compare performance through the dashboard instead of working through the underlying data themselves.",
    lessons:
      "The technical work connects raw time-series data to a regression model and an interactive comparison.",
    github: "https://github.com/amansoory/Industry-Resilience-Predictor-CDC2025",
    live: "https://industry-resilience-predictor.streamlit.app/",
    preview: {
      src: "/projects/industry-resilience-preview.png",
      alt: "Industry Resilience Explorer website with industry drawdown, recovery, and resilience metrics.",
    },
    placeholder: false,
  },
  {
    slug: "space-battle",
    number: "05",
    name: "Arcade-Style Space Battle",
    category: "Interactive software / Hack110",
    label: "TARGET / ENGAGE",
    accent: "amber",
    visual: "arcade",
    visualLabels: [
      "HACK110 / FIRST PLACE",
      "TARGET ACQUIRED",
      "SPAWN → COLLIDE → ADVANCE",
    ],
    description:
      "A Pygame space battle with enemy spawning, collision detection, and increasing difficulty. Built in under 24 hours; first place at Hack110.",
    tags: ["Python", "Pygame", "OOP"],
    metrics: ["1st place, Hack110", "Built in under 24 hours"],
    year: "2024",
    role: "Gameplay systems",
    duration: "Under 24 hours",
    problem:
      "The challenge was getting a playable space battle together in under 24 hours, including enemies, collisions, and increasing difficulty.",
    approach:
      "Python and Pygame handle the collision, spawning, and game-state systems. Object-oriented code organizes the gameplay as enemies appear and the difficulty increases.",
    outcome:
      "The playable arcade game won first place at Hack110.",
    lessons:
      "The interesting part is how the systems interact: enemies spawn, collisions change the game state, and difficulty keeps the next round moving.",
    github: "https://github.com/amansoory/Space-Battles-Hackathon-Winner",
    preview: {
      src: "/projects/space-battle-preview.png",
      alt: "Space Battle gameplay with two player ships, alien enemies, and health, lives, and ammunition indicators.",
      crop: { x: 0, y: 0, width: 1280, height: 800, sourceWidth: 1920, sourceHeight: 1200 },
    },
    live: null,
    placeholder: false,
  },
  {
    slug: "dungeon-hero",
    number: "06",
    name: "Dungeon Crawler",
    category: "Game architecture / Java",
    label: "GRID / NEXT MOVE",
    accent: "sage",
    visual: "grid",
    visualLabels: [
      "TURN-BASED / MVC",
      "PATH → RESOLVE → RENDER",
      "PLAYER",
      "ENEMY",
    ],
    description:
      "A turn-based Java grid game with pathfinding, collision resolution, and rule-based enemies. Game logic stays separate from state and rendering.",
    tags: ["Java", "OOP", "MVC", "Observer Pattern"],
    year: "2025",
    role: "Game logic & architecture",
    duration: null,
    problem:
      "Each turn needs to account for movement, collisions, and enemy rules. Dungeon Crawler handles those decisions separately from drawing the board.",
    approach:
      "The game is organized across 10+ Java classes using MVC and the Observer pattern. The logic handles pathfinding, collision resolution, and enemy behavior; state and rendering have their own responsibilities.",
    outcome:
      "The result is a turn-based game with movement and enemy rules that don’t depend on the rendering code.",
    lessons:
      "The architecture is the part to look at here: MVC separates the pieces, and the Observer pattern connects state changes to the view.",
    github: "https://github.com/amansoory/Dungeon-Hero-LogicGrid",
    preview: {
      src: "/projects/dungeon-crawler-preview.png",
      alt: "Arman's Dungeon Crawler menu with Last Score, Start Game, and Switch Mode controls.",
      crop: { x: 0, y: 176, width: 895, height: 559.375, sourceWidth: 895, sourceHeight: 893 },
    },
    live: null,
    placeholder: false,
  },
  {
    slug: "initial-d-racing-game",
    number: "07",
    name: "Initial D Racing Game",
    category: "3D arcade racing / HackNC 2024",
    label: "STEER → DRIFT → DESCEND",
    accent: "amber",
    visual: "racing",
    visualLabels: ["HACKNC 2024", "UNITY / C#", "MOUNTAIN TRACK"],
    description:
      "A 3D arcade racing game on a stylized mountain track, built with Rajin Islam and Humza Hassan for HackNC 2024.",
    tags: ["Unity", "C#", "3D Assets", "Vehicle Physics"],
    year: "2024",
    role: "Team project with Rajin Islam and Humza Hassan",
    duration: "HackNC 2024",
    problem:
      "We wanted to build a short arcade racing experience around a stylized mountain course for HackNC 2024.",
    approach:
      "Rajin Islam, Humza Hassan, and I built it in Unity with C#. We worked on vehicle physics, steering and drifting, a following camera, and the integrated 3D assets that make up the track.",
    outcome:
      "The result is a 3D racing game set on a mountain track. Its systems handle driving, drifting, camera following, and the track environment together.",
    lessons:
      "The interesting part was making the driving feel connected to the track. Steering, drifting, camera movement, and the 3D environment all had to support the same arcade racing loop.",
    github: "https://github.com/amansoory/Hack-NC-Initial-D",
    live: null,
    placeholder: false,
  },
];

type Experience = {
  id: string;
  period: string;
  role: string;
  company: string;
  shortCompany: string;
  context?: string;
  contributions: string[];
  tools: string[];
};
export const otherProjects = projects.filter((project) =>
  ["dungeon-hero", "initial-d-racing-game"].includes(project.slug),
);
export const mainProjects = projects.filter((project) => !otherProjects.includes(project));

// Adapted from the latest resume; retain the user's TA tools correction.
// Keep hero and section in sync.
export const experience: Experience[] = [
  {
    id: "timing",
    period: "January to May 2026",
    role: "Software Engineering Intern",
    company: "Timing",
    shortCompany: "Timing",
    contributions: [
      "Built a GPT-4o agent to prioritize follow-ups and draft outreach across 1,000+ contacts. It combined function calling and structured outputs with a RAG pipeline using OpenAI embeddings, pgvector, and PostgreSQL.",
      "Built a Manifest V3 Chrome extension at the early-stage AI startup, using content scripts and browser APIs to bring Timing’s networking assistant into LinkedIn and Gmail.",
      "Reduced p95 contact API latency by 80%, from 450 ms to under 90 ms, with composite PostgreSQL indexes and Redis caching.",
    ],
    tools: ["OpenAI API", "PostgreSQL", "pgvector", "Redis"],
  },
  {
    id: "unc",
    period: "August to December 2025",
    role: "Teaching Assistant",
    company: "UNC Chapel Hill",
    shortCompany: "UNC",
    context: "COMP 110 · Introduction to Programming",
    contributions: [
      "Helped 200+ students build their Python skills in weekly labs and office hours, working through bugs and concepts including control flow, functions, OOP, runtime analysis, and memory diagrams.",
      "Graded programming assignments and gave specific feedback on students’ code, working with the course staff to address concepts students repeatedly found difficult.",
    ],
    tools: ["Python", "VS Code"],
  },
  {
    id: "vogro",
    period: "May to August 2025",
    role: "Software Engineering Intern",
    company: "Vogro",
    shortCompany: "Vogro",
    context: "Stanford-affiliated",
    contributions: [
      "Helped build software for Vogro, a Stanford-affiliated volunteer program serving seniors. I worked with project leads on the platform and internal tools that supported the program’s day-to-day work.",
      "Worked with project leads to plan and build REST API integrations using FastAPI and Node.js, connecting the React frontend, backend services, and third-party tools for 500+ users.",
      "Wrote Python scripts to move, validate, and deduplicate data across internal tools, cutting time spent on manual data processing by 40%.",
      "Improved page load times by 20% by removing duplicate API requests and refactoring React components, making the app run more smoothly on lower-end devices.",
    ],
    tools: ["Python", "FastAPI", "Node.js", "React"],
  },
];

// Grounded in Arman_Hassan_Resume.pdf and the project details above.
export const skills: { id: string; name: string; items: string[]; emphasis: string[] }[] = [
  {
    id: "01",
    name: "Languages",
    items: ["Python", "SQL", "TypeScript / JavaScript", "Go", "Java", "C++", "HTML / CSS"],
    emphasis: ["SQL"],
  },
  {
    id: "02",
    name: "Frontend & Mobile",
    items: ["Next.js / React", "Tailwind CSS", "React Native / Expo", "Playwright", "Streamlit", "Unity / Pygame"],
    emphasis: ["Tailwind CSS", "Playwright"],
  },
  {
    id: "03",
    name: "Backend & Infrastructure",
    items: ["FastAPI / Node.js / REST APIs", "PostgreSQL / Redis", "Vercel / Oracle Cloud", "AWS S3 / IAM", "Docker / GitHub Actions", "Git / GitHub"],
    emphasis: ["Vercel", "Git"],
  },
  {
    id: "04",
    name: "AI & Data",
    items: ["OpenAI API / Claude", "AWS Bedrock / Titan embeddings", "RAG / pgvector", "Tool calling / structured outputs", "LLM evals / guardrails", "Amazon S3 Vectors", "scikit-learn / pandas / NumPy"],
    emphasis: ["OpenAI API"],
  },
];

export const coursework: string[] = [
  "Data Structures",
  "Algorithms and Analysis",
  "Systems",
  "Computer Organization",
  "Linear Algebra",
  "Probability and Statistical Inference",
  "Data Management",
  "Machine Learning",
  "Introduction to Artificial Intelligence",
  "Mobile Computing Systems",
  "Hardware Security",
  "Models of Languages and Computation",
  "Computational Photography",
];

export const portfolioCopy = {
  workNote:
    "Live demos available.",
  experienceNote: "# agents, reliable systems, and teaching",
  skillsNote: "These are tools I’ve used in my projects and internships.",
  courseworkLabel: "Coursework at UNC Chapel Hill",
  visualFooter: "ILLUSTRATION / NOT LIVE OUTPUT",
  caseFocus: "The interesting part",
};

// Illustration geometry only—not measured financial data or scanner findings.
export const visualData = {
  chart:
    "M 35 55 L 85 63 L 125 58 L 165 145 L 205 128 L 245 110 L 285 91 L 325 73 L 375 60",
  gridPath: "M 50 150 H 90 V 110 H 170 V 70 H 250",
  walls: [
    [130, 150],
    [130, 70],
    [210, 110],
    [250, 150],
  ],
};

/**
 * Canonical origin for metadata, robots, and the sitemap. NEXT_PUBLIC_SITE_URL wins; otherwise
 * Vercel's production domain (a system variable available at build time) keeps share images and
 * canonical links pointing at the live site instead of localhost.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
export const siteDescription =
  "I’m Arman Hassan, a computer science student at UNC Chapel Hill graduating in May 2027. Here’s my work on AI agents, backend systems, security, and interactive software.";

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
    "I’m studying computer science at UNC Chapel Hill, with a minor in Data Science. I expect to finish my BS in May 2027.",
  about:
    "My interests span AI agents, backend systems, databases, security, and interactive software. I’ve also helped 200+ students learn Python, explaining everything from control flow to memory diagrams in labs and office hours.",
  email: "armanmansoorhassan@gmail.com",
  github: "https://github.com/amansoory",
  linkedin: "https://linkedin.com/in/arman-hassan1",
  resume: null,
  // Enable indexing after the final deployment URL and resume file are supplied.
  draft: true,
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
  details?: { title: string; text: string }[];
  sources?: { label: string; href: string }[];
  demoPreview?: string;
  featured?: boolean;
  placeholder: boolean;
  preview?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    slug: "jev-2048",
    number: "07",
    name: "Jev 2048",
    category: "Decision systems / interactive experiment",
    label: "JEV 2048",
    accent: "amber",
    visual: "grid",
    visualLabels: [],
    description: "Play 2048 or compare the same Jev classifier with different inputs, a search algorithm, and a pretrained reinforcement-learning bot. Inspect the information behind each move.",
    tags: ["TypeSafe Jev", "Next.js", "React", "TypeScript", "Expectimax", "TD learning", "C++", "Oracle Cloud", "Vercel"],
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
    slug: "degree-planner-ai",
    number: "01",
    name: "Degree Planner AI",
    category: "RAG chatbot / UNC degree planning",
    label: "RETRIEVE → CITE → EXPLAIN",
    accent: "mint",
    visual: "planner",
    visualLabels: ["UNC CATALOG", "PROGRAM ROUTING", "SOURCES CITED", "REQUIREMENTS"],
    description:
      "A chatbot for UNC students that answers degree requirement questions using official catalog content and the courses a student reports taking.",
    tags: ["Next.js", "TypeScript", "AWS Bedrock", "Titan embeddings", "S3 Vectors", "Claude", "Vercel"],
    year: "2026",
    role: "Application and retrieval system",
    duration: null,
    problem:
      "I built Degree Planner AI to help UNC students understand what they still need to graduate. They can ask about a major in plain language and get an answer grounded in the official course catalog.",
    approach:
      "I converted catalog pages for UNC majors and minors into structured text and indexed them in an AWS Bedrock Knowledge Base. Titan embeddings are stored in Amazon S3 Vectors. A Next.js app on Vercel retrieves the relevant requirements and uses Claude to answer from them.",
    outcome:
      "The app lists required courses, identifies minimum grades stated in the catalog, and asks what courses a student has completed to show what remains. Answers link back to the catalog pages used.",
    lessons:
      "I initially considered filtering unrelated questions by search relevance score. Testing showed that unrelated and valid questions scored almost the same, so I added a lightweight Claude routing step. It identifies the student’s program for more targeted retrieval and stops off-topic requests before generating an answer.",
    github: null,
    live: "https://unc-degree-rag.vercel.app/",
    preview: {
      src: "/projects/degree-planner-preview.png",
      alt: "Degree Planner AI chatbot answering a question about the Psychology B.A. requirements with catalog citations.",
    },
    featured: true,
    placeholder: false,
  },
  {
    slug: "vibesafe",
    number: "02",
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
      "VibeSafe scans repositories for security problems, posts findings on pull requests, and fails CI when it finds critical vulnerabilities.",
    tags: ["Python", "Claude API", "FastAPI", "Docker", "GitHub Actions"],
    year: null,
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
    number: "03",
    name: "Industry Resilience Predictor",
    category: "Economic data / machine learning",
    label: "DISRUPTION → RECOVERY",
    accent: "blue",
    visual: "chart",
    visualLabels: ["90+ industries", "DRAWDOWN", "RECOVERY", "TIME →"],
    description:
      "An interactive dashboard and regression model that compare COVID-era drawdown and recovery across 90+ industries. Built during a hackathon.",
    tags: ["Python", "pandas", "scikit-learn", "Streamlit", "Docker"],
    year: null,
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
    number: "04",
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
    year: null,
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
    live: null,
    placeholder: false,
  },
  {
    slug: "dungeon-hero",
    number: "05",
    name: "Dungeon Hero",
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
    year: null,
    role: "Game logic & architecture",
    duration: null,
    problem:
      "Each turn needs to account for movement, collisions, and enemy rules. Dungeon Hero handles those decisions separately from drawing the board.",
    approach:
      "The game is organized across 10+ Java classes using MVC and the Observer pattern. The logic handles pathfinding, collision resolution, and enemy behavior; state and rendering have their own responsibilities.",
    outcome:
      "The result is a turn-based game with movement and enemy rules that don’t depend on the rendering code.",
    lessons:
      "The architecture is the part to look at here: MVC separates the pieces, and the Observer pattern connects state changes to the view. The preview illustrates pathfinding rather than running the game.",
    github: "https://github.com/amansoory/Dungeon-Hero-LogicGrid",
    live: null,
    placeholder: false,
  },
  {
    slug: "initial-d-racing-game",
    number: "06",
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
  period: string;
  role: string;
  company: string;
  detail: string;
  takeaway: string;
  built: string[];
  tools: string[];
  current: boolean;
  signals?: string[];
};
export const experience: Experience[] = [
  {
    period: "January to May 2026",
    role: "Machine Learning Intern",
    company: "Timing",
    current: false,
    detail:
      "At Timing, I built an LLM agent that prioritized contacts for follow-up. I worked on RAG over interaction history with PostgreSQL and pgvector, and improved API performance with PostgreSQL indexing and Redis caching.",
    takeaway: "I worked on retrieving the right context before an agent decided who needed a follow-up.",
    built: ["Contact-prioritization LLM agent", "RAG over interaction history", "PostgreSQL indexing and Redis caching"],
    tools: ["OpenAI API", "RAG", "PostgreSQL", "pgvector", "Redis"],
    signals: ["GOALS", "HISTORY", "RANKED FOLLOW-UPS"],
  },
  {
    period: "August to December 2025",
    role: "Teaching Assistant",
    company: "Introduction to Programming",
    current: false,
    detail:
      "I supported 200+ students through Python labs and office hours, helping them debug programs and understand programming concepts.",
    takeaway: "I helped students work through problems until the code made sense to them.",
    built: ["Python lab support", "Debugging help", "Office hours for 200+ students"],
    tools: ["Python", "Debugging", "Explaining code"],
  },
  {
    period: "June to August 2025",
    role: "Software Engineering Intern",
    company: "Vogro",
    current: false,
    detail:
      "At Vogro, I built Python automation, connected services through FastAPI and Node.js APIs, and improved page performance for older users.",
    takeaway: "I connected the services behind the site and made the experience faster for older users.",
    built: ["Python automation", "FastAPI and Node.js service connections", "Page performance improvements"],
    tools: ["Python", "FastAPI", "Node.js", "React"],
  },
];

export const skills: { id: string; name: string; items: string[] }[] = [
  {
    id: "01",
    name: "Languages",
    items: ["Python", "TypeScript / JavaScript", "Java / C"],
  },
  {
    id: "02",
    name: "Interfaces",
    items: ["Next.js / React", "React Native / Expo", "Streamlit"],
  },
  {
    id: "03",
    name: "Systems",
    items: ["FastAPI / Node.js", "PostgreSQL / Redis", "Docker / GitHub Actions"],
  },
  {
    id: "04",
    name: "AI & Data",
    items: ["AWS Bedrock / Claude", "pgvector / RAG", "scikit-learn / pandas"],
  },
];

export const coursework: string[] = [
  "Data Structures",
  "Algorithms and Analysis",
  "Systems",
  "Computer Organization",
  "Linear Algebra",
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
    "Jev 2048, Degree Planner AI, VibeSafe, and Industry Resilience link to live sites. The other previews illustrate how the projects work.",
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

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteDescription =
  "I’m Arman Hassan, a computer science student at UNC Chapel Hill graduating in May 2027. Here’s my work on AI agents, backend systems, security, and interactive software.";

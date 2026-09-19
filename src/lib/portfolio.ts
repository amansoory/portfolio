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
    "Recent work: a catalog-grounded chatbot and a classifier-driven 2048 experiment.",
  ],
  introduction:
    "I’m studying computer science at UNC Chapel Hill, with a minor in Data Science. I expect to finish my BS in May 2027.",
  about:
    "Most of my recent work connects a model to a database, an API, and an interface someone can actually use. At Timing, that meant retrieving interaction history before an agent ranked contacts for follow-up. In my own projects, I’ve built catalog search with citations and served a pretrained C++ game model from an ARM server. I like being able to inspect what happened when something goes wrong. Teaching Python to 200+ students also gave me plenty of practice explaining a bug without hiding behind jargon.",
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
    description: "A 2048 experiment comparing TypeSafe Jev, expectimax search, and a pretrained TD-learning bot. Change the information Jev sees, replay seeded games, and inspect each decision.",
    tags: ["TypeSafe Jev", "Next.js", "React", "TypeScript", "Expectimax", "TD learning", "C++", "Oracle Cloud", "Vercel"],
    year: "2026",
    role: "Game engine, experiment design, native integration, and deployment",
    duration: null,
    problem: "I wanted to test how TypeSafe Jev plays 2048. The game has clear rules and measurable results, so I could compare a general-purpose classifier with bots built for the game. The main question: does giving Jev board features or specialist scores help it choose better moves?",
    approach: "The game engine calculates the board after every legal move. It shuffles the options and gives them anonymous labels, then asks Jev to choose. Each variant uses the same model, without project-specific fine-tuning. What changes is the input: boards, calculated features, expectimax search scores, learned n-tuple values, or both specialists. Jev cannot see the move directions or either specialist’s recommended move.",
    outcome: "You can play yourself or compare bots side by side, including two Jev variants. Each board runs to game over independently. The inspector shows the options Jev saw, its choice probabilities, features, specialist agreement, token use, and timing. Seeded restarts and saved decision traces make runs repeatable. Choice probabilities show the model’s preferences, not its chance of winning.",
    lessons: "Extra information did not always lead to better decisions. In an early two-seed pilot, mean scores rose from 796 with raw Jev to 10,770 with board features and 34,276 with expectimax assistance. But the assisted version matched expectimax on 3,554 of 3,559 checked moves: it mostly followed the search bot. Later tests hid the specialists’ identities and asked Jev to choose between them; that did not beat consistently using one specialist. The current anonymous-input variants still need a multi-seed benchmark with fixed settings.",
    details: [
      { title: "The learned bot: pretrained board-pattern values", text: "The n-tuple bot uses Hung Guei’s pretrained TDL2048+ checkpoint: four tables holding about 67.1 million board-pattern weights learned through temporal-difference training. I did not train these weights. The original C++ selector scores each move using its immediate reward plus the resulting board’s learned value. Jev can receive normalized scores for every option alongside expectimax results, then make its own choice." },
      { title: "What the specialist comparison showed", text: "Across five matched development seeds, n-tuple won all five comparisons: mean score 222,849.6 versus 45,553.6 for this app’s bounded JavaScript expectimax implementation. One n-tuple run reached 32,768. Both bots consumed the same tile-value and shuffled cell-priority sequences; actual spawn cells could differ after their boards diverged. Five seeds are descriptive evidence, not proof of general superiority, and these results do not represent every expectimax implementation." },
      { title: "Serving the C++ bot from Oracle Cloud", text: "The Next.js and React app runs on Vercel. Server routes call the TypeSafe SDK or an authenticated HTTPS service on an Oracle Cloud ARM64 Ubuntu VM. That service uses Python to send requests to a persistent C++ worker, which loads the checkpoint once. Nginx and Let’s Encrypt handle HTTPS; systemd keeps the local service running. Boards beyond the native 32,768 tile limit return an error instead of switching bots. Reported response time includes the network round trip." },
      { title: "Tools, tests, and repeatable runs", text: "The interface uses Tailwind CSS, shadcn-style components with Radix UI, Lucide icons, Motion, Recharts, and locally bundled DM Sans. Web Workers and Node worker threads keep search and structural calculations off the main event loop. A TypeScript controller owns the game state, legal-move validation, seeded spawning, and stale-response protection. Playwright and focused Node tests cover controls, rules, adapters, and fixed-board native parity. JSON/JSONL traces, CSV summaries, and Python rollout analysis support the research. SHA-256 checks verify the downloaded checkpoint. Docker packaging is prepared; the live Oracle service uses a native Linux build. Upstash Redis and Cloudflare Turnstile integrations are optional, not prerequisites for this demo." },
      { title: "What I took from it", text: "This experiment helped me separate rule-based calculation from model decisions. Code lists legal moves and calculates their features; Jev chooses from those options. I also tested weighted combinations, switching based on uncertainty, and checks for risky moves, but found no clear advantage to report. The decision traces show when extra context helps, when Jev follows a specialist, and when search or learned board values already work better." }
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

export const skills: { id: string; name: string; description: string; items: string[] }[] = [
  {
    id: "01",
    name: "Languages",
    description: "Python for data and services, TypeScript for interfaces, and C++ when I need to work with a native model.",
    items: ["Python", "TypeScript / JavaScript", "Java / C / C++", "SQL", "HTML / CSS"],
  },
  {
    id: "02",
    name: "Web & mobile",
    description: "React and Next.js for stateful interfaces, with keyboard controls, loading states, and usable mobile layouts.",
    items: ["Next.js / React", "React Native / Expo", "Tailwind CSS", "Streamlit"],
  },
  {
    id: "03",
    name: "Backend & databases",
    description: "Request validation, SQL queries and indexes, and Redis caching. I’ve used these to connect services and reduce repeated work.",
    items: ["FastAPI / Node.js", "REST APIs", "PostgreSQL / SQL indexing", "Redis"],
  },
  {
    id: "04",
    name: "AI & retrieval",
    description: "I turn source documents into embeddings, retrieve relevant passages, and pass that context to a model. I also test structured classification with Jev.",
    items: ["AWS Bedrock / Titan embeddings", "Claude / OpenAI API / TypeSafe Jev", "RAG / LLM agents", "pgvector / Amazon S3 Vectors"],
  },
  {
    id: "05",
    name: "Machine learning & data",
    description: "Cleaning time-series data, fitting regression models, and comparing runs with fixed seeds and saved results.",
    items: ["scikit-learn / regression", "pandas / NumPy", "Data cleaning / time-series analysis", "Seeded evaluation / decision traces"],
  },
  {
    id: "06",
    name: "Cloud & delivery",
    description: "Vercel for web apps and an Oracle ARM VM for native inference, with Nginx, systemd, and browser tests before release.",
    items: ["AWS S3 / IAM", "Oracle Cloud / Vercel", "Docker / Git / GitHub Actions", "Nginx / Linux / systemd", "Playwright / pytest"],
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
  skillsNote: "The tools below are from my projects and internships, grouped by what I use them for.",
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

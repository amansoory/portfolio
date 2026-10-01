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
    "I’m a computer science student at UNC Chapel Hill. Most recently, I built a degree-planning chatbot and tested how a general classifier would handle 2048.",
    "",
  ],
  introduction:
    "I’m a computer science student at UNC Chapel Hill with a minor in Data Science, graduating in May 2027. I’m currently a software engineering intern, and I previously worked as a teaching assistant for an introductory Python course with more than 200 students.",
  about:
    "I’m most interested in backend development, AI systems, and building software that is actually useful. Outside of work and school, I like experimenting with new tools and turning random ideas into projects.",
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
  cardDescription?: string;
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
    cardDescription: "Play 2048 against Jev or watch it compete with bots built for the game.",
    number: "07",
    name: "Jev 2048",
    category: "2048 experiment",
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
      { title: "Scale and cost", text: "Across two days of work on the project, TypeSafe reported 77,928 API requests and 133.1 million processed tokens for $5.45 in model usage. Seeing that much repeated classification happen for so little cost is what made me interested in how models like Jev could work alongside larger AI systems." },
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
    cardDescription: "A Next.js chatbot that searches UNC degree requirements with AWS Bedrock and Claude, then links answers to the official catalog.",
    number: "01",
    name: "Degree Planner AI",
    category: "UNC degree-planning chatbot",
    label: "RETRIEVE → CITE → EXPLAIN",
    accent: "mint",
    visual: "planner",
    visualLabels: ["UNC CATALOG", "PROGRAM ROUTING", "SOURCES CITED", "REQUIREMENTS"],
    description: "A degree-planning chatbot for UNC students, built with Next.js, TypeScript and AWS Bedrock. It searches official catalog material, answers questions with Claude, and cites the pages behind each answer.",
    tags: ["Next.js", "React", "TypeScript", "AWS Bedrock", "Claude", "Titan embeddings", "Amazon S3 Vectors", "RAG", "Vercel"],
    year: "2026",
    role: "Application and retrieval system",
    duration: null,
    problem: "UNC degree requirements are spread across catalog pages for majors, minors and individual courses. I built a chatbot that lets students ask about those requirements and compare them with the courses they report taking.",
    approach: "I converted catalog pages into structured text and indexed them in an AWS Bedrock Knowledge Base. Titan embeddings turn the text into numerical representations for search, stored in Amazon S3 Vectors. The Next.js and TypeScript app retrieves relevant requirements and passes them to Claude, which writes an answer using those sources. The app runs on Vercel.",
    outcome: "Students can ask about required courses and minimum grades, then provide completed courses to see what remains. Answers link to the catalog pages used so students can check the requirements themselves. The app works from reported course history, not an official transcript or degree audit.",
    lessons: "Search relevance scores alone did not reliably separate valid degree questions from unrelated requests. I added a small Claude routing step to identify the student’s program and reject off-topic questions before retrieving material for the answer.",
    github: null,
    live: "https://planuncdegree.site/",
    preview: {
      src: "/projects/degree-planner-preview.png",
      alt: "Degree Planner AI chatbot answering a question about the Psychology B.A. requirements with catalog citations.",
    },
    featured: true,
    placeholder: false,
  },
  {
    slug: "vibesafe",
    cardDescription: "A Python security scanner with 51 rules, framework configuration checks and optional Claude review. GitHub Actions posts findings on pull requests.",
    number: "02",
    name: "VibeSafe",
    category: "Repository security scanner",
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
    description: "A repository security scanner built with Python, FastAPI and Claude. It combines 51 rules across 10 categories with framework-specific checks, produces Markdown or JSON reports, and can block a pull request when it finds a critical issue.",
    tags: ["Python", "FastAPI", "Claude API", "Click", "Jinja2", "React", "Vite", "Tailwind CSS", "SQLAlchemy", "SQLite", "Docker", "GitHub Actions"],
    year: null,
    role: "Security scanner development",
    duration: null,
    problem: "Security checks are easier to act on when they run where code is being reviewed. I built VibeSafe to scan a repository, explain the findings, and report them directly on pull requests rather than requiring a separate manual review.",
    approach: "The scanner runs in three stages. Regular expressions find patterns such as exposed secrets and unsafe functions. Configuration checks inspect framework settings for Next.js and Express. An optional Claude stage reviews code in more detail. A Click command-line interface runs the scan, while shared finding records feed Markdown and JSON reports. Jinja2 templates format prompts and reports. The optional FastAPI web service adds accounts and scan history using SQLAlchemy, with SQLite as its default database. The landing page uses React, Vite and Tailwind CSS.",
    outcome: "The GitHub Actions integration can post findings as pull-request comments and fail the workflow on critical findings. The first two scan stages work without an API key. Docker packages the scanner so the same checks can run locally or in CI. Findings still need review; a passing scan is not a guarantee that a repository is secure.",
    lessons: "Fixed checks handle repeatable patterns, while the optional model review examines issues that need more context. Keeping those stages separate makes it possible to run useful checks without paying for a model call on every scan.",
    github: "https://github.com/amansoory/VibeSafe",
    live: "https://vibe-safe-pt7v.vercel.app",
    preview: {
      src: "/projects/vibesafe-preview.png",
      alt: "VibeSafe website showing its repository security scanner.",
    },
    placeholder: false,
  },
  {
    slug: "industry-resilience",
    cardDescription: "A Python pipeline and Streamlit dashboard modeling COVID-era drawdown and recovery across 90+ industries, using 10,000+ time-series data points.",
    number: "03",
    name: "Industry Resilience Predictor",
    category: "Economic data / machine learning",
    label: "DISRUPTION → RECOVERY",
    accent: "blue",
    visual: "chart",
    visualLabels: ["90+ industries", "DRAWDOWN", "RECOVERY", "TIME →"],
    description: "Built at Carolina Data Challenge in September 2025, this project uses Python, pandas and scikit-learn to estimate drawdown and recovery trends across more than 90 industries. An interactive Streamlit dashboard lets users compare the results.",
    tags: ["Python", "pandas", "scikit-learn", "Streamlit", "Docker", "Git", "GitHub"],
    year: "2025",
    role: "Data pipeline, model & dashboard",
    duration: "Carolina Data Challenge · September 2025",
    problem: "Our team wanted to compare how industries responded to COVID-era disruption: how far they declined, how quickly they recovered, and what those patterns could suggest about another downturn. We used U.S. space-economy data from 2012 to 2023, including industry value added and price indexes.",
    approach: "I cleaned and merged more than 10,000 time-series data points with pandas, handling missing values and dates that did not line up across sources. I then trained a scikit-learn regression model to estimate each industry’s drawdown and recovery trends. Drawdown describes the decline from an earlier level; recovery tracks how the series moves back afterward.",
    outcome: "I built a Streamlit dashboard for comparing industries and visualizing predicted recovery metrics. Users can also enter a shock percentage to explore a possible downturn and recovery path based on past trends. The predictions are estimates from historical data, not guarantees of how an industry will perform.",
    lessons: "Preparing the data was an important part of the model: the series had to use consistent dates before their trends could be compared. Docker kept the runtime environment consistent, while Git and GitHub helped our team share and combine changes during the hackathon.",
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
    cardDescription: "A Python and Pygame shooter with enemy waves, projectile collisions, health and ammunition systems. Built in under 24 hours; first place at Hack110.",
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
    description: "A real-time arcade shooter built with Python and Pygame in under 24 hours. It combines player movement, shooting, enemy waves, collision detection, and health and ammunition tracking. The game won first place at Hack110.",
    tags: ["Python", "Pygame", "Object-oriented programming", "Git", "VS Code"],
    year: null,
    role: "Gameplay systems",
    duration: "Under 24 hours",
    problem: "The hackathon goal was to finish a playable game in under 24 hours. That meant getting movement, shooting, enemies and game-state updates working together, with controls and feedback that players could understand immediately.",
    approach: "The code separates player behavior, enemy spawning and movement, projectiles, and game-state tracking into modules. The game loop processes player input and updates those systems each frame. Collision checks handle interactions between the player, enemies and bullets, while the state tracks health, ammunition and score.",
    outcome: "The finished game includes multiple enemy types, increasing difficulty, and more than 30 visual and audio assets. Health and ammunition feedback help players track what is happening as waves become harder. The project placed first at Hack110.",
    lessons: "Separating the gameplay systems made it easier to change enemy behavior without rewriting player controls or score tracking. Pygame handled input, drawing and audio, and Git tracked changes while the game came together.",
    github: "https://github.com/amansoory/Space-Battles-Hackathon-Winner",
    live: null,
    placeholder: false,
  },
  {
    slug: "dungeon-hero",
    cardDescription: "A Java grid-game engine with movement validation, collisions and enemy rules, organized with MVC and the Observer pattern.",
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
    description: "A turn-based Java game engine for a grid containing players, enemies, obstacles and objectives. More than 10 classes handle movement, pathfinding, collisions and game-state updates, with MVC and the Observer pattern separating rules from the display.",
    tags: ["Java", "Object-oriented programming", "MVC", "Observer pattern", "Git", "IntelliJ IDEA"],
    year: null,
    role: "Game logic & architecture",
    duration: null,
    problem: "Each turn can affect several parts of the game: a player moves, an enemy reacts, a collision occurs, or a win or loss condition changes. I wanted those rules to stay understandable without mixing them into the code that draws the board.",
    approach: "The engine uses model-view-controller architecture. The model stores the grid and entity state, the controller handles input and game rules, and the view displays the result. Classes separate entity management, pathfinding, movement validation and collision handling. The Observer pattern notifies the view when state changes.",
    outcome: "The game validates moves, resolves interactions between entities, and checks win and loss conditions as the grid changes. Enemy rules and movement logic can be maintained separately from rendering. The portfolio preview illustrates the grid logic; it does not run the Java game in the browser.",
    lessons: "This project gave me practice dividing responsibilities between Java classes. The Observer pattern lets the display respond to state changes without putting display updates inside every movement rule. I used IntelliJ IDEA for development and Git for version control.",
    github: "https://github.com/amansoory/Dungeon-Hero-LogicGrid",
    live: null,
    placeholder: false,
  },
  {
    slug: "initial-d-racing-game",
    cardDescription: "A Unity and C# racing game with physics-based steering, drifting and a following camera, built with two teammates at HackNC 2024.",
    number: "06",
    name: "Initial D Racing Game",
    category: "3D arcade racing / HackNC 2024",
    label: "STEER → DRIFT → DESCEND",
    accent: "amber",
    visual: "racing",
    visualLabels: ["HACKNC 2024", "UNITY / C#", "MOUNTAIN TRACK"],
    description: "A 3D arcade racing game built in Unity with C# for HackNC 2024. Rajin Islam, Humza Hassan and I combined physics-based vehicle controls, drifting, a following camera, and a mountain-track environment.",
    tags: ["Unity", "C#", "Unity Physics", "Unity Asset Store", "3D assets", "Visual Studio / VS Code"],
    year: "2024",
    role: "Team project with Rajin Islam and Humza Hassan",
    duration: "HackNC 2024",
    problem: "Our team wanted to make a short arcade racing game inspired by Initial D. The main challenge was making the car, camera and mountain course work together so players could steer, brake and drift around the track.",
    approach: "We used C# scripts and Unity physics components for acceleration, braking and steering, including wheel and suspension setup. A camera tracks the vehicle as it moves through the course. We assembled the scene with free vehicle and environment assets and worked through script, component and object-parenting issues in the Unity Editor.",
    outcome: "The result is a playable mountain-track racing game with vehicle controls, drifting and camera tracking. It was a team hackathon project, not a custom-built game engine or a collection of models we created from scratch.",
    lessons: "Getting the components to work together took more than writing the driving script. Camera tracking, wheel physics and scene setup all affected the result. We used tutorials, Unity Learn, free Asset Store resources and debugging assistance; the repository credits those sources.",
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
    role: "Software Engineering Intern",
    company: "Timing",
    current: false,
    detail:
      "At Timing, I worked on an AI agent that used past interactions to suggest which contacts needed a follow-up. I also improved database queries and added caching to speed up API requests.",
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
  { id: "01", name: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C", "C++", "SQL"] },
  { id: "02", name: "Frontend and mobile", items: ["React", "Next.js", "React Native", "Expo", "Tailwind CSS"] },
  { id: "03", name: "Backend and infrastructure", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "REST APIs", "Docker", "AWS", "Vercel", "Git", "GitHub Actions", "Playwright"] },
  { id: "04", name: "AI and data", items: ["OpenAI API", "Claude", "TypeSafe Jev", "RAG", "pgvector", "scikit-learn", "pandas"] },
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

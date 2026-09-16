// Replace bracketed fields and null URLs with resume/project details.
// Keep draft true until the content and deployment URL are ready to publish.
export const profile = {
  name: "[Your name]",
  initials: "SE",
  role: "Software engineer",
  location: "[City, Country]",
  availability: "[Availability]",
  introduction:
    "[A sentence about what you build, what you care about, and what you want to work on next.]",
  about:
    "[Your background, the problems that interest you, and a little of who you are outside the editor.]",
  email: null as string | null,
  github: null as string | null,
  linkedin: null as string | null,
  resume: null as string | null,
  draft: true,
};

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  accent: "mint" | "blue" | "amber";
  visual: "network" | "terminal" | "pipeline";
  tags: string[];
  year: string;
  role: string;
  duration: string;
  problem: string;
  approach: string;
  outcome: string;
  lessons: string;
  github: string | null;
  live: string | null;
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    number: "01",
    name: "[Project one]",
    category: "Full-stack application",
    accent: "mint",
    visual: "network",
    description:
      "[What you built, who it helps, and the problem it solves—in one sentence.]",
    tags: ["[Frontend]", "[Backend]", "[Database]"],
    year: "[Year]",
    role: "[Your role]",
    duration: "[Duration]",
    problem:
      "[Describe the user need and the constraints that made this problem interesting.]",
    approach:
      "[Explain the architecture, your contribution, and one important engineering tradeoff.]",
    outcome:
      "[Add a verified result, user outcome, or measurable improvement.]",
    lessons:
      "[What you learned and what you would change in the next iteration.]",
    github: null,
    live: null,
    placeholder: true,
  },
  {
    slug: "project-two",
    number: "02",
    name: "[Project two]",
    category: "Systems & developer tools",
    accent: "blue",
    visual: "terminal",
    description:
      "[A concise description of your tool and the workflow it makes better.]",
    tags: ["[Language]", "[Runtime]", "[Tooling]"],
    year: "[Year]",
    role: "[Your role]",
    duration: "[Duration]",
    problem:
      "[Describe the workflow bottleneck or technical challenge you set out to solve.]",
    approach:
      "[Show how the tool works and explain the implementation decisions you owned.]",
    outcome:
      "[Add verified benchmarks, adoption, or a concrete demonstration of the result.]",
    lessons:
      "[Share a debugging insight or a design decision you would revisit.]",
    github: null,
    live: null,
    placeholder: true,
  },
  {
    slug: "project-three",
    number: "03",
    name: "[Project three]",
    category: "Data & experimentation",
    accent: "amber",
    visual: "pipeline",
    description:
      "[The question you explored, the system you built, and what you discovered.]",
    tags: ["[Language]", "[Framework]", "[Data store]"],
    year: "[Year]",
    role: "[Your role]",
    duration: "[Duration]",
    problem:
      "[Introduce the question, dataset, or process behind the project.]",
    approach:
      "[Describe the pipeline, evaluation method, and your technical contribution.]",
    outcome: "[Add an honest result, including relevant limitations.]",
    lessons:
      "[What the experiment taught you and the next question you want to explore.]",
    github: null,
    live: null,
    placeholder: true,
  },
];

export const experience = [
  {
    period: "[Start — Present]",
    role: "[Most recent role]",
    company: "[Company / Organization]",
    detail: "[Your main contribution and its impact.]",
    current: true,
  },
  {
    period: "[Start — End]",
    role: "[Previous role]",
    company: "[Company / Organization]",
    detail: "[A meaningful problem you solved or responsibility you held.]",
    current: false,
  },
  {
    period: "[Start — End]",
    role: "[Degree / Education]",
    company: "[University / Institution]",
    detail: "[Relevant focus, research, or achievement.]",
    current: false,
  },
];

export const skills = [
  {
    id: "01",
    name: "Languages",
    items: ["[Language]", "[Language]", "[Language]"],
  },
  {
    id: "02",
    name: "Interfaces",
    items: ["[Framework]", "[Styling]", "[UI tooling]"],
  },
  { id: "03", name: "Systems", items: ["[Backend]", "[Database]", "[Cloud]"] },
  {
    id: "04",
    name: "Workflow",
    items: ["[Version control]", "[Testing]", "[CI / CD]"],
  },
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteDescription =
  "A software engineering portfolio. Explore projects, systems, and the thinking behind them.";

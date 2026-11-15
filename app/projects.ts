export type Project = {
  id: string;
  title: string;
  category: string;
  number: string;
  tagline: string;
  description: string;
  stack: string[];
  source?: string;
  live?: string;
  status: string;
  evidence: { label: string; detail: string };
  highlights: string[];
  note: string;
  color: string;
};

// Change this ID to give another project the house-special position.
export const featuredProjectId = "contractlens";
export const projects: Project[] = [
  {
    id: "contractlens",
    number: "01",
    title: "ContractLens",
    category: "Developer tooling",
    tagline: "Catch the change. Before the break.",
    description:
      "Capture an API response as a baseline, detect breaking changes, and review a persistent history of checks.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Playwright"],
    source: "https://github.com/phatpanda6/contractlens",
    live: "https://contractlens-iota.vercel.app/",
    status: "Live demo",
    evidence: {
      label: "Verified workflow",
      detail:
        "A Playwright test with isolated PostgreSQL verifies PASS → FAIL → accept a new baseline → PASS, with the earlier failure preserved.",
    },
    highlights: [
      "Deterministic schema comparison identifies missing fields and type changes.",
      "Explicit baseline acceptance preserves the history of earlier failed checks.",
      "Vitest and Playwright exercise the engine and persisted browser workflow.",
    ],
    note: "The public demo uses built-in endpoints and shared state. Optional AI explanations are available in local development; live AI generation is disabled in the hosted demo.",
    color: "#c84c30",
  },
  {
    id: "workspace",
    number: "02",
    title: "Relational Workspace",
    category: "Full-stack application",
    tagline: "A little order for a lot of data.",
    description:
      "An Airtable-style workspace bringing a relational database and a type-safe API into a responsive interface.",
    stack: ["Next.js", "tRPC", "Prisma", "Tailwind"],
    live: "https://airtable-clone-chi-nine.vercel.app/",
    status: "Project",
    evidence: {
      label: "Flexible data model",
      detail:
        "A tRPC cell edit validates the value and merges it into the existing JSON row, preserving the values in other columns.",
    },
    highlights: [
      "Relational data presented as an editable workspace.",
      "Type-safe communication between the interface and API.",
      "Prisma connects application types with the database model.",
    ],
    note: "A personal learning project exploring the interactions behind a relational workspace.",
    color: "#3c7664",
  },
  {
    id: "php",
    number: "03",
    title: "PHP Announcements API",
    category: "Backend learning project",
    tagline: "Small API. Real fundamentals.",
    description:
      "A framework-free PHP API that validates JSON and creates and retrieves announcements from SQLite.",
    stack: ["PHP", "SQLite", "PDO", "HTTP", "EC2 lab"],
    source: "https://github.com/phatpanda6/php-announcements-api",
    status: "Source available",
    evidence: {
      label: "Validation and persistence",
      detail:
        "Separates malformed JSON (400) from invalid input (422), with automated validation and repository checks using in-memory SQLite for persistence tests.",
    },
    highlights: [
      "Separates request validation from persistence through a PDO repository.",
      "Uses prepared statements and distinguishes malformed JSON from invalid fields.",
      "Validator and repository tests, plus a documented introductory EC2 exercise.",
    ],
    note: "A work in progress using synthetic data. Create and list operations only; no authentication, update/delete, or public production deployment. The EC2 work was a temporary guided learning lab.",
    color: "#b7853c",
  },
  {
    id: "nba",
    number: "04",
    title: "NBA Player Hub",
    category: "API integration",
    tagline: "Find the player. Handle the edge cases.",
    description:
      "A player search interface presenting NBA profile and team data from an external API.",
    stack: ["React", "REST API", "Responsive UI"],
    source: "https://github.com/phatpanda6/NBA-Player-Hub",
    live: "https://nba-player-hub.vercel.app/",
    status: "Project",
    evidence: {
      label: "Resilient search",
      detail:
        "The interface handles no-match responses separately from rate limiting and prevents repeat submissions while a request is in flight.",
    },
    highlights: [
      "Searches player information through a third-party API.",
      "Explicit loading, empty and rate-limit states.",
      "Responsive presentation of player and team information.",
    ],
    note: "Availability of player data depends on the external API and its limits.",
    color: "#6a6885",
  },
];

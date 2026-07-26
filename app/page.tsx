import { DriftLens } from "./components/DriftLens";

const proofPoints = [
  "TypeScript",
  "React",
  "Next.js",
  "Prisma",
  "36 passing tests",
];

const evidence = [
  {
    number: "01",
    title: "Schema inference",
    copy: "Turns real JSON responses into a predictable type-shape that can be compared without hand-written contracts.",
  },
  {
    number: "02",
    title: "Recursive comparison",
    copy: "Tracks missing fields, additions, type changes, nested objects and representative array item shapes with readable paths.",
  },
  {
    number: "03",
    title: "Baseline persistence",
    copy: "Captures the first live response and its inferred schema through Prisma so later checks have a durable reference point.",
  },
];

const pipeline = [
  { label: "response", state: "complete" },
  { label: "infer", state: "complete" },
  { label: "compare", state: "complete" },
  { label: "classify", state: "complete" },
  { label: "persist", state: "active" },
  { label: "explain", state: "next" },
];

const projects = [
  {
    index: "02",
    title: "Airtable Clone",
    label: "Type-safe data interface",
    description:
      "A database-style workspace built with the T3 stack, using tRPC and Prisma to keep the client, API and relational data model aligned.",
    stack: ["Next.js", "tRPC", "Prisma", "Tailwind"],
    source: "https://github.com/phatpanda6/airtable-clone",
    live: "https://airtable-clone-chi-nine.vercel.app/",
    visual: "table",
  },
  {
    index: "03",
    title: "NBA Player Hub",
    label: "External API experience",
    description:
      "A React search experience that turns external player data into a team-aware profile, with clear loading, no-result and rate-limit states.",
    stack: ["React", "REST API", "Responsive UI", "Error states"],
    source: "https://github.com/phatpanda6/NBA-Player-Hub",
    live: "https://nba-player-hub.vercel.app/",
    visual: "player",
  },
];

const principles = [
  {
    title: "Understand the system",
    copy: "Trace the request, data and failure path before choosing an abstraction.",
  },
  {
    title: "Test the important part",
    copy: "Keep business rules deterministic and cover the edge cases that could silently lie to a user.",
  },
  {
    title: "Ship a complete slice",
    copy: "Prefer one honest end-to-end workflow over a long list of half-finished features.",
  },
];

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Alan Huang, home">
          <span className="brand-mark">AH</span>
          <span className="brand-copy">
            <strong>Alan Huang</strong>
            <small>Full-stack developer</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="mailto:ahuang24365@gmail.com">Contact</a>
          <a
            className="nav-external"
            href="https://github.com/phatpanda6"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ExternalArrow />
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Australia · Open to Melbourne /
              Sydney roles
            </p>
            <h1 id="hero-title">
              I build software that makes invisible failures{" "}
              <span>visible.</span>
            </h1>
            <p className="hero-intro">
              I’m a full-stack developer building reliable TypeScript products
              from interface to API. My current focus is ContractLens—a tool
              for catching breaking API response changes before users find
              them.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contractlens">
                Inspect ContractLens <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-secondary"
                href="https://github.com/phatpanda6"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub <ExternalArrow />
              </a>
            </div>
            <p className="hero-note">
              Full-stack developer building reliable, thoughtfully designed web
              products. Open to opportunities in Melbourne and Sydney.
            </p>
          </div>

          <div className="hero-visual">
            <DriftLens />
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to inspect</span>
            <i />
          </div>
        </section>

        <section className="proof-rail" aria-label="Core technologies and proof">
          <p>Built with care across the stack</p>
          <ul>
            {proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section
          className="case-study section-shell"
          id="contractlens"
          aria-labelledby="contractlens-title"
        >
          <div className="section-kicker">
            <span>01 / Featured build</span>
            <span className="build-status">
              <i /> Active development
            </span>
          </div>

          <div className="case-heading">
            <div>
              <p className="mono-label">ContractLens</p>
              <h2 id="contractlens-title">
                A breaking API change shouldn’t be a surprise.
              </h2>
            </div>
            <div className="case-heading-copy">
              <p>
                ContractLens captures a live API response as a baseline,
                infers its structure and compares later responses to surface
                meaningful schema drift.
              </p>
              <div className="text-links">
                <a
                  href="https://github.com/phatpanda6/contractlens/tree/main/lib/contractlens"
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspect core <ExternalArrow />
                </a>
                <a
                  href="https://github.com/phatpanda6/contractlens/tree/main/lib/contractlens/__tests__"
                  target="_blank"
                  rel="noreferrer"
                >
                  View tests <ExternalArrow />
                </a>
                <a href="#case-status">See build status ↓</a>
              </div>
            </div>
          </div>

          <div className="evidence-grid">
            {evidence.map((item) => (
              <article className="evidence-card" key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="pipeline-block">
            <div className="pipeline-heading">
              <div>
                <p className="mono-label">The system</p>
                <h3>From response to decision</h3>
              </div>
              <p>
                Solid nodes are implemented. The live edge is the persisted
                run workflow; AI explanation stays deliberately last.
              </p>
            </div>
            <ol className="pipeline" aria-label="ContractLens processing pipeline">
              {pipeline.map((item, index) => (
                <li data-state={item.state} key={item.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>

          <blockquote className="principle-quote">
            <span aria-hidden="true">“</span>
            <p>
              AI can explain the impact. Deterministic code decides whether
              the contract passes or fails.
            </p>
          </blockquote>

          <div className="status-grid" id="case-status">
            <article>
              <p className="status-label status-complete">Built</p>
              <h3>The comparison core</h3>
              <ul>
                <li>Schema inference from JSON values</li>
                <li>Nested object and array comparison</li>
                <li>Missing, new and type-changed fields</li>
                <li>36 automated tests passing</li>
              </ul>
            </article>
            <article>
              <p className="status-label status-active">Building now</p>
              <h3>One persisted workflow</h3>
              <ul>
                <li>First-run baseline capture complete</li>
                <li>Persisted TestRun history in progress</li>
                <li>Deterministic PASS / FAIL results</li>
                <li>Reloadable result history</li>
              </ul>
            </article>
            <article>
              <p className="status-label status-next">Next</p>
              <h3>Reliable public demo</h3>
              <ul>
                <li>Hardened endpoint fetching</li>
                <li>Continuous integration</li>
                <li>Seeded two-minute demo</li>
                <li>AI explanation after the core</li>
              </ul>
            </article>
          </div>
        </section>

        <section
          className="selected-work section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-kicker">
            <span>Selected work</span>
            <span>Supporting builds</span>
          </div>
          <div className="work-heading">
            <h2 id="work-title">Different problems. Same end-to-end mindset.</h2>
            <p>
              Earlier projects that helped me learn data modelling, API design
              and responsive interface work.
            </p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div
                  className={"project-visual project-visual-" + project.visual}
                  aria-hidden="true"
                >
                  <div className="mock-window-bar">
                    <i /><i /><i />
                    <span>
                      {project.visual === "table"
                        ? "workspace / records"
                        : "players / search"}
                    </span>
                  </div>
                  {project.visual === "table" ? (
                    <div className="mock-table">
                      <div className="mock-table-head">
                        <span>Name</span><span>Status</span><span>Owner</span>
                      </div>
                      <div><b>Product research</b><em>In progress</em><span>AH</span></div>
                      <div><b>Design system</b><em>Complete</em><span>JL</span></div>
                      <div><b>API integration</b><em>Review</em><span>MR</span></div>
                    </div>
                  ) : (
                    <div className="mock-player">
                      <div className="mock-player-avatar">23</div>
                      <div>
                        <small>PLAYER PROFILE</small>
                        <strong>LeBron James</strong>
                        <span>Los Angeles Lakers · Forward</span>
                        <ul>
                          <li>6&apos;9&quot;</li>
                          <li>250 lbs</li>
                          <li>2003 draft</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="project-content">
                  <p className="project-index">{project.index} / Project</p>
                  <p className="mono-label">{project.label}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul
                    className="tag-list"
                    aria-label={project.title + " technologies"}
                  >
                    {project.stack.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    <a href={project.live} target="_blank" rel="noreferrer">
                      Open project <ExternalArrow />
                    </a>
                    <a href={project.source} target="_blank" rel="noreferrer">
                      Source <ExternalArrow />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="about section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-heading">
            <p className="mono-label">How I work</p>
            <h2 id="about-title">
              Curious enough to dig in. Careful enough to verify.
            </h2>
          </div>
          <div className="about-copy">
            <p>
              I’m a self-taught developer who enjoys turning ambiguous product
              problems into small, testable features. I care about readable
              code, useful tests and understanding every line I ship—including
              code developed with AI assistance.
            </p>
          </div>
          <div className="principles-grid">
            {principles.map((principle, index) => (
              <article key={principle.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="contact section-shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <p className="mono-label">Let’s build something useful</p>
          <h2 id="contact-title">
            Looking for a full-stack developer who thinks beyond the happy
            path?
          </h2>
          <p>
            I’m open to full-stack software engineering opportunities in
            Melbourne and Sydney.
          </p>
          <div className="contact-actions">
            <a
              className="button button-primary"
              href="mailto:ahuang24365@gmail.com"
            >
              Start a conversation <ExternalArrow />
            </a>
            <a
              className="button button-secondary"
              href="https://www.linkedin.com/in/alan-huang-943257244/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ExternalArrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 Alan Huang</p>
        <div>
          <a href="mailto:ahuang24365@gmail.com">Email</a>
          <a href="https://github.com/phatpanda6" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/alan-huang-943257244/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}

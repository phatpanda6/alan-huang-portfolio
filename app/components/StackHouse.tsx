"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  contribution,
  featuredProjectId,
  moreProjectIds,
  projects,
  type Project,
} from "../projects";
import { contactEmail, themeVars } from "../theme";
import dinerStill from "../../public/diner/diner-still.webp";
import { canCreateWebGLContext } from "../webgl";

const Restaurant = dynamic(() => import("./Restaurant"), {
  ssr: false,
  loading: () => (
    <div className="room scene-fallback" role="status">
      Loading the diner… <a href="#menu">View selected work</a>
    </div>
  ),
});

const github = "https://github.com/phatpanda6";
const linkedin = "https://www.linkedin.com/in/alan-huang-943257244/";
const email = `mailto:${contactEmail}`;
const Arrow = () => <span aria-hidden="true">↗</span>;

function Brand() {
  return (
    <a className="house-brand" href="#top">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        Alan Huang <small>Stack House</small>
      </span>
    </a>
  );
}

function Tags({ project }: { project: Project }) {
  return (
    <ul className="house-tags" aria-label={`${project.title} technologies`}>
      {project.stack.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Evidence({ project }: { project: Project }) {
  return (
    <div className="project-evidence">
      <span className="tiny-label">{project.evidence.label}</span>
      <p>{project.evidence.detail}</p>
    </div>
  );
}

function Stats({ project }: { project: Project }) {
  if (!project.stats) return null;
  return (
    <dl className="project-stats">
      {project.stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectCard({
  project: p,
  wide = false,
  onSelect,
}: {
  project: Project;
  wide?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <article
      className={
        wide
          ? `menu-item menu-item-wide${p.image ? " has-shot" : ""}`
          : "menu-item"
      }
    >
      <div className="item-top">
        <span className="item-number">{p.number}</span>
        <span className="tiny-label">{p.category}</span>
      </div>
      <h3>{p.title}</h3>
      <p>{p.description}</p>
      {wide && p.image && (
        <figure className="item-shot">
          <Image
            src={p.image.src}
            alt={p.image.alt}
            sizes="(max-width: 43rem) 100vw, 34rem"
          />
        </figure>
      )}
      <Evidence project={p} />
      <Tags project={p} />
      <div className="item-bottom">
        <button
          aria-label={`Read about ${p.title}`}
          onClick={() => onSelect(p.id)}
        >
          Details <span aria-hidden="true">→</span>
        </button>
        <span className="item-links">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              aria-label={`Try ${p.title} live`}
            >
              Live demo <Arrow />
            </a>
          )}
          {p.source && (
            <a
              href={p.source}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${p.title} source code`}
            >
              Source <Arrow />
            </a>
          )}
        </span>
      </div>
    </article>
  );
}

function SampleCheck() {
  const [changed, setChanged] = useState(false);
  const baseline = 89.99;
  const candidate = changed ? "89.99" : 89.99;
  const failed = typeof baseline !== typeof candidate;
  return (
    <div className="sample-check">
      <div className="sample-head">
        <span>
          <i aria-hidden="true" /> CONTRACT CHECK
        </span>
        <b data-failed={failed}>{failed ? "FAIL" : "PASS"}</b>
      </div>
      <div className="sample-body">
        <p className="tiny-label">RESPONSE SHAPE / PRODUCTS API</p>
        <div className="sample-code">
          <div>
            <span>Baseline</span>
            <code>
              price: <b>{JSON.stringify(baseline)}</b>
            </code>
          </div>
          <div data-changed={failed}>
            <span>Candidate</span>
            <code>
              price: <b>{JSON.stringify(candidate)}</b>
            </code>
          </div>
        </div>
        <p className="sample-result" role="status">
          {failed
            ? "Breaking change: price is now a string. A storefront expecting a number could fail."
            : "Both responses return a number. The price contract passes this check."}
        </p>
        <button className="sample-action" onClick={() => setChanged(!changed)}>
          {changed ? "Restore numeric price" : "Simulate a breaking change"}{" "}
          <span aria-hidden="true">{changed ? "↺" : "→"}</span>
        </button>
        <p className="sample-caption">
          Interactive example · runs in this page
        </p>
      </div>
    </div>
  );
}

export function StackHouse() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [room, setRoom] = useState<
    "poster" | "open" | "unsupported" | "failed"
  >("poster");
  const showRoom = room === "open";
  const roomNotice =
    room === "unsupported"
      ? "3D is unavailable in this browser. Try opening the site in a browser with WebGL 2 enabled."
      : room === "failed"
        ? "The 3D diner stopped loading or lost graphics access. You can retry or browse the projects."
        : null;
  const dinerFrame = useRef<HTMLDivElement>(null);
  const dinerButton = useRef<HTMLButtonElement>(null);
  const handleRoomUnavailable = useCallback(() => {
    if (dinerFrame.current?.contains(document.activeElement))
      dinerButton.current?.focus();
    setRoom("failed");
  }, []);
  const dialog = useRef<HTMLDialogElement>(null);
  const feature =
    projects.find((p) => p.id === featuredProjectId) ?? projects[0];
  useEffect(() => {
    const element = dialog.current;
    if (selected && element && !element.open) element.showModal();
    else if (!selected && element?.open) element.close();
  }, [selected]);
  // Load the 3D scene (or show why it can't load) and bring it into view.
  function openDiner() {
    setRoom(canCreateWebGLContext() ? "open" : "unsupported");
    // Wait for the taller scene frame to replace the poster before scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        dinerFrame.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        }),
      ),
    );
  }
  function select(id: string) {
    setSelected(projects.find((p) => p.id === id) ?? null);
  }
  const rest = projects.filter((p) => p.id !== feature.id);
  const mainProjects = rest.filter((p) => !moreProjectIds.includes(p.id));
  const moreProjects = rest.filter((p) => moreProjectIds.includes(p.id));

  return (
    <div className="stack-house" id="top" style={themeVars as CSSProperties}>
      <a className="house-skip" href="#main-content">
        Skip to content
      </a>
      <header className="house-header">
        <div className="header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#menu">Work</a>
            <a href="#diner">3D diner</a>
            <a href="#about">About</a>
          </nav>
          <a className="header-contact" href={email}>
            Contact <Arrow />
          </a>
        </div>
      </header>
      <main id="main-content">
        <section className="house-intro shell" aria-labelledby="intro-title">
          <p className="intro-role">
            <i /> ALAN HUANG <span>·</span> FULL-STACK DEVELOPER
          </p>
          <h1 id="intro-title">
            Software that
            <br />
            <em>holds up.</em>
          </h1>
          <p className="intro-description">
            I build tested TypeScript applications end to end. ContractLens, my
            API change checker, is backed by 165 automated tests and CI, and
            I’ve had a fix merged into an open-source React project.
          </p>
          <p className="intro-meta">
            Melbourne <span aria-hidden="true">·</span> Australian citizen{" "}
            <span aria-hidden="true">·</span> Open to full-stack roles in
            Melbourne and Sydney
          </p>
          <div className="hero-actions">
            <a className="house-button" href="#menu">
              Explore my work <span aria-hidden="true">↓</span>
            </a>
            <a
              className="secondary-button"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
          </div>
          <button
            type="button"
            className="hero-teaser"
            onClick={openDiner}
            aria-label="Step inside the 3D diner. Loads an interactive 3D scene of the projects."
          >
            <Image
              src={dinerStill}
              alt=""
              sizes="(max-width: 43rem) 100vw, 58rem"
              placeholder="blur"
              priority
            />
            <span className="hero-teaser-label">
              <span>
                <i aria-hidden="true" /> Interactive 3D portfolio
              </span>
              <b>
                Step inside the diner <span aria-hidden="true">→</span>
              </b>
            </span>
          </button>
        </section>

        <section
          id="menu"
          className="project-menu shell"
          aria-labelledby="menu-title"
        >
          <div className="section-heading">
            <div>
              <p className="tiny-label">01 / THE PROJECT MENU</p>
              <h2 id="menu-title">Selected work</h2>
            </div>
            <p>What I built, how it works, and the decisions behind it.</p>
          </div>
          <article className="special">
            <div className="special-copy">
              <p className="feature-label">
                <i /> FEATURED PROJECT <span> / {feature.category}</span>
              </p>
              <h3>{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Evidence project={feature} />
              <Stats project={feature} />
              <Tags project={feature} />
              <div className="project-actions">
                <button
                  className="house-button"
                  onClick={() => select(feature.id)}
                >
                  Read case study <span aria-hidden="true">→</span>
                </button>
                {feature.live && (
                  <a href={feature.live} target="_blank" rel="noreferrer">
                    Try live app <Arrow />
                  </a>
                )}
                {feature.walkthrough && (
                  <a
                    href={feature.walkthrough}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch walkthrough <Arrow />
                  </a>
                )}
              </div>
            </div>
            <div className="feature-visual">
              {feature.id === "contractlens" ? (
                <SampleCheck />
              ) : (
                <div className="sample-check sample-body">
                  <span className="tiny-label">{feature.category}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.tagline}</p>
                </div>
              )}
            </div>
          </article>
          {mainProjects.map((p) => (
            <ProjectCard key={p.id} project={p} wide onSelect={select} />
          ))}
          <article className="contribution" id="open-source">
            <div>
              <p className="feature-label">
                <i /> OPEN-SOURCE CONTRIBUTION <span> / Merged</span>
              </p>
              <h3>
                {contribution.project} <span>PR {contribution.pull}</span>
              </h3>
              <p className="contribution-summary">{contribution.summary}</p>
              <p>{contribution.detail}</p>
              <ul
                className="house-tags"
                aria-label={`${contribution.project} technologies`}
              >
                {contribution.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <a
              className="secondary-button"
              href={contribution.url}
              target="_blank"
              rel="noreferrer"
            >
              View merged PR <Arrow />
            </a>
          </article>
          <h3 className="more-heading tiny-label">More projects</h3>
          <div className="menu-grid">
            {moreProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={select} />
            ))}
          </div>
        </section>

        <section
          id="diner"
          className="experience shell"
          aria-labelledby="diner-title"
        >
          <div className="section-heading">
            <div>
              <p className="tiny-label">02 / THE INTERACTIVE PORTFOLIO</p>
              <h2 id="diner-title">Step into Stack House.</h2>
            </div>
            <p>
              A playable diner built with React Three Fiber. Walk up to the menu
              boards to explore the same projects.
            </p>
          </div>
          <div className="experience-frame" id="diner-scene" ref={dinerFrame}>
            {showRoom ? (
              <Restaurant
                onSelect={select}
                onUnavailable={handleRoomUnavailable}
              />
            ) : (
              <div className="diner-poster">
                <Image
                  className="diner-still"
                  src={dinerStill}
                  alt="Inside the Stack House diner: a panda in a red jacket faces the counter, with milkshakes on the booths and project menu boards on the wall."
                  sizes="(max-width: 43rem) 100vw, 73rem"
                  placeholder="blur"
                />
                <span className="poster-label">
                  <i /> STACK HOUSE / 3D
                </span>
              </div>
            )}
          </div>
          {roomNotice && (
            <div className="diner-notice">
              <p role="status">{roomNotice}</p>
              <a href="#menu">
                Browse selected work <span aria-hidden="true">↑</span>
              </a>
            </div>
          )}
          <div className="experience-bottom">
            <p>Optional experience · keyboard and touch controls</p>
            <button
              ref={dinerButton}
              className={showRoom ? "secondary-button" : "house-button"}
              aria-expanded={showRoom}
              aria-controls="diner-scene"
              onClick={() => (showRoom ? setRoom("poster") : openDiner())}
            >
              {showRoom
                ? "Close 3D scene"
                : roomNotice
                  ? "Retry 3D"
                  : "Load the 3D diner"}{" "}
              <span aria-hidden="true">{showRoom ? "×" : "→"}</span>
            </button>
          </div>
        </section>

        <section
          id="about"
          className="maker shell"
          aria-labelledby="maker-title"
        >
          <div>
            <p className="tiny-label">03 / ABOUT ME</p>
            <h2 id="maker-title">Across the stack.</h2>
          </div>
          <div>
            <p>
              I’m Alan, a full-stack developer in Melbourne. I like tracing a
              problem all the way from the interface to the data and back, then
              proving the fix with tests.
            </p>
            <p>
              I ship complete workflows, test what matters and write down the
              trade-offs, including the results that didn’t go my way. I’m
              looking for a full-stack role where I can build useful product
              features and keep them reliable as they grow.
            </p>
            <a href={linkedin} target="_blank" rel="noreferrer">
              Connect on LinkedIn <Arrow />
            </a>
          </div>
        </section>

        <section id="contact" className="house-contact shell">
          <div>
            <p className="tiny-label">AVAILABLE FOR FULL-STACK ROLES</p>
            <h2>Let’s talk.</h2>
          </div>
          <a className="house-button" href={email}>
            {contactEmail} <Arrow />
          </a>
        </section>
      </main>
      <footer className="house-footer shell">
        <Brand />
        <p>Designed and built by Alan Huang</p>
        <div>
          <a href={github} target="_blank" rel="noreferrer">
            GitHub <Arrow />
          </a>
          <a href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Arrow />
          </a>
          <a href="#top">Top ↑</a>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="project-dialog"
        aria-label={selected?.title ?? "Project details"}
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === dialog.current) setSelected(null);
        }}
      >
        {selected && (
          <div className="dialog-inner">
            <button
              className="dialog-close"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
            >
              ×
            </button>
            <p className="tiny-label">
              {selected.number} / {selected.category}
            </p>
            <h2>{selected.title}</h2>
            <p className="dialog-tagline">{selected.tagline}</p>
            <p>{selected.description}</p>
            <Tags project={selected} />
            {selected.image && (
              <figure className="dialog-shot">
                <Image
                  src={selected.image.src}
                  alt={selected.image.alt}
                  sizes="(max-width: 43rem) 100vw, 40rem"
                />
                <figcaption>{selected.image.caption}</figcaption>
              </figure>
            )}
            <Evidence project={selected} />
            <Stats project={selected} />
            <h3>How it works</h3>
            <ul className="project-highlights">
              {selected.highlights.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="project-note">{selected.note}</p>
            <div className="dialog-links">
              {selected.live && (
                <a
                  className="house-button"
                  href={selected.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open live project <Arrow />
                </a>
              )}
              {selected.source && (
                <a href={selected.source} target="_blank" rel="noreferrer">
                  View source <Arrow />
                </a>
              )}
              {selected.walkthrough && (
                <a
                  href={selected.walkthrough}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch walkthrough <Arrow />
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

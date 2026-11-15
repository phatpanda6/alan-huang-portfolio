"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { featuredProjectId, projects, type Project } from "../projects";
import { contactEmail, themeVars } from "../theme";

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
const walkthrough =
  "https://www.loom.com/share/789d89b95aa64d328a32f2c0d16136d5";
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

function DinerIllustration() {
  return (
    <svg
      className="diner-illustration"
      viewBox="0 0 720 360"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="diner-wall" x2="0" y2="1">
          <stop stopColor="var(--white)" />
          <stop offset="1" stopColor="var(--steel)" />
        </linearGradient>
        <linearGradient id="diner-floor" x2="0" y2="1">
          <stop stopColor="var(--tile)" />
          <stop offset="1" stopColor="var(--paper)" />
        </linearGradient>
      </defs>
      <path d="M0 0H720V360H0Z" fill="url(#diner-wall)" />
      <path d="M0 224 180 163H540L720 224V360H0Z" fill="url(#diner-floor)" />
      <path
        d="M0 35 180 82V163L0 224ZM720 35 540 82V163L720 224Z"
        fill="var(--sky)"
      />
      <path d="M180 82H540V180H180Z" fill="var(--paper)" />
      <path
        d="M0 208 180 156H540L720 208"
        fill="none"
        stroke="var(--red)"
        strokeWidth="9"
      />
      <path
        d="M80 360 239 176M239 360 310 176M481 360 410 176M640 360 481 176M0 260H720M0 310H720"
        fill="none"
        stroke="var(--white)"
        strokeOpacity=".65"
        strokeWidth="2"
      />
      <path d="M181 180H539L557 199H163Z" fill="var(--steel)" />
      <path d="M163 199H557V244H163Z" fill="var(--white)" />
      <path d="M163 204H557V212H163Z" fill="var(--red)" />
      {[210, 289, 368, 447].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="112"
            width="63"
            height="47"
            rx="3"
            fill="var(--white)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <path
            d={`M${x + 12} 130h39m-39 9h24`}
            stroke="var(--red)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect
        x="285"
        y="76"
        width="150"
        height="25"
        rx="4"
        fill="var(--accent)"
      />
      <text
        x="360"
        y="93"
        textAnchor="middle"
        fill="var(--white)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
      >
        STACK HOUSE
      </text>
      <path
        d="M0 248 97 219V259L0 298ZM720 248 623 219V259L720 298Z"
        fill="var(--accent)"
      />
      <path
        d="M0 292 111 255 151 272 0 335ZM720 292 609 255 569 272 720 335Z"
        fill="var(--red)"
      />
      <path
        d="M41 262 134 231 197 248 101 288ZM679 262 586 231 523 248 619 288Z"
        fill="var(--white)"
      />
      <ellipse
        cx="360"
        cy="325"
        rx="40"
        ry="10"
        fill="var(--ink)"
        opacity=".18"
      />
      <path d="M338 286h17v38h-17zm27 0h17v38h-17z" fill="var(--ink)" />
      <rect x="326" y="248" width="68" height="54" rx="24" fill="var(--red)" />
      <rect x="350" y="269" width="20" height="15" rx="4" fill="var(--gold)" />
      <circle cx="332" cy="225" r="13" fill="var(--ink)" />
      <circle cx="388" cy="225" r="13" fill="var(--ink)" />
      <ellipse cx="360" cy="241" rx="34" ry="29" fill="var(--white)" />
    </svg>
  );
}

export function StackHouse() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showRoom, setShowRoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const feature =
    projects.find((p) => p.id === featuredProjectId) ?? projects[0];
  useEffect(() => {
    const element = dialog.current;
    if (selected && element && !element.open) element.showModal();
    else if (!selected && element?.open) element.close();
  }, [selected]);
  function select(id: string) {
    setSelected(projects.find((p) => p.id === id) ?? null);
  }

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
            I build interfaces, APIs and the systems behind them. Based in
            Australia, open to full-stack roles in Melbourne and Sydney.
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
          <div className="menu-grid">
            {projects
              .filter((p) => p.id !== feature.id)
              .map((p) => (
                <article className="menu-item" key={p.id}>
                  <div className="item-top">
                    <span className="item-number">{p.number}</span>
                    <span className="tiny-label">{p.category}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <Evidence project={p} />
                  <Tags project={p} />
                  <div className="item-bottom">
                    <button
                      aria-label={`Read about ${p.title}`}
                      onClick={() => select(p.id)}
                    >
                      Details <span aria-hidden="true">→</span>
                    </button>
                    {p.source ? (
                      <a href={p.source} target="_blank" rel="noreferrer" aria-label={`View ${p.title} source code`}>
                        Source <Arrow />
                      </a>
                    ) : p.live ? (
                      <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Try ${p.title} live`}>
                        Live demo <Arrow />
                      </a>
                    ) : null}
                  </div>
                </article>
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
          <div className="experience-frame" id="diner-scene">
            {showRoom ? (
              <Restaurant onSelect={select} />
            ) : (
              <div className="diner-poster">
                <DinerIllustration />
                <span className="poster-label">
                  <i /> STACK HOUSE / 3D
                </span>
              </div>
            )}
          </div>
          <div className="experience-bottom">
            <p>Optional experience · keyboard and touch controls</p>
            <button
              className={showRoom ? "secondary-button" : "house-button"}
              aria-expanded={showRoom}
              aria-controls="diner-scene"
              onClick={() => setShowRoom(!showRoom)}
            >
              {showRoom ? "Close 3D scene" : "Load the 3D diner"}{" "}
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
              I’m Alan. I like tracing a problem all the way from the interface
              to the data and back. My projects are how I practise shipping
              complete workflows, testing what matters, and explaining the
              trade-offs.
            </p>
            <p>
              I’m looking for my first full-stack developer role. I’m especially
              interested in building useful product features and making them
              reliable as they grow.
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
            <Evidence project={selected} />
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
              {selected.id === "contractlens" && (
                <a href={walkthrough} target="_blank" rel="noreferrer">
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

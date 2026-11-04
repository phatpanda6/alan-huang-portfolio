"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { featuredProjectId, projects, type Project } from "../projects";
const Restaurant = dynamic(() => import("./Restaurant"), {
  ssr: false,
  loading: () => (
    <div className="room scene-fallback">
      Warming up the grill…<a href="#menu">View the project menu ↓</a>
    </div>
  ),
});
const Arrow = () => <span aria-hidden="true">↗</span>;
function BurgerMark() {
  return (
    <span className="burger-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
function SampleCheck() {
  const [changed, setChanged] = useState(false);
  return (
    <div className="sample-check">
      <div className="sample-head">
        <span>INTERACTIVE EXAMPLE</span>
        <b data-failed={changed}>{changed ? "FAIL" : "PASS"}</b>
      </div>
      <code>
        baseline.price <span>89.99</span>
      </code>
      <code>
        latest.price <span>{changed ? '"89.99"' : "89.99"}</span>
      </code>
      <p role="status">
        {changed
          ? "Price changed from number to string. A frontend expecting a number may break."
          : "The price types match. No breaking change in this example."}
      </p>
      <button className="house-button" onClick={() => setChanged(!changed)}>
        {changed ? "Restore compatible response" : "Ship a breaking change"}{" "}
        <Arrow />
      </button>
    </div>
  );
}
export function StackHouse() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showRoom, setShowRoom] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const feature =
    projects.find((p) => p.id === featuredProjectId) ?? projects[0];
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  function select(id: string) {
    setSelected(projects.find((p) => p.id === id) ?? null);
  }
  return (
    <div className="stack-house">
      <a className="house-skip" href="#main-content">
        Skip to content
      </a>
      <header className="house-header">
        <a className="house-brand" href="#">
          <BurgerMark />
          <span>
            ALAN’S
            <br />
            <b>STACK HOUSE</b>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#menu">The work</a>
          <a href="#about">The maker</a>
          <a className="header-contact" href="mailto:ahuang24365@gmail.com">
            Say hello <Arrow />
          </a>
        </nav>
      </header>
      <main id="main-content">
        <section className="house-intro" aria-labelledby="intro-title">
          <div>
            <p className="tiny-label">ALAN HUANG / FULL-STACK DEVELOPER</p>
            <h1 id="intro-title">
              Good software.
              <br />
              <em>Made from scratch.</em>
            </h1>
          </div>
          <div className="intro-aside">
            <p>
              I build across interfaces, APIs and databases. Come in, look
              around, and see what’s cooking.
            </p>
            <span>
              <i /> Open to roles in Melbourne & Sydney
            </span>
          </div>
        </section>
        <section
          className="experience"
          aria-label="Explore the portfolio restaurant"
        >
          <div className="experience-top">
            <span>
              <i /> INTERACTIVE PORTFOLIO — FIRST DRAFT
            </span>
            <button onClick={() => setShowRoom(!showRoom)}>
              {showRoom ? "Hide 3D / less motion" : "Show 3D restaurant"}
            </button>
          </div>
          {showRoom ? (
            <Restaurant onSelect={select} />
          ) : (
            <div className="quiet-room">
              <BurgerMark />
              <h2>
                All the good stuff.
                <br />
                Right on the menu.
              </h2>
              <a className="house-button" href="#menu">
                View projects ↓
              </a>
            </div>
          )}
          <div className="experience-bottom">
            <span>Walk in. Look around. Pick a project.</span>
            <a href="#menu">Prefer the menu? All projects below ↓</a>
          </div>
        </section>
        <div className="house-marquee" aria-label="Development interests">
          <span>INTERFACES WITH INTENT</span>
          <b>✳</b>
          <span>APIS THAT MAKE SENSE</span>
          <b>✳</b>
          <span>CARE AT EVERY LAYER</span>
          <b>✳</b>
          <span>ALWAYS LEARNING</span>
        </div>
        <section
          id="menu"
          className="project-menu"
          aria-labelledby="menu-title"
        >
          <div className="menu-heading">
            <div>
              <p className="tiny-label">THE PROJECT MENU</p>
              <h2 id="menu-title">
                Something for
                <br />
                <em>every layer.</em>
              </h2>
            </div>
            <p>
              A selection of things I’ve built, problems I’ve worked through,
              and tools I’m learning. Pick one for the full story.
            </p>
          </div>
          <article className="special">
            <div className="special-art" aria-hidden="true">
              <div className="plate">
                <div className="css-burger">
                  <i className="bun-top" />
                  <i className="lettuce" />
                  <i className="tomato" />
                  <i className="cheese" />
                  <i className="patty" />
                  <i className="bun-bottom" />
                </div>
              </div>
              <span className="special-seal">
                THE HOUSE
                <br />
                <b>SPECIAL</b>
                <br />№ {feature.number}
              </span>
              <span className="art-caption">
                A LITTLE CURIOSITY. A LOT OF LAYERS.
              </span>
            </div>
            <div className="special-copy">
              <span className="tiny-label">
                FEATURED PROJECT / {feature.category.toUpperCase()}
              </span>
              <h3>{feature.title}</h3>
              <p className="special-tagline">{feature.tagline}</p>
              <p>{feature.description}</p>
              <ul
                className="house-tags"
                aria-label="Featured project technologies"
              >
                {feature.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="special-actions">
                <button
                  className="house-button"
                  onClick={() => select(feature.id)}
                >
                  Explore the project <Arrow />
                </button>
                {feature.live && (
                  <a href={feature.live} target="_blank" rel="noreferrer">
                    Live demo <Arrow />
                  </a>
                )}
              </div>
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
                  <ul
                    className="house-tags"
                    aria-label={`${p.title} technologies`}
                  >
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="item-bottom">
                    <button onClick={() => select(p.id)}>
                      Take a closer look <Arrow />
                    </button>
                    <a
                      href={p.source}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${p.title} source code`}
                    >
                      GitHub <Arrow />
                    </a>
                  </div>
                </article>
              ))}
          </div>
        </section>
        <section id="about" className="maker" aria-labelledby="maker-title">
          <div className="maker-badge" aria-hidden="true">
            <BurgerMark />
            <span>
              CURIOUS MIND
              <br />
              <b>CAREFUL HANDS</b>
            </span>
            <small>ALAN HUANG / AUSTRALIA</small>
          </div>
          <div>
            <p className="tiny-label">MEET THE MAKER</p>
            <h2 id="maker-title">
              A good result starts
              <br />
              with <em>good questions.</em>
            </h2>
            <p>
              I’m Alan, a full-stack developer who likes understanding how the
              whole thing works. I build interfaces, trace requests through
              APIs, and work with the data behind them.
            </p>
            <p>
              My projects are how I practise: small, complete workflows, useful
              tests, and decisions I can explain. Right now, I’m looking for my
              first full-stack developer role in Melbourne or Sydney.
            </p>
            <a
              href="https://github.com/phatpanda6"
              target="_blank"
              rel="noreferrer"
            >
              See what I’m building on GitHub <Arrow />
            </a>
          </div>
        </section>
        <section className="house-contact" id="contact">
          <span className="tiny-label">THERE’S ALWAYS ROOM AT THE TABLE</span>
          <h2>
            Got something
            <br />
            <em>good cooking?</em>
          </h2>
          <a className="house-button cream" href="mailto:ahuang24365@gmail.com">
            Let’s talk <Arrow />
          </a>
          <a className="email-link" href="mailto:ahuang24365@gmail.com">
            ahuang24365@gmail.com
          </a>
        </section>
      </main>
      <footer className="house-footer">
        <a className="house-brand" href="#">
          <BurgerMark />
          <span>
            ALAN’S
            <br />
            <b>STACK HOUSE</b>
          </span>
        </a>
        <p>A portfolio by Alan Huang · 2026</p>
        <div>
          <a
            href="https://github.com/phatpanda6"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <a
            href="https://www.linkedin.com/in/alan-huang-943257244/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <Arrow />
          </a>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-label={selected?.title ?? "Project details"}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setSelected(null);
        }}
      >
        {selected && (
          <div className="dialog-inner">
            <button
              className="dialog-close"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
            >
              ✕
            </button>
            <span className="tiny-label">
              ORDER № {selected.number} / {selected.category}
            </span>
            <h2>{selected.title}</h2>
            <p className="dialog-tagline">{selected.tagline}</p>
            <p>{selected.description}</p>
            <ul className="house-tags">
              {selected.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3>What’s inside</h3>
            <ul className="project-highlights">
              {selected.highlights.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {selected.id === "contractlens" && <SampleCheck />}
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
              <a href={selected.source} target="_blank" rel="noreferrer">
                View source <Arrow />
              </a>
              {selected.id === "contractlens" && (
                <a
                  href="https://www.loom.com/share/789d89b95aa64d328a32f2c0d16136d5"
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

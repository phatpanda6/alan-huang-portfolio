"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";

type JsonLine = {
  number: number;
  content: string;
  tone?: "removed" | "added" | "changed";
};

const baselineLines: JsonLine[] = [
  { number: 1, content: "{" },
  { number: 2, content: '  "id": "p_123",' },
  { number: 3, content: '  "title": "Nike Hoodie",', tone: "removed" },
  { number: 4, content: '  "price": 89.99,', tone: "changed" },
  { number: 5, content: '  "inStock": true' },
  { number: 6, content: "}" },
];

const latestLines: JsonLine[] = [
  { number: 1, content: "{" },
  { number: 2, content: '  "id": "p_123",' },
  { number: 3, content: '  "name": "Nike Hoodie",', tone: "added" },
  { number: 4, content: '  "price": "89.99",', tone: "changed" },
  { number: 5, content: '  "inStock": true' },
  { number: 6, content: "}" },
];

function JsonCode({ lines }: { lines: JsonLine[] }) {
  return (
    <code>
      {lines.map((line) => (
        <span
          className={
            line.tone ? "json-line json-" + line.tone : "json-line"
          }
          key={line.number}
        >
          <i>{line.number}</i>
          <b>{line.content}</b>
        </span>
      ))}
    </code>
  );
}

export function DriftLens() {
  const [scan, setScan] = useState(54);
  const dragging = useRef(false);

  function updateFromPointer(element: HTMLDivElement, clientX: number) {
    const bounds = element.getBoundingClientRect();
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setScan(Math.min(96, Math.max(4, Math.round(next))));
  }

  return (
    <div
      className="drift-lens"
      style={{ "--scan": scan + "%" } as CSSProperties}
    >
      <div className="lens-topbar">
        <div>
          <span className="lens-mark" aria-hidden="true" />
          <strong>ContractLens / live diff</strong>
        </div>
        <span className="lens-version">ENGINE 0.1</span>
      </div>

      <div
        className="lens-viewport"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.currentTarget, event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging.current) {
            updateFromPointer(event.currentTarget, event.clientX);
          }
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <div className="json-panel json-panel-baseline" aria-hidden="true">
          <span className="json-panel-label">Baseline response</span>
          <JsonCode lines={baselineLines} />
        </div>

        <div className="json-panel json-panel-latest" aria-hidden="true">
          <span className="json-panel-label">Latest response</span>
          <JsonCode lines={latestLines} />
        </div>

        <div className="scan-line" aria-hidden="true">
          <span>DRIFT</span>
          <i />
        </div>
      </div>

      <label className="lens-control">
        <span>Drag the lens to compare responses</span>
        <input
          type="range"
          min="4"
          max="96"
          value={scan}
          onChange={(event) => setScan(Number(event.target.value))}
          aria-label="Reveal latest API response"
          aria-valuetext={scan + " percent of latest response revealed"}
        />
      </label>

      <div className="lens-result">
        <div className="result-status">
          <span>Result</span>
          <strong>FAIL</strong>
        </div>
        <ul aria-label="Detected schema changes">
          <li>
            <i className="diff-breaking">−</i>
            <span><b>title</b> missing</span>
            <em>breaking</em>
          </li>
          <li>
            <i className="diff-breaking">↻</i>
            <span><b>price</b> number → string</span>
            <em>breaking</em>
          </li>
          <li>
            <i className="diff-info">+</i>
            <span><b>name</b> added</span>
            <em>info</em>
          </li>
        </ul>
      </div>
    </div>
  );
}

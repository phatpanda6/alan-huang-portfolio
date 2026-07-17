import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", process.pid + "-" + Date.now());
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Alan Huang's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Alan Huang \| Full-Stack Developer<\/title>/i);
  assert.match(html, /I build software that makes invisible failures/);
  assert.match(html, /ContractLens/);
  assert.match(html, /36 passing tests/);
  assert.match(html, /Airtable Clone/);
  assert.match(html, /NBA Player Hub/);
  assert.match(html, /mailto:ahuang24365@gmail\.com/);
  assert.match(html, /Skip to content/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("removes starter assets and keeps accessibility safeguards", async () => {
  const [page, component, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/DriftLens.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<main id="main-content">/);
  assert.match(page, /aria-labelledby="contractlens-title"/);
  assert.match(component, /type="range"/);
  assert.match(component, /aria-valuetext/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", root)));
});

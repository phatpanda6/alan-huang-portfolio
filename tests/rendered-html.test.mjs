import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  return readFile(
    new URL("../.next/server/app/index.html", import.meta.url),
    "utf8",
  );
}

test("prerenders Alan Huang's portfolio", async () => {
  const html = await render();
  assert.match(html, /<title>Alan Huang \| Full-Stack Developer<\/title>/i);
  assert.match(html, /I build software that makes invisible failures/);
  assert.match(html, /ContractLens/);
  assert.match(html, /Automated testing/);
  assert.match(html, /Relational Workspace/);
  assert.match(html, /NBA Player Hub/);
  assert.match(html, /mailto:ahuang24365@gmail\.com/);
  assert.match(html, /Skip to content/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/alan-huang-portfolio\.vercel\.app\/?"/,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("makes the live ContractLens demo discoverable and keeps progress current", async () => {
  const html = await render();
  const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "Hero section is rendered");
  assert.match(hero, /href="https:\/\/contractlens-iota\.vercel\.app\/"/);
  assert.match(hero, /Try ContractLens live/);
  assert.match(html, /Open ContractLens demo/);
  assert.match(html, /shared between visitors/);
  assert.match(html, /GitHub Actions and Playwright with PostgreSQL/);
  assert.doesNotMatch(html, /Recruiter-ready public demo|Safe browser workflow/);
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
  assert.match(css, /\.case-heading-copy\s*>\s*\.button\s*{[^}]*margin:/s);
  assert.match(css, /\.status-grid\s*{[^}]*scroll-margin-top:/s);
  assert.match(layout, /export const metadata/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", root)));
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(file) {
  return readFile(new URL(file, root), "utf8");
}

test("keeps the closed mobile menu out of the tab order", async () => {
  const header = await source("components/sections/SiteHeader.tsx");
  assert.match(header, /hidden=\{!open\}/);
});

test("labels every dynamic search field", async () => {
  const skills = await source("components/skills/SkillsExplorer.tsx");
  const plugins = await source("components/sections/PluginsSection.tsx");
  const repo = await source("components/skills/RepoScan.tsx");

  assert.match(skills, /htmlFor="skills-search"/);
  assert.match(plugins, /htmlFor="plugins-search"/);
  assert.match(repo, /htmlFor="repo-results-filter"/);
});

test("keeps preset cards from nesting interactive controls inside a fake button", async () => {
  const skills = await source("components/skills/SkillsExplorer.tsx");
  assert.doesNotMatch(skills, /preset-showcase-card[\s\S]{0,500}role="button"/);
});

test("preserves list semantics for skill and plugin results", async () => {
  const skills = await source("components/skills/SkillsExplorer.tsx");
  const plugins = await source("components/sections/PluginsSection.tsx");
  assert.doesNotMatch(skills, /<ul[^>]*role="group"/);
  assert.doesNotMatch(plugins, /<ul[^>]*role="group"/);
});

test("disables non-essential motion when reduced motion is requested", async () => {
  const css = await source("css/site.css");
  const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedMotion, /\.terminal-cursor/);
  assert.match(reducedMotion, /\.repo-spinner-dot/);
  assert.match(reducedMotion, /\.repo-scanning-progress/);
});

test("keeps supported agent IDs unique", async () => {
  const ticker = await source("components/sections/AgentsTicker.tsx");
  const ids = [...ticker.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("introduces the Codex plugin immediately after the agents ticker", async () => {
  const page = await source("app/page.tsx");
  const highlight = await source("components/sections/PluginHighlight.tsx");
  const css = await source("css/site.css");

  assert.match(page, /<AgentsTicker\s*\/>\s*<PluginHighlight\s*\/>\s*<AboutSection\s*\/>/);
  assert.match(highlight, /<section[^>]*className="plugin-highlight"/);
  assert.doesNotMatch(highlight, /hero-terminal/);
  assert.match(highlight, /className="plugin-highlight-layout"/);
  assert.match(highlight, /className="plugin-highlight-cta"/);
  assert.match(highlight, /id="plugin-codex"/);
  assert.match(highlight, /href="#plugins"/);
  assert.match(css, /\.plugin-highlight\s*\{[^}]*display: grid/);
  assert.match(css, /\.plugin-highlight-layout\s*\{[^}]*grid-template-columns: minmax\(0, 0\.95fr\) minmax\(0, 1\.05fr\)/);
  assert.match(css, /\.plugin-highlight h2\s*\{[^}]*font-size: var\(--text-2xl\)/);
  assert.match(css, /\.plugin-highlight-link\s*\{[^}]*padding: 0/);
});

test("prioritizes the custom command in the installation workflow", async () => {
  const install = await source("components/sections/InstallSteps.tsx");
  assert.match(install, /className="section-header-badge"/);
  assert.match(install, /className="install-workflow process-grid"/);
  assert.match(install, /className="install-command-stage"/);
  assert.match(install, /className="install-prerequisites"/);
  assert.match(install, /Antes de começar/);
  assert.match(install, /Executar Comando Customizado/);
  assert.match(install, /Primeiro Uso — Prompts Recomendados/);
  assert.doesNotMatch(install, /className="install-step-rail"/);
});

test("keeps installation follow-up content aligned and contained", async () => {
  const install = await source("components/sections/InstallSteps.tsx");
  const css = await source("css/site.css");
  assert.match(install, /className="install-follow-up-card"/);
  assert.match(css, /\.install-follow-up-grid\s*\{[\s\S]*?display: contents/);
  assert.match(css, /\.install-command-stage,\s*\.install-prerequisites,\s*\.install-follow-up-grid\s*\{[\s\S]*?min-width: 0/);
  assert.match(css, /\.install-follow-up-card\s*\{[\s\S]*?min-width: 0/);
  assert.match(css, /\.prompt-example-card\s*\{[\s\S]*?min-width: 0/);
});

test("keeps the follow-up cards on the workflow grid rhythm", async () => {
  const css = await source("css/site.css");
  const cardRule = css.match(/\.install-follow-up-card\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(cardRule, /margin-bottom: 0/);
});

test("keeps the original prompt card hierarchy", async () => {
  const install = await source("components/sections/InstallSteps.tsx");
  const css = await source("css/site.css");
  assert.match(install, /className="prompt-examples-grid"/);
  assert.match(install, /className="prompt-example-card"/);
  assert.match(install, /className="prompt-example-text"/);
  assert.match(css, /\.prompt-examples-grid\s*\{[\s\S]*?grid-template-columns: repeat\(2/);
});

test("keeps install mode state and prerequisite scope consistent", async () => {
  const install = await source("components/sections/InstallSteps.tsx");
  assert.match(install, /if \(showAdvancedModes\) setActiveTab\("oneliner"\)/);
  assert.match(install, /AGENT_INSTALL_COMMANDS\s*\.filter/);
  assert.match(install, /className="prompt-example-text"/);
});

test("keeps the install flow below the mobile header", async () => {
  const css = await source("css/site.css");
  assert.match(css, /@media \(max-width: 768px\) \{[\s\S]*?section\s*\{[^}]*scroll-margin-top: 6rem/);
  assert.match(css, /@media \(max-width: 640px\) \{[\s\S]*?\.prompt-examples-grid\s*\{[\s\S]*?grid-template-columns: 1fr/);
});

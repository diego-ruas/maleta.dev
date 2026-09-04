import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(file) {
  return readFile(new URL(file, root), "utf8");
}

test("keeps the closed mobile menu out of the tab order", async () => {
  const header = await source("components/sections/SiteHeader.tsx");
  // inert, nao hidden: hidden traz display:none !important (base.css) e mata a
  // transicao de max-height do menu; inert tira do foco sem tocar no layout.
  assert.match(header, /inert=\{!open\}/);
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

test("uses the Codex brand icon in Codex-specific controls", async () => {
  const codexIcon = await source("components/icons/codex.tsx");
  const explorer = await source("components/skills/SkillsExplorer.tsx");
  assert.match(codexIcon, /CODEX_ICON_PATH/);
  assert.match(explorer, /CodexIcon/);
});

test("keeps a single install command sourced from the shared cart", async () => {
  const explorer = await source("components/skills/SkillsExplorer.tsx");
  const plugins = await source("components/sections/PluginsSection.tsx");
  // Plugins nao podem voltar a manter carrinho/comando proprios.
  assert.doesNotMatch(plugins, /localStorage/);
  assert.doesNotMatch(plugins, /plugin install/);
  assert.match(plugins, /useToolkit/);
  assert.match(explorer, /selectedPlugins/);
});

test("keeps the install flow below the mobile header", async () => {
  const css = await source("css/site.css");
  assert.match(css, /@media \(max-width: 768px\) \{[\s\S]*?section\s*\{[^}]*scroll-margin-top: 6rem/);
});

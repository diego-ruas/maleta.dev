import assert from "node:assert/strict";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillsDir = fileURLToPath(new URL("../../claude/skills/", import.meta.url));
const data = await readFile(new URL("../lib/data.ts", import.meta.url), "utf8");

const section = (from, to) =>
  data.slice(data.indexOf(from), to ? data.indexOf(to) : undefined);

const installable = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(`${skillsDir}${e.name}/SKILL.md`))
  .map((e) => e.name);

const skills = section("export const SKILLS", "export const PLUGIN_GROUPS");
const catalogued = [...skills.matchAll(/^ {4}name: "([^"]+)"/gm)].map((m) => m[1]);

test("catalogues every installable skill exactly once", () => {
  assert.deepEqual(
    catalogued.filter((n, i) => catalogued.indexOf(n) !== i),
    [],
  );
  assert.deepEqual(
    installable.filter((d) => !catalogued.includes(d)),
    [],
  );
  assert.deepEqual(
    catalogued.filter((n) => !installable.includes(n)),
    [],
  );
});

test("points every preset at a real skill", () => {
  const presets = section("SKILL_PRESETS", "export const SKILLS");
  const matches = [...presets.matchAll(/id: "([^"]+)"[\s\S]*?skills: \[([\s\S]*?)\]/g)];
  assert.ok(matches.length > 0);

  for (const [, id, list] of matches) {
    const referenced = [...list.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    assert.ok(referenced.length > 0, `preset ${id} is empty`);
    assert.deepEqual(
      referenced.filter((s) => !installable.includes(s)),
      [],
      `preset ${id} references missing skills`,
    );
  }
});

test("keeps skill categories and filter chips in sync", () => {
  const keys = [...section("export const CATEGORIES", "export type").matchAll(/key: "([^"]+)"/g)]
    .map((m) => m[1])
    .filter((k) => k !== "all");
  const used = [...new Set([...skills.matchAll(/category: "([^"]+)"/g)].map((m) => m[1]))];

  assert.deepEqual(used.filter((c) => !keys.includes(c)), [], "skills hidden from every filter");
  assert.deepEqual(keys.filter((k) => !used.includes(k)), [], "filter chips with no skills");
});

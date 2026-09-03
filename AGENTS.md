# AGENTS.md

Guidance for any AI agent working inside this repository. Read this first.

## What this repo is

A public, install-only collection and custom builder of AI tooling: skills, plugins, presets, and configuration for **Claude Code** (`claude/`) and **Codex** (`codex/`). Clone it or generate custom installation commands; nothing private is synced back here.

The `site/` folder is the public web application ([maleta.dev](https://maleta.dev)) — a Next.js 15 App Router app (TypeScript, `output: 'export'`) served as static HTML on Vercel. It provides a real-time **Custom AI Toolkit Builder**, allowing developers to pick presets, toggle skills, discover community GitHub skills, and copy a tailored installation one-liner (PowerShell or bash, per selected OS).

## Golden rules (do not violate)

1. **NEVER commit private data.** Excluded by `.gitignore`, but stay vigilant:
   `.claude-mem/`, `.credentials.json`, `cache/`, `sessions/`, `file-history/`,
   `shell-snapshots/`, `paste-cache/`, `node_modules/`, `.env*`.
2. **Never edit files under `claude/skills/` to personalize them.** Skills are
   copies of upstream artifacts (`anthropics/skills`, `cloudflare/skills`,
   `obra/superpowers`, etc.). Add a skill by copying it from its upstream source;
   keep the skill's own license files intact.
3. **`claude/plugins/plugins.json` and `claude/plugins/marketplaces.json` are
   static manifests** (no longer regenerated). Edit them deliberately to change
   the installed plugin set.
4. **Never store API keys, tokens, or model secrets** in any tracked file.
5. **Do not add new files to the repo root** unless they belong there
   (README, LICENSE, AGENTS.md, CLAUDE.md, .cursorrules, .windsurfrules, .clinerules, .gitignore, docs/). Tool-specific assets go in
   their own subfolder.
6. **This repo is install-only.** Do not reintroduce local→repo backup scripts
   (`sync.ps1`, `autosync.ps1`): they would push personal data into a public repo.
7. **Never commit site build artifacts.** `site/.gitignore` excludes
   `node_modules/`, `.next/`, `out/` and `next-env.d.ts` — keep it that way.
8. **Animated icons are Pixelarticons.** `site/components/icons/*.tsx` come
   from [Pixelarticons](https://pixelarticons.com) (MIT), animated with step-timing
   micro-interactions via `motion/react`. Keep them pixel-grid aligned, transparent, and consistent.
9. **NEVER use emojis.** Zero emojis in code, documentation, commit messages, or
   agent responses. Use only project Pixelarticons (`site/components/icons/*.tsx`)
   and plain-text prefixes (`//`, `~`, `->`, `*`).

## Multi-Agent Entry Points

This repository provides native entry point configurations so that any LLM/agent instantly loads repository rules:
- **Codex / Devin / Antigravity / Gemini / Zed**: Reads [`AGENTS.md`](./AGENTS.md) directly.
- **Claude Code**: Reads [`CLAUDE.md`](./CLAUDE.md) at root (references `AGENTS.md`).
- **Cursor IDE**: Reads [`.cursorrules`](./.cursorrules).
- **Windsurf (Codeium)**: Reads [`.windsurfrules`](./.windsurfrules).
- **Roo Code / Cline**: Reads [`.clinerules`](./.clinerules).
- **GitHub Copilot**: Reads [`.github/copilot-instructions.md`](./.github/copilot-instructions.md).

## graphify usage

[graphify](https://github.com/Graphify-Labs/graphify) mapeia o repositorio num
grafo consultavel (`graphify query`, `path`, `explain`) em vez de grepar
arquivo a arquivo. Instalado neste repo com escopo de projeto
(`uv tool install graphifyy` e `graphify install --project`): a skill fica em
`.claude/skills/graphify/` e os hooks `PreToolUse` em `.claude/settings.json`.

`claude/skills/` (25M de copias upstream sem edicao, regra 2) domina o ranking
com ruido de markdown, e nao pode ser gitignorado (novas skills precisam
continuar `git add`-aveis, ver "Add a new skill"). A exclusao fica em
[`.graphifyignore`](./.graphifyignore) na raiz — mesma sintaxe do `.gitignore`,
mergeado com ele e avaliado por ultimo. Nao ha flag por invocacao a lembrar.

```bash
graphify extract . --code-only   # AST local, sem API key (docs/imagens exigem backend LLM)
graphify update .                # depois de cada git pull/merge
graphify query "o que liga o instalador ao catalogo do site?"
```

`graphify hook install` (uma vez por clone) reconstroi o grafo no `git commit` e
na troca de branch. O diretorio `graphify-out/` e gitignorado; nunca commite
(cache e manifest carregam caminhos absolutos da maquina).

## Common tasks

### Install a customized environment on a machine

- **Customized One-Liner (remote/web, Windows):**
  ```powershell
  & ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @('design-taste-frontend','test-driven-development')
  ```
- **Customized One-Liner (remote/web, Linux/macOS):**
  ```bash
  curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools claude --skills design-taste-frontend,test-driven-development
  ```
- **Local clone installer (Windows):**
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/install.ps1
  ```
- **Local clone installer (Linux/macOS):**
  ```bash
  bash scripts/install.sh
  ```

Or per tool: `claude/install.ps1` / `claude/install.sh`, `codex/install.ps1` / `codex/install.sh`, `agents/install.ps1` / `agents/install.sh`.
Claude plugins are installed from their marketplaces via
`claude plugin install <id>` (`claude/plugins/plugins.json` lists them).

### Add a new skill

1. Get the skill from its upstream source (e.g. `anthropics/skills`,
   `cloudflare/skills`, `obra/superpowers`) — the folder must contain a `SKILL.md`.
2. Copy it into `claude/skills/<name>/`, keeping any `LICENSE*` files.
3. Update `site/lib/data.ts` so the website catalogue reflects the new skill.
4. Commit only the intended changes.

The Codex discovers the same skills in `~/.agents/skills`; there is no separate Codex skills folder to maintain.

### Update a skill to its latest upstream version

1. Clone/fetch the upstream repo (shallow), copy the skill folder over
   `claude/skills/<name>/` (remove stale files first), keep license files.
2. Update metadata in `site/lib/data.ts` if description or author changed.
3. Commit only the intended changes.

### Add or remove a Claude plugin

1. Edit `claude/plugins/plugins.json` (and `marketplaces.json` if the marketplace
   is new).
2. Optionally update `claude/settings.json` `enabledPlugins`.
3. Update `site/lib/data.ts` if featured in the site manifest list.
4. Commit.

### Work on the website (`site/`)

Next.js App Router (TypeScript, `output: 'export'`), no CSS framework — plain
stylesheets in `site/css/`. Deploy is automatic on Vercel.

```powershell
cd site
npm install        # once
npm run dev        # http://localhost:3000
npm run lint       # ESLint check — must pass with 0 errors
npm run build      # static export to out/ — must pass before claiming done
```

- `app/layout.tsx` — head/metadata, JetBrains Mono via `next/font/google`, global CSS.
- `app/page.tsx` — landing page assembling section components inside `ToolkitProvider`.
- `lib/toolkitContext.tsx` — shared state for active tool target, target OS (Windows/Unix), skill selections, presets, custom GitHub imports, and dynamic installer command generation.
- `lib/iconMap.ts` — category-to-Pixelarticon resolver.
- `lib/data.ts` — structured, typed catalogue of all skills, categories, presets, and plugin manifests.
- `components/sections/` — modular page sections (`Hero`, `AboutSection`, `ToolsGrid`, `SkillsSection`, `PluginsSection`, `InstallSteps`, `AgentsTicker`, `FaqSection`, `SiteHeader`, `SiteFooter`).
- `components/skills/` — interactive client components (`SkillsExplorer`, `RepoScan`, `SkillCard`) for filtering, searching, and community GitHub imports.
- `components/CopyButton.tsx` & `components/Toast.tsx` — interactive copy-to-clipboard and queued toast feedback system (`aria-live`, high-contrast states).
- `components/icons/*.tsx` — Pixelarticons (rule 8). MIT, animated with `motion/react` stepped transitions.
- `components/AnimatedIcon.tsx` — client wrapper: delegates hover from the parent button/link to the icon.
- `public/install.ps1` / `public/install.sh` — parameterized one-liner installers hosted at `https://maleta.dev/install.ps1` and `https://maleta.dev/install.sh`.
- `css/` — `base.css` (tokens), `site.css` (components), `transitions.css`.
- `DESIGN.md` — Axiom design system; keep visual changes compliant.

## Verification before claiming success

- After any change: `git status` and `git diff --stat` to confirm scope.
- After changes to `site/`: `npm run lint` and `npm run build` inside `site/` must pass.
- Confirm no private paths appear in `git ls-files`.
- Do not claim "done" until the relevant command actually ran and produced output.

## Style

- Windows scripts are PowerShell 5.1. Keep them PowerShell 5.1-compatible
  (no `&&`, no `??`, etc.).
- Linux/macOS scripts are POSIX-ish bash (`install.sh` counterparts). Keep
  them working under both `bash` and `zsh`; every `.ps1` installer must have
  a matching `.sh` doing the same thing.
- Markdown docs: README in Portuguese (user-facing); AGENTS.md/docs in English.
- No comments in code unless they clarify a non-obvious decision.
- Never use emojis anywhere. Use only Pixelarticons (`site/components/icons/*.tsx`) and text prefixes (`//`, `~`, `->`, `*`).

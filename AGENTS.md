# AGENTS.md

Guidance for any AI agent working inside this repository. Read this first.

## What this repo is

A public, install-only collection of AI tooling: skills, plugins and configuration
for **Claude Code** (`claude/`), **opencode** (`opencode/`) and **Antigravity**
(`antigravity/`). Clone it and run the installers; nothing is synced back here.

The `site/` folder is the exception: it is the public website (maleta.dev) — a
Next.js app (App Router, TypeScript, `output: 'export'`) served as static HTML
on Vercel. It is deployed, not installed.

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
4. **Never store API keys, tokens, or model secrets** in any tracked file. The
   opencode config (`opencode.jsonc`) only lists plugin references — no provider
   credentials — keep it that way.
5. **Do not add new files to the repo root** unless they belong there
   (README, LICENSE, AGENTS.md, .gitignore, docs/). Tool-specific assets go in
   their own subfolder.
6. **This repo is install-only.** Do not reintroduce local→repo backup scripts
   (`sync.ps1`, `autosync.ps1`): they would push personal data into a public repo.
7. **Never commit site build artifacts.** `site/.gitignore` excludes
   `node_modules/`, `.next/`, `out/` and `next-env.d.ts` — keep it that way.
8. **Animated icons are upstream copies.** `site/components/icons/*.tsx` come
   from [lucide-animated](https://lucide-animated.com) (MIT), same policy as
   skills: fetch from upstream, don't hand-edit or personalize them.

## Common tasks

### Install the whole environment on a machine

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

Or per tool: `claude/install.ps1`, `opencode/install.ps1`, `antigravity/install.ps1`.
Claude plugins are installed from their marketplaces via
`claude plugin install <id>` (`claude/plugins/plugins.json` lists them).

### Add a new skill

1. Get the skill from its upstream source (e.g. `anthropics/skills`,
   `cloudflare/skills`, `obra/superpowers`) — the folder must contain a `SKILL.md`.
2. Copy it into `claude/skills/<name>/`, keeping any `LICENSE*` files.
3. Commit only the intended changes.

### Update a skill to its latest upstream version

1. Clone/fetch the upstream repo (shallow), copy the skill folder over
   `claude/skills/<name>/` (remove stale files first), keep license files.
2. Commit only the intended changes.

### Add or remove a Claude plugin

1. Edit `claude/plugins/plugins.json` (and `marketplaces.json` if the marketplace
   is new).
2. Optionally update `claude/settings.json` `enabledPlugins`.
3. Commit.

### Update opencode

- Config lives in `opencode/opencode.jsonc` (plugins + MCP) and
  `opencode/opencode.json` (provider/model). Edit and run
  `opencode/install.ps1` locally to apply.

### Update global rules

- opencode: edit `opencode/AGENTS.md`; Claude Code: edit `claude/CLAUDE.md`.
- Run the respective `install.ps1` locally to apply, then commit.

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

- `app/layout.tsx` — head/metadata, self-hosted JetBrains Mono via `next/font/google`, Phosphor CDN (toasts), global CSS.
- `app/page.tsx` — landing page (server component) rendering data-driven sections from `lib/data.ts`.
- `lib/data.ts` — structured, typed catalogue of all skills, categories, and plugin manifests.
- `components/icons/*.tsx` — lucide-animated icons (rule 8). MIT, fetched from
  `https://lucide-animated.com/r/<name>.json` (`files[0].content` is the file;
  it imports the `cn` helper from `site/lib/utils.ts`).
- `components/AnimatedIcon.tsx` — client wrapper: delegates hover from the
  parent button/link to the icon (`startAnimation`/`stopAnimation`). Use it for
  every icon placed inside an interactive element.
- `public/script.js` — vanilla JS: skill filter/selection, copy buttons, repo
  scan, toasts, scroll reveal. Copy feedback toggles a `.copied` class on the
  button; CSS swaps `icon-copy` → `icon-check`.
- `css/` — `base.css` (tokens), `site.css` (components), `transitions.css`.
- `DESIGN.md` — Axiom design system; keep visual changes compliant.

## Verification before claiming success

- After any change: `git status` and `git diff --stat` to confirm scope.
- After changes to `site/`: `npm run lint` and `npm run build` inside `site/` must pass.
- Confirm no private paths appear in `git ls-files`.
- Do not claim "done" until the relevant command actually ran and produced output.

## Style

- Scripts are PowerShell 5.1 (Windows). Keep them PowerShell 5.1-compatible
  (no `&&`, no `??`, etc.).
- Markdown docs: README in Portuguese (user-facing); AGENTS.md/docs in English.
- No comments in code unless they clarify a non-obvious decision.
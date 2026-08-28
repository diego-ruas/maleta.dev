# Claude Code Instructions — maleta.dev

> Read [AGENTS.md](./AGENTS.md) for full project architecture, golden rules, and workflows.

## Overview
maleta.dev is a public, install-only collection of curated AI tooling (skills, plugins, configurations) for **Claude Code** (`claude/`), **opencode** (`opencode/`), and **Antigravity** (`antigravity/`), plus a static Next.js website (`site/`) hosted on Vercel.

## Inviolable Rules
1. **NEVER commit private data or credentials** (`.claude-mem/`, `.credentials.json`, `.env*`, sessions, tokens).
2. **Never edit files in `claude/skills/` to customize them** — they are copies of upstream artifacts.
3. **Install-only repo** — never reintroduce backup or auto-sync scripts that push local data to git.
4. **Site changes (`site/`)**: plain CSS tokens in `site/css/`, Pixelarticons with step-timing in `components/icons/`, data in `lib/data.ts`. Always verify with `npm run lint` and `npm run build`.
5. **Keep PowerShell scripts PowerShell 5.1 compatible** (no `&&`, no `??`).

For detailed operational procedures (adding skills, updating plugins, site workflows), consult [AGENTS.md](./AGENTS.md).

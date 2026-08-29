# Tool Compatibility Matrix

How each piece of this repo maps to each AI coding tool.

| Asset                          | Claude Code                  | opencode                 |
|--------------------------------|------------------------------|--------------------------|
| **Skills** (`claude/skills/`)  | `~/.claude/skills/`          | custom skills (via config) |
| **Claude settings**            | `~/.claude/settings.json`    | n/a                      |
| **Claude MCP servers**         | `~/.claude.json` (imported from `claude/mcp.json`) | n/a |
| **Claude plugins** (manifest)  | `claude plugin install <id>` | n/a                      |
| **claude-mem worker**          | plugin `claude-mem@thedotmack` | `plugins/claude-mem.js` |
| **opencode config**            | n/a                          | `~/.config/opencode/opencode.jsonc` + `opencode.json` |
| **opencode plugins**           | n/a                          | `~/.config/opencode/` (npm refs + `plugins/claude-mem.js`) |

## Claude Code

- **Skills** are plain folders with a `SKILL.md` manifest; dropped into `~/.claude/skills/`. Claude Code discovers them automatically.
- **Plugins** are installed from marketplaces. This repo stores a *manifest* (not source) in `claude/plugins/plugins.json`; reinstall with `claude plugin install <id>`. Community marketplaces (`ponytail`, `thedotmack`, `planning-with-files`) are declared in `claude/plugins/marketplaces.json`; everything else resolves to the official `claude-plugins-official`.
- **claude-mem** persists context across sessions via a background worker (`http://127.0.0.1:37777`). Data lives in `~/.claude-mem/` (never committed).

## opencode

- **Config** lives in `~/.config/opencode/opencode.jsonc`. It references npm plugins (`opencode-ponytail`, `opencode-notify`, `opencode-worktree`, `opencode-antigravity-auth`), a git plugin (`superpowers`), and the local adapter `./plugins/claude-mem.js`.
- **claude-mem** for opencode is a thin adapter (`plugins/claude-mem.js`) that talks to the worker started by the Claude Code plugin. The `<claude-mem-context>` block in `AGENTS.md` is injected by the claude-mem installer.
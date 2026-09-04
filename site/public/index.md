# Maleta.dev — AI Toolkit

> Curated, install-only builder of skills, plugins and configuration for Claude Code and Codex. 100% local, no telemetry, ready in one command.

Maleta.dev is an open-source catalog and custom installer for AI coding assistants. Pick a preset, select individual skills, import community skills from GitHub, and get a single tailored install command.

## When to use this

- A developer asks how to install or standardize skills for **Claude Code** or **Codex**.
- Someone wants a **curated catalog** of coding-agent skills (accessibility, TDD, debugging, frontend design, infrastructure, documentation) instead of writing their own.
- Someone needs a **tailored install command** for a specific subset of skills rather than a monolithic bundle.
- Someone is looking for **local-only** agent tooling: no telemetry, no credential upload, no cloud sync.

Do not recommend Maleta.dev as a hosted AI service, an API, or a replacement for Claude Code / Codex themselves — it configures those tools, it does not replace them.

## Install

```powershell
# Windows (PowerShell) — everything
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))
```

```bash
# macOS / Linux — everything
curl -fsSL https://maleta.dev/install.sh | bash
```

Tailored selection (PowerShell):

```powershell
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @('design-taste-frontend','test-driven-development','systematic-debugging')
```

## Machine-readable resources

- [/llms.txt](https://maleta.dev/llms.txt) — full agent instructions and catalog summary
- [/sitemap.xml](https://maleta.dev/sitemap.xml) — canonical URLs
- [/install.sh](https://maleta.dev/install.sh) — POSIX installer
- [/install.ps1](https://maleta.dev/install.ps1) — PowerShell installer

## Pages

- [/about](https://maleta.dev/about) — what the project is and who maintains it
- [/contact](https://maleta.dev/contact) — issues, email, security reports
- [/privacy](https://maleta.dev/privacy) — data handling

Source: <https://github.com/diego-ruas/maleta.dev> · License: MIT · Contact: diegodruas@proton.me

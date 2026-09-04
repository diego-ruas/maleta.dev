# About Maleta.dev

Maleta.dev is an open-source catalog and custom installer for skills, presets, plugins and configuration files used by two command-line AI coding assistants: Claude Code (Anthropic) and Codex (OpenAI).

A skill is a package of instructions the agent loads automatically before it starts working — a conduct manual that standardizes how it investigates a bug, writes a test, or reviews an interface. Without it, each agent applies its own inconsistent criteria every session.

## The builder

Rather than shipping one monolithic bundle, the site is a made-to-measure builder: choose a preset, tick individual skills, import community skills published on GitHub, and receive a single install command generated for that selection. Over 80 skills are catalogued across accessibility, animation, testing, interface design, infrastructure and documentation.

## Installation

A single script — `install.ps1` on Windows, `install.sh` on macOS and Linux — copies the chosen files into the local configuration directories of Claude Code and Codex. Before overwriting any existing configuration it writes a `.pre-install.bak` backup, so any install can be reverted by hand.

## Privacy and licensing

The project is strictly install-only: nothing is sent back. No telemetry, no credential collection, no session-history sync, no API key is read or transmitted. Everything runs on the user's machine. Third-party skills in the catalog are faithful copies of the upstream artifacts, unmodified, with their original licenses intact. Maleta.dev's own code is MIT licensed.

## Maintainer

Maintained by Diego Ruas, developed in the open at <https://github.com/diego-ruas/maleta.dev>. Fixes, new skills and bug reports are welcome via issue or pull request. Direct contact: diegodruas@proton.me

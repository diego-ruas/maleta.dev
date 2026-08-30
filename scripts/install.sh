#!/usr/bin/env bash
# One-shot installer: restore Claude Code and Codex configs from this repo.
#
# Runs claude/install.sh, codex/install.sh and agents/install.sh.
# Use this after cloning the repo to reproduce the full AI toolchain.
#
# Usage:
#     bash scripts/install.sh

set -uo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

echo "===== Claude Code ====="
bash "$REPO_ROOT/claude/install.sh" "$REPO_ROOT"
echo ""
echo "===== Codex ====="
bash "$REPO_ROOT/codex/install.sh" "$REPO_ROOT"
echo ""
echo "===== Universal Agents (~/.agents) ====="
bash "$REPO_ROOT/agents/install.sh" "$REPO_ROOT"

echo ""
echo "All installers finished. Restart the tools to pick up changes."

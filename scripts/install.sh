#!/usr/bin/env bash
# One-shot installer: restore Claude Code and opencode configs from this repo.
#
# Runs claude/install.sh and opencode/install.sh.
# Use this after cloning the repo to reproduce the full AI toolchain.
#
# Usage:
#     bash scripts/install.sh

set -uo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

echo "===== Claude Code ====="
bash "$REPO_ROOT/claude/install.sh" "$REPO_ROOT"
echo ""
echo "===== opencode ====="
bash "$REPO_ROOT/opencode/install.sh" "$REPO_ROOT"

echo ""
echo "All installers finished. Restart the tools to pick up changes."

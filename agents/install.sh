#!/usr/bin/env bash
# Install universal AI agent skills from this repo.
#
# Provisions universal skills to ~/.agents/skills (consumed by Antigravity, Codex,
# Devin, Gemini CLI, Claude Code, and agent standard tools).
#
# Usage:
#     bash agents/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
AGENTS_DIR="$HOME/.agents"
DST_SKILLS="$AGENTS_DIR/skills"
SRC_SKILLS="$REPO_ROOT/claude/skills"

mkdir -p "$DST_SKILLS"

# --- 1. Universal Skills (~/.agents/skills) ---
SELECTION_FILE="$REPO_ROOT/claude/skills-selection.txt"
SELECTED=()
if [ -f "$SELECTION_FILE" ]; then
    while IFS= read -r line; do
        trimmed="$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
        [ -z "$trimmed" ] && continue
        [[ "$trimmed" == \#* ]] && continue
        SELECTED+=("$trimmed")
    done < "$SELECTION_FILE"
fi

if [ "${#SELECTED[@]}" -gt 0 ]; then
    if [ -d "$SRC_SKILLS/shared" ]; then
        mkdir -p "$DST_SKILLS/shared"
        cp -a "$SRC_SKILLS/shared/." "$DST_SKILLS/shared/"
    fi
    for s in "${SELECTED[@]}"; do
        case "$s" in
            *[!A-Za-z0-9._-]*|*..*)
                echo "[erro] nome de skill invalido: '$s'" >&2
                exit 1
                ;;
        esac
        if [ -d "$SRC_SKILLS/$s" ]; then
            mkdir -p "$DST_SKILLS/$s"
            cp -a "$SRC_SKILLS/$s/." "$DST_SKILLS/$s/"
        else
            echo "[warn] skill '$s' not found in repo, skipped"
        fi
    done
    total=$(find "$DST_SKILLS" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    echo "[ok] universal skills restored -> $DST_SKILLS (${#SELECTED[@]} selecionadas; $total no total)"
else
    cp -a "$SRC_SKILLS/." "$DST_SKILLS/"
    total=$(find "$DST_SKILLS" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    echo "[ok] universal skills restored -> $DST_SKILLS ($total skills)"
fi

echo ""
echo "Universal agent environment installed successfully."

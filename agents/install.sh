#!/usr/bin/env bash
# Install universal AI agent skills and global rules from this repo.
#
# Provisions universal skills to ~/.agents/skills (consumed by Antigravity, Codex,
# OpenCode, Devin, Gemini CLI, Claude Code, and agent standard tools) and global
# agent rules into ~/.agents/AGENTS.md, ~/.cursorrules, ~/.windsurfrules, and ~/.clinerules.
#
# Usage:
#     bash agents/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
AGENTS_DIR="$HOME/.agents"
DST_SKILLS="$AGENTS_DIR/skills"
SRC_SKILLS="$REPO_ROOT/claude/skills"
SRC_AGENTS="$REPO_ROOT/agents"

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

# --- 2. Global Universal AGENTS.md (~/.agents/AGENTS.md) ---
SRC_GLOBAL_AGENTS="$SRC_AGENTS/AGENTS.md"
if [ -f "$SRC_GLOBAL_AGENTS" ]; then
    DST_AGENTS_MD="$AGENTS_DIR/AGENTS.md"
    if [ -f "$DST_AGENTS_MD" ]; then
        cp -f "$DST_AGENTS_MD" "$DST_AGENTS_MD.pre-install.bak"
    fi
    cp -f "$SRC_GLOBAL_AGENTS" "$DST_AGENTS_MD"
    echo "[ok] global ~/.agents/AGENTS.md written"
fi

# --- 3. IDE Global Rules (~/.cursorrules, ~/.windsurfrules, ~/.clinerules) ---
for rule_file in .cursorrules .windsurfrules .clinerules; do
    src_rule="$REPO_ROOT/$rule_file"
    dst_rule="$HOME/$rule_file"
    if [ -f "$src_rule" ]; then
        if [ -f "$dst_rule" ]; then
            cp -f "$dst_rule" "$dst_rule.pre-install.bak"
        fi
        cp -f "$src_rule" "$dst_rule"
        echo "[ok] $rule_file -> $dst_rule"
    fi
done

echo ""
echo "Universal agent environment installed successfully."

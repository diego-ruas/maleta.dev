#!/usr/bin/env bash
# Install Claude Code skills, settings, marketplaces and plugins from this repo.
#
# Copies claude/skills/* -> ~/.claude/skills, deep-merges claude/settings.json into
# ~/.claude/settings.json (local-only keys preserved), registers the marketplaces and
# installs the plugins listed in claude/plugins/plugins.json.
#
# Usage:
#     bash claude/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
CLAUDE_DIR="$HOME/.claude"
SRC_CLAUDE="$REPO_ROOT/claude"

# --- 1. Skills ---
SRC_SKILLS="$SRC_CLAUDE/skills"
DST_SKILLS="$CLAUDE_DIR/skills"
mkdir -p "$DST_SKILLS"

SELECTION_FILE="$SRC_CLAUDE/skills-selection.txt"
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
    # shared/ nao e skill (sem SKILL.md) mas e referencia interna de outras
    # skills (../shared/methodology.md) — copia sempre, fora da selecao.
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
    echo "[ok] skills restored -> $DST_SKILLS (${#SELECTED[@]} selecionadas; $total no total)"
else
    cp -a "$SRC_SKILLS/." "$DST_SKILLS/"
    total=$(find "$DST_SKILLS" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    echo "[ok] skills restored -> $DST_SKILLS ($total skills)"
fi

# --- 2. settings.json (deep merge; local-only keys are preserved) ---
SRC_SETTINGS="$SRC_CLAUDE/settings.json"
DST_SETTINGS="$CLAUDE_DIR/settings.json"
if [ -f "$SRC_SETTINGS" ]; then
    mkdir -p "$CLAUDE_DIR"
    if [ -f "$DST_SETTINGS" ]; then
        cp -f "$DST_SETTINGS" "$DST_SETTINGS.pre-install.bak"
        node -e '
            const fs = require("fs");
            const [localPath, repoPath, outPath] = process.argv.slice(1);
            function merge(base, repo) {
                for (const k of Object.keys(repo)) {
                    if (base[k] && repo[k] && typeof base[k] === "object" && !Array.isArray(base[k])
                        && typeof repo[k] === "object" && !Array.isArray(repo[k])) {
                        merge(base[k], repo[k]);
                    } else {
                        base[k] = repo[k];
                    }
                }
                return base;
            }
            const local = JSON.parse(fs.readFileSync(localPath, "utf8"));
            const repo = JSON.parse(fs.readFileSync(repoPath, "utf8"));
            fs.writeFileSync(outPath, JSON.stringify(merge(local, repo), null, 2));
        ' "$DST_SETTINGS" "$SRC_SETTINGS" "$DST_SETTINGS"
        echo "[ok] settings.json merged (previous saved as settings.json.pre-install.bak)"
    else
        cp -f "$SRC_SETTINGS" "$DST_SETTINGS"
        echo "[ok] settings.json written"
    fi
fi

# --- 3. Marketplaces ---
MARKETPLACES=$(node -e '
    const m = require(process.argv[1]);
    for (const mp of m.marketplaces) {
        if (mp.source === "builtin") continue;
        console.log(mp.id + "\t" + mp.source.repo);
    }
' "$SRC_CLAUDE/plugins/marketplaces.json")
while IFS=$'\t' read -r id repo; do
    [ -z "$id" ] && continue
    echo "[..] adding marketplace '$id' from $repo"
    claude plugin marketplace add "$repo"
done <<< "$MARKETPLACES"

# --- 4. Plugins ---
PLUGINS=$(node -e '
    const p = require(process.argv[1]);
    for (const plugin of p.plugins) console.log(plugin.id);
' "$SRC_CLAUDE/plugins/plugins.json")
while IFS= read -r id; do
    [ -z "$id" ] && continue
    echo "[..] installing plugin '$id'"
    claude plugin install "$id"
done <<< "$PLUGINS"

echo ""
echo "Claude install complete. Restart Claude Code to load plugins."

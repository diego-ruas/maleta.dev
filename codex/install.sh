#!/usr/bin/env bash
# Install Codex CLI config from this repo.
#
# Provisions skills to ~/.agents/skills (delegated to agents/install.sh - the
# Codex CLI discovers skills there) and appends the curated MCP servers to
# ~/.codex/config.toml without overwriting user settings.
#
# Usage:
#     bash codex/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
CODEX_DIR="$HOME/.codex"
SRC_CONFIG="$REPO_ROOT/codex/config.toml"
DST_CONFIG="$CODEX_DIR/config.toml"
BEGIN_MARKER="# >>> maleta.dev mcp servers"
END_MARKER="# <<< maleta.dev mcp servers"

bash "$REPO_ROOT/agents/install.sh" "$REPO_ROOT"

mkdir -p "$CODEX_DIR"

BLOCK="$(printf '%s\n%s\n%s\n' "$BEGIN_MARKER" "$(cat "$SRC_CONFIG")" "$END_MARKER")"

if [ -f "$DST_CONFIG" ]; then
    cp -f "$DST_CONFIG" "$DST_CONFIG.pre-install.bak"
    echo "[ok] backup config.toml -> config.toml.pre-install.bak"
    HAS_FULL_BLOCK="$(awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" '
        index($0, begin) == 1 { infound = 1 }
        infound && index($0, end) == 1 { print "yes"; exit }
    ' "$DST_CONFIG")"
    if [ "$HAS_FULL_BLOCK" = "yes" ]; then
        awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" -v block="$BLOCK" '
            index($0, begin) == 1 { print block; skip = 1; next }
            skip && index($0, end) == 1 { skip = 0; next }
            !skip { print }
        ' "$DST_CONFIG" > "$DST_CONFIG.tmp"
        mv -f "$DST_CONFIG.tmp" "$DST_CONFIG"
        echo "[ok] bloco MCP do maleta.dev atualizado em config.toml"
    else
        printf '\n%s\n' "$BLOCK" >> "$DST_CONFIG"
        echo "[ok] bloco MCP do maleta.dev adicionado ao config.toml existente"
    fi
else
    printf '%s\n' "$BLOCK" > "$DST_CONFIG"
    echo "[ok] written codex/config.toml"
fi

echo ""
echo "Codex install complete. Skills em ~/.agents/skills, MCP em ~/.codex/config.toml."

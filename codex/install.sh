#!/usr/bin/env bash
# Install Codex CLI config from this repo.
#
# Provisions skills to ~/.agents/skills (delegated to agents/install.sh - the
# Codex CLI discovers skills there).
#
# Usage:
#     bash codex/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
DST_CONFIG="$HOME/.codex/config.toml"
BEGIN_MARKER="# >>> maleta.dev mcp servers"
END_MARKER="# <<< maleta.dev mcp servers"

bash "$REPO_ROOT/agents/install.sh" "$REPO_ROOT"

# ponytail: limpa bloco MCP de instalacoes antigas (removido, ver AGENTS.md)
if [ -f "$DST_CONFIG" ] && grep -qF "$BEGIN_MARKER" "$DST_CONFIG"; then
    cp -f "$DST_CONFIG" "$DST_CONFIG.pre-install.bak"
    awk -v begin="$BEGIN_MARKER" -v end="$END_MARKER" '
        index($0, begin) == 1 { skip = 1; next }
        skip && index($0, end) == 1 { skip = 0; next }
        !skip { print }
    ' "$DST_CONFIG" > "$DST_CONFIG.tmp"
    mv -f "$DST_CONFIG.tmp" "$DST_CONFIG"
    echo "[ok] bloco MCP antigo removido de config.toml (backup em config.toml.pre-install.bak)"
fi

echo ""
echo "Codex install complete. Skills em ~/.agents/skills."

#!/usr/bin/env bash
# Install opencode config + plugins from this repo.
#
# Copies opencode.jsonc, opencode.json, AGENTS.md and the plugins/ folder into
# ~/.config/opencode. No npm install needed: claude-mem.js ships as a standalone
# bundle and the rest are npm/git plugin references resolved by opencode itself.
#
# Usage:
#     bash opencode/install.sh [repo-root]

set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
OPENCODE_DIR="$HOME/.config/opencode"
SRC_OPENCODE="$REPO_ROOT/opencode"
mkdir -p "$OPENCODE_DIR"

for f in opencode.jsonc opencode.json AGENTS.md; do
    src="$SRC_OPENCODE/$f"
    if [ -f "$src" ]; then
        dst="$OPENCODE_DIR/$f"
        if [ -f "$dst" ]; then
            cp -f "$dst" "$dst.pre-install.bak"
            echo "[ok] backup opencode/$f -> $f.pre-install.bak"
        fi
        cp -f "$src" "$dst"
        echo "[ok] written opencode/$f"
    fi
done

SRC_PLUGINS="$SRC_OPENCODE/plugins"
if [ -d "$SRC_PLUGINS" ]; then
    DST_PLUGINS="$OPENCODE_DIR/plugins"
    mkdir -p "$DST_PLUGINS"
    cp -a "$SRC_PLUGINS/." "$DST_PLUGINS/"
    echo "[ok] plugins restored"
fi

echo ""
echo "opencode install complete."

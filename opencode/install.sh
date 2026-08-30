#!/usr/bin/env bash
# Install opencode config + plugins from this repo.
#
# Copies opencode.jsonc, opencode.json and the plugins/ folder into
# ~/.config/opencode. No npm install needed: claude-mem.js ships as a standalone
# bundle and the rest are npm/git plugin references resolved by opencode itself.
#
# Usage:
#     bash opencode/install.sh [repo-root] [--plugins name1,name2,...]

set -euo pipefail

PLUGINS=""
REPO_ROOT=""
for arg in "$@"; do
    case "$arg" in
        --plugins=*) PLUGINS="${arg#--plugins=}" ;;
        *) [ -z "$REPO_ROOT" ] && REPO_ROOT="$arg" ;;
    esac
done
REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
OPENCODE_DIR="$HOME/.config/opencode"
SRC_OPENCODE="$REPO_ROOT/opencode"
mkdir -p "$OPENCODE_DIR"

for f in opencode.jsonc opencode.json; do
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

# ponytail: selecao opcional de plugins — substitui o array "plugin" do jsonc
# instalado (repo vence, mesmo padrao do claude/skills-selection.txt).
if [ -n "$PLUGINS" ]; then
    DST_JSONC="$OPENCODE_DIR/opencode.jsonc"
    if [ -f "$DST_JSONC" ] && command -v node >/dev/null 2>&1; then
        node -e '
            const fs = require("fs");
            const path = process.argv[1];
            const plugins = process.argv[2].split(",");
            const raw = fs.readFileSync(path, "utf8").replace(/^\s*\/\/.*$/gm, "");
            const config = JSON.parse(raw);
            config.plugin = plugins;
            fs.writeFileSync(path, JSON.stringify(config, null, 2));
        ' "$DST_JSONC" "$PLUGINS"
        echo "[ok] opencode.jsonc plugin = $PLUGINS"
    else
        echo "[warn] node nao encontrado ou opencode.jsonc ausente; selecao de plugins ignorada"
    fi
fi

echo ""
echo "opencode install complete."

#!/usr/bin/env bash
# Instalador One-Liner do maleta.dev para Claude Code e Codex (Linux/macOS).
#
# Instala skills, plugins, marketplaces e configuracoes de IA.
# Pode ser executado diretamente da web sem clonar o repositorio antes:
#     curl -fsSL https://maleta.dev/install.sh | bash
#
# Ou com parametros customizados:
#     curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools claude --skills design-taste-frontend,emil-design-eng
#
# Opcoes:
#   --tools <all|claude|codex|agents>[,...]   Padrao: all
#   --skills <nome1,nome2,...>            Padrao: todas as skills curadas
#   --repo-root <path>                    Usa um clone local em vez de baixar

set -uo pipefail

# Sem -e de proposito: cada delegacao precisa restaurar skills-selection.txt
# antes de propagar a falha. FAILED acumula quem quebrou.
FAILED=""

TOOLS="all"
SKILLS=""
REPO_ROOT=""

while [ $# -gt 0 ]; do
    case "$1" in
        --tools) TOOLS="$2"; shift 2 ;;
        --skills) SKILLS="$2"; shift 2 ;;
        --repo-root) REPO_ROOT="$2"; shift 2 ;;
        *) echo "[warn] opcao desconhecida: $1"; shift ;;
    esac
done

echo ""
echo "  __  __       _      _            _             "
echo " |  \\/  |     | |    | |          | |            "
echo " | \\  / | __ _| | ___| |_ __ _  __| | _____   __ "
echo " | |\\/| |/ _\` | |/ _ \\ __/ _\` |/ _\` |/ _ \\ \\ / / "
echo " | |  | | (_| | |  __/ || (_| | (_| |  __/\\ V /  "
echo " |_|  |_|\\__,_|_|\\___|\\__\\__,_|\\__,_|\\___| \\_/   "
echo "  +------------------------------------------------------------+"
echo "  | Skills, plugins e configs de IA prontos para instalar      |"
echo "  | https://maleta.dev                                         |"
echo "  +------------------------------------------------------------+"
echo ""

IS_REMOTE=false
TEMP_DIR=""
cleanup() {
    if [ "$IS_REMOTE" = true ] && [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# 1. Determinar raiz do repositorio (local ou download remoto)
if [ -z "$REPO_ROOT" ]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || true)"
    if [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/claude/skills" ]; then
        REPO_ROOT="$SCRIPT_DIR"
    elif [ -n "$SCRIPT_DIR" ] && [ -d "$(dirname "$SCRIPT_DIR")/claude/skills" ]; then
        REPO_ROOT="$(dirname "$SCRIPT_DIR")"
    else
        IS_REMOTE=true
    fi
fi

if [ "$IS_REMOTE" = true ]; then
    echo "[info] Baixando pacote mais recente do maleta.dev..."
    TEMP_DIR="$(mktemp -d)"
    TARBALL_URL="https://github.com/diego-ruas/maleta.dev/archive/refs/heads/main.tar.gz"
    curl -fsSL "$TARBALL_URL" | tar -xz -C "$TEMP_DIR"
    REPO_ROOT="$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n1)"
    [ -z "$REPO_ROOT" ] && REPO_ROOT="$TEMP_DIR"
fi

if [ "$TOOLS" = "all" ]; then
    TOOLS_TO_RUN="claude codex agents"
else
    TOOLS_TO_RUN="$(echo "$TOOLS" | tr ',' ' ')"
fi

RUN_AGENTS_DIRECT=true
if echo " $TOOLS_TO_RUN " | grep -q " codex "; then
    RUN_AGENTS_DIRECT=false
fi

# 2. Executar instalacao do Claude Code
if echo " $TOOLS_TO_RUN " | grep -q " claude "; then
    echo "[1] Claude Code"
    CLAUDE_INSTALL="$REPO_ROOT/claude/install.sh"
    if [ -f "$CLAUDE_INSTALL" ]; then
        SELECTION_FILE="$REPO_ROOT/claude/skills-selection.txt"
        HAD_SELECTION=false
        ORIGINAL_SELECTION=""
        if [ -f "$SELECTION_FILE" ]; then
            HAD_SELECTION=true
            ORIGINAL_SELECTION="$(cat "$SELECTION_FILE")"
        fi

        if [ -n "$SKILLS" ]; then
            echo "$SKILLS" | tr ',' '\n' > "$SELECTION_FILE"
            echo "[info] Instalando skills selecionadas: $SKILLS"
        fi

        bash "$CLAUDE_INSTALL" "$REPO_ROOT" || FAILED="$FAILED claude"

        if [ "$HAD_SELECTION" = false ] && [ -f "$SELECTION_FILE" ]; then
            rm -f "$SELECTION_FILE"
        elif [ "$HAD_SELECTION" = true ]; then
            echo "$ORIGINAL_SELECTION" > "$SELECTION_FILE"
        fi
        case "$FAILED" in
            *claude*) echo "[erro] Claude Code falhou." ;;
            *) echo "[ok]   Claude Code configurado." ;;
        esac
    else
        echo "[warn] Script do Claude nao encontrado em $CLAUDE_INSTALL"
    fi
    echo ""
fi

# 3. Executar instalacao do Codex
if echo " $TOOLS_TO_RUN " | grep -q " codex "; then
    echo "[2] Codex"
    CODEX_INSTALL="$REPO_ROOT/codex/install.sh"
    if [ -f "$CODEX_INSTALL" ]; then
        SELECTION_FILE="$REPO_ROOT/claude/skills-selection.txt"
        HAD_SELECTION=false
        ORIGINAL_SELECTION=""
        if [ -f "$SELECTION_FILE" ]; then
            HAD_SELECTION=true
            ORIGINAL_SELECTION="$(cat "$SELECTION_FILE")"
        fi

        if [ -n "$SKILLS" ]; then
            echo "$SKILLS" | tr ',' '\n' > "$SELECTION_FILE"
        fi

        bash "$CODEX_INSTALL" "$REPO_ROOT" || FAILED="$FAILED codex"

        if [ "$HAD_SELECTION" = false ] && [ -f "$SELECTION_FILE" ]; then
            rm -f "$SELECTION_FILE"
        elif [ "$HAD_SELECTION" = true ]; then
            echo "$ORIGINAL_SELECTION" > "$SELECTION_FILE"
        fi
        case "$FAILED" in
            *codex*) echo "[erro] Codex falhou." ;;
            *) echo "[ok]   Codex configurado." ;;
        esac
    else
        echo "[warn] Script do Codex nao encontrado em $CODEX_INSTALL"
    fi
    echo ""
fi

# 4. Executar instalacao de Universal Agents (~/.agents, Cursor, Windsurf, Cline)
if [ "$RUN_AGENTS_DIRECT" = true ] && echo " $TOOLS_TO_RUN " | grep -q " agents "; then
    echo "[3] Universal Agents (~/.agents, IDEs)"
    AGENTS_INSTALL="$REPO_ROOT/agents/install.sh"
    if [ -f "$AGENTS_INSTALL" ]; then
        SELECTION_FILE="$REPO_ROOT/claude/skills-selection.txt"
        HAD_SELECTION=false
        ORIGINAL_SELECTION=""
        if [ -f "$SELECTION_FILE" ]; then
            HAD_SELECTION=true
            ORIGINAL_SELECTION="$(cat "$SELECTION_FILE")"
        fi

        if [ -n "$SKILLS" ]; then
            echo "$SKILLS" | tr ',' '\n' > "$SELECTION_FILE"
        fi

        bash "$AGENTS_INSTALL" "$REPO_ROOT" || FAILED="$FAILED agents"

        if [ "$HAD_SELECTION" = false ] && [ -f "$SELECTION_FILE" ]; then
            rm -f "$SELECTION_FILE"
        elif [ "$HAD_SELECTION" = true ]; then
            echo "$ORIGINAL_SELECTION" > "$SELECTION_FILE"
        fi
        case "$FAILED" in
            *agents*) echo "[erro] Universal Agents falhou." ;;
            *) echo "[ok]   Universal Agents configurado (~/.agents/skills)." ;;
        esac
    else
        echo "[warn] Script universal de agents nao encontrado em $AGENTS_INSTALL"
    fi
    echo ""
fi

if [ -n "$FAILED" ]; then
    echo "  +------------------------------------------------------------+"
    echo "  | Instalacao INCOMPLETA — falhou:$FAILED"
    echo "  +------------------------------------------------------------+"
    echo ""
    exit 1
fi

echo "  +------------------------------------------------------------+"
echo "  | Instalacao concluida com sucesso!                          |"
echo "  +------------------------------------------------------------+"
echo ""
echo "Proximos passos:"
if echo " $TOOLS_TO_RUN " | grep -q " claude "; then
    echo "  * Claude Code: reinicie sua sessao e digite '/skills' ou '/plugins' para conferir."
fi
if echo " $TOOLS_TO_RUN " | grep -q " codex "; then
    echo "  * Codex: reinicie o codex e digite '/skills' para conferir."
fi
if echo " $TOOLS_TO_RUN " | grep -q " agents "; then
    echo "  * Universal Agents: skills disponiveis em ~/.agents/skills."
fi
echo ""

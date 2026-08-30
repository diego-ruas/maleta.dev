# Migracao opencode -> Codex Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar o segundo alvo suportado do repo (opencode -> OpenAI Codex CLI) e deixar o caminho de instalacao obvio para um dev iniciante.

**Architecture:** O Codex descobre skills em `$HOME/.agents/skills`, exatamente onde `agents/install.*` ja grava. Entao `codex/install.*` apenas delega as skills ao installer de agents e acrescenta o bloco MCP em `~/.codex/config.toml` de forma nao destrutiva (append entre marcadores). No site, `ToolTarget` ganha `"codex"` no lugar de `"opencode"`, o grupo de plugins do opencode vira a lista de MCP do Codex, e o Hero passa a mostrar o comando pronto antes dos seletores.

**Tech Stack:** PowerShell 5.1, bash, Next.js 15 (App Router, `output: 'export'`), TypeScript, motion/react, CSS plano em `site/css/`.

**Spec:** `docs/superpowers/specs/2026-08-30-codex-migration-design.md`

## Global Constraints

- Sem emojis em codigo, docs, UI ou mensagens de commit. Apenas Pixelarticons de `site/components/icons/` e prefixos textuais (`//`, `~`, `->`, `*`).
- PowerShell 5.1: sem `&&`, sem `??`, sem operador ternario.
- Nunca editar nada dentro de `claude/skills/` (artefatos upstream).
- Nao adicionar arquivos novos na raiz do repo.
- Textos do site em portugues.
- Nunca sobrescrever config do usuario de forma destrutiva: backup `.pre-install.bak` antes de escrever.
- Comandos de verificacao do site rodam em `site/`: `npm run lint` e `npm run build`.
- Alvos validos dos instaladores apos este plano: `all | claude | codex | agents`.

---

### Task 1: `codex/config.toml` e installers do Codex

**Files:**
- Create: `codex/config.toml`
- Create: `codex/install.ps1`
- Create: `codex/install.sh`
- Test: manual, via `$env:USERPROFILE` / `HOME` temporario (o repo nao tem framework de teste)

**Interfaces:**
- Consumes: `agents/install.ps1 -RepoRoot <path>` e `bash agents/install.sh <repo-root>` (ja existem; provisionam `~/.agents/skills` respeitando `claude/skills-selection.txt`).
- Produces: `codex/install.ps1 -RepoRoot <path>` e `bash codex/install.sh <repo-root>`, consumidos pela Task 2.

- [ ] **Step 1: Confirmar que o pacote MCP `context7` existe antes de entrar na config**

Run:
```bash
npm view @upstash/context7-mcp version
```
Expected: imprime uma versao (ex.: `1.0.x`). Se der `404 Not Found`, **remova o bloco `[mcp_servers.context7]`** do arquivo do Step 2 e siga o resto do plano com apenas `open-websearch`; registre a remocao no commit do Step 8.

- [ ] **Step 2: Criar `codex/config.toml`**

```toml
# maleta.dev - MCP servers curados para o Codex CLI.
# Instalado por codex/install.ps1 / codex/install.sh em ~/.codex/config.toml.
# As skills nao ficam aqui: o Codex as descobre em ~/.agents/skills.

[mcp_servers.open-websearch]
command = "npx"
args = ["-y", "open-websearch@latest"]
startup_timeout_sec = 20

[mcp_servers.open-websearch.env]
MODE = "stdio"
DEFAULT_SEARCH_ENGINE = "duckduckgo"

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp@latest"]
startup_timeout_sec = 20
```

- [ ] **Step 3: Criar `codex/install.ps1`**

```powershell
<#
.SYNOPSIS
    Install Codex CLI config from this repo.

.DESCRIPTION
    Provisions skills to ~/.agents/skills (delegated to agents/install.ps1 - the
    Codex CLI discovers skills there) and appends the curated MCP servers to
    ~/.codex/config.toml without overwriting user settings.

    Usage:
        powershell -ExecutionPolicy Bypass -File codex/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$beginMarker = '# >>> maleta.dev mcp servers'
$endMarker = '# <<< maleta.dev mcp servers'

& (Join-Path $RepoRoot 'agents\install.ps1') -RepoRoot $RepoRoot

$codexDir = Join-Path $env:USERPROFILE '.codex'
New-Item -ItemType Directory -Path $codexDir -Force | Out-Null

$srcConfig = Join-Path $RepoRoot 'codex\config.toml'
$dstConfig = Join-Path $codexDir 'config.toml'
$block = $beginMarker + "`n" + (Get-Content -LiteralPath $srcConfig -Raw).TrimEnd() + "`n" + $endMarker

if (Test-Path -LiteralPath $dstConfig) {
    Copy-Item $dstConfig "$dstConfig.pre-install.bak" -Force
    Write-Host '[ok] backup config.toml -> config.toml.pre-install.bak'
    $existing = Get-Content -LiteralPath $dstConfig -Raw
    if ($existing -match [regex]::Escape($beginMarker)) {
        $pattern = [regex]::Escape($beginMarker) + '[\s\S]*?' + [regex]::Escape($endMarker)
        $updated = [regex]::Replace($existing, $pattern, $block)
        Set-Content -LiteralPath $dstConfig -Value $updated -Encoding UTF8
        Write-Host '[ok] bloco MCP do maleta.dev atualizado em config.toml'
    } else {
        Add-Content -LiteralPath $dstConfig -Value ("`n" + $block) -Encoding UTF8
        Write-Host '[ok] bloco MCP do maleta.dev adicionado ao config.toml existente'
    }
} else {
    Set-Content -LiteralPath $dstConfig -Value $block -Encoding UTF8
    Write-Host '[ok] written codex/config.toml'
}

Write-Host ''
Write-Host 'Codex install complete. Skills em ~/.agents/skills, MCP em ~/.codex/config.toml.'
```

- [ ] **Step 4: Criar `codex/install.sh`**

```bash
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
    if grep -qF "$BEGIN_MARKER" "$DST_CONFIG"; then
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
```

- [ ] **Step 5: Rodar o installer PowerShell num HOME temporario (primeira instalacao)**

```powershell
$repo = (Get-Location).Path
$fake = Join-Path $env:TEMP 'codex-test-home'
Remove-Item -Recurse -Force $fake -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $fake -Force | Out-Null
$real = $env:USERPROFILE
$env:USERPROFILE = $fake
powershell -ExecutionPolicy Bypass -File codex/install.ps1 -RepoRoot $repo
$env:USERPROFILE = $real
Get-ChildItem (Join-Path $fake '.agents\skills') | Measure-Object | Select-Object -ExpandProperty Count
Get-Content (Join-Path $fake '.codex\config.toml')
```
Expected: contagem de skills > 0; `config.toml` contendo `# >>> maleta.dev mcp servers` e `[mcp_servers.open-websearch]`.

- [ ] **Step 6: Rodar de novo por cima de uma config de usuario ja existente (idempotencia)**

```powershell
$fake = Join-Path $env:TEMP 'codex-test-home'
$cfg = Join-Path $fake '.codex\config.toml'
$prefix = 'model = "gpt-5-codex"' + [Environment]::NewLine
Set-Content -LiteralPath $cfg -Value ($prefix + (Get-Content -LiteralPath $cfg -Raw)) -Encoding UTF8
$real = $env:USERPROFILE
$env:USERPROFILE = $fake
powershell -ExecutionPolicy Bypass -File codex/install.ps1 -RepoRoot (Get-Location).Path
$env:USERPROFILE = $real
Select-String -Path $cfg -Pattern 'model =', 'maleta.dev mcp servers', 'mcp_servers.open-websearch'
Test-Path "$cfg.pre-install.bak"
```
Expected: `model = "gpt-5-codex"` continua presente, o bloco `maleta.dev mcp servers` aparece **uma unica vez** (dois marcadores, inicio e fim), e o `.pre-install.bak` existe.

- [ ] **Step 7: Rodar a versao bash num HOME temporario**

```bash
repo="$(pwd)"
fake="$(mktemp -d)"
HOME="$fake" bash codex/install.sh "$repo"
ls "$fake/.agents/skills" | wc -l
printf 'model = "gpt-5-codex"\n' | cat - "$fake/.codex/config.toml" > "$fake/tmp" && mv "$fake/tmp" "$fake/.codex/config.toml"
HOME="$fake" bash codex/install.sh "$repo"
grep -c "maleta.dev mcp servers" "$fake/.codex/config.toml"
grep -c "^model = " "$fake/.codex/config.toml"
ls "$fake/.codex/"
```
Expected: contagem de skills > 0; `grep -c "maleta.dev mcp servers"` retorna `2` (marcador de inicio + de fim, ou seja, um bloco so); `model` preservado (`1`); `config.toml.pre-install.bak` presente.

- [ ] **Step 8: Commit**

```bash
git add codex/
git commit -m "feat(codex): installer e config MCP para o Codex CLI"
```

---

### Task 2: Trocar opencode por codex nos instaladores existentes

**Files:**
- Delete: `opencode/` (`install.ps1`, `install.sh`, `opencode.json`, `opencode.jsonc`, `plugins/claude-mem.js`)
- Modify: `scripts/install.ps1`, `scripts/install.sh`
- Modify: `site/public/install.ps1`, `site/public/install.sh`

**Interfaces:**
- Consumes: `codex/install.ps1 -RepoRoot <path>`, `bash codex/install.sh <repo-root>` (Task 1).
- Produces: `-Tools`/`--tools` aceitando `all|claude|codex|agents`; sem `-Plugins`/`--plugins`. A Task 3 gera comandos com esses valores.

- [ ] **Step 1: Apagar a pasta do opencode**

```bash
git rm -r opencode
```

- [ ] **Step 2: Atualizar `scripts/install.ps1`**

Cabecalho:

```powershell
<#
.SYNOPSIS
    One-shot installer: restore Claude Code and Codex configs from this repo.

.DESCRIPTION
    Runs claude/install.ps1, codex/install.ps1 and agents/install.ps1.
    Use this after cloning the repo to reproduce the full AI toolchain.

    Usage:
        powershell -ExecutionPolicy Bypass -File scripts/install.ps1
#>
```

Bloco do opencode vira:

```powershell
Write-Host '===== Codex ====='
& (Join-Path $RepoRoot 'codex\install.ps1') -RepoRoot $RepoRoot
```

- [ ] **Step 3: Atualizar `scripts/install.sh`**

Cabecalho:

```bash
#!/usr/bin/env bash
# One-shot installer: restore Claude Code and Codex configs from this repo.
#
# Runs claude/install.sh, codex/install.sh and agents/install.sh.
# Use this after cloning the repo to reproduce the full AI toolchain.
#
# Usage:
#     bash scripts/install.sh
```

Bloco do opencode vira:

```bash
echo "===== Codex ====="
bash "$REPO_ROOT/codex/install.sh" "$REPO_ROOT"
```

- [ ] **Step 4: Atualizar `site/public/install.ps1`**

Trocas exatas:

1. Cabecalho `.SYNOPSIS`: `Instalador One-Liner do maleta.dev para Claude Code e Codex.`
2. `.PARAMETER Tools`: `Quais ferramentas instalar: 'all', 'claude', 'codex', 'agents'.` / `Padrao: 'all' (Claude Code + Codex + Universal Agents).`
3. Remover integralmente o bloco `.PARAMETER Plugins` e o parametro `[string[]]$Plugins = @(),` da assinatura.
4. `$toolsToRun = @('claude', 'opencode', 'agents')` -> `$toolsToRun = @('claude', 'codex', 'agents')`.
5. Substituir a secao `# 3. Executar instalacao do opencode` inteira por:

```powershell
    # 3. Executar instalacao do Codex
    if ($toolsToRun -contains 'codex') {
        $stepIndex++
        Write-Step -Index $stepIndex -Total $totalSteps -Text 'Codex'
        $codexInstallScript = Join-Path $RepoRoot 'codex\install.ps1'
        if (Test-Path $codexInstallScript) {
            $selectionFile = Join-Path $RepoRoot 'claude\skills-selection.txt'
            $hadOriginalSelection = Test-Path $selectionFile
            $originalSelectionContent = $null
            if ($hadOriginalSelection) {
                $originalSelectionContent = Get-Content -LiteralPath $selectionFile -Raw
            }

            if ($Skills -and $Skills.Count -gt 0) {
                $Skills | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }

            & $codexInstallScript -RepoRoot $RepoRoot

            if (-not $hadOriginalSelection -and (Test-Path $selectionFile)) {
                Remove-Item -LiteralPath $selectionFile -Force -ErrorAction SilentlyContinue
            } elseif ($hadOriginalSelection -and $originalSelectionContent) {
                $originalSelectionContent | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }
            Write-Ok "Codex configurado."
        } else {
            Write-Warn "Script do Codex nao encontrado em $codexInstallScript"
        }
        Write-Host ""
    }
```

6. Nos "Proximos passos" ao final, a linha do opencode vira:

```powershell
    if ($toolsToRun -contains 'codex') {
        Write-Host "  * Codex: reinicie o codex e digite '/skills' para conferir; MCP em ~/.codex/config.toml." -ForegroundColor White
    }
```

- [ ] **Step 5: Atualizar `site/public/install.sh`**

Trocas exatas:

1. Cabecalho: `Instalador One-Liner do maleta.dev para Claude Code e Codex (Linux/macOS).`
2. Linha de opcoes: `#   --tools <all|claude|codex|agents>[,...]   Padrao: all`; remover a linha que documenta `--plugins`.
3. Remover `PLUGINS=""` e o case `--plugins) PLUGINS="$2"; shift 2 ;;`.
4. `TOOLS_TO_RUN="claude opencode agents"` -> `TOOLS_TO_RUN="claude codex agents"`.
5. Substituir a secao `# 3. Executar instalacao do opencode` inteira por:

```bash
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

        bash "$CODEX_INSTALL" "$REPO_ROOT"

        if [ "$HAD_SELECTION" = false ] && [ -f "$SELECTION_FILE" ]; then
            rm -f "$SELECTION_FILE"
        elif [ "$HAD_SELECTION" = true ]; then
            echo "$ORIGINAL_SELECTION" > "$SELECTION_FILE"
        fi
        echo "[ok]   Codex configurado."
    else
        echo "[warn] Script do Codex nao encontrado em $CODEX_INSTALL"
    fi
    echo ""
fi
```

6. Nos "Proximos passos" ao final:

```bash
if echo " $TOOLS_TO_RUN " | grep -q " codex "; then
    echo "  * Codex: reinicie o codex e digite '/skills' para conferir; MCP em ~/.codex/config.toml."
fi
```

- [ ] **Step 6: Verificar que nenhum instalador cita opencode nem plugins**

```bash
grep -rn "opencode\|PLUGINS\|-Plugins\|--plugins" scripts/ site/public/install.ps1 site/public/install.sh codex/ agents/
```
Expected: sem saida.

- [ ] **Step 7: Rodar o one-liner local com HOME temporario, alvo codex**

```bash
repo="$(pwd)"
fake="$(mktemp -d)"
HOME="$fake" bash site/public/install.sh --tools codex --skills test-driven-development --repo-root "$repo"
ls "$fake/.agents/skills"
test -f "$fake/.codex/config.toml" && echo CONFIG_OK
git status --porcelain claude/skills-selection.txt
```
Expected: `~/.agents/skills` contem `test-driven-development` (e `shared`, se existir no repo); imprime `CONFIG_OK`; `git status` vazio para o arquivo de selecao (o script restaura o estado original).

- [ ] **Step 8: Commit**

```bash
git add -A scripts site/public opencode
git commit -m "refactor(install): substituir alvo opencode por codex"
```

---

### Task 3: Modelo de dados e textos do site

**Files:**
- Modify: `site/lib/toolkitContext.tsx:14`, `:77`
- Modify: `site/lib/data.ts:712-747` (grupo `tool: "opencode"`)
- Delete: `site/components/icons/opencode.tsx`
- Modify: `site/app/layout.tsx:19,33,39`
- Modify: `site/components/sections/Hero.tsx`, `InstallSteps.tsx`, `FaqSection.tsx`, `AboutSection.tsx`, `ToolsGrid.tsx`, `AgentsTicker.tsx`, `PluginsSection.tsx`
- Modify: `site/components/skills/SkillsExplorer.tsx`, `site/components/skills/RepoScan.tsx`

**Interfaces:**
- Consumes: alvos `all|claude|codex|agents` da Task 2.
- Produces: `ToolTarget = "all" | "claude" | "codex" | "agents"`; `PLUGIN_GROUPS` com `tool: "Codex"`. A Task 4 depende desses nomes.

- [ ] **Step 1: Trocar o tipo em `site/lib/toolkitContext.tsx`**

Linha 14:
```ts
export type ToolTarget = "all" | "claude" | "codex" | "agents";
```

Linha 77 (o valor antigo `"opencode"` no localStorage deixa de ser aceito e cai para o default `"all"`):
```ts
    if (savedTool && (savedTool === "all" || savedTool === "claude" || savedTool === "codex" || savedTool === "agents")) {
```

- [ ] **Step 2: Trocar o grupo de plugins em `site/lib/data.ts`**

Substituir o objeto inteiro `{ tool: "opencode", items: [...] }` (6 itens) por:

```ts
  {
    tool: "Codex",
    items: [
      {
        name: "open-websearch",
        description: "busca na web sem API key (MCP)",
        category: "MCP",
      },
      {
        name: "context7",
        description: "docs atualizadas das libs (MCP)",
        category: "MCP",
      },
    ],
  },
```

Se o Step 1 da Task 1 tiver removido o `context7`, deixar apenas o item `open-websearch`.

- [ ] **Step 3: Trocar o icone**

O Codex passa a usar o `TerminalIcon` ja existente — nao ha icone novo. Em cada arquivo que importava `OpencodeIcon`, trocar o import por:

```ts
import { TerminalIcon } from "@/components/icons/terminal";
```

(se o arquivo ja importar `TerminalIcon`, nao duplicar o import) e cada uso `Icon={OpencodeIcon}` por `Icon={TerminalIcon}`. Depois:

```bash
git rm site/components/icons/opencode.tsx
```

- [ ] **Step 4: Hero — alvo e textos**

Em `site/components/sections/Hero.tsx`, no `TOOL_TARGET_META`, a chave `opencode` vira:

```ts
  codex: {
    tag: "Apenas Codex",
    description: "Configura exclusivamente o Codex CLI.",
  },
```

e a chave `all`:

```ts
  all: {
    tag: "Ecossistema Completo",
    description: "Configura Claude Code, Codex e todas as IDEs/Agentes.",
  },
```

Botao de alvo (no lugar do botao do opencode):

```tsx
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "codex"}
                  className={`hero-tool-btn${targetTool === "codex" ? " active" : ""}`}
                  onClick={() => setTargetTool("codex")}
                  title="Instalar apenas para Codex (~/.agents/skills e ~/.codex/config.toml)"
                >
                  <AnimatedIcon Icon={TerminalIcon} className="icon" size={14} />
                  <span>Codex</span>
                </button>
```

Botao "Todos (Completo)": `title="Instalar para todos os ambientes (Claude + Codex + Agentes & IDEs)"`.

No paragrafo `intro-desc`, trocar `<span className="highlight-word">opencode</span>` por `<span className="highlight-word">Codex</span>`.

- [ ] **Step 5: Demais textos**

- `site/app/layout.tsx` (3 ocorrencias): `... para Claude Code e Codex.`
- `AboutSection.tsx:44`: `"Claude Code e Codex"`; `:119`: `<strong>Claude Code</strong>, <strong>Codex</strong> e outros agentes`.
- `AgentsTicker.tsx:21-22`: `id: "codex"`, `name: "Codex"`.
- `FaqSection.tsx:71`: `<li><strong>Codex (<code>-Tools codex</code>)</strong>: Injeta as skills em <code>~/.agents/skills/</code> e os servidores MCP em <code>~/.codex/config.toml</code>.</li>`; `:73`: `... sincroniza simultaneamente o Claude Code, Codex e todas as IDEs/Agentes.`
- `InstallSteps.tsx:152,154`: `<strong>Claude Code</strong> e/ou <strong>Codex</strong> ja instalados no terminal.` (este texto e substituido de novo na Task 4); `:379`: `Navegue pela pasta <code>claude/skills/</code>. Cada skill contem seu arquivo <code>SKILL.md</code> em Markdown auditavel.`; `:444`: `Skills do Codex: <code>~/.agents/skills/</code> - MCP: <code>~/.codex/config.toml</code>`; `:449`: `Skills do Codex: <code>%USERPROFILE%\.agents\skills\</code> - MCP: <code>%USERPROFILE%\.codex\config.toml</code>`.
- `PluginsSection.tsx`: `useState<"all" | "Claude Code" | "Codex">("all")`; renomear `opencodeSelected` para `codexSelected`, filtrando `p.tool === "Codex"`; o comando gerado para esse grupo passa a ser `--tools codex` / `-Tools codex` **sem** `--plugins`/`-Plugins` (os MCP vao inteiros na config); chip `plugin.tool === "Claude Code" ? "claude" : "codex"`; label da aba `Codex ({ALL_PLUGINS.filter((p) => p.tool === "Codex").length})`.
- `ToolsGrid.tsx`: `PLUGIN_GROUPS.find((g) => g.tool === "Codex")`, variavel `opencodePlugins` renomeada para `codexMcp`, titulo `Codex`, descricao `Skills em <code>~/.agents/skills/</code>, MCP em <code>~/.codex/config.toml</code>.`, link `https://github.com/diego-ruas/maleta.dev/tree/main/codex`, texto do link `Inspecionar pasta codex/`.
- `SkillsExplorer.tsx` e `RepoScan.tsx`: trocar as mencoes de opencode por Codex mantendo a frase.

Se algum CSS usar a classe `.plugin-row-tool-chip.opencode`, renomear para `.codex` em `site/css/site.css`.

- [ ] **Step 6: Verificar que nao sobrou opencode no site**

```bash
grep -rn "opencode\|Opencode\|OPENCODE" site --include=*.ts --include=*.tsx --include=*.css --include=*.mjs | grep -v node_modules
```
Expected: sem saida.

- [ ] **Step 7: Lint e build**

```bash
cd site && npm run lint && npm run build
```
Expected: lint sem erros; build conclui sem erro de tipo.

- [ ] **Step 8: Commit**

```bash
git add -A site
git commit -m "refactor(site): trocar alvo opencode por codex no catalogo e na UI"
```

---

### Task 4: Comando primeiro no Hero, pre-requisito explicito e glossario

**Files:**
- Modify: `site/components/sections/Hero.tsx`
- Modify: `site/components/sections/InstallSteps.tsx`
- Modify: `site/components/sections/SkillsSection.tsx`
- Modify: `site/components/sections/PluginsSection.tsx`
- Modify: `site/components/sections/FaqSection.tsx`
- Modify: `site/css/site.css`

**Interfaces:**
- Consumes: `installCommand`, `targetTool`, `targetOs`, `selectedSkills` de `useToolkit()` (assinaturas inalteradas).
- Produces: nada consumido por tarefas seguintes.

- [ ] **Step 1: Hero — comando pronto no topo do terminal**

Dentro de `.hero-terminal-body`, mover o bloco `04. COMANDO PRONTO` (o `div.hero-terminal-section` que contem `.hero-code-box`) para ser o **primeiro** filho, com o label trocado para:

```tsx
              <span className="hero-section-label">01. COMANDO PRONTO:</span>
```

Logo abaixo desse bloco, antes do `<details>` do Step 2, inserir:

```tsx
            <p className="hero-command-hint">
              {"// Ja funciona assim: instala a base recomendada no Claude Code, no Codex e nas IDEs."}
            </p>
```

- [ ] **Step 2: Hero — seletores dentro de um `<details>`**

Envolver as tres secoes restantes (ferramenta, sistema operacional e base) em:

```tsx
            <details className="hero-advanced-details hero-setup-details">
              <summary>
                <span>Ajustar pacote</span>
                <span className="hero-advanced-count">ferramenta - sistema - base</span>
              </summary>
              {/* as secoes 02/03/04 entram aqui, na ordem atual */}
            </details>
```

Renumerar os labels internos para `02. ONDE INSTALAR:`, `03. SEU SISTEMA:`, `04. COMECE POR UMA BASE:`. O `<details>` de presets que ja existe dentro da secao de bases permanece como esta (details aninhado e valido).

- [ ] **Step 3: CSS minimo do novo bloco**

Em `site/css/site.css`, junto das regras `.hero-advanced-details`:

```css
.hero-setup-details {
  margin-top: 0.75rem;
}

.hero-command-hint {
  margin: 0.4rem 0 0;
  font-size: 0.75rem;
  color: var(--muted);
}
```
Se `--muted` nao existir em `site/css/base.css`, usar a mesma cor aplicada em `.hero-terminal-actions-hint`.

- [ ] **Step 4: InstallSteps — pre-requisito explicito na aba do one-liner**

O card `01` (`Requisitos Minimos`) vira `Antes de comecar`:

```tsx
              <h3 className="process-title">Antes de comecar</h3>
              <p className="process-desc">
                {isUnix ? (
                  <>Linux ou macOS com <strong>bash</strong> ou <strong>zsh</strong>. Voce precisa de pelo menos um agente instalado:</>
                ) : (
                  <>Windows 10/11 com <strong>PowerShell 5.1+</strong> nativo. Voce precisa de pelo menos um agente instalado:</>
                )}
              </p>
              <div className="cmd">
                <code>npm install -g @anthropic-ai/claude-code</code>
                <CopyButton className="cmd-copy" text="npm install -g @anthropic-ai/claude-code" aria-label="Copiar comando de instalacao do Claude Code">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
              <div className="cmd">
                <code>npm install -g @openai/codex</code>
                <CopyButton className="cmd-copy" text="npm install -g @openai/codex" aria-label="Copiar comando de instalacao do Codex">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
```

- [ ] **Step 5: InstallSteps — card do opencode na aba "Setup do Zero" vira Codex**

O card `02` da aba `fresh` (hoje `Instalar o opencode (Opcional)`):

```tsx
              <h3 className="process-title">Instalar o Codex (Opcional)</h3>
              <p className="process-desc">
                Caso prefira o agente da OpenAI, ou queira usar os dois lado a lado:
              </p>
              <div className="cmd">
                <code>npm install -g @openai/codex</code>
                <CopyButton className="cmd-copy" text="npm install -g @openai/codex" aria-label="Copiar comando de instalacao do Codex">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
```
com `Icon={TerminalIcon}` no `process-icon-box` do card.

- [ ] **Step 6: Glossario de uma linha**

Logo abaixo do `<h2>` de cada secao:

`SkillsSection.tsx`:
```tsx
      <p className="section-glossary">
        {"// Skill = um arquivo SKILL.md com instrucoes que o agente carrega quando o assunto aparece."}
      </p>
```

`PluginsSection.tsx`:
```tsx
      <p className="section-glossary">
        {"// Plugin = pacote que adiciona comandos ao Claude Code. MCP = servidor externo que da novas ferramentas ao agente (busca, docs)."}
      </p>
```

Em `site/css/site.css`:
```css
.section-glossary {
  margin: 0.25rem 0 1rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--muted);
}
```

- [ ] **Step 7: FAQ em linguagem de iniciante**

Trocar o texto da pergunta `tools` para `Onde as skills vao parar na minha maquina?` (a lista ja foi atualizada na Task 3) e acrescentar dois itens no fim de `faq-list`:

```tsx
        <FaqItem id="agentes" question="Qual a diferenca entre Claude Code e Codex?">
          <p>
            Sao dois agentes de terminal diferentes: o <strong>Claude Code</strong> e da Anthropic, o <strong>Codex</strong> e da OpenAI. Voce pode usar os dois na mesma maquina. As skills deste site funcionam nos dois, porque ambos leem arquivos <code>SKILL.md</code>; o instalador so muda a pasta de destino.
          </p>
        </FaqItem>

        <FaqItem id="iniciante" question="Nunca usei nenhum dos dois. Por onde comeco?">
          <p>
            Instale um agente com <code>npm install -g @anthropic-ai/claude-code</code> (ou <code>npm install -g @openai/codex</code>), cole o comando pronto que aparece no topo desta pagina e reabra o terminal. Depois digite <code>/skills</code> dentro do agente para ver o que foi instalado.
          </p>
        </FaqItem>
```

- [ ] **Step 8: Lint e build**

```bash
cd site && npm run lint && npm run build
```
Expected: lint sem erros e build concluido.

- [ ] **Step 9: Conferir a pagina renderizada**

```bash
cd site && npx serve out -l 4321
```
Abrir `http://localhost:4321` e confirmar: o comando aparece no topo do terminal do Hero; `Ajustar pacote` comeca fechado; ao abrir e escolher `Codex`, o comando passa a conter `-Tools codex` (Windows) ou `--tools codex` (Linux/macOS).

- [ ] **Step 10: Commit**

```bash
git add -A site
git commit -m "feat(site): comando pronto primeiro, pre-requisito explicito e glossario"
```

---

### Task 5: Documentacao

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `docs/TOOL-MATRIX.md`
- Modify: `docs/DISCOVERED_SKILLS.md` (1 mencao)

**Interfaces:**
- Consumes: estrutura final de pastas e alvos das Tasks 1-4.
- Produces: nada.

- [ ] **Step 1: Listar todas as mencoes restantes**

```bash
grep -rn "opencode" --include=*.md . | grep -v "^./claude/skills/"
```
Expected: apenas `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/TOOL-MATRIX.md`, `docs/DISCOVERED_SKILLS.md` (e os arquivos deste plano/spec, que descrevem a migracao e permanecem).

- [ ] **Step 2: Atualizar `AGENTS.md`**

- Descricao do repo: `Claude Code (claude/)` e `Codex (codex/)`.
- Golden rule 4: `A config do Codex (codex/config.toml) so lista servidores MCP - nenhuma credencial de provedor. Mantenha assim.`
- Secao "Common tasks": trocar `opencode/install.ps1 / opencode/install.sh` por `codex/install.ps1 / codex/install.sh`; alvos `all|claude|codex|agents`; remover as mencoes a `--plugins`.
- Acrescentar em "Add a new skill": `O Codex descobre as mesmas skills em ~/.agents/skills; nao ha pasta de skills propria do Codex para manter.`

- [ ] **Step 3: Atualizar `CLAUDE.md`**

Na "Visao geral": `... para **Claude Code** (claude/) e **Codex** (codex/).` As demais regras permanecem.

- [ ] **Step 4: Atualizar `README.md` (9 mencoes) e `docs/TOOL-MATRIX.md` (7 mencoes)**

Trocar opencode por Codex, com os caminhos corretos: skills em `~/.agents/skills`, MCP em `~/.codex/config.toml`. Remover linhas sobre plugins do opencode e sobre `~/.config/opencode/`.

- [ ] **Step 5: Verificacao final**

```bash
grep -rn "opencode" . --include=*.ts --include=*.tsx --include=*.ps1 --include=*.sh --include=*.json --include=*.jsonc | grep -v "^./claude/skills/" | grep -v node_modules
```
Expected: sem saida.

```bash
cd site && npm run lint && npm run build
```
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add -A AGENTS.md CLAUDE.md README.md docs
git commit -m "docs: substituir opencode por Codex na documentacao"
```

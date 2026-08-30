# Migracao opencode -> Codex e simplificacao para iniciantes

Data: 2026-08-30
Status: aprovado (design)

## Objetivo

Trocar o segundo alvo suportado do repositorio (opencode -> OpenAI Codex CLI) e reduzir
a friccao da pagina para o publico-alvo real: dev iniciante que chega em maleta.dev
com Claude Code ou Codex e precisa instalar sem errar.

## Contexto que decide o desenho

O Codex CLI descobre skills nestes diretorios (docs oficiais, `learn.chatgpt.com/docs/build-skills`):

1. `$CWD/.agents/skills`
2. `$CWD/../.agents/skills`
3. `$REPO_ROOT/.agents/skills`
4. `$HOME/.agents/skills`  <- o que este repo ja instala via `agents/install.*`
5. `/etc/codex/skills`

Ou seja: o provisionamento de skills para Codex ja existe. O que falta e configuracao
(`~/.codex/config.toml`, MCP), o alvo na UI e o texto. Skills usam `SKILL.md` com
frontmatter `name` + `description` — o mesmo formato ja usado em `claude/skills/`,
sem conversao necessaria.

Nao havera arquivo de regras global (`~/.codex/AGENTS.md`): o commit `fd54db5` removeu
os arquivos de regra cross-editor de proposito, e a instalacao continua so por skills.

## Escopo

### 1. `codex/` substitui `opencode/`

Novo `codex/install.ps1` e `codex/install.sh`:

- Chamam `agents/install.*` (mesmo `-RepoRoot` / selecao em `claude/skills-selection.txt`)
  para provisionar `~/.agents/skills`. Sem duplicar a logica de copia.
- Escrevem `~/.codex/config.toml` com os MCP servers curados, fazendo backup
  `config.toml.pre-install.bak` quando ja existir (mesmo padrao do installer do opencode).
- Fonte da config: novo `codex/config.toml` versionado no repo, com
  `open-websearch` (migrado do `opencode.jsonc`) e `context7`.
- PowerShell 5.1 compativel (sem `&&`, sem `??`).

Removidos: `opencode/install.ps1`, `opencode/install.sh`, `opencode/opencode.json`,
`opencode/opencode.jsonc`, `opencode/plugins/claude-mem.js` — a pasta `opencode/` inteira.

Alvos aceitos por `scripts/install.*` e `site/public/install.*`:
`all | claude | codex | agents`, onde `all = claude + codex + agents`.
`agents` continua existindo separado (skills para Cursor, Windsurf, Cline, Antigravity,
Gemini) e `codex` = `agents` + `config.toml`.

O parametro `-Plugins` / `--plugins` (hoje exclusivo do opencode) e removido dos
instaladores: o Codex nao tem gerenciador de plugins; MCP vai inteiro no `config.toml`.

`scripts/install.*` e `site/public/install.*` continuam sendo dois pares de arquivos
distintos (o primeiro para clone local, o segundo servido pela web); a unificacao
esta fora de escopo, apenas o conteudo e mantido em sincronia.

### 2. Modelo de dados do site

- `lib/toolkitContext.tsx`: `ToolTarget = "all" | "claude" | "codex" | "agents"`.
  Valor `"opencode"` persistido em localStorage deixa de ser aceito e cai para `"all"`.
- `lib/data.ts`: o grupo `PLUGIN_GROUPS` com `tool: "opencode"` (6 itens) e substituido
  por `tool: "Codex"` listando os MCP servers instalados (`open-websearch`, `context7`),
  com `category: "MCP"`.
- `components/icons/codex.tsx`: novo icone Pixelarticons animado no mesmo padrao dos
  demais (`forwardRef`, `Variants`, step timing, fundo transparente).
  `components/icons/opencode.tsx` e removido.

### 3. Substituicao de texto e UI

Arquivos que citam opencode e passam a citar Codex: `app/layout.tsx` (metadata),
`components/sections/{Hero,InstallSteps,FaqSection,AboutSection,ToolsGrid,AgentsTicker,PluginsSection}.tsx`,
`components/skills/{SkillsExplorer,RepoScan}.tsx`.

Caminhos citados na UI mudam de `~/.config/opencode/` e `%LOCALAPPDATA%\opencode\`
para `~/.codex/config.toml` + `~/.agents/skills`.

`ToolsGrid` passa a apontar para a pasta `codex/` no GitHub.

### 4. UX para iniciante

**a) Passo 0 no `InstallSteps`** — "Instale o agente primeiro", antes do one-liner,
com comandos copiaveis:

- `npm install -g @anthropic-ai/claude-code`
- `npm install -g @openai/codex`

Substitui o texto atual de pre-requisito que apenas assume "ja instalados".
O passo existente "Instalar o opencode (Opcional)" e absorvido por este.

**b) Hero: comando primeiro.** A ordem atual e 01 ferramenta -> 02 SO -> 03 base ->
04 comando. Passa a ser:

- Bloco de comando pronto no topo do terminal, ja valido com os defaults
  (`all`, preset `essentials`, SO detectado por `detectOs()` — logica ja existente).
- As tres selecoes (ferramenta, SO, base) vao para dentro de um `<details>`
  "Ajustar pacote", fechado por padrao, reusando o estilo `hero-advanced-details`.
- Nenhuma mudanca no formato do comando gerado nem em `installCommand`.

**c) Glossario minimo.** Uma linha explicando o termo na primeira aparicao:
skill (`SkillsSection`), plugin (`PluginsSection`), MCP (`PluginsSection`, aba Codex).
FAQ reescrito em linguagem de iniciante, sem jargao, incluindo a pergunta
"qual a diferenca entre Claude Code e Codex" e "onde os arquivos sao gravados".

### 5. Documentacao

`AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/TOOL-MATRIX.md`: opencode -> Codex,
mais a regra nova de que o Codex descobre skills em `~/.agents/skills` (nao ha
pasta propria de skills do Codex a manter).

## Fora de escopo

- Quebrar `lib/data.ts` (748), `RepoScan.tsx` (733), `SkillsExplorer.tsx` (645).
- Unificar `scripts/install.*` com `site/public/install.*`.
- Qualquer arquivo de regra global instalado na maquina do usuario.
- Traducao do site para outro idioma.

## Verificacao

- `npm run lint` e `npm run build` em `site/` a cada fase que toca o site.
- `codex/install.ps1 -RepoRoot <clone>` executado com `$env:USERPROFILE` apontando
  para um diretorio temporario; conferir `~/.agents/skills` populado e
  `~/.codex/config.toml` escrito, e que rodar duas vezes gera o `.pre-install.bak`
  sem perder a config anterior.
- `bash codex/install.sh --repo-root <clone>` com `HOME` temporario, mesmo criterio.
- `grep -ri opencode` no repo (excluindo `claude/skills/`, que sao artefatos upstream
  intocaveis) deve voltar vazio.

## Riscos

- Usuarios com opencode instalado pelo repo ficam com `~/.config/opencode` orfao.
  Decisao: nao remover nada da maquina do usuario; o installer nao desinstala.
- `context7` como MCP do Codex precisa ser validado (comando/pacote) antes de entrar
  no `config.toml`; se nao validar, a aba Codex fica so com `open-websearch`.

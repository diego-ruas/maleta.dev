# Maleta.dev

Coleção curada e instalável de **skills**, **plugins** e **configurações de IA** para
[Claude Code](https://docs.anthropic.com/en/docs/claude-code), [opencode](https://opencode.ai)
e [Antigravity](https://antigravity.ai).

O repositório é **instalação somente**: você clona e roda os scripts para reproduzir o
ambiente na sua máquina. Nada do seu ambiente é enviado de volta para cá.

## O que tem aqui

```
maleta.dev/
├── claude/
│   ├── skills/          # 82 skills (SKILL.md + scripts + dados)
│   ├── plugins/         # manifest plugins.json + marketplaces.json
│   ├── settings.json    # enabledPlugins + extraKnownMarketplaces
│   ├── mcp.json         # servidores MCP do Claude (open-websearch)
│   ├── CLAUDE.md        # regras globais do Claude Code
│   └── install.ps1      # instala skills, settings, marketplaces e plugins
├── opencode/
│   ├── opencode.jsonc   # plugins npm + MCP (open-websearch)
│   ├── opencode.json    # provider local (LM Studio) + modelo padrão
│   ├── AGENTS.md        # regras globais do opencode
│   ├── plugins/         # claude-mem.js (adaptador do claude-mem)
│   ├── package.json     # @opencode-ai/plugin (dev de plugins)
│   └── install.ps1
├── antigravity/         # placeholder (install.ps1 + README.md)
├── scripts/
│   └── install.ps1      # instala Claude + opencode + Antigravity de uma vez
├── docs/TOOL-MATRIX.md  # como cada asset mapeia para cada tool
├── AGENTS.md            # instruções para AIs que lerem o repo
├── SKILLSPECTOR_REPORT.md # relatório de auditoria de segurança das 82 skills
└── README.md
```

## Requisitos

- Windows com **PowerShell 5.1** (nativo).
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (para instalar a parte do Claude).
- [opencode](https://opencode.ai) (para instalar a parte do opencode).
- [Git](https://git-scm.com).

## Como instalar

Clone o repositório e rode o instalador completo:

```powershell
git clone https://github.com/diego-ruas/maleta.dev.git
cd maleta.dev
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

Ou instale apenas uma ferramenta:

```powershell
# apenas Claude Code
powershell -ExecutionPolicy Bypass -File claude/install.ps1

# apenas opencode
powershell -ExecutionPolicy Bypass -File opencode/install.ps1
```

O `claude/install.ps1` copia as skills para `~/.claude/skills`, escreve o
`settings.json` (plugins + marketplaces), registra os marketplaces e instala os
plugins listados em `claude/plugins/plugins.json` com `claude plugin install <id>`.
Reinicie a ferramenta depois de instalar.

## Plugins

### Claude Code (11 plugins)

| Plugin | Market | O que faz |
|---|---|---|
| `ponytail` | community | Respostas/verificação de código minimalista ("dev preguiçoso") |
| `frontend-design` | official | UI distintiva e sem cara de "AI slop" |
| `figma` | official | Trabalhar com designs e componentes do Figma |
| `superpowers` | official | Workflow completo: brainstorm → plan → TDD → review |
| `code-simplifier` | official | Simplifica código e reduz complexidade desnecessária |
| `security-guidance` | official | Revisão de segurança e boas práticas |
| `claude-mem` | community | Memória persistente entre sessões (comprime e reinjeta contexto) |
| `code-review` | official | Revisão multi-agente de mudanças antes do commit |
| `commit-commands` | official | Commits convencionais |
| `context7` | official (MCP) | Docs atualizadas/versionadas das libs, anti-alucinação de API |
| `planning-with-files` | community | Planos salvos em markdown que sobrevivem a `/clear` |

### opencode (6 plugins)

| Plugin | Tipo | O que faz |
|---|---|---|
| `opencode-ponytail` | npm | Mesmo princípio minimalista do ponytail |
| `superpowers` | git | Workflow completo: brainstorm → plan → TDD → review |
| `opencode-notify` | npm | Notificações nativas do SO ao fim de tarefas |
| `opencode-worktree` | npm | Git worktrees zero-fricção para isolar sessões |
| `opencode-antigravity-auth` | npm | Modelos Gemini/Claude via login Google do Antigravity |
| `claude-mem.js` | local | Adaptador do worker claude-mem (porta 37777) |

O opencode também usa o MCP **open-websearch** (busca na web) via `opencode.jsonc`, e o
`opencode.json` configura um **provider local LM Studio** com modelo padrão
(`qwen2.5-coder-7b-instruct`) — ajuste os modelos conforme a sua máquina.

## open-websearch (MCP)

Servidor MCP de busca na web registrado tanto no Claude (`claude/mcp.json`) quanto no
opencode (`opencode.jsonc`), em modo `stdio` com engine padrão DuckDuckGo.
Instale o binário (`open-websearch`) na máquina e reinicie a ferramenta.

## claude-mem (memória persistente)

Instalado por padrão no **Claude Code** (plugin `claude-mem@thedotmack`) e no
**opencode** (`plugins/claude-mem.js` + bloco `<claude-mem-context>` no AGENTS.md).

- O worker roda em segundo plano (`http://127.0.0.1:37777`) e comprime observações com
  um modelo Claude via auth do Claude Code (sem chaves no repo).
- Dados ficam em `~/.claude-mem/` — fora do repo.
- Comandos úteis: `npx claude-mem status|start|stop`, `npx claude-mem search <query>`.

> O claude-mem roda um serviço e não é 100% restaurado pelo manifest. Em máquina nova:
> `npx claude-mem install --ide claude-code --provider claude --model claude-sonnet-5`
> e `npx claude-mem install --ide opencode --provider claude --model claude-sonnet-5`.

## Adicionar ou remover uma skill

1. Encontre a skill no repositório upstream (ex.: `anthropics/skills`, `cloudflare/skills`,
   `obra/superpowers`, etc.).
2. Copie a pasta da skill para `claude/skills/<nome>/` (com `SKILL.md`).
3. Se quiser testar na sua máquina, rode `claude/install.ps1` para instalar em
   `~/.claude/skills`.
4. Envie um PR ou commite a mudança.

> Ao adicionar uma skill de terceiros, mantenha os arquivos de licença originais da skill.

## Segurança (SkillSpector)

Todas as 82 skills passam por auditoria de segurança estática automatizada com o
[SkillSpector](https://github.com/diego-ruas/skillspector), cobrindo:
- **Injeções de Prompt & Anti-Refusal:** Detecção de caracteres ocultos, tags e instruções maliciosas.
- **Menor Privilégio & MCP:** Proteção contra tool poisoning e conexões não autorizadas.
- **AST & Scripts:** Verificação de segurança estrutural de scripts TypeScript/Python.
- **Supply Chain:** Integridade de lockfiles e dependências upstream.

O relatório detalhado está documentado em [SKILLSPECTOR_REPORT.md](SKILLSPECTOR_REPORT.md). Para reproduzir a auditoria:

```powershell
skillspector scan claude/skills -r --no-llm
```

## Notas de licença

- O **wrapper do repo** (scripts, docs, configurações) é distribuído sob [MIT](LICENSE).
- As **skills de terceiros** dentro de `claude/skills/` são propriedade de seus autores e
  mantêm suas próprias licenças (ex.: várias skills Anthropic trazem um `LICENSE.txt`
  proprietário). Ao redistribuir, respeite os termos de cada skill.

## Ferramentas

| Ferramenta | Caminho de config | Estado |
|---|---|---|
| Claude Code | `~/.claude/` | 82 skills + 11 plugins |
| opencode | `~/.config/opencode/` | 6 plugins (5 npm/git + claude-mem.js) + MCP open-websearch |
| Antigravity | `%LOCALAPPDATA%\antigravity` | placeholder |
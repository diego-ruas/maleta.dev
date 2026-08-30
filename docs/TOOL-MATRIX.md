# Matriz de Compatibilidade de Ferramentas

Como cada recurso deste repositório é mapeado para cada assistente e ambiente de desenvolvimento com IA.

---

## Mapeamento por Ferramenta

| Recurso | Claude Code | opencode | Cursor / Windsurf / Cline / Outros |
| :--- | :--- | :--- | :--- |
| **Skills** (`claude/skills/`) | `~/.claude/skills/` | Skills customizadas (via config) | Carregadas como contexto / prompts |
| **Configurações gerais** | `~/.claude/settings.json` | `~/.config/opencode/opencode.json` | Configuração nativa de cada IDE |
| **Servidores MCP** | `~/.claude.json` (via `claude/mcp.json`) | `~/.config/opencode/opencode.jsonc` | Configuração de MCP nativa de cada IDE |
| **Manifesto de Plugins** | `claude plugin install <id>` | Gerenciado no `opencode.jsonc` (npm/git) | n/a |
| **Worker do claude-mem** | Plugin `claude-mem@thedotmack` | Adaptador `plugins/claude-mem.js` | Conexão HTTP local (`127.0.0.1:37777`) |

---

## Detalhamento por Ambiente

### Claude Code

- **Skills**: Pastas individuais contendo o manifesto `SKILL.md`, copiadas diretamente para `~/.claude/skills/`. O Claude Code detecta e carrega as skills automaticamente.
- **Plugins**: Instalados a partir de seus marketplaces oficiais ou comunitários. Este repositório mantém um *manifesto estático* em `claude/plugins/plugins.json`. Marketplaces comunitários (`ponytail`, `thedotmack`, `planning-with-files`) são declarados em `claude/plugins/marketplaces.json`.
- **claude-mem**: Mantém memória persistente entre sessões através de um worker em segundo plano (`http://127.0.0.1:37777`). Os dados ficam salvos localmente em `~/.claude-mem/` (nunca versionados ou compartilhados).
- **Servidores MCP**: Declarados em `claude/mcp.json` e mesclados em `~/.claude.json`, fornecendo capacidades adicionais como busca na web.

### opencode

- **Configurações**: Arquivos `~/.config/opencode/opencode.jsonc` (plugins e MCP) e `opencode.json` (provedor e modelo).
- **Plugins**: Referências npm (`opencode-ponytail`, `opencode-notify`, `opencode-worktree`, `opencode-antigravity-auth`), plugin git (`superpowers`) e o adaptador local `./plugins/claude-mem.js`.
- **claude-mem**: Adaptador leve em JavaScript (`plugins/claude-mem.js`) que se comunica com o serviço local iniciado pelo plugin do Claude Code.
- **Busca Web**: Integração nativa com DuckDuckGo via MCP (`open-websearch`).

- **Zero Vazamento**: Nenhum dado confidencial, credencial ou chave de API é compartilhado entre agentes ou sincronizado externamente.

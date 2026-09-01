# Matriz de Compatibilidade de Ferramentas

Como cada recurso deste repositório é mapeado para cada assistente e ambiente de desenvolvimento com IA.

---

## Mapeamento por Ferramenta

| Recurso | Claude Code | Codex | Cursor / Windsurf / Cline / Outros |
| :--- | :--- | :--- | :--- |
| **Skills** (`claude/skills/`) | `~/.claude/skills/` | `~/.agents/skills/` | Carregadas como contexto / prompts |
| **Configurações gerais** | `~/.claude/settings.json` | n/a | Configuração nativa de cada IDE |
| **Manifesto de Plugins** | `claude plugin install <id>` | n/a | n/a |
| **Worker do claude-mem** | Plugin `claude-mem@thedotmack` | n/a | Conexão HTTP local (`127.0.0.1:37777`) |

---

## Detalhamento por Ambiente

### Claude Code

- **Skills**: Pastas individuais contendo o manifesto `SKILL.md`, copiadas diretamente para `~/.claude/skills/`. O Claude Code detecta e carrega as skills automaticamente.
- **Plugins**: Instalados a partir de seus marketplaces oficiais ou comunitários. Este repositório mantém um *manifesto estático* em `claude/plugins/plugins.json`. Marketplaces comunitários (`ponytail`, `thedotmack`, `planning-with-files`) são declarados em `claude/plugins/marketplaces.json`.
- **claude-mem**: Mantém memória persistente entre sessões através de um worker em segundo plano (`http://127.0.0.1:37777`). Os dados ficam salvos localmente em `~/.claude-mem/` (nunca versionados ou compartilhados).

### Codex

- **Skills**: As mesmas pastas de `claude/skills/` são copiadas para `~/.agents/skills/`, que o Codex descobre automaticamente.
- **Plugins**: O Codex não possui gerenciador de plugins no instalador.
- **claude-mem**: Não há adaptador próprio do Codex. O plugin do Claude Code continua independente.

- **Zero Vazamento**: Nenhum dado confidencial, credencial ou chave de API é compartilhado entre agentes ou sincronizado externamente.

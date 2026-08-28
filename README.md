# Maleta.dev

Uma coleção pronta e curada de skills, plugins e configurações para turbinar seus assistentes de IA: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) e [opencode](https://opencode.ai).

Clone, execute o instalador e pronto: tudo configurado e funcionando no seu ambiente em segundos. 100% local e seguro — nenhum dado pessoal ou chave de API é armazenado ou enviado de volta.

Você também pode explorar o catálogo interativo e gerar comandos sob medida em [maleta.dev](https://maleta.dev).

---

## Como instalar

### Pré-requisitos
- Windows com **PowerShell**
- [Git](https://git-scm.com)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) e/ou [opencode](https://opencode.ai) instalados

### Método 1: Instalação Expressa (One-Liner — Recomendado)

Abra o **PowerShell** e execute:

```powershell
# Instala tudo (Claude Code + opencode)
irm https://maleta.dev/install.ps1 | iex
```

Ou instale apenas para uma ferramenta específica:

```powershell
# Apenas Claude Code
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude

# Apenas opencode
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools opencode
```

### Método 2: Instalação Manual (Git Clone)

Se preferir clonar o repositório para inspecionar os arquivos:

```powershell
git clone https://github.com/diego-ruas/maleta.dev.git
cd maleta.dev
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

> **Dica:** Para instalar apenas uma ferramenta específica a partir do clone local, execute o script individual correspondente: `claude/install.ps1` ou `opencode/install.ps1`.

---

## O que está incluído

- **Mais de 80 Skills Prontas:** Instruções especializadas para frontend, backend, testes, refatoração, cloud, segurança, acessibilidade e documentação (`claude/skills/`).
- **Plugins Selecionados:**
  - **Memória entre sessões (`claude-mem`):** Mantém o contexto persistente entre conversas.
  - **Workflow Ágil (`superpowers`):** Estrutura de brainstorming, planejamento e TDD antes de codificar.
  - **Design de Qualidade (`frontend-design`, `figma`):** Interfaces modernas e integração com componentes.
  - **Código Limpo (`ponytail`, `code-simplifier`):** Respostas diretas ao ponto, sem complexidade desnecessária.
  - **Planejamento (`planning-with-files`):** Gestão de contexto e execução estruturada em arquivos.
- **Busca na Web (MCP):** Suporte nativo a pesquisas via DuckDuckGo (`open-websearch`).
- **Regras Globais e Multi-Agente:** Prompts e configurações refinadas com suporte nativo a múltiplos editores e agentes:
  - Claude Code (`CLAUDE.md`)
  - opencode (`opencode/AGENTS.md`)
  - Codex / Devin / Gemini (`AGENTS.md`)
  - Cursor (`.cursorrules`)
  - Windsurf (`.windsurfrules`)
  - Roo Code / Cline (`.clinerules`)
  - GitHub Copilot (`.github/copilot-instructions.md`)

Consulte a [Matriz de Compatibilidade](docs/TOOL-MATRIX.md) para detalhes de mapeamento por ferramenta.

---

## Segurança

Todas as skills incluídas são auditadas automaticamente com o [NVIDIA SkillSpector](https://github.com/nvidia/skillspector) contra injeções de prompt, scripts maliciosos e vulnerabilidades.

Confira o relatório completo em [SKILLSPECTOR_REPORT.md](SKILLSPECTOR_REPORT.md).

---

## Como personalizar ou adicionar skills

1. Baixe ou crie a pasta da skill contendo seu respectivo arquivo `SKILL.md`.
2. Adicione em `claude/skills/<nome-da-skill>/`.
3. Execute `claude/install.ps1` para aplicar as alterações localmente.
4. Para refletir no catálogo web, atualize `site/lib/data.ts`.

---

## Licença

- O código deste repositório (instaladores, configurações e documentação) é distribuído sob a licença [MIT](LICENSE).
- Skills e plugins de terceiros mantêm suas respectivas licenças originais.

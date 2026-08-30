# Maleta.dev

Um construtor e catálogo customizado de skills, plugins e configurações para turbinar seus assistentes de IA: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) e [opencode](https://opencode.ai).

Monte seu pacote sob medida no site [maleta.dev](https://maleta.dev) ou execute comandos específicos para instalar apenas o que você precisa. 100% local e seguro — nenhum dado pessoal ou chave de API é armazenado ou enviado de volta.

**Nunca usou um agente de IA de código?** Ferramentas como o Claude Code e o opencode são assistentes que escrevem e editam código a partir dos seus pedidos no terminal. Sozinhos, eles seguem critérios próprios e inconsistentes. Uma **skill** é um pacote de instruções que o agente carrega sozinho antes de trabalhar — como um manual de conduta que ele passa a seguir automaticamente. O maleta.dev instala esse manual pra você, sem precisar copiar arquivo por arquivo.

---

## Início rápido

Já tem o Claude Code e/ou o opencode instalados? Rode o comando abaixo pro seu sistema — ele instala tudo (todas as skills e plugins recomendados) sem precisar escolher nada:

```powershell
# Windows (PowerShell)
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))
```

```bash
# Linux/macOS (bash/zsh)
curl -fsSL https://maleta.dev/install.sh | bash
```

Quer escolher só algumas skills ou apenas uma das ferramentas? Monte seu comando personalizado no [maleta.dev](https://maleta.dev) (o site gera o comando certo pra copiar) ou veja as opções manuais no "Método 1" abaixo.

### Como saber se funcionou

Abra o Claude Code (ou opencode) num projeto qualquer e peça algo que combine com uma skill instalada — por exemplo, com `test-driven-development` ativa, peça para implementar uma função nova: o agente deve propor os testes antes do código. Se ele responder do jeito de sempre, revise se o `-Tools`/`--tools` do comando bateu com a ferramenta que você abriu.

---

## Como instalar seu pacote sob medida

### Pré-requisitos
- Windows com **PowerShell 5.1** (nativo), ou Linux/macOS com **bash**/**zsh**
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) e/ou [opencode](https://opencode.ai) instalados

### Método 1: One-Liner Customizado

Gere seu comando personalizado no [maleta.dev](https://maleta.dev) ou monte os parâmetros diretamente no terminal:

```powershell
# Windows (PowerShell) — instalar Claude Code com skills selecionadas
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @('design-taste-frontend','test-driven-development','systematic-debugging')

# Windows (PowerShell) — instalar apenas opencode
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools opencode
```

```bash
# Linux/macOS (bash/zsh) — instalar Claude Code com skills selecionadas
curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools claude --skills design-taste-frontend,test-driven-development,systematic-debugging

# Linux/macOS (bash/zsh) — instalar apenas opencode
curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools opencode
```

### Método 2: Instalador Local (Git Clone)

Se preferir clonar o repositório para inspecionar os arquivos:

```powershell
git clone https://github.com/diego-ruas/maleta.dev.git
cd maleta.dev
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

```bash
git clone https://github.com/diego-ruas/maleta.dev.git
cd maleta.dev
bash scripts/install.sh
```

---

## O que está incluído

- **Mais de 80 Skills Curadas:** Instruções especializadas para frontend, backend, testes, refatoração, cloud, acessibilidade e documentação (`claude/skills/`).
- **Hub Comunitário (GitHub):** Descubra e importe skills de qualquer repositório aberto na comunidade diretamente no instalador.
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
  - Codex / Devin / Antigravity / Gemini (`AGENTS.md`)
  - Cursor (`.cursorrules`)
  - Windsurf (`.windsurfrules`)
  - Roo Code / Cline (`.clinerules`)
  - GitHub Copilot (`.github/copilot-instructions.md`)

Consulte a [Matriz de Compatibilidade](docs/TOOL-MATRIX.md) para detalhes de mapeamento por ferramenta.

---

## Para quem vai contribuir: adicionar ou atualizar skills

1. Obtenha a pasta da skill upstream contendo seu arquivo `SKILL.md`.
2. Adicione em `claude/skills/<nome-da-skill>/` mantendo as licenças originais.
3. Para refletir no catálogo web, atualize `site/lib/data.ts`.
4. Execute `claude/install.ps1` (Windows) ou `claude/install.sh` (Linux/macOS) para aplicar as alterações localmente.

---

## Licença

- O código deste repositório (instaladores, configurações e documentação) é distribuído sob a licença [MIT](LICENSE).
- Skills e plugins de terceiros mantêm suas respectivas licenças originais.

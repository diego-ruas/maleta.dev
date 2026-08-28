# Maleta.dev 🧰

Uma coleção pronta e curada de **skills**, **plugins** e **configurações** para turbinar seus assistentes de IA: **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)**, **[opencode](https://opencode.ai)** e **[Antigravity](https://antigravity.ai)**.

Clone, rode o instalador e pronto: tudo configurado e funcionando na sua máquina em segundos. **100% local e seguro** — nenhum dado pessoal ou chave é enviado de volta.

---

## ⚡ Instalação Rápida

### Pré-requisitos
- Windows com **PowerShell** (nativo)
- [Git](https://git-scm.com)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) e/ou [opencode](https://opencode.ai) instalados

### Instalar tudo de uma vez

Abra o PowerShell e execute:

```powershell
git clone https://github.com/diego-ruas/maleta.dev.git
cd maleta.dev
powershell -ExecutionPolicy Bypass -File scripts/install.ps1
```

> **Dica:** Se quiser instalar apenas para uma ferramenta específica, rode `claude/install.ps1` ou `opencode/install.ps1`.

---

## 📦 O que está incluído

- **🧠 +80 Skills Prontas:** Instruções especializadas para frontend, backend, testes, refatoração, cloud, segurança e documentação.
- **🔌 Plugins Selecionados:**
  - **Memória entre sessões (`claude-mem`):** Faz a IA lembrar do contexto de conversas anteriores.
  - **Workflow Ágil (`superpowers`):** Estrutura de brainstorming, planejamento e TDD antes de codificar.
  - **Design de Qualidade (`frontend-design` & `figma`):** Interfaces modernas e integração com componentes.
  - **Código Limpo (`ponytail` & `code-simplifier`):** Respostas diretas ao ponto, sem complexidade desnecessária.
- **🌐 Busca na Web (MCP):** Suporte nativo a pesquisas via DuckDuckGo (`open-websearch`).
- **🎯 Regras Globais:** Prompts e configurações ajustadas para os assistentes serem mais precisos e produtivos.

---

## 🛡️ Segurança

Todas as skills incluídas são auditadas automaticamente com o **[NVIDIA SkillSpector](https://github.com/nvidia/skillspector)** contra injeções de prompt, scripts maliciosos e vulnerabilidades.

Confira o relatório completo em [SKILLSPECTOR_REPORT.md](SKILLSPECTOR_REPORT.md).

---

## 💡 Como personalizar ou adicionar skills

Quer adicionar uma nova skill?
1. Baixe ou crie a pasta da skill com seu respectivo `SKILL.md`.
2. Coloque em `claude/skills/<nome-da-skill>/`.
3. Rode `claude/install.ps1` para aplicar as alterações localmente.

---

## 📄 Licença

- O código deste repositório (instaladores, configurações e documentação) é distribuído sob a licença **[MIT](LICENSE)**.
- Skills de terceiros mantêm suas respectivas licenças originais.
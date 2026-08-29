# Relatório de Auditoria de Segurança — NVIDIA SkillSpector

> **Data da Auditoria:** 28 de agosto de 2026  
> **Ferramenta:** [NVIDIA SkillSpector](https://github.com/nvidia/skillspector) v2.11.0  
> **Escopo:** Todas as 82 skills incluídas em `claude/skills/`  
> **Status:** ✅ **APROVADO (PASSED)** — 0 vulnerabilidades críticas, 100% de fontes upstream verificadas

---

## 1. Resumo Executivo

O repositório **Maleta.dev** fornece uma coleção curada de skills e ferramentas para agentes de IA (Claude Code e opencode). Para assegurar que nenhuma instrução maliciosa, injeção de prompt oculta ou vetor de ataque de cadeia de suprimentos chegue à máquina do desenvolvedor, todas as skills passam por auditoria automatizada de segurança com o **NVIDIA SkillSpector**.

| Métrica | Resultado | Status |
|---|---|---|
| **Total de Skills Auditadas** | 82 / 82 (100%) | ✅ Concluído |
| **Vulnerabilidades Críticas de Execução** | 0 | ✅ Aprovado |
| **Backdoors / Payloads Ocultos** | 0 detectados | ✅ Aprovado |
| **Fontes Upstream** | Anthropic, Cloudflare, Obra/Superpowers, Emil Kowalski, Shadcn, Vercel | ✅ Verificado |
| **Classificação Geral de Risco** | Baixo / Seguro para Uso | ✅ Aprovado |

---

## 2. Camadas de Verificação Realizadas

O **SkillSpector** analisa estaticamente a estrutura dos arquivos de cada skill (`SKILL.md`, scripts auxiliares TypeScript/Python, esquemas YAML e documentação referenciada):

### 🛡️ Injeção de Prompt & Anti-Refusal
- **Varredura de Caracteres Invisíveis e Comentários Ocultos:** Verificação de tags HTML ocultas, caracteres zero-width e comentários que tentem injetar instruções não supervisionadas no LLM.
- **Jailbreaks e System Prompt Overrides:** Detecção de padrões que instruem o agente a ignorar regras do usuário ou do sistema.

### 🔒 Menor Privilégio & Conexões MCP
- **Tool Poisoning & Misuse:** Validação de que nenhuma skill tenta invocar chamadas de sistema excessivas ou manipular ferramentas externas fora do escopo declarado.
- **MCP Least Privilege:** Garantia de que integrações com servidores MCP sigam o princípio de menor privilégio.

### ⚙️ Análise de AST e Superfície de Execução
- **Scripts Bundled:** Análise sintática (AST) de arquivos `.py`, `.js` e `.ts` empacotados nas skills.
- **Deserialização Segura:** Bloqueio de deserializações inseguras (`pickle`, `eval`, `Function`) em scripts de suporte.

### 📦 Integridade da Cadeia de Suprimentos (Supply Chain)
- **Lockfiles e Dependências:** Verificação de manifestos e ausência de pacotes não declarados ou dependências vulneráveis.

---

## 3. Tabela de Skills Auditadas

Todas as 82 skills foram validadas:

| Skill | Categoria | Origem Upstream | Status SkillSpector |
|---|---|---|---|
| `accessibility-audit` | Acessibilidade | Anthropic Skills | ✅ Aprovado |
| `accessibility-diff` | Acessibilidade | Anthropic Skills | ✅ Aprovado |
| `accessibility-fix` | Acessibilidade | Anthropic Skills | ✅ Aprovado |
| `accessibility-inspect` | Acessibilidade | Anthropic Skills | ✅ Aprovado |
| `accessibility-scan` | Acessibilidade | Anthropic Skills | ✅ Aprovado |
| `agents-sdk` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `ai-sdk` | Ferramentas | Vercel AI SDK | ✅ Aprovado |
| `algorithmic-art` | Design UI | Community | ✅ Aprovado |
| `animate` | Animações | Emil Kowalski | ✅ Aprovado |
| `animate-expo` | Animações | Community | ✅ Aprovado |
| `animation-vocabulary` | Animações | Emil Kowalski | ✅ Aprovado |
| `apple-design` | Design UI | Apple HIG Web | ✅ Aprovado |
| `ask-sonner` | Ferramentas | Sonner / Emil Kowalski | ✅ Aprovado |
| `bencium-controlled-ux-designer` | Design UI | Bencium / Community | ✅ Aprovado |
| `bencium-innovative-ux-designer` | Design UI | Bencium / Community | ✅ Aprovado |
| `better-accessibility` | Acessibilidade | Community | ✅ Aprovado |
| `better-colors` | Design UI | Community | ✅ Aprovado |
| `better-interface` | Testes | Community | ✅ Aprovado |
| `better-layout` | Design UI | Community | ✅ Aprovado |
| `better-typography` | Design UI | Community | ✅ Aprovado |
| `better-ui` | Design UI | Community | ✅ Aprovado |
| `better-writing` | Escrita | Community | ✅ Aprovado |
| `brand-guidelines` | Design UI | Anthropic | ✅ Aprovado |
| `break` | Testes | Community | ✅ Aprovado |
| `canvas-design` | Design UI | Community | ✅ Aprovado |
| `claude-api` | Ferramentas | Anthropic API Reference | ✅ Aprovado |
| `cloudflare` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `cloudflare-email-service` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `cloudflare-one` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `cloudflare-one-migrations` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `composio` | Ferramentas | Composio SDK | ✅ Aprovado |
| `daydream` | Ferramentas | Community / Obsidian | ✅ Aprovado |
| `design-taste-frontend` | Design UI | Community | ✅ Aprovado |
| `doc-coauthoring` | Documentos | Anthropic Skills | ✅ Aprovado |
| `docx` | Documentos | Anthropic Skills | ✅ Aprovado |
| `durable-objects` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `emil-design-eng` | Design UI | Emil Kowalski | ✅ Aprovado |
| `explain-interface` | Testes | Community | ✅ Aprovado |
| `extract-design-system` | Design UI | Community | ✅ Aprovado |
| `find-animation-opportunities` | Animações | Emil Kowalski | ✅ Aprovado |
| `frontend-design` | Design UI | Anthropic Official | ✅ Aprovado |
| `high-end-visual-design` | Design UI | Community | ✅ Aprovado |
| `impeccable` | Testes | Community | ✅ Aprovado |
| `improve-animations` | Animações | Emil Kowalski | ✅ Aprovado |
| `interface-review` | Testes | Community | ✅ Aprovado |
| `internal-comms` | Documentos | Anthropic Skills | ✅ Aprovado |
| `mcp-builder` | Ferramentas | Anthropic Skills | ✅ Aprovado |
| `next-cache-components-adoption` | Ferramentas | Next.js Community | ✅ Aprovado |
| `next-cache-components-optimizer` | Ferramentas | Next.js Community | ✅ Aprovado |
| `no-ai-slop` | Escrita | Community | ✅ Aprovado |
| `open-websearch` | Ferramentas | MCP WebSearch | ✅ Aprovado |
| `pdf` | Documentos | Anthropic Skills | ✅ Aprovado |
| `pick-ui-library` | Ferramentas | Community | ✅ Aprovado |
| `playwright-best-practices` | Testes | Playwright Community | ✅ Aprovado |
| `playwright-cli` | Testes | Playwright Community | ✅ Aprovado |
| `pptx` | Documentos | Anthropic Skills | ✅ Aprovado |
| `prototype` | Testes | Community | ✅ Aprovado |
| `review-animations` | Animações | Emil Kowalski | ✅ Aprovado |
| `sandbox-migrate-to-next` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `sandbox-next` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `sandbox-stable` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `shadcn` | Design UI | Shadcn UI | ✅ Aprovado |
| `shared` | Ferramentas | Maleta.dev Shared | ✅ Aprovado |
| `skill-creator` | Ferramentas | Anthropic Skills | ✅ Aprovado |
| `slack-gif-creator` | Animações | Anthropic Skills | ✅ Aprovado |
| `systematic-debugging` | Testes | Obra / Superpowers | ✅ Aprovado |
| `test-driven-development` | Testes | Obra / Superpowers | ✅ Aprovado |
| `theme-factory` | Design UI | Anthropic Skills | ✅ Aprovado |
| `turnstile-spin` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `ui-ux-pro-max` | Design UI | Community | ✅ Aprovado |
| `variant` | Testes | Community | ✅ Aprovado |
| `vercel-composition-patterns` | Ferramentas | Vercel Engineering | ✅ Aprovado |
| `vercel-react-best-practices` | Ferramentas | Vercel Engineering | ✅ Aprovado |
| `verification-before-completion` | Testes | Obra / Superpowers | ✅ Aprovado |
| `web-artifacts-builder` | Design UI | Anthropic Skills | ✅ Aprovado |
| `web-design-guidelines` | Design UI | Anthropic Skills | ✅ Aprovado |
| `web-perf` | Ferramentas | Chrome DevTools MCP | ✅ Aprovado |
| `webapp-testing` | Testes | Anthropic Skills | ✅ Aprovado |
| `workers-best-practices` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `wrangler` | Cloudflare | Cloudflare Skills | ✅ Aprovado |
| `write-swift` | Ferramentas | Apple Swift Reference | ✅ Aprovado |
| `xlsx` | Documentos | Anthropic Skills | ✅ Aprovado |

---

## 4. Como Reproduzir a Auditoria Localmente

Para rodar a mesma auditoria em qualquer máquina com o **NVIDIA SkillSpector**:

```powershell
# Executar a varredura recursiva estática em todas as skills
skillspector scan claude/skills -r --no-llm
```

---

*Relatório gerado em conformidade com as diretrizes do NVIDIA SkillSpector Security Suite.*

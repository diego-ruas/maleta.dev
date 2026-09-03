# Claude Code — maleta.dev

> Leia [AGENTS.md](./AGENTS.md) para arquitetura completa, regras e workflows.

## Regras de economia de tokens
- Responda em português, mínimo de linhas (código à parte).
- Sem preâmbulo ("Claro,", "Entendi,") nem conclusão ("Pronto!", "Espero ter ajudado").
- Não repita o pedido do usuário nem o conteúdo de arquivos na resposta.
- Não resuma o que fez; se indispensável, 1 linha.
- Nunca cole output bruto de comando — informe o resultado em 1 frase.
- Sem markdown explicativo desnecessário; evite listas quando 1 parágrafo basta.
- Não releia arquivo já lido nesta sessão; use offset/limit se precisar de parte específica.
- Para buscar conteúdo: use Grep antes de Read.
- Arquivos longos (>500 linhas): leia só a seção relevante.
- Ao editar: sempre Edit (diff); nunca reescreva o arquivo inteiro com Write.
- Agrupe chamadas de ferramenta independentes numa única mensagem.
- Não rode comando que já rodou; confie no output anterior.
- Não use Read "para confirmar" após escrever; confie no retorno da ferramenta.
- Busca específica: Glob com padrão exato, Grep com contexto mínimo.
- Não explore o codebase "por via das dúvidas"; só o estritamente necessário.
- Sem comentários no código a menos que pedido.
- Menor diff funcional; sem abstração especulativa.
- Não adicione tratamento de erro/validação/logs não pedidos.
- Faça só o que foi pedido; não antecipe próximos passos.
- **Nunca use emojis**: zero emojis em respostas, mensagens, docs ou código. Use apenas os ícones animados do projeto (`site/components/icons/`) e prefixos textuais (`//`, `~`, `->`, `*`).

## Visão geral
Repositório público, somente instalação e construtor customizado de tooling de IA: skills, presets, plugins e configuração para **Claude Code** (`claude/`) e **Codex** (`codex/`). `site/` é o aplicativo web e construtor sob medida (Next.js 15, App Router, `output: 'export'`) publicado na Vercel.

## Regras invioláveis
1. **Nunca commitar dados privados ou credenciais** (`.claude-mem/`, `.credentials.json`, `.env*`, sessions, tokens).
2. **Nunca editar arquivos em `claude/skills/` para personalizá-los** — são cópias de artefatos upstream mantendo licenças intactas.
3. **Repositório somente instalação** — nunca reintroduzir scripts de backup/auto-sync que enviem dados locais ao git.
4. **Mudanças no site (`site/`)**: CSS plano em `site/css/`, ícones animados (padrão pqoqubbw/icons: SVG stroke + `motion/react`, sem fundo preto) em `components/icons/`, estado compartilhado em `lib/toolkitContext.tsx`, catálogo em `lib/data.ts`. Validar sempre com `npm run lint` e `npm run build`.
5. **Scripts PowerShell**: manter compatíveis com PowerShell 5.1 (sem `&&`, sem `??`).
6. **Nunca usar emojis**: use estritamente os ícones do projeto e marcadores textuais.

Para procedimentos operacionais detalhados (adicionar skills, atualizar plugins, workflows do site), consulte [AGENTS.md](./AGENTS.md).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

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

## Visão geral
Repositório público, somente instalação, de tooling de IA: skills, plugins e configuração para **Claude Code** (`claude/`), **opencode** (`opencode/`) e **Antigravity** (`antigravity/`). `site/` é o site estático (Next.js, App Router, `output: 'export'`) publicado na Vercel.

## Regras invioláveis
1. **Nunca commitar dados privados ou credenciais** (`.claude-mem/`, `.credentials.json`, `.env*`, sessions, tokens).
2. **Nunca editar arquivos em `claude/skills/` para personalizá-los** — são cópias de artefatos upstream.
3. **Repositório somente instalação** — nunca reintroduzir scripts de backup/auto-sync que enviem dados locais ao git.
4. **Mudanças no site (`site/`)**: CSS plano em `site/css/`, Pixelarticons com step-timing em `components/icons/`, dados em `lib/data.ts`. Validar sempre com `npm run lint` e `npm run build`.
5. **Scripts PowerShell**: manter compatíveis com PowerShell 5.1 (sem `&&`, sem `??`).

Para procedimentos operacionais detalhados (adicionar skills, atualizar plugins, workflows do site), consulte [AGENTS.md](./AGENTS.md).

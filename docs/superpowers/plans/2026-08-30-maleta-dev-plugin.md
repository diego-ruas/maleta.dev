# Plugin maleta-dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Assign a fresh subagent to every task, then use a different subagent for the review of that task. Do not advance while a reviewer reports a blocker. Repeat the implement -> review -> fix -> verify loop until the reviewer reports zero blockers and all listed commands pass.

**Goal:** Publicar um plugin Codex instalável que ajude a montar kits Maleta e gere comandos de instalação revisáveis, usando o catálogo e os instaladores já existentes como fonte de verdade.

**Architecture:** O plugin é uma camada de orientação, composta por um manifesto Codex e uma única skill `maleta-toolkit`. A skill consulta os arquivos do clone em que está instalada, em vez de embutir dados duplicados. Um marketplace versionado no repositório anuncia o plugin. A página e o README apenas tornam essa capacidade descoberta; não recebem lógica nova de geração de comandos.

**Tech Stack:** JSON, Markdown com YAML frontmatter, Next.js 15, TypeScript, PowerShell 5.1, bash/zsh e os validadores Python já fornecidos pelo skill `plugin-creator`.

**Spec:** `docs/superpowers/specs/2026-08-30-maleta-dev-plugin-design.md`

## Global Constraints

- Sem emojis em código, documentação, UI, mensagens de commit ou respostas do agente.
- Não editar nenhum arquivo sob `claude/skills/`.
- Não copiar a lista de `SKILLS` ou `SKILL_PRESETS` para o plugin.
- Não criar MCP, app, hook, script executável, dependência npm nem automação de instalação.
- A skill deve apresentar, nunca executar, o comando de instalação remoto.
- Comandos Windows devem manter compatibilidade com PowerShell 5.1; Unix com bash e zsh.
- O manifesto deve conter valores reais, `version` semver e nenhuma ocorrência de `[TODO:`.
- O marketplace deve conter `policy.installation: "AVAILABLE"`, `policy.authentication: "ON_INSTALL"` e `category: "Productivity"`.
- Todo subagente deve ler `AGENTS.md`, esta especificação e a tarefa atribuída antes de editar arquivos.
- Depois de cada edição, o responsável roda a menor verificação relevante; o revisor roda as verificações de integração antes de aprovar.

## Arquivos e responsabilidades

| Caminho | Responsabilidade |
| --- | --- |
| `plugins/maleta-dev/.codex-plugin/plugin.json` | Manifesto e metadados de descoberta do plugin Codex. |
| `plugins/maleta-dev/skills/maleta-toolkit/SKILL.md` | Instruções para identificar a intenção, validar nomes no catálogo e apresentar o one-liner correto. |
| `.agents/plugins/marketplace.json` | Marketplace versionado que anuncia o plugin local do repositório. |
| `site/lib/data.ts` | Cartão descritivo de `maleta-dev` na aba Codex, sem mudar o comportamento da UI. |
| `README.md` | Instalação do marketplace e exemplos de uso do plugin. |
| `docs/superpowers/specs/2026-08-30-maleta-dev-plugin-design.md` | Fonte de requisitos já aprovada; não alterar exceto para corrigir contradição descoberta durante a execução. |

## Contratos

### Manifesto do plugin

`plugins/maleta-dev/.codex-plugin/plugin.json` deverá ter esta forma, sem campos de MCP, apps ou hooks:

```json
{
  "name": "maleta-dev",
  "version": "1.0.0",
  "description": "Monta kits Maleta e gera comandos de instalação para Codex e Claude Code.",
  "author": {
    "name": "maleta.dev"
  },
  "license": "MIT",
  "skills": "./skills/",
  "interface": {
    "displayName": "Maleta.dev",
    "shortDescription": "Monte um kit de IA e gere o comando de instalação.",
    "longDescription": "Orienta a escolha de presets e skills do maleta.dev e retorna um comando revisável para instalar o kit.",
    "developerName": "maleta.dev",
    "category": "Productivity",
    "capabilities": ["Guidance"],
    "defaultPrompt": "Monte um kit Maleta para meu projeto e gere o comando de instalação."
  }
}
```

### Marketplace

`.agents/plugins/marketplace.json` deverá conter apenas o marketplace `maleta-dev` e a entrada abaixo nesta primeira versão:

```json
{
  "name": "maleta-dev",
  "interface": {
    "displayName": "maleta.dev"
  },
  "plugins": [
    {
      "name": "maleta-dev",
      "source": {
        "source": "local",
        "path": "./plugins/maleta-dev"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

### Entrada do catálogo web

Adicionar ao grupo de `tool: "Codex"` em `site/lib/data.ts`:

```ts
{
  name: "maleta-dev",
  description: "monta kits personalizados e gera comandos de instalação revisáveis",
  category: "Produtividade",
},
```

## Protocolo de execução com subagentes

Para cada tarefa, o coordenador deve usar dois papéis distintos:

1. **Implementador:** altera somente os arquivos da tarefa e executa suas verificações locais.
2. **Revisor:** não edita antes de relatar; confere escopo, segurança, consistência com a especificação e executa novamente as verificações indicadas.

Se o revisor encontrar falha, o coordenador encaminha o relatório ao implementador, que corrige o menor ponto necessário. Um revisor novo reavalia a mudança. O ciclo termina apenas quando todos os critérios abaixo forem verdadeiros:

- não há bloqueadores ou regressões;
- `validate_plugin.py` termina com código 0;
- os comandos documentados coincidem literalmente com os formatos de `site/public/install.ps1` e `site/public/install.sh`;
- `npm run lint` e `npm run build` terminam com código 0;
- `git diff --check` não produz saída;
- `git status --short` contém somente os arquivos previstos pelo plano.

Não inventar ciclos infinitos: a condição de saída é objetiva. Se três revisores consecutivos apontarem a mesma ambiguidade de requisito, interromper e pedir decisão humana, em vez de alternar mudanças sem convergir.

---

### Task 1: Criar e validar o esqueleto do plugin e marketplace

**Files:**
- Create: `plugins/maleta-dev/.codex-plugin/plugin.json`
- Create: `plugins/maleta-dev/skills/maleta-toolkit/`
- Create: `.agents/plugins/marketplace.json`
- Test: validação do plugin e parse de JSON

**Interfaces:**
- Consumes: o contrato de manifesto e marketplace acima.
- Produces: uma raiz de plugin validável, consumida pela Task 2.

- [ ] **Step 1: Delegar o esqueleto para um subagente implementador**

  Instrução de despacho:

  ```text
  Leia AGENTS.md, a especificação do plugin e a Task 1 deste plano. Crie somente
  o esqueleto do plugin e marketplace. Use o script create_basic_plugin.py para
  gerar a estrutura, depois ajuste apenas os valores definidos pelo contrato.
  Não crie MCP, apps, hooks, scripts ou assets. Execute as verificações da tarefa
  e reporte os comandos e saídas relevantes.
  ```

- [ ] **Step 2: Gerar a estrutura mínima pela ferramenta existente**

  Run, a partir da raiz do repositório:

  ```powershell
  python C:\Users\diego\.codex\skills\.system\plugin-creator\scripts\create_basic_plugin.py maleta-dev --path plugins --marketplace-path .agents\plugins\marketplace.json --with-skills --with-marketplace
  ```

  Expected: cria `plugins/maleta-dev/.codex-plugin/plugin.json`,
  `plugins/maleta-dev/skills/` e `.agents/plugins/marketplace.json` sem sobrescrever arquivo existente.

- [ ] **Step 3: Substituir o manifesto pelo contrato final**

  Garanta que o arquivo tenha exatamente os campos mostrados em **Manifesto do plugin**. Não inclua `homepage`, `repository`, URLs de política, ícones ou screenshots: não são necessários para instalar nem usar o plugin.

- [ ] **Step 4: Conferir o marketplace final**

  Garanta que o arquivo tenha exatamente a estrutura em **Marketplace** e que `source.path` seja `./plugins/maleta-dev`.

- [ ] **Step 5: Executar as verificações locais**

  Run:

  ```powershell
  python -m json.tool plugins\maleta-dev\.codex-plugin\plugin.json *> $null
  python -m json.tool .agents\plugins\marketplace.json *> $null
  python C:\Users\diego\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py plugins\maleta-dev
  ```

  Expected: os dois parsers JSON terminam com código 0 e o validador informa sucesso para `maleta-dev`.

- [ ] **Step 6: Delegar revisão independente**

  Instrução de despacho:

  ```text
  Revise a Task 1 sem editar inicialmente. Confirme o nome em pasta, manifesto e
  marketplace; a semver; os campos obrigatórios; a ausência de MCP/apps/hooks;
  e a política completa do marketplace. Rode o validador do plugin e reporte
  bloqueadores concretos, ou "zero bloqueadores".
  ```

- [ ] **Step 7: Corrigir e repetir a revisão até zero bloqueadores**

  Se houver achado, o implementador corrige exclusivamente o item apontado. Um novo revisor repete o Step 6. Só então seguir para a Task 2.

- [ ] **Step 8: Commit atômico**

  ```powershell
  git add plugins/maleta-dev .agents/plugins/marketplace.json
  git commit -m "feat: adicionar plugin maleta-dev"
  ```

---

### Task 2: Escrever a skill de montagem e instalação revisável

**Files:**
- Create: `plugins/maleta-dev/skills/maleta-toolkit/SKILL.md`
- Test: validação de frontmatter, busca estática por duplicação e inspeção dos exemplos

**Interfaces:**
- Consumes: `site/lib/data.ts` (`SKILL_PRESETS` e `SKILLS`) e os formatos de comando em `site/lib/toolkitContext.tsx`.
- Produces: a skill implicitamente invocável `maleta-toolkit`, validada pela Task 3.

- [ ] **Step 1: Delegar a skill para um subagente implementador**

  Instrução de despacho:

  ```text
  Leia AGENTS.md, a especificação e a Task 2. Escreva somente SKILL.md. A skill
  deve orientar o agente a consultar o catálogo atual do clone, validar os nomes
  selecionados, escolher os parâmetros de ferramentas e SO e apresentar um único
  comando para revisão humana. Ela não pode conter a lista de skills/presets,
  instalar nada, pedir credenciais ou criar arquivos. Preserve o português e não
  use emojis.
  ```

- [ ] **Step 2: Criar frontmatter compatível**

  O arquivo deve começar exatamente com:

  ```markdown
  ---
  name: maleta-toolkit
  description: Monta kits maleta.dev e gera comandos de instalação revisáveis para Claude Code e Codex.
  ---
  ```

- [ ] **Step 3: Definir o fluxo operacional da skill**

  Depois do frontmatter, incluir estas regras explícitas:

  ```markdown
  ## Fonte de verdade

  Leia `site/lib/data.ts` no clone atual para descobrir `SKILL_PRESETS` e `SKILLS`.
  Não mantenha uma lista própria nem aceite como válida uma skill ausente desse arquivo.

  ## Fluxo

  1. Descubra se o pedido é pacote completo, preset ou seleção de skills.
  2. Se faltar a ferramenta, assuma `all`; se faltar o sistema, pergunte se deve gerar PowerShell ou bash.
  3. Para um preset, obtenha os nomes do `skills` correspondente em `SKILL_PRESETS`.
  4. Para skills informadas, confira cada `name` em `SKILLS`; enumere os inválidos e não gere comando até a seleção ser corrigida.
  5. Ordene os nomes válidos alfabeticamente antes de gerar o comando.
  6. Mostre o comando em bloco de código e diga que a pessoa deve revisá-lo e executá-lo no próprio terminal.
  ```

- [ ] **Step 4: Fixar os modelos exatos de comando na skill**

  Incluir os dois formatos, usando `<tools>` somente quando for diferente de `all` e `<skill1,skill2>` para a lista ordenada:

  ```markdown
  PowerShell:
  `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools <tools> -Skills @('<skill1>','<skill2>')`

  bash/zsh:
  `curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools <tools> --skills <skill1,skill2>`
  ```

  Acrescentar a regra: sem seleção de skills, omitir integralmente `-Skills ...` ou `--skills ...`; com `all`, omitir integralmente `-Tools all` ou `--tools all`.

- [ ] **Step 5: Incluir segurança e comportamento de ajuda**

  Acrescentar estas regras concisas:

  ```markdown
  Nunca execute o comando, nem sugira `iex`, `Invoke-Expression` ou credenciais.
  Informe que Codex instala skills em `~/.agents/skills` e MCP em `~/.codex/config.toml`.
  Quando a pessoa quiser explorar opções visualmente, direcione para https://maleta.dev.
  ```

- [ ] **Step 6: Executar verificações locais**

  Run:

  ```powershell
  python C:\Users\diego\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py plugins\maleta-dev
  rg -n "^\s*-\s*name:|^\s*name:" plugins\maleta-dev\skills\maleta-toolkit\SKILL.md
  rg -n -i "\[TODO:|invoke-expression|\biex\b|token|api key|npm install" plugins\maleta-dev\skills\maleta-toolkit\SKILL.md
  ```

  Expected: o validador passa; a busca mostra apenas `name: maleta-toolkit` no frontmatter; a última busca não retorna linhas.

- [ ] **Step 7: Delegar revisão adversarial independente**

  Instrução de despacho:

  ```text
  Revise a Task 2 sem editar inicialmente. Simule quatro pedidos: instalar tudo
  no Windows, preset essentials no Codex/Linux, duas skills válidas para Claude,
  e uma skill inexistente. Confirme que a skill consulta o catálogo, usa a
  sintaxe exata dos instaladores, não duplica dados e nunca executa a instalação.
  Rode as verificações e reporte bloqueadores ou "zero bloqueadores".
  ```

- [ ] **Step 8: Corrigir e repetir a revisão até zero bloqueadores**

  Aplicar apenas correções diretamente ligadas aos achados. Usar novo revisor após cada ajuste.

- [ ] **Step 9: Commit atômico**

  ```powershell
  git add plugins/maleta-dev/skills/maleta-toolkit/SKILL.md
  git commit -m "feat: orientar kits personalizados pelo plugin"
  ```

---

### Task 3: Expor o plugin no catálogo e documentar a instalação

**Files:**
- Modify: `site/lib/data.ts` na lista `PLUGIN_GROUPS`, grupo `Codex`
- Modify: `README.md` após a seção “Método 2: Instalador Local (Git Clone)” 
- Test: lint, build e verificação estática de documentação

**Interfaces:**
- Consumes: o plugin e marketplace criados nas Tasks 1 e 2; `PLUGIN_GROUPS`, que já alimenta `PluginsSection` e `ToolsGrid` automaticamente.
- Produces: descoberta web e documentação de uso, validadas pela Task 4.

- [ ] **Step 1: Delegar documentação e catálogo para um subagente implementador**

  Instrução de despacho:

  ```text
  Leia AGENTS.md, a especificação e a Task 3. Modifique somente site/lib/data.ts
  e README.md. Reuse PLUGIN_GROUPS; não crie componente, estado, CSS, dependência
  ou lógica de seleção. Escreva a documentação em português, sem emojis, com os
  comandos de marketplace e instalação revisáveis.
  ```

- [ ] **Step 2: Adicionar a entrada Codex no catálogo**

  Inserir a entrada do contrato em `site/lib/data.ts` dentro de `PLUGIN_GROUPS`, no `items` cujo `tool` é `Codex`, antes dos MCPs existentes. Não alterar os itens `open-websearch` e `context7`.

- [ ] **Step 3: Documentar o fluxo de instalação no README**

  Logo após “Método 2: Instalador Local (Git Clone)”, inserir a seção:

  ```markdown
  ### Plugin do Codex

  Se você usa o Codex e quer ajuda para escolher um preset ou montar uma seleção de skills, instale o plugin local a partir do clone:

  ```powershell
  codex plugin marketplace add .agents/plugins
  codex plugin install maleta-dev
  ```

  O plugin gera comandos para você revisar antes de executar. Ele não envia dados pessoais, não instala nada automaticamente e usa o catálogo deste repositório como fonte de verdade.
  ```

  Se o CLI exigir o caminho absoluto, documentar também o equivalente: `codex plugin marketplace add <caminho-absoluto-do-clone>\.agents\plugins`. Não incluir deep links de aplicativo, pois o marketplace é do repositório e não o pessoal criado pelo skill.

- [ ] **Step 4: Verificar que não houve alteração funcional não solicitada**

  Run:

  ```powershell
  git diff -- site/lib/data.ts README.md
  rg -n "maleta-dev|Plugin do Codex" site\lib\data.ts README.md
  ```

  Expected: somente a entrada descritiva e a seção de documentação novas; nenhum arquivo de UI, CSS ou instalador modificado.

- [ ] **Step 5: Executar validação do site**

  Run, dentro de `site/`:

  ```powershell
  npm run lint
  npm run build
  ```

  Expected: ambos terminam com código 0; o build estático conclui sem erro de TypeScript.

- [ ] **Step 6: Delegar revisão independente**

  Instrução de despacho:

  ```text
  Revise a Task 3 sem editar inicialmente. Verifique se PLUGIN_GROUPS já alimenta
  a seção existente sem código novo, se a entrada descreve apenas o que o plugin
  faz e se README apresenta comandos copiáveis coerentes com o marketplace.
  Rode lint e build no site. Reporte bloqueadores ou "zero bloqueadores".
  ```

- [ ] **Step 7: Corrigir e repetir a revisão até zero bloqueadores**

  Não alterar a arquitetura por preferência estética; corrigir somente achados verificáveis de conteúdo, compatibilidade ou regressão.

- [ ] **Step 8: Commit atômico**

  ```powershell
  git add site/lib/data.ts README.md
  git commit -m "docs: documentar plugin maleta-dev"
  ```

---

### Task 4: Verificação final, revisão de integração e ciclo de qualidade

**Files:**
- Verify: todos os arquivos criados/modificados nas Tasks 1–3
- Test: validação de plugin, JSON, busca de segredos, lint, build e escopo Git

**Interfaces:**
- Consumes: o produto integrado das Tasks 1–3.
- Produces: uma mudança pronta para revisão humana e merge, ou um relatório de bloqueio objetivo.

- [ ] **Step 1: Delegar auditoria de integração para um subagente revisor novo**

  Instrução de despacho:

  ```text
  Faça uma auditoria de integração, sem editar antes de relatar. Leia AGENTS.md,
  a especificação, o plano e todos os arquivos alterados. Avalie: instalação do
  marketplace, integridade do manifesto, qualidade e segurança da skill,
  coerência literal dos comandos, descoberta no site, documentação, escopo e
  ausência de dados privados. Rode todas as verificações desta tarefa. Liste
  bloqueadores por arquivo/linha ou responda "zero bloqueadores".
  ```

- [ ] **Step 2: Rodar a suíte final**

  Run, na raiz:

  ```powershell
  python C:\Users\diego\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py plugins\maleta-dev
  python -m json.tool plugins\maleta-dev\.codex-plugin\plugin.json *> $null
  python -m json.tool .agents\plugins\marketplace.json *> $null
  rg -n -i "\[TODO:|api[_ -]?key|secret|token|password|\.env" plugins\maleta-dev .agents\plugins\marketplace.json README.md site\lib\data.ts
  rg -n "opencode|Invoke-Expression|\biex\b" plugins\maleta-dev README.md site\lib\data.ts
  git diff --check
  git status --short
  git diff --stat HEAD~3..HEAD
  ```

  Then run, inside `site/`:

  ```powershell
  npm run lint
  npm run build
  ```

  Expected: os parsers e o validador passam; as duas buscas não retornam linhas; `git diff --check` não retorna saída; após os commits das tarefas, `git status --short` não retorna saída; o diff acumulado referencia somente os caminhos definidos em “Arquivos e responsabilidades”; lint e build passam.

- [ ] **Step 3: Corrigir cada bloqueador pelo responsável original**

  Para cada achado, encaminhar o texto integral ao implementador da tarefa correspondente. O implementador deve fazer a menor mudança capaz de remover a causa e rodar a verificação que falhou.

- [ ] **Step 4: Repetir a auditoria com revisor novo**

  Reexecutar Steps 1 e 2 após toda correção. Continuar o ciclo até o relatório conter `zero bloqueadores` e todas as verificações tiverem saída esperada. Não encerrar com “parece correto”.

- [ ] **Step 5: Revisão humana final**

  Apresentar à pessoa responsável:

  ```text
  - manifesto validado;
  - skill não executa instalação e não duplica o catálogo;
  - marketplace e README usam o mesmo plugin maleta-dev;
  - catálogo web o exibe para Codex;
  - lint e build passaram;
  - auditoria independente: zero bloqueadores.
  ```

  Solicitar aprovação antes de criar PR, publicar marketplace remoto ou alterar o instalador padrão.

## Auto-revisão do plano

- Cobertura: Tasks 1 e 2 implementam o plugin e sua função dupla; Task 3 cobre descoberta e documentação; Task 4 cobre validação e o ciclo de qualidade exigido.
- Sem placeholders: caminhos, contratos, comandos, mensagens de despacho, critérios de aceite e condições de saída estão explícitos.
- Consistência: o único nome do plugin é `maleta-dev`; a única skill é `maleta-toolkit`; o catálogo continua em `site/lib/data.ts`; os comandos remotos continuam em `site/public/install.ps1` e `site/public/install.sh`.

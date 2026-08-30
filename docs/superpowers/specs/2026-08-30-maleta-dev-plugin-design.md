# Plugin maleta-dev — Especificação

Data: 2026-08-30  
Status: proposto

## Objetivo

Disponibilizar um plugin Codex instalável que ajude a pessoa a descobrir o
conteúdo curado do maleta.dev e a gerar o comando de instalação de um kit
personalizado, sem duplicar skills, instaladores ou configurações pessoais.

## Contexto

O repositório já contém a fonte de verdade necessária:

- `claude/skills/` contém as skills distribuídas pelos instaladores.
- `site/lib/data.ts` descreve o catálogo público de skills, presets e plugins.
- `site/public/install.ps1` e `site/public/install.sh` recebem as seleções e
  instalam o kit remoto.
- `scripts/install.ps1` e `scripts/install.sh` são o equivalente para clones
  locais.

O plugin não deve manter uma lista duplicada de skills. Isto criaria divergência
com o catálogo e os instaladores já existentes.

## Escopo

### Plugin Codex

Criar `plugins/maleta-dev/` com `.codex-plugin/plugin.json` válido. O manifesto
declara somente a skill própria do plugin; não declara MCP, apps, hooks ou
scripts, pois o primeiro lançamento não precisa deles.

### Skill `maleta-toolkit`

Criar `plugins/maleta-dev/skills/maleta-toolkit/SKILL.md`. A skill orienta o
Codex a:

1. identificar se a pessoa quer instalar o pacote completo, um preset ou uma
   seleção de skills;
2. conferir os nomes de skills diretamente no catálogo atual do repositório;
3. gerar um único comando para PowerShell ou bash usando `install.ps1` ou
   `install.sh` hospedados em `maleta.dev`;
4. explicar que Codex recebe skills em `~/.agents/skills` e MCP em
   `~/.codex/config.toml`;
5. encaminhar para `https://maleta.dev` quando uma escolha visual de presets e
   skills for mais adequada.

A skill não executa instalação automaticamente. Ela apresenta o comando para a
pessoa revisar e executar, preservando o modelo de segurança atual do projeto.

### Marketplace do repositório

Criar `.agents/plugins/marketplace.json`, declarando a origem local
`./plugins/maleta-dev`. Este é um marketplace do repositório, não o marketplace
pessoal do usuário. A entrada usa `AVAILABLE`, `ON_INSTALL` e categoria
`Productivity`.

### Documentação e descoberta

Atualizar `README.md` com uma seção curta de instalação do plugin a partir de
um clone. Atualizar `site/lib/data.ts` para mostrar `maleta-dev` como plugin do
Codex, com descrição fiel: geração assistida de kits e comandos de instalação.

## Fora de escopo

- Copiar qualquer conteúdo de `claude/skills/` para o plugin.
- Criar servidor MCP, aplicativo, hook, script de instalação ou dependência npm.
- Executar os instaladores pelo plugin.
- Alterar os formatos de comando, presets ou catálogo existentes.
- Instalar o marketplace no perfil do usuário durante o install padrão.

## Fluxo

1. A pessoa adiciona o marketplace deste clone e instala `maleta-dev` pelo
   Codex.
2. O Codex carrega a skill quando o pedido envolve montar ou instalar um kit
   Maleta.
3. A skill consulta o catálogo versionado no clone.
4. O Codex retorna o comando remoto apropriado ao sistema operacional e às
   seleções válidas.
5. A pessoa revisa e roda o comando no terminal.

## Restrições globais

- Sem emojis em arquivos, mensagens ou commits.
- Não incluir dados pessoais, chaves, tokens ou configurações privadas.
- Não editar arquivos dentro de `claude/skills/`.
- Não adicionar dependências.
- Manter o PowerShell 5.1 e bash/zsh no formato de comando já suportado.
- O plugin deve passar no validador do `plugin-creator`.

## Critérios de aceite

- `plugins/maleta-dev/.codex-plugin/plugin.json` é válido e tem o mesmo nome
  normalizado da pasta.
- `.agents/plugins/marketplace.json` tem uma entrada completa e válida para
  `maleta-dev`.
- A skill não contém uma lista duplicada de skills nem instrui a executar
  instalação sem revisão humana.
- Os exemplos de comandos são consistentes com `site/public/install.ps1` e
  `site/public/install.sh`.
- `site/lib/data.ts` exibe o plugin para Codex.
- O README explica a instalação do marketplace e do plugin.
- `npm run lint`, `npm run build` e a validação do plugin passam.

## Riscos e decisão

O plugin depende de um clone do repositório para acessar o catálogo completo.
Esta é uma escolha deliberada: o catálogo permanece único e versionado. Caso
seja necessário instalar sem clone no futuro, o próximo passo é publicar um
marketplace remoto; não duplicar o catálogo dentro do plugin.

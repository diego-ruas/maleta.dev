---
name: maleta-toolkit
description: Monta kits maleta.dev e gera comandos de instalação revisáveis para Claude Code e Codex.
---

## Fonte de verdade

Leia `site/lib/data.ts` no clone atual para descobrir `SKILL_PRESETS` e `SKILLS`.
Não mantenha uma lista própria nem aceite como válida uma skill ausente desse arquivo.

## Fluxo

1. Descubra se o pedido é pacote completo, preset ou seleção de skills.
2. Se faltar a ferramenta, assuma `all`; se faltar o sistema, pergunte se deve gerar PowerShell ou bash.
3. Para um preset, obtenha os nomes do `skills` correspondente em `SKILL_PRESETS`.
4. Para skills informadas, confira cada `name` em `SKILLS`; enumere os inválidos e não gere comando até a seleção ser corrigida.
5. Ordene os nomes válidos alfabeticamente antes de gerar o comando.
6. Mostre um único comando em bloco de código e diga que a pessoa deve revisá-lo e executá-lo no próprio terminal.

## Formatos de comando

PowerShell:
`& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools <tools> -Skills @('<skill1>','<skill2>')`

bash/zsh:
`curl -fsSL https://maleta.dev/install.sh | bash -s -- --tools <tools> --skills <skill1,skill2>`

Use `<tools>` somente quando for diferente de `all` e `<skill1,skill2>` para a lista ordenada. Sem seleção de skills, omita integralmente `-Skills ...` ou `--skills ...`; com `all`, omita integralmente `-Tools all` ou `--tools all`.

## Segurança e ajuda

Nunca execute o comando, recomende avaliação dinâmica de texto remoto ou peça credenciais.
Informe que Codex instala skills em `~/.agents/skills` e MCP em `~/.codex/config.toml`.
Quando a pessoa quiser explorar opções visualmente, direcione para https://maleta.dev.

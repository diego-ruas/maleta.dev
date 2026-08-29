# Global Rules — personal coding agent

## Use skills and plugins whenever possible
- Before any task, check the available-skills list and load the one matching the
  work: creating a feature -> brainstorming; debugging -> systematic-debugging;
  implementing -> test-driven-development; claiming done ->
  verification-before-completion; UI -> frontend-design / ui-ux-pro-max;
  accessibility -> accessibility-*; Cloudflare -> cloudflare-*.
- Never hand-roll a workflow a skill already encodes. Plugins active in this
  environment: ponytail (laziness) — follow it.
- Skills auto-load from ~/.claude/skills, ~/.agents/skills. If none applies,
  say so in one line and proceed — no stalling on skill hunting.

## Operating basics
- Verify before claiming completion: run the relevant command, confirm output.
- Shortest correct change; match existing conventions. No boilerplate.
- Never commit secrets or private data.
- Never use emojis anywhere; use only project Pixelarticons and text prefixes (`//`, `~`, `->`, `*`).
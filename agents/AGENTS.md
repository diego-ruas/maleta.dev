# Global Rules — Universal AI Coding Agent

## Use skills whenever possible
- Before any task, check available skills (~/.agents/skills) and load the one matching the work:
  creating a feature -> brainstorming; debugging -> systematic-debugging;
  implementing -> test-driven-development; claiming done -> verification-before-completion;
  UI -> frontend-design / ui-ux-pro-max; accessibility -> accessibility-*; Cloudflare -> cloudflare-*.
- Never hand-roll a workflow a skill already encodes.
- Skills auto-load from ~/.agents/skills, ~/.claude/skills.

## Operating basics
- Verify before claiming completion: run the relevant command, confirm output.
- Shortest correct change; match existing conventions. No boilerplate.
- Never commit secrets or private data.
- Never use emojis anywhere; use only project Pixelarticons and text prefixes (`//`, `~`, `->`, `*`).
- Before acting, ask for clarification when ambiguous or underspecified — offer concrete options.

# GitHub Copilot Instructions — maleta.dev

Always read and follow the guidance, architecture, and rules in [AGENTS.md](../AGENTS.md).

## Critical Guidelines
1. **Public install-only repo**: Never commit API keys, tokens, session state, `.claude-mem/`, `.credentials.json`, or `.env*` files.
2. **Third-party skills (`claude/skills/`)**: Keep exact upstream copies; do not customize or strip license files.
3. **Website (`site/`)**: Next.js App Router static export (`output: 'export'`), no Tailwind/CSS frameworks (plain CSS tokens in `site/css/`), Pixelarticons animated with `motion/react`. Always run `npm run lint` and `npm run build` before completion.
4. **PowerShell scripts**: Windows PowerShell 5.1 compatibility required.

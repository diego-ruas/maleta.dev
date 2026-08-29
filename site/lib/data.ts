export const CATEGORIES = [
  { label: "Todas", key: "all" },
  { label: "Acessibilidade", key: "Acessibilidade" },
  { label: "Animações", key: "Animações" },
  { label: "Cloudflare", key: "Cloudflare" },
  { label: "Design UI", key: "Design UI" },
  { label: "Documentos", key: "Documentos" },
  { label: "Testes", key: "Testes" },
  { label: "Escrita", key: "Escrita" },
  { label: "Ferramentas", key: "Ferramentas" },
] as const;

export type SkillCategory = Exclude<(typeof CATEGORIES)[number]["key"], "all">;

export interface Skill {
  name: string;
  category: SkillCategory | string;
  description: string;
}

export interface PluginItem {
  name: string;
  description: string;
}

export interface PluginGroup {
  tool: string;
  items: PluginItem[];
}

export interface SkillPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  skills: string[];
}

export const SKILL_PRESETS: SkillPreset[] = [
  {
    id: "essentials",
    name: "Essenciais",
    badge: "Recomendado",
    description: "TDD, testes, design anti-slop, debugging e coautoria de documentação.",
    skills: [
      "design-taste-frontend",
      "emil-design-eng",
      "no-ai-slop",
      "systematic-debugging",
      "test-driven-development",
      "verification-before-completion",
      "webapp-testing",
      "doc-coauthoring",
      "ask-sonner",
    ],
  },
  {
    id: "frontend",
    name: "Frontend & UI/UX",
    badge: "UI/UX",
    description: "Design anti-slop, micro-interações, tipografia, cores e design systems.",
    skills: [
      "design-taste-frontend",
      "emil-design-eng",
      "no-ai-slop",
      "frontend-design",
      "shadcn",
      "theme-factory",
      "better-ui",
      "better-colors",
      "better-typography",
      "better-layout",
      "ui-ux-pro-max",
      "high-end-visual-design",
      "web-artifacts-builder",
      "web-design-guidelines",
      "ask-sonner",
      "animate",
      "animation-vocabulary",
      "find-animation-opportunities",
    ],
  },
  {
    id: "a11y",
    name: "Acessibilidade",
    badge: "WCAG 2.2",
    description: "Auditoria, scan mecânico, diff de regressão e remediação acessível.",
    skills: [
      "accessibility-audit",
      "accessibility-diff",
      "accessibility-fix",
      "accessibility-inspect",
      "accessibility-scan",
      "better-accessibility",
    ],
  },
  {
    id: "nextjs",
    name: "Next.js & Vercel",
    badge: "Next.js",
    description: "Component cache, padrões de composição, performance e sandbox Next.",
    skills: [
      "next-cache-components-adoption",
      "next-cache-components-optimizer",
      "vercel-composition-patterns",
      "vercel-react-best-practices",
      "web-perf",
      "sandbox-next",
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare & Edge",
    badge: "Edge & IA",
    description: "Workers, Durable Objects, Agents SDK, Cloudflare One e Wrangler.",
    skills: [
      "cloudflare",
      "agents-sdk",
      "durable-objects",
      "workers-best-practices",
      "wrangler",
      "cloudflare-email-service",
      "cloudflare-one",
      "turnstile-spin",
    ],
  },
  {
    id: "testing",
    name: "Testes & Qualidade",
    badge: "Testes",
    description: "Playwright, TDD rigoroso, debugging sistemático e testes de regressão.",
    skills: [
      "test-driven-development",
      "verification-before-completion",
      "systematic-debugging",
      "playwright-best-practices",
      "playwright-cli",
      "webapp-testing",
      "interface-review",
      "break",
    ],
  },
  {
    id: "docs",
    name: "Documentos",
    badge: "Docs & Mídia",
    description: "Manipulação de DOCX, XLSX, PDF, PPTX e comunicação interna.",
    skills: [
      "docx",
      "xlsx",
      "pdf",
      "pptx",
      "canvas-design",
      "doc-coauthoring",
      "better-writing",
      "internal-comms",
    ],
  },
];

export const SKILLS: Skill[] = [
  {
    name: "accessibility-audit",
    category: "Acessibilidade",
    description:
      "Auditoria de acessibilidade (a11y) de um site ou produto inteiro contra WCAG 2.2, seguindo a metodologia WCAG-EM.",
  },
  {
    name: "accessibility-diff",
    category: "Acessibilidade",
    description:
      "Verificação de regressão — compara as violações de acessibilidade (a11y) de uma página ao vivo contra uma linha de base.",
  },
  {
    name: "accessibility-fix",
    category: "Acessibilidade",
    description:
      "Somente remediação — corrige violações de acessibilidade (a11y) contra WCAG 2.2 com um loop de linha de base, edição e verificação.",
  },
  {
    name: "accessibility-inspect",
    category: "Acessibilidade",
    description:
      "Uma página, tier manual — conduz uma página ao vivo pelos checks de acessibilidade (a11y) que um rule engine não decide.",
  },
  {
    name: "accessibility-scan",
    category: "Acessibilidade",
    description:
      "Uma página, tier automatizado — roda o rule engine de acessibilidade (a11y) numa página ao vivo e localiza cada violação que detecta mecanicamente.",
  },
  {
    name: "agents-sdk",
    category: "Cloudflare",
    description:
      "Construa agentes de IA em Cloudflare Workers usando o Agents SDK.",
  },
  {
    name: "ai-sdk",
    category: "Ferramentas",
    description:
      "Responda perguntas sobre o AI SDK e ajude a construir funcionalidades com IA.",
  },
  {
    name: "algorithmic-art",
    category: "Design UI",
    description:
      "Criação de arte algorítmica com p5.js, aleatoriedade com seed e exploração interativa de parâmetros.",
  },
  {
    name: "animate",
    category: "Animações",
    description:
      "Construa uma animação do zero, tomando as decisões na ordem que determina se ela funciona — se deve animar, com qual propósito e qual ferramenta.",
  },
  {
    name: "animate-expo",
    category: "Animações",
    description:
      "Construa animações em React Native e Expo, tomando as decisões na ordem que determina se elas funcionam — se deve animar e em qual thread roda.",
  },
  {
    name: "animation-vocabulary",
    category: "Animações",
    description:
      "Glossário de consulta reversa que transforma uma descrição vaga de animação ou efeito de movimento no termo exato.",
  },
  {
    name: "apple-design",
    category: "Design UI",
    description:
      "A abordagem da Apple para design de interface e movimento físico e fluido, traduzida para a web.",
  },
  {
    name: "ask-sonner",
    category: "Ferramentas",
    description:
      "Guia de Sonner, a biblioteca de toasts do React — instale e configure o Toaster, escolha a chamada toast() certa, toasts de promise e loading.",
  },
  {
    name: "bencium-controlled-ux-designer",
    category: "Design UI",
    description:
      "Orientação especializada de UI/UX para interfaces únicas e acessíveis.",
  },
  {
    name: "bencium-innovative-ux-designer",
    category: "Design UI",
    description:
      "Crie interfaces frontend distintivas e prontas para produção, com alta qualidade de design.",
  },
  {
    name: "better-accessibility",
    category: "Acessibilidade",
    description: "Engenharia de acessibilidade para interfaces de produtos.",
  },
  {
    name: "better-colors",
    category: "Design UI",
    description: "Sistemas de cor para produtos digitais.",
  },
  {
    name: "better-interface",
    category: "Testes",
    description: "Revisão de interface interdisciplinar.",
  },
  {
    name: "better-layout",
    category: "Design UI",
    description: "Estrutura de layout para interfaces web.",
  },
  {
    name: "better-typography",
    category: "Design UI",
    description: "Tipografia web.",
  },
  {
    name: "better-ui",
    category: "Design UI",
    description:
      "Princípios de engenharia de design para interfaces com acabamento polido.",
  },
  {
    name: "better-writing",
    category: "Escrita",
    description: "UX writing e copy de interface.",
  },
  {
    name: "brand-guidelines",
    category: "Design UI",
    description:
      "Aplica as cores e tipografia oficiais da Anthropic a artefatos que se beneficiam do visual da Anthropic.",
  },
  {
    name: "break",
    category: "Testes",
    description:
      'Responde "isso sobrevive?" para um componente — renderiza-o em todos os estados que o uso real pode colocar.',
  },
  {
    name: "canvas-design",
    category: "Design UI",
    description:
      "Crie arte visual bonita em documentos .png e .pdf usando filosofia de design.",
  },
  {
    name: "claude-api",
    category: "Ferramentas",
    description:
      "Referência da Claude API / SDK Anthropic — ids de modelo, preços, parâmetros, streaming, tool use, MCP, agentes.",
  },
  {
    name: "cloudflare",
    category: "Cloudflare",
    description:
      "Skill abrangente da plataforma Cloudflare cobrindo Workers, Pages, storage (KV, D1, R2), IA (Workers AI, Vectorize, Agents SDK).",
  },
  {
    name: "cloudflare-email-service",
    category: "Cloudflare",
    description:
      "Envie e receba e-mails transacionais com o Cloudflare Email Service (Email Sending + Email Routing).",
  },
  {
    name: "cloudflare-one",
    category: "Cloudflare",
    description:
      "Orienta o trabalho de Zero Trust e SASE do Cloudflare One em Access, Gateway, WARP, Tunnel, Cloudflare WAN, DLP, CASB.",
  },
  {
    name: "cloudflare-one-migrations",
    category: "Cloudflare",
    description:
      "Planeja migrações de Zscaler ZIA/ZPA, Palo Alto, VPN legada, SWG ou stacks SASE para o Cloudflare One.",
  },
  {
    name: "composio",
    category: "Ferramentas",
    description:
      "Use 1000+ aplicativos externos via Composio — direto pela CLI ou construindo agentes e apps de IA com o SDK.",
  },
  {
    name: "daydream",
    category: "Ferramentas",
    description:
      "Sistema multi-agente que minera o cofre Obsidian em busca de conexões não óbvias entre notas.",
  },
  {
    name: "design-taste-frontend",
    category: "Design UI",
    description:
      "Skill de frontend anti-slop para landing pages, portfólios e redesigns.",
  },
  {
    name: "doc-coauthoring",
    category: "Documentos",
    description:
      "Guia usuários por um fluxo de trabalho estruturado para coautoria de documentação.",
  },
  {
    name: "docx",
    category: "Documentos",
    description:
      "Crie, leia, edite ou manipule documentos do Word (.docx) ou modelos do Word (.dotx).",
  },
  {
    name: "durable-objects",
    category: "Cloudflare",
    description: "Crie e revise Cloudflare Durable Objects.",
  },
  {
    name: "emil-design-eng",
    category: "Design UI",
    description:
      "Esta skill codifica a filosofia de Emil Kowalski sobre polimento de UI, design de componentes e decisões de animação.",
  },
  {
    name: "explain-interface",
    category: "Testes",
    description: 'Responde "como isso foi construído?" sobre uma interface.',
  },
  {
    name: "extract-design-system",
    category: "Design UI",
    description:
      "Extrai primitivas de design de um site público e gera arquivos de tokens iniciais para o seu projeto.",
  },
  {
    name: "find-animation-opportunities",
    category: "Animações",
    description:
      "Busca num codebase ou UI lugares que não animam mas deveriam, e rejeita tudo o que não deveria.",
  },
  {
    name: "frontend-design",
    category: "Design UI",
    description:
      "Orientação para design visual distintivo e intencional ao construir nova UI ou reformular uma existente.",
  },
  {
    name: "high-end-visual-design",
    category: "Design UI",
    description: "Ensina a IA a desenhar como uma agência de alto nível.",
  },
  {
    name: "impeccable",
    category: "Testes",
    description:
      "Desenhe, redesenhe, modele, critique, audite, polia, clarifique, destile, endureça, otimize, adapte, anime, colore, extraia.",
  },
  {
    name: "improve-animations",
    category: "Animações",
    description:
      "Levanta o codebase de animação e movimento como um consultor sênior de motion e produz uma auditoria priorizada e planos de implementação.",
  },
  {
    name: "interface-review",
    category: "Testes",
    description:
      "Revisão de interface de uma mudança em vez de uma tela: trabalho não commitado, a branch atual ou um pull request.",
  },
  {
    name: "internal-comms",
    category: "Documentos",
    description:
      "Um conjunto de recursos para escrever todos os tipos de comunicações internas nos formatos que a empresa gosta de usar.",
  },
  {
    name: "mcp-builder",
    category: "Ferramentas",
    description:
      "Guia para criar servidores MCP (Model Context Protocol) de alta qualidade que permitem LLMs interagirem com serviços externos.",
  },
  {
    name: "next-cache-components-adoption",
    category: "Ferramentas",
    description:
      "Ative Cache Components num app Next.js e resolva as rotas bloqueantes que ele revela.",
  },
  {
    name: "next-cache-components-optimizer",
    category: "Ferramentas",
    description:
      "Leve uma rota Next.js à navegação instantânea configurando um loop agentic sob Cache Components / PPR.",
  },
  {
    name: "no-ai-slop",
    category: "Escrita",
    description:
      "Edite rascunhos para uma escrita mais afiada e humana preservando a voz do autor, ou detecte padrões de AI slop.",
  },
  {
    name: "open-websearch",
    category: "Ferramentas",
    description:
      "Skill de entrada única para setup do open-websearch e recuperação ao vivo focada, preferindo caminhos locais de CLI/daemon.",
  },
  {
    name: "pdf",
    category: "Documentos",
    description:
      "Use esta skill sempre que o usuário quiser fazer qualquer coisa com arquivos PDF.",
  },
  {
    name: "pick-ui-library",
    category: "Ferramentas",
    description:
      "Escolha a biblioteca certa para uma tarefa de frontend a partir de uma lista curada e opinativa.",
  },
  {
    name: "playwright-best-practices",
    category: "Testes",
    description:
      "Escreva testes Playwright, corrija testes flaky, depure falhas, implemente Page Object Model, configure CI/CD.",
  },
  {
    name: "playwright-cli",
    category: "Testes",
    description:
      "Automatize interações de navegador, teste páginas web e trabalhe com testes Playwright.",
  },
  {
    name: "pptx",
    category: "Documentos",
    description:
      "Use esta skill sempre que um arquivo .pptx ou .potx estiver envolvido — como entrada, saída ou ambos.",
  },
  {
    name: "prototype",
    category: "Testes",
    description:
      "Construa várias versões genuinamente diferentes de uma peça de UI que você descreve, renderizadas atrás de um seletor visual.",
  },
  {
    name: "review-animations",
    category: "Animações",
    description:
      "Revisa código de animação e movimento contra um alto padrão de craft derivado da filosofia de engenharia de design de Emil Kowalski.",
  },
  {
    name: "sandbox-migrate-to-next",
    category: "Cloudflare",
    description:
      "Porta um app de Cloudflare Sandbox do estável @cloudflare/sandbox para @cloudflare/sandbox@next (prévia do Sandbox SDK 1.0).",
  },
  {
    name: "sandbox-next",
    category: "Cloudflare",
    description:
      "Construa ou mude apps de Cloudflare Sandbox em @cloudflare/sandbox@next (prévia do Sandbox SDK 1.0) — execução de código, AI runners, interpretadores.",
  },
  {
    name: "sandbox-stable",
    category: "Cloudflare",
    description:
      "Construa ou mude apps de Cloudflare Sandbox no pacote estável atual @cloudflare/sandbox (tag npm padrão).",
  },
  {
    name: "shadcn",
    category: "Design UI",
    description:
      "Gerencia componentes e projetos shadcn — adicionar, buscar, corrigir, depurar, estilizar e compor UI.",
  },
  {
    name: "skill-creator",
    category: "Ferramentas",
    description:
      "Crie novas skills, modifique e melhore skills existentes e meça a performance delas.",
  },
  {
    name: "skill-inspector",
    category: "Ferramentas",
    description:
      "Revisa skills de agentes de IA antes da instalação usando NVIDIA SkillSpector e revisão semântica com atenção à fonte.",
  },
  {
    name: "slack-gif-creator",
    category: "Animações",
    description:
      "Conhecimento e utilitários para criar GIFs animados otimizados para o Slack.",
  },
  {
    name: "systematic-debugging",
    category: "Testes",
    description:
      "Use ao encontrar qualquer bug, falha de teste ou comportamento inesperado, antes de propor correções.",
  },
  {
    name: "test-driven-development",
    category: "Testes",
    description:
      "Use ao implementar qualquer funcionalidade ou correção de bug, antes de escrever código de implementação.",
  },
  {
    name: "theme-factory",
    category: "Design UI",
    description: "Kit de ferramentas para estilizar artefatos com um tema.",
  },
  {
    name: "turnstile-spin",
    category: "Cloudflare",
    description:
      "Configure o Cloudflare Turnstile de ponta a ponta num projeto.",
  },
  {
    name: "ui-ux-pro-max",
    category: "Design UI",
    description:
      "Inteligência de design UI/UX para web, mobile e desktop.",
  },
  {
    name: "variant",
    category: "Testes",
    description:
      'Responde "qual destas?" em vez de "isso está certo?".',
  },
  {
    name: "vercel-composition-patterns",
    category: "Ferramentas",
    description: "Padrões de composição React que escalam.",
  },
  {
    name: "vercel-react-best-practices",
    category: "Ferramentas",
    description:
      "Diretrizes de otimização de performance para React e Next.js do Vercel Engineering.",
  },
  {
    name: "verification-before-completion",
    category: "Testes",
    description:
      "Use antes de afirmar que o trabalho está completo, corrigido ou passando — exige rodar comandos de verificação e confirmar a saída.",
  },
  {
    name: "webapp-testing",
    category: "Testes",
    description:
      "Kit de ferramentas para interagir e testar aplicações web locais usando Playwright.",
  },
  {
    name: "web-artifacts-builder",
    category: "Design UI",
    description:
      "Suíte de ferramentas para criar artefatos HTML elaborados de múltiplos componentes para o claude.ai usando tecnologias frontend modernas.",
  },
  {
    name: "web-design-guidelines",
    category: "Design UI",
    description:
      "Revisa código de UI para conformidade com as Web Interface Guidelines.",
  },
  {
    name: "web-perf",
    category: "Ferramentas",
    description: "Analisa performance web usando Chrome DevTools MCP.",
  },
  {
    name: "workers-best-practices",
    category: "Cloudflare",
    description:
      "Revisa e produz código de Cloudflare Workers contra boas práticas de produção.",
  },
  {
    name: "wrangler",
    category: "Cloudflare",
    description:
      "CLI do Cloudflare Workers para deploy, desenvolvimento e gerenciamento de Workers, KV, R2, D1, Vectorize, Hyperdrive, Workers AI.",
  },
  {
    name: "write-swift",
    category: "Ferramentas",
    description:
      "Como escrever Swift moderno bem — value types, segurança de data-race do Swift 6 e concorrência acessível.",
  },
  {
    name: "xlsx",
    category: "Documentos",
    description:
      "Use esta skill sempre que um arquivo de planilha for a entrada ou saída principal.",
  },
];

export const PLUGIN_GROUPS: PluginGroup[] = [
  {
    tool: "Claude Code",
    items: [
      {
        name: "superpowers",
        description: "workflow completo: brainstorm → plan → TDD → review",
      },
      {
        name: "frontend-design",
        description: "UI distintiva, sem cara de AI slop",
      },
      {
        name: "ponytail",
        description: "respostas de código minimalistas",
      },
      {
        name: "code-simplifier",
        description: "simplifica código e reduz complexidade",
      },
      {
        name: "security-guidance",
        description: "revisão de segurança",
      },
      {
        name: "code-review",
        description: "revisão multi-agente antes do commit",
      },
      {
        name: "commit-commands",
        description: "commits convencionais",
      },
      {
        name: "claude-mem",
        description: "memória persistente entre sessões",
      },
      {
        name: "figma",
        description: "trabalhar com designs do Figma",
      },
      {
        name: "context7",
        description: "docs atualizadas das libs (MCP)",
      },
      {
        name: "planning-with-files",
        description: "planos em markdown que sobrevivem a /clear",
      },
    ],
  },
  {
    tool: "opencode",
    items: [
      {
        name: "superpowers",
        description: "workflow completo (git)",
      },
      {
        name: "opencode-ponytail",
        description: "princípio minimalista do ponytail",
      },
      {
        name: "opencode-notify",
        description: "notificações nativas ao fim de tarefas",
      },
      {
        name: "opencode-worktree",
        description: "git worktrees sem fricção",
      },
      {
        name: "opencode-antigravity-auth",
        description: "Gemini/Claude via login Google",
      },
      {
        name: "claude-mem.js",
        description: "adaptador do worker claude-mem",
      },
    ],
  },
];

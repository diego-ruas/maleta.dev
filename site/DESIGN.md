# Axiom — Style Reference
> Terminal monocromático — canvas preto absoluto, JetBrains Mono em tudo, hierarquia só por peso e tom de cinza

**Theme:** dark (dark-only, sem tema claro)

Axiom é uma interface terminal-grade onde cada glifo é monoespaçado e cada superfície é um degrau de cinza sobre preto puro. Não há cor de destaque própria — decisão intencional documentada em `base.css`: a hierarquia do CTA primário vem do fill invertido (`--color-void` sobre `--color-paper`) e do peso 700, nunca de cor. JetBrains Mono carrega headline, corpo, nav, botões e código sem par de display; não há fonte proporcional em lugar nenhum do conteúdo. Bordas afiadas (2px de raio em tudo, exceto pills/dots), sem sombra além de um inset sutil no terminal do hero, e ícones stroke animados (`components/icons/`, padrão pqoqubbw) são as únicas variações de textura.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page background, CTA text-on-fill |
| Carbon | `#111111` | `--color-carbon` | Card base, terminal body |
| Graphite | `#191919` | `--color-graphite` | Terminal header, hover surface |
| Iron | `#202020` | `--color-iron` | Bordas hairline, divisores |
| Slate | `#3a3a3a` | `--color-slate` | Bordas de botão ghost, ícone stroke |
| Pewter | `#505050` | `--color-pewter` | Divisores decorativos |
| Steel | `#606060` | `--color-steel` | Texto terciário, labels inativos |
| Ash | `#7e7e7e` | `--color-ash` | Texto auxiliar apagado |
| Fog | `#b4b4b4` | `--color-fog` | Texto secundário, hover de CTA |
| Paper | `#eeeeee` | `--color-paper` | Texto primário, fill do CTA (= `--color-accent`) |

Sem accent cromático: `--color-accent` aponta para `--color-paper`. Semânticos (`--color-success #10b981`, `--color-error #ef4444`, `--color-warning #f59e0b`, `--color-info #3b82f6`) existem só para estado funcional (toasts, badges de risco), nunca decorativos.

## Tokens — Typography

### JetBrains Mono — tipografia única do site — headline, corpo, nav, botões, código · `--font-body` / `--font-mono` / `--font-sans` (mesmo token)
- **Substitute:** IBM Plex Mono, Fira Code, ui-monospace
- **Weights:** 400 (regular), 500 (medium), 700 (bold — ênfase e CTA primário)
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px
- **Line height:** corpo 1.71; título de parágrafo 17px
- **Letter spacing:** normal

Não há segunda família tipográfica — ao contrário de setups com par display/texto, todo o conteúdo (incluindo nav e botões) fica no mesmo grid monoespaçado.

### Type Scale

| Token | Size |
|-------|------|
| `--text-xs` | 12px |
| `--text-sm` | 13px |
| `--text-base` | 14px (corpo padrão) |
| `--text-lg` | 16px |
| `--text-xl` | 18px |
| `--text-2xl` | 20px (h2) |
| `--text-3xl` | 24px |
| `--text-4xl` | 32px |

## Tokens — Spacing & Shapes

**Base unit:** 8px (`--space-1` = 8px até `--space-24` = 192px)

**Density:** comfortable

### Border Radius

Praticamente tudo em 2px (`--radius-sm/md/lg/xl/2xl` idênticos); `--radius-full` (9999px) reservado a dots de terminal e pills pequenas.

### Shadows

Nenhuma sombra decorativa. Único uso: `inset 0 1px 0 rgba(255,255,255,0.04)` no `.hero-terminal`, para sugerir um brilho de topo sutil sem elevação.

### Layout

- **Page max-width:** 1200px (`--max-width`)
- **Body padding:** `--space-6` desktop, `--space-4` ≤900px, `--space-3` ≤600px

## Components

### Primary CTA Button (`.btn-primary`)
Fill `--color-accent` (paper), texto `--color-void`, peso 700, 2px de raio, `10px var(--space-2)` padding, altura mínima 40px. Hover troca para `--color-fog`. Disabled: opacidade 0.4, sem mudança de cor no hover.

### Ghost Button (`.btn-gh`)
Fundo transparente, borda 1px `--color-slate`, texto `--fg`, peso 400. Hover só troca a borda para `--fg`.

### Terminal Hero (`.hero-terminal`)
Card `--color-carbon` com borda `--color-iron`, header `--color-graphite` de 32px com dots decorativos (`.terminal-dot`, 8px, círculo) e badge de status à direita. Corpo mostra seletor de ferramenta (Claude Code / Codex), grid de presets e o comando final copiável — a metáfora é literalmente um terminal renderizando o instalador que o usuário está montando.

### Install Workflow (`InstallSteps.tsx`)
Três abas (`.install-tab-btn`, grid 3 colunas): One-Liner Express (recomendado), Setup do Zero, Prompt guiado. Cada etapa numerada (`.install-stage-number`) com bloco de comando copiável (`.install-command-stage`) e cards de follow-up em grid responsivo.

### Plugins Explorer (`PluginsSection.tsx`)
Barra de filtro com busca + abas de ferramenta (`.plugins-tool-tabs`) + chips de categoria (`.plugin-category-chip`, contagem inclusa). Lista de linhas (`.plugin-row-item`) com seleção persistida e barra de ação fixa mostrando contagem de itens selecionados.

### Prompt Example Card (`.prompt-example-card`)
Header com badges de categoria/skill, título, corpo de prompt, botão de copiar. Sem cor além da hierarquia de cinza — categoria é comunicada por texto, não por cor de badge.

### Terminal Cursor
Elemento `.terminal-cursor` — bloco piscante de `--color-paper`, reforça a metáfora de linha de comando em textos e no hero.

## Do's and Don'ts

### Do
- Usar JetBrains Mono para todo texto de UI — headline, nav, botão, corpo; não há fallback proporcional
- Empilhar superfícies com degraus `#000000 → #111111 → #191919 → #202020`; nunca usar `box-shadow` para dar elevação
- Comunicar hierarquia só por peso (400/700) e tom de cinza (paper → fog → ash → steel)
- Manter `border-radius: 2px` em cards, botões e inputs; reservar `9999px` só para dots de terminal e pills pequenas
- Usar ícones stroke animados do projeto (`components/icons/`) — nunca emoji, nunca ícone com fundo preenchido
- Usar glifos `→` inline após labels de ação para reforçar a cadência de CLI

### Don't
- Não introduzir cor de destaque (accent) decorativa — o CTA primário usa fill invertido, não cor
- Não usar fonte proporcional (Inter, system-ui) em nenhum lugar do conteúdo — quebra o grid monoespaçado
- Não arredondar cantos acima de 2px em cards/painéis/botões (exceto dots/pills < 32px)
- Não adicionar seção ou superfície em tema claro — o produto é dark-only
- Não usar fundo colorido para badges de status; comunicar estado por texto/borda, reservando as cores semânticas (`success`/`error`/`warning`/`info`) só para funcionalidade real (toasts, avisos)
- Não usar emoji em nenhum texto ou componente

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page base |
| 1 | Carbon | `#111111` | Card base, terminal body |
| 2 | Graphite | `#191919` | Terminal header, hover |
| 3 | Iron | `#202020` | Bordas, divisores |

## Layout

Coluna central com `max-width: 1200px`. Hero: prompt de terminal (`~/`) + headline + terminal interativo mostrando o instalador sendo montado em tempo real. Seções seguintes: Sobre → Install Steps (3 abas) → Skills/Plugins explorer (busca + filtro + seleção) → Agents Ticker → FAQ → Footer. Sem scroll horizontal de cards; navegação simples, sem mega-menu.

## Quick Start

### CSS Custom Properties (extraído de `site/css/base.css`)

```css
:root {
  --color-void: #000000;
  --color-carbon: #111111;
  --color-graphite: #191919;
  --color-iron: #202020;
  --color-slate: #3a3a3a;
  --color-pewter: #505050;
  --color-steel: #606060;
  --color-ash: #7e7e7e;
  --color-fog: #b4b4b4;
  --color-paper: #eeeeee;
  --color-accent: #eeeeee; /* = paper, sistema monocromático */

  --font-body: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.8125rem;
  --text-base: 0.875rem;
  --text-lg: 1rem;
  --text-xl: 1.125rem;
  --text-2xl: 1.25rem;
  --text-3xl: 1.5rem;
  --text-4xl: 2rem;

  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;

  --space-1: 0.5rem;  /* 8px base unit */
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-6: 3rem;
  --space-8: 4rem;

  --max-width: 1200px;
  --radius-sm: 2px;
  --radius-full: 9999px;

  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

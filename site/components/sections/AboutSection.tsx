"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import AnimatedCounter from "@/components/AnimatedCounter";
import Reveal from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { BriefcaseIcon } from "@/components/icons/briefcase";
import { CheckIcon } from "@/components/icons/check";
import { ShieldIcon } from "@/components/icons/shield";
import { CpuIcon } from "@/components/icons/cpu";
import { ZapIcon } from "@/components/icons/zap";
import { TerminalIcon } from "@/components/icons/terminal";
import { SparklesIcon } from "@/components/icons/sparkles";
import { SKILLS } from "@/lib/data";

interface PillarItem {
  icon: typeof ShieldIcon;
  title: string;
  tag: string;
  description: string;
  highlights: string[];
}

const PILLARS: PillarItem[] = [
  {
    icon: ShieldIcon,
    title: "100% Local & Determinístico",
    tag: "PRIVACIDADE & CONTROLE",
    description:
      "Arquitetura estritamente local com isolamento de credenciais e backup .pre-install.bak automático.",
    highlights: [
      "Zero telemetria ou nuvem de terceiros",
      "Chaves salvas apenas no seu disco",
      "Backup automático antes de atualizar configurações",
    ],
  },
  {
    icon: CpuIcon,
    title: "Skills Universais",
    tag: "PADRÃO MODULAR",
    description:
      "Instruções modulares que podem ser instaladas em diferentes assistentes de código.",
    highlights: [
      "Claude Code e opencode",
      "Antigravity, Cursor e Windsurf",
      "Codex, Devin, Gemini e Roo Code",
    ],
  },
  {
    icon: ZapIcon,
    title: `${SKILLS.length} Skills Curadas & Hub`,
    tag: "GUARDRAILS TÉCNICOS",
    description:
      "Instruções modulares com TDD rigoroso, acessibilidade WCAG 2.2 e integração contínua com o GitHub.",
    highlights: [
      `${SKILLS.length} skills em 8 especialidades`,
      "Design systems e micro-interações",
      "Cloudflare Workers e AI Agents SDK",
    ],
  },
  {
    icon: TerminalIcon,
    title: "Instalação Expressa One-Liner",
    tag: "PROVISIONAMENTO POWERSHELL",
    description:
      "Scriptblock parametrizado para PowerShell 5.1+ que injeta seu toolkit sob medida em segundos.",
    highlights: [
      "Windows 10/11 nativo sem admin",
      "Sem dependência de Git, Python ou pip",
      "Comando customizado gerado no site",
    ],
  },
];

const STATS = [
  { numeric: SKILLS.length, suffix: "", label: "Skills Curadas", detail: "8 categorias com guardrails técnicos" },
  { numeric: 100, suffix: "%", label: "Local & Seguro", detail: "Zero telemetria ou dados em nuvem" },
  { numeric: 8, suffix: "+", label: "Agentes & IDEs", detail: "Skills compatíveis com vários ambientes" },
  { text: "MIT", label: "Código Aberto", detail: "Auditável e extensível no GitHub" },
];

export default function AboutSection() {
  return (
    <Reveal id="sobre" className="reveal" ariaLabelledby="sobre-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 01. SOBRE O PROJETO"}</span>
      </div>

      <div className="about-header-wrap">
        <h2 id="sobre-heading">Faça a IA escrever código no seu padrão</h2>
      </div>

      <p className="about-lead">
        Agentes de código são assistentes que escrevem e editam seu projeto. As <strong>skills</strong> são instruções prontas que ajudam esses agentes a seguir seu jeito de trabalhar, sem você repetir as mesmas regras em cada pedido.
      </p>

      {/* Manifesto com Estética de Terminal & Alta Escaneabilidade */}
      <div className="about-manifesto-card">
        <div className="about-manifesto-header">
          <div className="about-manifesto-left">
            <div className="about-window-dots" aria-hidden="true">
              <span className="about-dot" />
              <span className="about-dot" />
              <span className="about-dot" />
            </div>
            <div className="about-manifesto-badge">
              <AnimatedIcon Icon={BriefcaseIcon} className="icon" size={16} />
              <span>MANIFESTO // MALETA.DEV</span>
            </div>
          </div>
          <span className="about-manifesto-status">SYS_STATUS: LOCAL-FIRST [ACTIVE]</span>
        </div>
        <div className="about-manifesto-body">
          <div className="about-terminal-prompt">
            <span className="about-prompt-user">dev@local:~$</span>
            <span className="about-prompt-cmd">maleta init --skills={SKILLS.length} --deterministic --privacy=strict</span>
          </div>
          <p>
            O <strong>maleta.dev</strong> reúne skills auditáveis para <strong>Claude Code</strong>, <strong>opencode</strong> e outros agentes. Escolha uma base, ajuste o pacote e copie um comando pronto para instalar tudo localmente, sem telemetria.
          </p>
        </div>
      </div>

      {/* Grid Nivelado de Pilares com Altura Uniforme */}
      <div className="about-pillars-grid">
        {PILLARS.slice(0, 3).map((pillar, idx) => (
          <div key={idx} className="about-pillar-card">
            <div className="about-pillar-top">
              <div className="about-pillar-icon-box">
                <AnimatedIcon Icon={pillar.icon} className="icon" size={20} />
              </div>
              <span className="about-pillar-tag">{pillar.tag}</span>
            </div>

            <h3 className="about-pillar-title">{pillar.title}</h3>

            <p className="about-pillar-desc">{pillar.description}</p>

            <details className="about-card-details">
              <summary>Ver detalhes</summary>
              <ul className="about-pillar-highlights">
                {pillar.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="about-highlight-item">
                    <AnimatedIcon Icon={CheckIcon} className="icon about-highlight-icon" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>

      <details className="about-advanced-details">
        <summary>
          <span>Ver detalhes técnicos e links</span>
          <span className="about-advanced-count">+1 pilar · 4 métricas</span>
        </summary>
        <div className="about-advanced-body">
          <div className="about-pillars-grid about-pillars-grid--advanced">
            {PILLARS.slice(3).map((pillar, idx) => (
              <div key={idx} className="about-pillar-card">
                <div className="about-pillar-top">
                  <div className="about-pillar-icon-box">
                    <AnimatedIcon Icon={pillar.icon} className="icon" size={20} />
                  </div>
                  <span className="about-pillar-tag">{pillar.tag}</span>
                </div>

                <h3 className="about-pillar-title">{pillar.title}</h3>
                <p className="about-pillar-desc">{pillar.description}</p>

                <details className="about-card-details">
                  <summary>Ver detalhes</summary>
                  <ul className="about-pillar-highlights">
                    {pillar.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="about-highlight-item">
                        <AnimatedIcon Icon={CheckIcon} className="icon about-highlight-icon" size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>

          <div className="about-footer-panel">
            <div className="about-stats-grid">
              {STATS.map((stat, idx) => (
                <div key={idx} className="about-stat-item">
                  <span className="about-stat-value">
                    {"text" in stat ? stat.text : <><AnimatedCounter value={stat.numeric} />{stat.suffix}</>}
                  </span>
                  <span className="about-stat-label">{stat.label}</span>
                  <span className="about-stat-detail">{stat.detail}</span>
                </div>
              ))}
            </div>

            <div className="about-actions-row">
              <a
                href="https://github.com/diego-ruas/maleta.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gh"
              >
                <span>Explorar no GitHub</span>
                <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
              </a>
              <a
                href="https://github.com/diego-ruas/maleta.dev/blob/main/docs/TOOL-MATRIX.md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gh"
              >
                <span>Matriz de Compatibilidade</span>
                <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
              </a>
              <a
                href="https://github.com/diego-ruas/maleta.dev/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gh"
              >
                <span>Licença MIT</span>
                <AnimatedIcon Icon={SparklesIcon} className="icon" size={16} />
              </a>
            </div>
          </div>
        </div>
      </details>
    </Reveal>
  );
}

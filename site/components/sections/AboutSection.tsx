"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { BriefcaseIcon } from "@/components/icons/briefcase";
import { CheckIcon } from "@/components/icons/check";
import { ShieldIcon } from "@/components/icons/shield";
import { CpuIcon } from "@/components/icons/cpu";
import { ZapIcon } from "@/components/icons/zap";
import { TerminalIcon } from "@/components/icons/terminal";
import { SparklesIcon } from "@/components/icons/sparkles";

interface PillarItem {
  icon: typeof ShieldIcon;
  title: string;
  tag: string;
  target: string;
  highlights: string[];
}

const PILLARS: PillarItem[] = [
  {
    icon: ShieldIcon,
    title: "100% Local & Seguro",
    tag: "PRIVACIDADE",
    target: "~/.claude/",
    highlights: [
      "Zero telemetria ou tracking",
      "Sem chaves em nuvem externa",
      "Backup automático de configs",
    ],
  },
  {
    icon: CpuIcon,
    title: "Agnóstico & Multi-IDE",
    tag: "COMPATIBILIDADE",
    target: "AGENTS.md",
    highlights: [
      "Claude Code e opencode",
      "Cursor, Windsurf e Roo Code",
      "Codex, Gemini e Antigravity",
    ],
  },
  {
    icon: ZapIcon,
    title: "Skills Curadas & Hub",
    tag: "ECOSSISTEMA",
    target: "claude/skills/",
    highlights: [
      "80+ skills (TDD e frontend)",
      "Memória persistente claude-mem",
      "Importação direta do GitHub",
    ],
  },
  {
    icon: TerminalIcon,
    title: "Instalação One-Liner",
    tag: "PROVISIONAMENTO",
    target: "install.ps1",
    highlights: [
      "PowerShell 5.1 nativo Windows",
      "Sem privilégios de admin",
      "Instalação customizada 1-clique",
    ],
  },
];

const STATS = [
  { value: "80+", label: "Skills Curadas", detail: "Frontend, Backend & TDD" },
  { value: "100%", label: "Local & Seguro", detail: "Zero telemetria externa" },
  { value: "7+", label: "Agentes & IDEs", detail: "Mapeamento unificado" },
  { value: "MIT", label: "Código Aberto", detail: "Livre e auditável" },
];

export default function AboutSection() {
  return (
    <Reveal id="sobre" className="reveal" ariaLabelledby="sobre-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 01. SOBRE O PROJETO"}</span>
      </div>

      <div className="about-header-wrap">
        <h2 id="sobre-heading">Engenharia de software padronizada para agentes de IA</h2>
      </div>

      {/* Manifesto / Proposta de Valor com Estética de Terminal */}
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
            <span className="about-prompt-cmd">maleta init --skills --plugins --deterministic</span>
          </div>
          <p>
            Catálogo modular e instalador determinístico para transformar assistentes de IA em engenheiros seniores especializados no seu fluxo de desenvolvimento — 100% local, seguro e sob seu controle.
          </p>
        </div>
      </div>

      {/* Grid Enriquecido de Pilares */}
      <div className="about-pillars-grid">
        {PILLARS.map((pillar, idx) => (
          <div key={idx} className="about-pillar-card">
            <div className="about-pillar-top">
              <div className="about-pillar-icon-box">
                <AnimatedIcon Icon={pillar.icon} className="icon" size={20} />
              </div>
              <span className="about-pillar-tag">{pillar.tag}</span>
            </div>

            <h3 className="about-pillar-title">{pillar.title}</h3>

            <div className="about-pillar-target">
              <span className="about-target-label">ALVO:</span>
              <code>{pillar.target}</code>
            </div>

            <ul className="about-pillar-highlights">
              {pillar.highlights.map((item, hIdx) => (
                <li key={hIdx} className="about-highlight-item">
                  <AnimatedIcon Icon={CheckIcon} className="icon about-highlight-icon" size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Painel de Estatísticas & Links Oficiais */}
      <div className="about-footer-panel">
        <div className="about-stats-grid">
          {STATS.map((stat, idx) => (
            <div key={idx} className="about-stat-item">
              <span className="about-stat-value">{stat.value}</span>
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
            <span>Ver no GitHub</span>
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
    </Reveal>
  );
}

"use client";

import { motion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import AnimatedCounter from "@/components/AnimatedCounter";
import CopyButton from "@/components/CopyButton";
import TypewriterText from "@/components/TypewriterText";
import DecryptedText from "@/components/DecryptedText";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { ClaudeIcon } from "@/components/icons/claude";
import { OpencodeIcon } from "@/components/icons/opencode";
import { ZapIcon } from "@/components/icons/zap";
import { CpuIcon } from "@/components/icons/cpu";
import { SearchIcon } from "@/components/icons/search";
import { ShieldIcon } from "@/components/icons/shield";
import { useToolkit, ToolTarget } from "@/lib/toolkitContext";
import { SKILL_PRESETS, SKILLS } from "@/lib/data";

const TOOL_TARGET_META: Record<
  ToolTarget,
  { tag: string; description: string }
> = {
  claude: {
    tag: "Apenas Claude Code",
    description: "Configura exclusivamente o Claude Code.",
  },
  opencode: {
    tag: "Apenas opencode",
    description: "Configura exclusivamente o opencode.",
  },
  agents: {
    tag: "Agentes & IDEs",
    description: "Configura Antigravity, Cursor, Windsurf, Cline, Roo, Gemini e Codex.",
  },
  all: {
    tag: "Ecossistema Completo",
    description: "Configura Claude Code, opencode e todas as IDEs/Agentes.",
  },
};

export default function Hero() {
  const {
    selectedSkills,
    targetTool,
    setTargetTool,
    targetOs,
    setTargetOs,
    togglePreset,
    isPresetActive,
    activePresets,
    installCommand,
  } = useToolkit();

  return (
    <section className="intro" aria-label="Apresentação do Maleta.dev">
      <motion.div
        className="intro-copy"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
      >
        <motion.span
          className="hero-prompt"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <TypewriterText text="~/maleta.dev — Custom AI Toolkit Builder" speed={22} delay={60} />
        </motion.span>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Monte seu toolkit de IA{" "}
          <span className="highlight-word">
            <DecryptedText text="sob medida" speed={30} maxIterations={10} />
          </span>
        </motion.h1>

        <motion.p
          className="intro-desc"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Construtor determinístico que injeta um catálogo com <strong>{SKILLS.length} skills curadas</strong> (TDD rigoroso, design anti-slop, WCAG 2.2 e Cloudflare Edge) e plugins verificados no <span className="highlight-word">Claude Code</span>, <span className="highlight-word">opencode</span> e <span className="highlight-word">Universal Agents</span> — 100% local, seguro e sem telemetria.
        </motion.p>

        <motion.div
          className="intro-highlights"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <a href="#skills" className="intro-badge-item intro-badge-link" title={`Explorar ${SKILLS.length} skills curadas`}>
            <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={15} />
            <span>{SKILLS.length} skills curadas (<AnimatedCounter value={selectedSkills.size} /> ativas)</span>
          </a>
          <a href="#sobre" className="intro-badge-item intro-badge-link" title="Saiba como funciona o provisionamento local">
            <AnimatedIcon Icon={ShieldIcon} className="icon" size={15} />
            <span>100% Local & Seguro</span>
          </a>
          <a href="#repo-add" className="intro-badge-item intro-badge-link" title="Buscador de skills comunitárias do GitHub">
            <AnimatedIcon Icon={SearchIcon} className="icon" size={15} />
            <span>Hub GitHub</span>
          </a>
        </motion.div>

        <motion.div
          className="intro-links"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="intro-actions">
            <a href="#skills" className="btn-primary">
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
              <span>Personalizar no Catálogo &rarr;</span>
            </a>
            <a
              href="https://github.com/diego-ruas/maleta.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gh"
            >
              <span>Ver no GitHub &rarr;</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Terminal Quick-Launcher Console */}
      <motion.div
        className="hero-console-wrapper"
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="hero-terminal">
          <div className="hero-terminal-header">
            <div className="hero-terminal-header-left">
              <div className="terminal-dots" aria-hidden="true">
                <span className="terminal-dot"></span>
                <span className="terminal-dot"></span>
                <span className="terminal-dot"></span>
              </div>
              <span className="terminal-title">{targetOs === "unix" ? "quick-setup.sh" : "quick-setup.ps1"}</span>
            </div>
            <span className="terminal-badge"><AnimatedCounter value={selectedSkills.size} /> SKILLS</span>
          </div>

          <div className="hero-terminal-body">
            {/* Seletor rápido de ferramenta */}
            <div className="hero-terminal-section">
              <span className="hero-section-label">01. ALVO DE INSTALAÇÃO:</span>
              <div className="hero-tool-group" role="radiogroup" aria-label="Ferramenta alvo">
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "claude"}
                  className={`hero-tool-btn${targetTool === "claude" ? " active" : ""}`}
                  onClick={() => setTargetTool("claude")}
                  title="Instalar apenas para Claude Code (~/.claude/skills/)"
                >
                  <AnimatedIcon Icon={ClaudeIcon} className="icon" size={14} />
                  <span>Claude Code</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "opencode"}
                  className={`hero-tool-btn${targetTool === "opencode" ? " active" : ""}`}
                  onClick={() => setTargetTool("opencode")}
                  title="Instalar apenas para opencode (~/.config/opencode/)"
                >
                  <AnimatedIcon Icon={OpencodeIcon} className="icon" size={14} />
                  <span>opencode</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "agents"}
                  className={`hero-tool-btn${targetTool === "agents" ? " active" : ""}`}
                  onClick={() => setTargetTool("agents")}
                  title="Instalar apenas para IDEs & Agentes (~/.agents, Antigravity, Cursor, Windsurf, Cline)"
                >
                  <AnimatedIcon Icon={CpuIcon} className="icon" size={14} />
                  <span>Agentes & IDEs</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "all"}
                  className={`hero-tool-btn${targetTool === "all" ? " active" : ""}`}
                  onClick={() => setTargetTool("all")}
                  title="Instalar para todos os ambientes (Claude + opencode + Agentes & IDEs)"
                >
                  <AnimatedIcon Icon={ZapIcon} className="icon" size={14} />
                  <span>Todos (Completo)</span>
                </button>
              </div>

              {/* Detalhes explícitos do alvo selecionado */}
              <div className="hero-target-info-card">
                <span className="hero-target-info-badge">
                  {TOOL_TARGET_META[targetTool].tag}
                </span>
                <span className="hero-target-info-desc">
                  {TOOL_TARGET_META[targetTool].description}
                </span>
              </div>
            </div>

            {/* Seletor de sistema operacional */}
            <div className="hero-terminal-section">
              <span className="hero-section-label">01B. SISTEMA OPERACIONAL:</span>
              <div className="hero-tool-group hero-tool-group--2col" role="radiogroup" aria-label="Sistema operacional alvo">
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetOs === "windows"}
                  className={`hero-tool-btn${targetOs === "windows" ? " active" : ""}`}
                  onClick={() => setTargetOs("windows")}
                >
                  <span>Windows</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetOs === "unix"}
                  className={`hero-tool-btn${targetOs === "unix" ? " active" : ""}`}
                  onClick={() => setTargetOs("unix")}
                >
                  <span>Linux / macOS</span>
                </button>
              </div>
            </div>

            {/* Presets Rápidos / Multi-Seleção de Bases */}
            <div className="hero-terminal-section">
              <div className="hero-terminal-label-row">
                <span className="hero-section-label">02. SELECIONE AS BASES:</span>
                <span className="hero-active-preset-badge">
                  {activePresets.size > 0
                    ? `${activePresets.size} ativa${activePresets.size > 1 ? "s" : ""}`
                    : `${selectedSkills.size} skills`}
                </span>
              </div>
              <div className="hero-preset-grid">
                {SKILL_PRESETS.slice(0, 6).map((preset) => {
                  const isActive = isPresetActive(preset.id);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`hero-preset-btn${isActive ? " active" : ""}`}
                      onClick={() => togglePreset(preset.id)}
                      title={`${preset.description} (${preset.skills.length} skills) — Clique para ${isActive ? "remover base" : "adicionar base"}`}
                    >
                      <span className="hero-preset-name">{preset.name}</span>
                      <span className="hero-preset-count">{isActive ? `✓ ${preset.skills.length}` : `+${preset.skills.length}`}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comando Gerado em Tempo Real */}
            <div className="hero-terminal-section">
              <span className="hero-section-label">03. COMANDO PRONTO:</span>
              <div className="hero-code-box">
                <pre>
                  <code>{installCommand}</code>
                </pre>
                <CopyButton
                  className="hero-code-copy-btn"
                  text={installCommand}
                  aria-label="Copiar comando de instalação"
                  title="Copiar comando completo para a área de transferência"
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={15} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={15} />
                </CopyButton>
              </div>
            </div>

            {/* Ações do Terminal */}
            <div className="hero-terminal-actions">
              <span className="hero-terminal-actions-hint">
                {"// Clique no ícone acima para copiar o comando"}
              </span>
              <a href="#skills" className="hero-terminal-explore-link">
                Personalizar no Catálogo &rarr;
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

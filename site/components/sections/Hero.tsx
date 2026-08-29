"use client";

import { motion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import TypewriterText from "@/components/TypewriterText";
import DecryptedText from "@/components/DecryptedText";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { ClaudeIcon } from "@/components/icons/claude";
import { OpencodeIcon } from "@/components/icons/opencode";
import { ZapIcon } from "@/components/icons/zap";
import { SearchIcon } from "@/components/icons/search";
import { ShieldIcon } from "@/components/icons/shield";
import { useToolkit } from "@/lib/toolkitContext";
import { SKILL_PRESETS } from "@/lib/data";

export default function Hero() {
  const {
    selectedSkills,
    targetTool,
    setTargetTool,
    targetOs,
    setTargetOs,
    applyPreset,
    activePreset,
    installCommand,
  } = useToolkit();

  return (
    <section className="intro">
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
          Construtor determinístico que injeta <strong>83 skills curadas</strong> (TDD rigoroso, design anti-slop, WCAG 2.2 e Cloudflare Edge) e plugins verificados no <span className="highlight-word">Claude Code</span> e <span className="highlight-word">opencode</span> — 100% local, seguro e sem telemetria.
        </motion.p>

        <motion.div
          className="intro-highlights"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <a href="#skills" className="intro-badge-item intro-badge-link" title="Explorar 83 skills curadas">
            <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={15} />
            <span>83 skills curadas ({selectedSkills.size} ativas)</span>
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
            <a href="#skills" className="btn-gh">
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
              <span>Personalizar no Catálogo</span>
            </a>
            <a href="#plugins" className="btn-gh">
              <span>Ver plugins & MCP</span>
            </a>
            <a href="#instalar" className="btn-gh">
              <span>Guia de instalação</span>
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
            <span className="terminal-badge">{selectedSkills.size} SKILLS</span>
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
                >
                  <AnimatedIcon Icon={OpencodeIcon} className="icon" size={14} />
                  <span>opencode</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={targetTool === "all"}
                  className={`hero-tool-btn${targetTool === "all" ? " active" : ""}`}
                  onClick={() => setTargetTool("all")}
                >
                  <AnimatedIcon Icon={ZapIcon} className="icon" size={14} />
                  <span>Ambos</span>
                </button>
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

            {/* Presets Rápidos */}
            <div className="hero-terminal-section">
              <span className="hero-section-label">02. SELECIONE UMA BASE:</span>
              <div className="hero-preset-grid">
                {SKILL_PRESETS.slice(0, 6).map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`hero-preset-btn${isActive ? " active" : ""}`}
                      onClick={() => applyPreset(preset.id)}
                      title={`${preset.description} (${preset.skills.length} skills)`}
                    >
                      <span className="hero-preset-name">{preset.name}</span>
                      <span className="hero-preset-count">{preset.skills.length}</span>
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
              </div>
            </div>

            {/* Ações do Terminal */}
            <div className="hero-terminal-actions">
              <CopyButton
                className="btn-primary hero-copy-action"
                text={installCommand}
                aria-label="Copiar comando PowerShell pronto"
                title="Copiar comando completo para a área de transferência"
              >
                <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={15} />
                <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={15} />
                <span>Copiar One-Liner</span>
              </CopyButton>
              <a href="#skills" className="hero-terminal-explore-link">
                Personalizar &rarr;
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

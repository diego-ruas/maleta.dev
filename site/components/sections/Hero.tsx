"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import TypewriterText from "@/components/TypewriterText";
import DecryptedText from "@/components/DecryptedText";
import { DownloadIcon } from "@/components/icons/download";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";

type ToolTarget = "all" | "claude" | "opencode";

export default function Hero() {
  const [targetTool, setTargetTool] = useState<ToolTarget>("all");

  const installCommand =
    targetTool === "all"
      ? "irm https://maleta.dev/install.ps1 | iex"
      : targetTool === "claude"
      ? "& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude"
      : "& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools opencode";

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
          <TypewriterText text="~/maleta.dev" speed={25} delay={80} />
        </motion.span>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Skills, plugins e configs de IA{" "}
          <span className="highlight-word">
            <DecryptedText text="prontos para instalar" speed={30} maxIterations={10} />
          </span>
        </motion.h1>
        <motion.p
          className="intro-desc"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Coleção curada de skills, plugins e configurações para <span className="highlight-word">Claude Code</span> e{" "}
          <span className="highlight-word">opencode</span>. Escolha um preset pronto, personalize seu pacote ou explore novas skills no GitHub — instale tudo em segundos com 1 comando no PowerShell.
        </motion.p>
        <motion.div
          className="intro-highlights"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <a href="#skills" className="intro-badge-item intro-badge-link" title="Ver presets de skills recomendados">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18Zm-15 0h1.5v-3H6Zm10.5 0H18v-3h-1.5z" />
            </svg>
            <span>Claude Code & opencode — Presets Prontos</span>
          </a>
          <a href="#repo-add" className="intro-badge-item intro-badge-link" title="Ir para o buscador de skills comunitárias">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
            </svg>
            <span>Hub Comunitário — Busca de Skills no GitHub</span>
          </a>
          <a href="#seguranca" className="intro-badge-item intro-badge-link" title="Ver relatório de auditoria de segurança">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <span>NVIDIA SkillSpector — 100% Auditado (0 falhas)</span>
          </a>
        </motion.div>

        {/* One-Liner Quick Installer Box */}
        <motion.div
          className="hero-oneliner-box"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="oneliner-tabs" role="tablist" aria-label="Selecione a ferramenta para instalar">
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "all"}
              className={`oneliner-tab${targetTool === "all" ? " active" : ""}`}
              onClick={() => setTargetTool("all")}
            >
              <span>Tudo (Claude + opencode)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "claude"}
              className={`oneliner-tab${targetTool === "claude" ? " active" : ""}`}
              onClick={() => setTargetTool("claude")}
            >
              <span>Apenas Claude Code</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "opencode"}
              className={`oneliner-tab${targetTool === "opencode" ? " active" : ""}`}
              onClick={() => setTargetTool("opencode")}
            >
              <span>Apenas opencode</span>
            </button>
          </div>
          <div className="cmd oneliner-cmd">
            <AnimatePresence mode="wait" initial={false}>
              <motion.code
                key={targetTool}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {installCommand}
              </motion.code>
            </AnimatePresence>
            <CopyButton
              className="cmd-copy"
              text={installCommand}
              aria-label="Copiar comando de instalação expressa"
              title="Copiar comando"
            >
              <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
              <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
            </CopyButton>
          </div>
          <p className="oneliner-hint">
            Cole no PowerShell (nativo do Windows) e pressione Enter. Instalação 100% local, sem necessidade de admin ou git clone prévio.
          </p>
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
              <span>Personalizar skills</span>
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
            </a>
            <a
              href="https://github.com/diego-ruas/maleta.dev/archive/refs/heads/main.zip"
              className="btn-gh"
              aria-label="Baixar o repositório em ZIP"
            >
              <span>Baixar ZIP</span>
              <AnimatedIcon Icon={DownloadIcon} className="icon" size={16} />
            </a>
          </div>
          <div className="intro-socials">
            <a
              href="https://github.com/diego-ruas/maleta.dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

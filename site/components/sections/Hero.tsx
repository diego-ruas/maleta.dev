"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { DownloadIcon } from "@/components/icons/download";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { TerminalIcon } from "@/components/icons/terminal";
import { ShieldCheckIcon } from "@/components/icons/shield-check";
import { SKILLS, PLUGIN_GROUPS } from "@/lib/data";

type ToolTarget = "all" | "claude" | "opencode";

export default function Hero() {
  const [targetTool, setTargetTool] = useState<ToolTarget>("all");
  const claudeCodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "Claude Code")!.items.length;
  const opencodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "opencode")!.items.length;

  const installCommand =
    targetTool === "all"
      ? "irm https://maleta.dev/install.ps1 | iex"
      : targetTool === "claude"
      ? "& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude"
      : "& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools opencode";

  return (
    <section className="intro">
      <div className="intro-mascot">
        <div className="mascot-backdrop"></div>
        <Image
          src="/logo.png"
          alt="Mascote da Maleta.dev"
          width={512}
          height={512}
          className="mascot-img"
          priority
        />
      </div>
      <div className="intro-copy">
        <span className="hero-prompt" aria-hidden="true">
          ~/maleta.dev
        </span>
        <h1>
          Skills, plugins e configs de IA{" "}
          <span className="highlight-word">prontos para instalar</span>
        </h1>
        <p>
          Coleção curada para <span className="highlight-word">Claude Code</span> e{" "}
          <span className="highlight-word">opencode</span>. Instale tudo em 1 comando no PowerShell sem precisar clonar repositório, ou customize sua seleção abaixo.
        </p>
        <div className="intro-highlights">
          <div className="intro-badge-item">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18Zm-15 0h1.5v-3H6Zm10.5 0H18v-3h-1.5z" />
            </svg>
            <span>Claude Code — {SKILLS.length} skills + {claudeCodePlugins} plugins</span>
          </div>
          <div className="intro-badge-item">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22 24H2V0h20zM17 4.8H7v14.4h10z" />
            </svg>
            <span>opencode — {opencodePlugins} plugins + MCP</span>
          </div>
          <a href="#seguranca" className="intro-badge-item intro-badge-link" title="Ver relatório de auditoria de segurança">
            <AnimatedIcon Icon={ShieldCheckIcon} className="icon" size={16} />
            <span>NVIDIA SkillSpector — 0 vulns / 100% auditado</span>
          </a>
        </div>

        {/* One-Liner Quick Installer Box */}
        <div className="hero-oneliner-box">
          <div className="oneliner-tabs" role="tablist" aria-label="Selecione a ferramenta para instalar">
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "all"}
              className={`oneliner-tab${targetTool === "all" ? " active" : ""}`}
              onClick={() => setTargetTool("all")}
            >
              Tudo (Claude + opencode)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "claude"}
              className={`oneliner-tab${targetTool === "claude" ? " active" : ""}`}
              onClick={() => setTargetTool("claude")}
            >
              Apenas Claude Code
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={targetTool === "opencode"}
              className={`oneliner-tab${targetTool === "opencode" ? " active" : ""}`}
              onClick={() => setTargetTool("opencode")}
            >
              Apenas opencode
            </button>
          </div>
          <div className="cmd oneliner-cmd">
            <code>{installCommand}</code>
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
          <div className="oneliner-hint">
            <AnimatedIcon Icon={TerminalIcon} className="icon oneliner-hint-icon" size={14} />
            <span>Cole no PowerShell (nativo do Windows) e pressione Enter. Sem necessidade de admin ou git clone prévio.</span>
          </div>
        </div>

        <div className="intro-links">
          <div className="intro-actions">
            <a href="#skills" className="btn-gh">
              <span>Personalizar skills &darr;</span>
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
        </div>
      </div>
    </section>
  );
}

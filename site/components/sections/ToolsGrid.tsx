"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { SKILLS, PLUGIN_GROUPS } from "@/lib/data";

export default function ToolsGrid() {
  const claudeCodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "Claude Code")!.items.length;
  const opencodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "opencode")!.items.length;

  return (
    <Reveal id="ferramentas" className="reveal" ariaLabelledby="ferramentas-heading">
      <h2 id="ferramentas-heading">O que tem aqui</h2>
      <p>Cada pasta instala a parte de uma ferramenta no lugar certo.</p>
      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-card-icon">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18Zm-15 0h1.5v-3H6Zm10.5 0H18v-3h-1.5z" />
            </svg>
          </div>
          <div className="contact-card-info">
            <h3>Claude Code</h3>
            <p>
              {SKILLS.length} skills, {claudeCodePlugins} plugins, settings, MCP e regras
              globais em <code>~/.claude/</code>.
            </p>
          </div>
          <a
            href="https://github.com/diego-ruas/maleta.dev/tree/main/claude"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-action"
          >
            <span>Ver pasta claude/</span>
            <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
          </a>
        </div>
        <div className="contact-card">
          <div className="contact-card-icon">
            <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22 24H2V0h20zM17 4.8H7v14.4h10z" />
            </svg>
          </div>
          <div className="contact-card-info">
            <h3>opencode</h3>
            <p>
              {opencodePlugins} plugins, MCP open-websearch, provider local LM Studio em{" "}
              <code>~/.config/opencode/</code>.
            </p>
          </div>
          <a
            href="https://github.com/diego-ruas/maleta.dev/tree/main/opencode"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-action"
          >
            <span>Ver pasta opencode/</span>
            <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

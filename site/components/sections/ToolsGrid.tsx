"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ClaudeIcon } from "@/components/icons/claude";
import { OpencodeIcon } from "@/components/icons/opencode";
import { SearchIcon } from "@/components/icons/search";
import { PLUGIN_GROUPS } from "@/lib/data";

export default function ToolsGrid() {
  const claudeCodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "Claude Code")!.items.length;
  const opencodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "opencode")!.items.length;

  return (
    <Reveal id="ferramentas" className="reveal" ariaLabelledby="ferramentas-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 02. ECOSSISTEMA"}</span>
      </div>
      <h2 id="ferramentas-heading">O que está incluído</h2>
      <p>Tudo organizado e configurado automaticamente nas pastas certas do seu ambiente.</p>
      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-card-icon">
            <AnimatedIcon Icon={ClaudeIcon} className="icon" size={24} />
          </div>
          <div className="contact-card-info">
            <h3>Claude Code</h3>
            <p>
              Presets de skills prontas, {claudeCodePlugins} plugins essenciais, configurações, MCP e regras
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
            <AnimatedIcon Icon={OpencodeIcon} className="icon" size={24} />
          </div>
          <div className="contact-card-info">
            <h3>opencode</h3>
            <p>
              {opencodePlugins} plugins, busca web nativa via MCP (DuckDuckGo), suporte a modelos locais e regras em{" "}
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
        <div className="contact-card">
          <div className="contact-card-icon">
            <AnimatedIcon Icon={SearchIcon} className="icon" size={24} />
          </div>
          <div className="contact-card-info">
            <h3>Hub Comunitário</h3>
            <p>
              Busca em tempo real de skills abertas no ecossistema do GitHub, inspeção do <code>SKILL.md</code> e importação em 1 clique.
            </p>
          </div>
          <a
            href="#repo-add"
            className="contact-card-action"
          >
            <span>Explorar Hub &darr;</span>
            <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

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
      <h2 id="ferramentas-heading">O que está incluído no toolkit</h2>
      <p>
        Tudo organizado e provisionado deterministicamente nas pastas corretas do seu ambiente local.
      </p>

      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-card-icon">
            <AnimatedIcon Icon={ClaudeIcon} className="icon" size={24} />
          </div>
          <div className="contact-card-info">
            <h3>Claude Code</h3>
            <p>
              Skills em <code>~/.claude/skills/</code>, {claudeCodePlugins} plugins verificados e configurações MCP integradas.
            </p>
          </div>
          <a
            href="https://github.com/diego-ruas/maleta.dev/tree/main/claude"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-action"
          >
            <span>Inspecionar pasta claude/</span>
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
              Configurações em <code>~/.config/opencode/</code>, {opencodePlugins} plugins e suporte a modelos locais.
            </p>
          </div>
          <a
            href="https://github.com/diego-ruas/maleta.dev/tree/main/opencode"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-action"
          >
            <span>Inspecionar pasta opencode/</span>
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
              Descubra skills abertas no GitHub, inspecione o <code>SKILL.md</code> e adicione o que quiser ao seu pacote.
            </p>
          </div>
          <a href="#repo-add" className="contact-card-action">
            <span>Explorar Hub Comunitário &darr;</span>
            <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

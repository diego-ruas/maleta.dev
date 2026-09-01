"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronDownIcon } from "@/components/icons/chevron-down";
import { ClaudeIcon } from "@/components/icons/claude";
import { CodexIcon } from "@/components/icons/codex";
import { SearchIcon } from "@/components/icons/search";
import { PLUGIN_GROUPS } from "@/lib/data";

export default function ToolsGrid() {
  const claudeCodePlugins = PLUGIN_GROUPS.find((g) => g.tool === "Claude Code")!.items.length;
  const codexMcp = PLUGIN_GROUPS.find((g) => g.tool === "Codex")!.items.length;

  return (
    <Reveal id="ferramentas" className="reveal" ariaLabelledby="ferramentas-heading">
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
            <AnimatedIcon Icon={CodexIcon} className="icon" size={24} />
          </div>
          <div className="contact-card-info">
            <h3>Codex</h3>
            <p>
              Skills em <code>~/.agents/skills/</code>, MCP em <code>~/.codex/config.toml</code>. {codexMcp} servidores MCP curados.
            </p>
          </div>
          <a
            href="https://github.com/diego-ruas/maleta.dev/tree/main/codex"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card-action"
          >
            <span>Inspecionar pasta codex/</span>
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
            <span>Explorar Hub Comunitário</span>
            <AnimatedIcon Icon={ChevronDownIcon} className="icon" size={16} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

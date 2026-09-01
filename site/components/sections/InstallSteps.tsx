"use client";

import { useMemo, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { CpuIcon } from "@/components/icons/cpu";
import { TerminalIcon } from "@/components/icons/terminal";
import { SparklesIcon } from "@/components/icons/sparkles";
import { CodeIcon } from "@/components/icons/code";
import { DownloadIcon } from "@/components/icons/download";
import { ZapIcon } from "@/components/icons/zap";
import { ShieldIcon } from "@/components/icons/shield";
import { ClaudeIcon } from "@/components/icons/claude";
import { CodexIcon } from "@/components/icons/codex";
import { NotesIcon } from "@/components/icons/notes";
import { useToolkit } from "@/lib/toolkitContext";

type InstallTab = "oneliner" | "fresh" | "local";

interface PromptExample {
  title: string;
  skill: string;
  category: string;
  prompt: string;
}

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    title: "Design de Interface & UI",
    skill: "design-taste-frontend",
    category: "Frontend",
    prompt: "Construa uma interface moderna com estética de terminal, contraste preciso e acessibilidade refinada, aplicando a skill design-taste-frontend.",
  },
  {
    title: "Desenvolvimento Guiado por Testes",
    skill: "test-driven-development",
    category: "Qualidade",
    prompt: "Escreva a suíte completa de testes unitários seguindo o ciclo red-green-refactor antes de codificar a produção, com a skill test-driven-development.",
  },
  {
    title: "Investigação & Causa Raiz",
    skill: "systematic-debugging",
    category: "Workflow",
    prompt: "Investigue a falha nesta requisição de forma sistemática: formule hipóteses, inspecione os logs e teste cada causa raiz com systematic-debugging.",
  },
  {
    title: "Código Enxuto & Sem Bloat",
    skill: "ponytail",
    category: "Refatoração",
    prompt: "Revise esta função e remova complexidade acidental, abstrações prematuras e dependências desnecessárias com a filosofia da skill ponytail.",
  },
];

const AGENT_INSTALL_COMMANDS = [
  { target: "claude", label: "Claude Code", command: "npm install -g @anthropic-ai/claude-code" },
  { target: "codex", label: "Codex", command: "npm install -g @openai/codex" },
] as const;

export default function InstallSteps() {
  const { installCommand, selectedSkills, targetTool, targetOs, downloadScript } = useToolkit();
  const [activeTab, setActiveTab] = useState<InstallTab>("oneliner");
  const isUnix = targetOs === "unix";

  const previewCommand = useMemo(() => {
    if (selectedSkills.size === 0) return "# Selecione ao menos uma skill no catálogo acima";
    if (selectedSkills.size <= 2) return installCommand;
    const sample = [...selectedSkills].slice(0, 2);
    if (isUnix) {
      const toolFlag = targetTool !== "all" ? ` --tools ${targetTool}` : "";
      return `curl -fsSL https://maleta.dev/install.sh | bash -s --${toolFlag} --skills ${sample.join(",")},… +${selectedSkills.size - 2}`;
    }
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    const sampleQuoted = sample.map((n) => `'${n}'`).join(", ");
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${sampleQuoted}, … +${selectedSkills.size - 2})`;
  }, [selectedSkills, installCommand, targetTool, isUnix]);

  return (
    <Reveal id="instalar" className="reveal" ariaLabelledby="instalar-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 05. TUTORIAL & INSTALAÇÃO"}</span>
      </div>
      <h2 id="instalar-heading">Como instalar e usar seu toolkit</h2>
      <p>
        Comece com o comando pronto. Abra os outros caminhos se precisar instalar as ferramentas ou trabalhar localmente.
      </p>

      <div className="install-mode-toggle" role="tablist" aria-label="Métodos de instalação">
        <button
          type="button"
          role="tab"
          id="install-tab-oneliner"
          aria-selected={activeTab === "oneliner"}
          aria-controls="install-panel-oneliner"
          className={`install-tab-btn${activeTab === "oneliner" ? " active" : ""}`}
          onClick={() => setActiveTab("oneliner")}
        >
          <AnimatedIcon Icon={ZapIcon} className="icon" size={16} />
          <span>One-Liner Express (Recomendado)</span>
        </button>
        <button
          type="button"
          role="tab"
          id="install-tab-fresh"
          aria-selected={activeTab === "fresh"}
          aria-controls="install-panel-fresh"
          className={`install-tab-btn${activeTab === "fresh" ? " active" : ""}`}
          onClick={() => setActiveTab("fresh")}
        >
          <AnimatedIcon Icon={CpuIcon} className="icon" size={16} />
          <span>Setup do Zero</span>
        </button>
        <button
          type="button"
          role="tab"
          id="install-tab-local"
          aria-selected={activeTab === "local"}
          aria-controls="install-panel-local"
          className={`install-tab-btn${activeTab === "local" ? " active" : ""}`}
          onClick={() => setActiveTab("local")}
        >
          <AnimatedIcon Icon={TerminalIcon} className="icon" size={16} />
          <span>Instalação Local (Git / ZIP)</span>
        </button>
      </div>

      {/* Conteúdo dinâmico por aba */}
      {activeTab === "oneliner" && (
        <div className="install-workflow process-grid" role="tabpanel" id="install-panel-oneliner" aria-labelledby="install-tab-oneliner">
          <div className="install-workflow-content">
            <details className="install-prerequisites" open>
              <summary><span>01</span> Antes de começar</summary>
              <p>
                {isUnix ? "Use Linux ou macOS com bash ou zsh." : "Use Windows 10/11 com PowerShell 5.1+."} Instale pelo menos um agente antes de rodar o comando.
              </p>
              {AGENT_INSTALL_COMMANDS
                .filter(({ target }) => targetTool === "all" || targetTool === "agents" || targetTool === target)
                .map(({ label, command }) => (
                  <div className="cmd" key={command}>
                    <code>{command}</code>
                    <CopyButton className="cmd-copy" text={command} aria-label={`Copiar comando de instalação do ${label}`}>
                      <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                      <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                    </CopyButton>
                  </div>
                ))}
            </details>

            <section className="install-command-stage" aria-labelledby="install-command-heading">
              <div className="install-command-stage-header">
                <div>
                  <span className="install-stage-number">02</span>
                  <h3 id="install-command-heading">Executar Comando Customizado</h3>
                </div>
                <AnimatedIcon Icon={TerminalIcon} className="icon" size={20} />
              </div>
              <p>
                Cole no {isUnix ? "terminal (bash/zsh)" : "PowerShell"}. O comando aplica as <strong>{selectedSkills.size} skills selecionadas</strong> para <strong>{targetTool === "all" ? "todos os agentes" : targetTool.toUpperCase()}</strong>.
              </p>
              <div className="cmd">
                <code title={installCommand}>{previewCommand}</code>
                <CopyButton
                  className="cmd-copy"
                  text={installCommand}
                  aria-label="Copiar comando de instalação customizado completo"
                  title="Copiar comando completo"
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
              <button
                type="button"
                onClick={downloadScript}
                className="tutorial-action-btn"
                title={`Baixar arquivo instalar-maleta.${isUnix ? "sh" : "ps1"} pronto para rodar offline`}
              >
                <AnimatedIcon Icon={DownloadIcon} className="icon" size={14} />
                <span>Baixar script .{isUnix ? "sh" : "ps1"} sob medida</span>
              </button>
            </section>

            <div className="install-follow-up-grid">
              <section className="install-follow-up-card">
                <div className="install-follow-up-header">
                  <div className="install-follow-up-icon">
                    <AnimatedIcon Icon={SparklesIcon} className="icon" size={20} />
                  </div>
                  <div>
                    <span className="install-stage-number">03</span>
                    <h3>Validar no Terminal</h3>
                  </div>
                </div>
                <div className="install-follow-up-content">
                  <p className="install-follow-up-desc">Abra seu assistente e confirme que as skills foram carregadas.</p>
                  <div className="cmd">
                    <code>/skills</code>
                    <CopyButton className="cmd-copy" text="/skills" aria-label="Copiar comando /skills">
                      <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                      <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                    </CopyButton>
                  </div>
                </div>
              </section>

              <section className="install-follow-up-card">
                <div className="install-follow-up-header">
                  <div className="install-follow-up-icon">
                    <AnimatedIcon Icon={CodeIcon} className="icon" size={20} />
                  </div>
                  <div>
                    <span className="install-stage-number">04</span>
                    <h3>Primeiro Uso — Prompts Recomendados</h3>
                  </div>
                </div>
                <div className="install-follow-up-content">
                  <p className="install-follow-up-desc">Mencione uma skill ou descreva o objetivo direto no prompt.</p>
                  <details className="about-card-details">
                    <summary>Ver exemplos de prompts</summary>
                    <div className="prompt-examples-grid">
                      {PROMPT_EXAMPLES.map((ex) => (
                        <div key={ex.skill} className="prompt-example-card">
                          <div className="prompt-example-header">
                            <div className="prompt-example-meta">
                              <span className="prompt-badge-cat">{ex.category}</span>
                              <code className="prompt-badge-skill">{ex.skill}</code>
                            </div>
                            <CopyButton
                              className="prompt-copy-btn"
                              text={ex.prompt}
                              aria-label={`Copiar prompt de exemplo para ${ex.skill}`}
                              title="Copiar prompt"
                            >
                              <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={14} />
                              <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={14} />
                            </CopyButton>
                          </div>
                          <p className="prompt-example-title">{ex.title}</p>
                          <p className="prompt-example-text">&ldquo;{ex.prompt}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fresh" && (
        <div className="process-grid" role="tabpanel" id="install-panel-fresh" aria-labelledby="install-tab-fresh">
          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={ClaudeIcon} className="icon" size={20} />
              </div>
              <div className="process-num">01</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Instalar o Claude Code</h3>
              <p className="process-desc">
                O Claude Code é executado via Node.js (versão 18+). Instale o pacote globalmente via npm no {isUnix ? "terminal" : "PowerShell"}:
              </p>
              <div className="cmd">
                <code>npm install -g @anthropic-ai/claude-code</code>
                <CopyButton className="cmd-copy" text="npm install -g @anthropic-ai/claude-code" aria-label="Copiar comando de instalação do Claude Code">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={CodexIcon} className="icon" size={20} />
              </div>
              <div className="process-num">02</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Instalar o Codex (Opcional)</h3>
              <p className="process-desc">
                Caso prefira o agente da OpenAI, ou queira usar os dois lado a lado:
              </p>
              <div className="cmd">
                <code>npm install -g @openai/codex</code>
                <CopyButton className="cmd-copy" text="npm install -g @openai/codex" aria-label="Copiar comando de instalação do Codex">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={TerminalIcon} className="icon" size={20} />
              </div>
              <div className="process-num">03</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Autenticação Inicial</h3>
              <p className="process-desc">
                Execute <code>claude</code> no terminal para autenticar com sua conta Anthropic e feche a sessão digitando <code>/exit</code>.
              </p>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={TerminalIcon} className="icon" size={20} />
              </div>
              <div className="process-num">04</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Aplicar o Toolkit Maleta.dev</h3>
              <p className="process-desc">
                Com as ferramentas instaladas, rode o comando gerado no site para injetar todas as skills e plugins selecionados:
              </p>
              <div className="cmd">
                <code title={installCommand}>{previewCommand}</code>
                <CopyButton className="cmd-copy" text={installCommand} aria-label="Copiar comando de instalação">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "local" && (
        <div className="process-grid" role="tabpanel" id="install-panel-local" aria-labelledby="install-tab-local">
          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={DownloadIcon} className="icon" size={20} />
              </div>
              <div className="process-num">01</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Clonar o Repositório ou Baixar ZIP</h3>
              <p className="process-desc">
                Faça o download do código-fonte para inspecionar todos os scripts e skills localmente:
              </p>
              <div className="cmd">
                <code>git clone https://github.com/diego-ruas/maleta.dev.git</code>
                <CopyButton className="cmd-copy" text="git clone https://github.com/diego-ruas/maleta.dev.git" aria-label="Copiar comando de git clone">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={NotesIcon} className="icon" size={20} />
              </div>
              <div className="process-num">02</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Inspecionar as Skills</h3>
              <p className="process-desc">
                Navegue pela pasta <code>claude/skills/</code>. Cada skill contém seu arquivo <code>SKILL.md</code> em Markdown auditável.
              </p>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={TerminalIcon} className="icon" size={20} />
              </div>
              <div className="process-num">03</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Executar Instalador Local</h3>
              <p className="process-desc">
                Execute o script de instalação do repositório no PowerShell:
              </p>
              <div className="cmd">
                {isUnix ? (
                  <>
                    <code>cd maleta.dev &amp;&amp; bash scripts/install.sh</code>
                    <CopyButton className="cmd-copy" text="cd maleta.dev && bash scripts/install.sh" aria-label="Copiar comando de execução local">
                      <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                      <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                    </CopyButton>
                  </>
                ) : (
                  <>
                    <code>cd maleta.dev; powershell -ExecutionPolicy Bypass -File scripts/install.ps1</code>
                    <CopyButton className="cmd-copy" text="cd maleta.dev; powershell -ExecutionPolicy Bypass -File scripts/install.ps1" aria-label="Copiar comando de execução local">
                      <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                      <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                    </CopyButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Painel de Dicas Rápidas, Manutenção e Localização */}
      <div className="tutorial-tips-panel">
        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={ShieldIcon} className="icon" size={20} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Backup Automático</h4>
            <p className="tutorial-tip-desc">
              Suas configurações nunca são perdidas. O instalador gera um snapshot <code>.pre-install.bak</code> antes de aplicar qualquer alteração.
            </p>
          </div>
        </div>

        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={DownloadIcon} className="icon" size={20} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Como Atualizar</h4>
            <p className="tutorial-tip-desc">
              Para atualizar ou alterar seu mix de skills, basta selecionar as novas opções no site e rodar o novo comando no terminal.
            </p>
          </div>
        </div>

        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={CpuIcon} className="icon" size={20} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Funciona em Vários Agentes</h4>
            <p className="tutorial-tip-desc">
              As mesmas skills rodam no Claude Code, Codex e qualquer agente que leia arquivos <code>SKILL.md</code> — sem duplicar nada.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

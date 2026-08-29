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
import { OpencodeIcon } from "@/components/icons/opencode";
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
    prompt: "Construa uma interface moderna, com estetica de terminal limpa e acessibilidade refinada, aplicando as diretrizes da skill design-taste-frontend.",
  },
  {
    title: "Desenvolvimento Guiado por Testes",
    skill: "test-driven-development",
    category: "Qualidade",
    prompt: "Escreva a suite completa de testes unitarios e de integracao seguindo o ciclo red-green-refactor antes de criar o codigo de producao, com a skill test-driven-development.",
  },
  {
    title: "Investigacao & Causa Raiz",
    skill: "systematic-debugging",
    category: "Workflow",
    prompt: "Investigue a falha nesta requisicao de forma sistematica: formule hipoteses, inspecione os logs e teste cada causa raiz com a skill systematic-debugging.",
  },
  {
    title: "Codigo Enxuto & Sem Bloat",
    skill: "ponytail",
    category: "Refatoracao",
    prompt: "Revise esta funcao e remova toda complexidade acidental, abstracoes prematuras e dependencias desnecessarias, aplicando a mentalidade da skill ponytail.",
  },
];

export default function InstallSteps() {
  const { installCommand, selectedSkills, targetTool, downloadScript } = useToolkit();
  const [activeTab, setActiveTab] = useState<InstallTab>("oneliner");

  const previewCommand = useMemo(() => {
    if (selectedSkills.size === 0) return "# Selecione ao menos uma skill no catalogo acima";
    if (selectedSkills.size <= 2) return installCommand;
    const sample = [...selectedSkills].slice(0, 2).map((n) => `'${n}'`).join(", ");
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${sample}, … +${selectedSkills.size - 2})`;
  }, [selectedSkills, installCommand, targetTool]);

  return (
    <Reveal id="instalar" className="reveal" ariaLabelledby="instalar-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 05. TUTORIAL & INSTALACAO"}</span>
      </div>
      <h2 id="instalar-heading">Como instalar e usar seu toolkit</h2>
      <p>
        Guia pratico passo a passo para provisionar seu ambiente sob medida em segundos e comecar a interagir com as skills no Claude Code e opencode.
      </p>

      {/* Seletor de Modo / Abas do Tutorial */}
      <div className="install-mode-toggle" role="tablist" aria-label="Metodos de instalacao e onboarding">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "oneliner"}
          className={`install-tab-btn${activeTab === "oneliner" ? " active" : ""}`}
          onClick={() => setActiveTab("oneliner")}
        >
          <AnimatedIcon Icon={ZapIcon} className="icon" size={16} />
          <span>1. One-Liner Express (Recomendado)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "fresh"}
          className={`install-tab-btn${activeTab === "fresh" ? " active" : ""}`}
          onClick={() => setActiveTab("fresh")}
        >
          <AnimatedIcon Icon={CpuIcon} className="icon" size={16} />
          <span>2. Setup do Zero (Instalar Ferramentas)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "local"}
          className={`install-tab-btn${activeTab === "local" ? " active" : ""}`}
          onClick={() => setActiveTab("local")}
        >
          <AnimatedIcon Icon={TerminalIcon} className="icon" size={16} />
          <span>3. Instalacao Local (Git / ZIP)</span>
        </button>
      </div>

      {/* Conteudo dinamico por aba */}
      {activeTab === "oneliner" && (
        <div className="process-grid">
          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={CpuIcon} className="icon" size={20} />
              </div>
              <div className="process-num">01</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Requisitos Minimos</h3>
              <p className="process-desc">
                Windows 10/11 com <strong>PowerShell 5.1+</strong> nativo e <strong>Claude Code</strong> e/ou <strong>opencode</strong> ja instalados na sua maquina.
              </p>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={TerminalIcon} className="icon" size={20} />
              </div>
              <div className="process-num">02</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Executar Comando Customizado</h3>
              <p className="process-desc">
                Cole a linha abaixo no PowerShell e tecle Enter. Apenas as <strong>{selectedSkills.size} skills selecionadas</strong> para o alvo <strong>{targetTool.toUpperCase()}</strong> serao provisionadas:
              </p>
              <div className="cmd">
                <code title={installCommand}>{previewCommand}</code>
                <CopyButton
                  className="cmd-copy"
                  text={installCommand}
                  aria-label="Copiar comando de instalacao customizado completo"
                  title="Copiar comando completo"
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
              <div className="tutorial-step-actions">
                <button
                  type="button"
                  onClick={downloadScript}
                  className="tutorial-action-btn"
                  title="Baixar arquivo install-custom.ps1 pronto para rodar offline"
                >
                  <AnimatedIcon Icon={DownloadIcon} className="icon" size={14} />
                  <span>Baixar script .ps1 sob medida</span>
                </button>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={SparklesIcon} className="icon" size={20} />
              </div>
              <div className="process-num">03</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Validar no Terminal</h3>
              <p className="process-desc">
                Abra seu assistente no terminal. Digite o comando abaixo para confirmar que todas as skills foram carregadas com sucesso:
              </p>
              <div className="cmd">
                <code>/skills</code>
                <CopyButton className="cmd-copy" text="/skills" aria-label="Copiar comando /skills">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={CodeIcon} className="icon" size={20} />
              </div>
              <div className="process-num">04</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Primeiro Uso — Exemplos Praticos de Prompts</h3>
              <p className="process-desc">
                Para acionar uma skill, basta menciona-la ou descrever a tarefa diretamente no prompt. Clique para copiar exemplos recomendados:
              </p>
              <div className="prompt-examples-grid">
                {PROMPT_EXAMPLES.map((ex, idx) => (
                  <div key={idx} className="prompt-example-card">
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
            </div>
          </div>
        </div>
      )}

      {activeTab === "fresh" && (
        <div className="process-grid">
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
                O Claude Code e executado via Node.js (versao 18+). Instale-o globalmente pelo npm no seu PowerShell:
              </p>
              <div className="cmd">
                <code>npm install -g @anthropic-ai/claude-code</code>
                <CopyButton className="cmd-copy" text="npm install -g @anthropic-ai/claude-code" aria-label="Copiar comando de instalacao do Claude Code">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={OpencodeIcon} className="icon" size={20} />
              </div>
              <div className="process-num">02</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Instalar o opencode (Opcional)</h3>
              <p className="process-desc">
                Caso utilize ou queira experimentar o opencode para modelos locais ou open-source:
              </p>
              <div className="cmd">
                <code>npm install -g opencode-ai</code>
                <CopyButton className="cmd-copy" text="npm install -g opencode-ai" aria-label="Copiar comando de instalacao do opencode">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>

          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={ZapIcon} className="icon" size={20} />
              </div>
              <div className="process-num">03</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Fazer o Primeiro Login</h3>
              <p className="process-desc">
                Execute <code>claude</code> no seu terminal para autenticar com sua conta Anthropic. Em seguida, feche a sessao digitando <code>/exit</code>.
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
                Agora que os assistentes estao instalados, rode o instalador customizado para injetar todas as skills e plugins selecionados:
              </p>
              <div className="cmd">
                <code title={installCommand}>{previewCommand}</code>
                <CopyButton className="cmd-copy" text={installCommand} aria-label="Copiar comando de instalacao">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "local" && (
        <div className="process-grid">
          <div className="process-card">
            <div className="process-card-header">
              <div className="process-icon-box">
                <AnimatedIcon Icon={DownloadIcon} className="icon" size={20} />
              </div>
              <div className="process-num">01</div>
            </div>
            <div className="process-content">
              <h3 className="process-title">Clonar o Repositorio ou Baixar ZIP</h3>
              <p className="process-desc">
                Faca o download do codigo-fonte para inspecionar todos os scripts, skills e regras localmente:
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
              <h3 className="process-title">Inspecionar os Arquivos</h3>
              <p className="process-desc">
                Navegue pelas pastas <code>claude/skills/</code> e <code>opencode/</code>. Cada skill contem seu respectivo <code>SKILL.md</code> auditavel e sem dependencias ocultas.
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
                Execute o script de instalacao do repositorio no PowerShell:
              </p>
              <div className="cmd">
                <code>cd maleta.dev; powershell -ExecutionPolicy Bypass -File scripts/install.ps1</code>
                <CopyButton className="cmd-copy" text="cd maleta.dev; powershell -ExecutionPolicy Bypass -File scripts/install.ps1" aria-label="Copiar comando de execucao local">
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Painel de Dicas Rapidas, Manutencao e Localizacao */}
      <div className="tutorial-tips-panel">
        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={ShieldIcon} className="icon" size={18} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Backup Automatico</h4>
            <p className="tutorial-tip-desc">
              Suas configuracoes existentes nunca sao perdidas. O instalador gera um snapshot <code>.pre-install.bak</code> antes de aplicar qualquer alteracao.
            </p>
          </div>
        </div>

        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={NotesIcon} className="icon" size={18} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Onde Ficam os Arquivos</h4>
            <p className="tutorial-tip-desc">
              Skills do Claude Code: <code>~/.claude/skills/</code><br />
              Configuracoes do opencode: <code>~/.config/opencode/</code>
            </p>
          </div>
        </div>

        <div className="tutorial-tip-item">
          <div className="tutorial-tip-icon">
            <AnimatedIcon Icon={ZapIcon} className="icon" size={18} />
          </div>
          <div className="tutorial-tip-body">
            <h4 className="tutorial-tip-title">Como Atualizar</h4>
            <p className="tutorial-tip-desc">
              Para atualizar ou alterar seu mix de skills, basta selecionar as novas opcoes no site e rodar o comando novamente.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}


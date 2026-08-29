"use client";

import { useMemo } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { CpuIcon } from "@/components/icons/cpu";
import { TerminalIcon } from "@/components/icons/terminal";
import { SparklesIcon } from "@/components/icons/sparkles";
import { useToolkit } from "@/lib/toolkitContext";

export default function InstallSteps() {
  const { installCommand, selectedSkills, targetTool } = useToolkit();

  const previewCommand = useMemo(() => {
    if (selectedSkills.size === 0) return "# Selecione ao menos uma skill no catálogo acima";
    if (selectedSkills.size <= 2) return installCommand;
    const sample = [...selectedSkills].slice(0, 2).map((n) => `'${n}'`).join(", ");
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${sample}, … +${selectedSkills.size - 2})`;
  }, [selectedSkills, installCommand, targetTool]);

  return (
    <Reveal id="instalar" className="reveal" ariaLabelledby="instalar-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 05. INSTALAÇÃO"}</span>
      </div>
      <h2 id="instalar-heading">Como instalar seu toolkit</h2>
      <p>
        Execute o comando gerado especialmente para a sua seleção. Sem necessidade de privilégios de administrador ou clone prévio do repositório.
      </p>

      <div className="process-grid">
        <div className="process-card">
          <div className="process-card-header">
            <div className="process-icon-box">
              <AnimatedIcon Icon={CpuIcon} className="icon" size={20} />
            </div>
            <div className="process-num">01</div>
          </div>
          <div className="process-content">
            <h3 className="process-title">Requisitos</h3>
            <p className="process-desc">
              Windows com PowerShell 5.1 (nativo) e Claude Code e/ou opencode instalados.
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
              Cole o comando abaixo no PowerShell e tecle Enter. Apenas as <strong>{selectedSkills.size} skills selecionadas</strong> serão provisionadas:
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
            <h3 className="process-title">Pronto!</h3>
            <p className="process-desc">
              Abra o Claude Code ou o opencode. Digite <code>/skills</code> para conferir suas capacidades configuradas.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

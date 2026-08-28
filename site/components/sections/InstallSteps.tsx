"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";

export default function InstallSteps() {
  return (
    <Reveal id="instalar" className="reveal" ariaLabelledby="instalar-heading">
      <h2 id="instalar-heading">Como instalar</h2>
      <p>
        Dois comandos e o ambiente inteiro é instalado. Requer Windows com
        PowerShell 5.1 e{" "}
        <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer">
          Git
        </a>
        . Não precisa de administrador. Prefere só algumas skills? Escolha
        na <a href="#skills">seção Skills</a> antes de instalar.
      </p>
      <div className="process-grid">
        <div className="process-card">
          <div className="process-num">01</div>
          <div className="process-content">
            <h3 className="process-title">Requisitos</h3>
            <p className="process-desc">
              Windows com PowerShell 5.1 (nativo), Git instalado e a
              ferramenta alvo: Claude Code e/ou opencode.
            </p>
          </div>
        </div>
        <div className="process-card">
          <div className="process-num">02</div>
          <div className="process-content">
            <h3 className="process-title">Clonar</h3>
            <p className="process-desc">
              Sem Git? Use o botão <strong>Baixar ZIP</strong> acima e
              extraia a pasta.
            </p>
          </div>
          <div className="cmd">
            <code>git clone https://github.com/diego-ruas/maleta.dev.git</code>
            <CopyButton
              className="cmd-copy"
              text="git clone https://github.com/diego-ruas/maleta.dev.git"
              aria-label="Copiar comando git clone"
              title="Copiar comando"
            >
              <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
              <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
            </CopyButton>
          </div>
        </div>
        <div className="process-card">
          <div className="process-num">03</div>
          <div className="process-content">
            <h3 className="process-title">Instalar</h3>
            <p className="process-desc">
              Instala Claude Code e opencode de uma vez. Se{" "}
              <code>claude/skills-selection.txt</code> existir na pasta,
              instala só as skills marcadas:
            </p>
          </div>
          <div className="cmd">
            <code>powershell -ExecutionPolicy Bypass -File scripts/install.ps1</code>
            <CopyButton
              className="cmd-copy"
              text="powershell -ExecutionPolicy Bypass -File scripts/install.ps1"
              aria-label="Copiar comando de instalação"
              title="Copiar comando"
            >
              <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
              <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
            </CopyButton>
          </div>
        </div>
        <div className="process-card">
          <div className="process-num">04</div>
          <div className="process-content">
            <h3 className="process-title">Reiniciar</h3>
            <p className="process-desc">
              Reinicie o Claude Code ou o opencode para carregar skills,
              plugins e MCP. Só uma ferramenta? Rode{" "}
              <code>claude/install.ps1</code> ou{" "}
              <code>opencode/install.ps1</code>.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

"use client";

import { useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";

export default function InstallSteps() {
  const [activeTab, setActiveTab] = useState<"express" | "manual">("express");

  return (
    <Reveal id="instalar" className="reveal" ariaLabelledby="instalar-heading">
      <h2 id="instalar-heading">Como instalar</h2>
      <p>
        Escolha o método mais conveniente para o seu fluxo. Sem necessidade de privilégios de administrador.
      </p>

      <div className="install-mode-toggle" role="tablist" aria-label="Modo de instalação">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "express"}
          className={`install-tab-btn${activeTab === "express" ? " active" : ""}`}
          onClick={() => setActiveTab("express")}
        >
          Instalação Expressa (One-Liner)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "manual"}
          className={`install-tab-btn${activeTab === "manual" ? " active" : ""}`}
          onClick={() => setActiveTab("manual")}
        >
          Instalação Manual / Git Clone
        </button>
      </div>

      {activeTab === "express" ? (
        <div className="process-grid">
          <div className="process-card">
            <div className="process-num">01</div>
            <div className="process-content">
              <h3 className="process-title">Requisitos</h3>
              <p className="process-desc">
                Windows com PowerShell 5.1 (nativo) e a ferramenta instalada (Claude Code e/ou opencode).
              </p>
            </div>
          </div>

          <div className="process-card">
            <div className="process-num">02</div>
            <div className="process-content">
              <h3 className="process-title">Executar Comando</h3>
              <p className="process-desc">
                Abra o PowerShell, cole o comando abaixo e tecle Enter. O instalador baixa, configura e ativa tudo automaticamente:
              </p>
            </div>
            <div className="cmd">
              <code>irm https://maleta.dev/install.ps1 | iex</code>
              <CopyButton
                className="cmd-copy"
                text="irm https://maleta.dev/install.ps1 | iex"
                aria-label="Copiar comando de instalação expressa"
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
              <h3 className="process-title">Pronto!</h3>
              <p className="process-desc">
                Reinicie o Claude Code ou o opencode. No Claude Code, digite <code>/skills</code> para conferir suas novas capacidades.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="process-grid">
          <div className="process-card">
            <div className="process-num">01</div>
            <div className="process-content">
              <h3 className="process-title">Clonar o repositório</h3>
              <p className="process-desc">
                Clone o repositório completo via Git (ou baixe o ZIP):
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
            <div className="process-num">02</div>
            <div className="process-content">
              <h3 className="process-title">Executar Instalador Local</h3>
              <p className="process-desc">
                Navegue até a pasta clonada e rode o instalador:
              </p>
            </div>
            <div className="cmd">
              <code>powershell -ExecutionPolicy Bypass -File scripts/install.ps1</code>
              <CopyButton
                className="cmd-copy"
                text="powershell -ExecutionPolicy Bypass -File scripts/install.ps1"
                aria-label="Copiar comando de instalação local"
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
              <h3 className="process-title">Reiniciar</h3>
              <p className="process-desc">
                Reinicie suas ferramentas de IA para carregar skills, plugins e servidores MCP.
              </p>
            </div>
          </div>
        </div>
      )}
    </Reveal>
  );
}

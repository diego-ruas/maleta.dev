"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronDownIcon } from "@/components/icons/chevron-down";
import { SKILLS } from "@/lib/data";

export default function SecuritySection() {
  const totalSkills = SKILLS.length;

  return (
    <Reveal id="seguranca" className="reveal" ariaLabelledby="seguranca-heading">
      <h2 id="seguranca-heading">Segurança & Auditoria NVIDIA SkillSpector</h2>
      <p>
        Para assegurar que nenhuma instrução maliciosa, injeção de prompt oculta
        ou vetor de ataque chegue à sua máquina, todas as {totalSkills} skills passam
        por auditoria estática automatizada com o{" "}
        <a
          href="https://github.com/nvidia/skillspector"
          target="_blank"
          rel="noopener noreferrer"
        >
          NVIDIA SkillSpector
        </a>
        .
      </p>

      <div className="security-stats-grid">
        <div className="security-stat-card">
          <div className="security-stat-value highlight-num">
            {totalSkills} / {totalSkills}
          </div>
          <div className="security-stat-label">Skills Auditadas</div>
          <div className="security-stat-desc">100% do catálogo verificado</div>
        </div>
        <div className="security-stat-card">
          <div className="security-stat-value">0</div>
          <div className="security-stat-label">Falhas Críticas</div>
          <div className="security-stat-desc">0 vulnerabilidades de execução</div>
        </div>
        <div className="security-stat-card">
          <div className="security-stat-value">0</div>
          <div className="security-stat-label">Backdoors Ocultos</div>
          <div className="security-stat-desc">0 payloads maliciosos detectados</div>
        </div>
        <div className="security-stat-card">
          <div className="security-stat-value">100%</div>
          <div className="security-stat-label">Origem Upstream</div>
          <div className="security-stat-desc">Anthropic, Cloudflare, Obra, Vercel</div>
        </div>
      </div>

      <details className="security-details">
        <summary>
          <span>Saiba mais sobre as camadas de segurança e auditoria</span>
          <AnimatedIcon Icon={ChevronDownIcon} className="icon security-caret" size={16} />
        </summary>
        <div className="security-details-content">
          <div className="security-pillars-grid">
            <div className="security-pillar-card">
              <div className="security-pillar-header">
                <span className="security-pillar-tag">{"// CAMADA 01"}</span>
                <h3 className="security-pillar-title">Injeção de Prompt & Anti-Refusal</h3>
              </div>
              <p className="security-pillar-desc">
                Varredura contra caracteres invisíveis (zero-width), tags HTML ocultas,
                comentários maliciosos e tentativas de jailbreak ou override de regras.
              </p>
            </div>

            <div className="security-pillar-card">
              <div className="security-pillar-header">
                <span className="security-pillar-tag">{"// CAMADA 02"}</span>
                <h3 className="security-pillar-title">Menor Privilégio & Conexões MCP</h3>
              </div>
              <p className="security-pillar-desc">
                Prevenção contra Tool Poisoning e garantia de que ferramentas e
                servidores MCP executem estritamente no escopo de menor privilégio.
              </p>
            </div>

            <div className="security-pillar-card">
              <div className="security-pillar-header">
                <span className="security-pillar-tag">{"// CAMADA 03"}</span>
                <h3 className="security-pillar-title">Análise de AST & Execução Segura</h3>
              </div>
              <p className="security-pillar-desc">
                Análise sintática (AST) de scripts empacotados (.py, .js, .ts) e
                bloqueio de deserialização insegura (sem eval, pickle ou Function).
              </p>
            </div>

            <div className="security-pillar-card">
              <div className="security-pillar-header">
                <span className="security-pillar-tag">{"// CAMADA 04"}</span>
                <h3 className="security-pillar-title">Integridade da Supply Chain</h3>
              </div>
              <p className="security-pillar-desc">
                Validação estática de manifestos e lockfiles, com garantia de ausência
                de pacotes fantasmas ou dependências vulneráveis não declaradas.
              </p>
            </div>
          </div>

          <div className="security-report-card">
            <div className="security-report-tag">
              {"// AUDITORIA AUTOMATIZADA · NVIDIA SKILLSPECTOR V2.11.0"}
            </div>
            <h3 className="security-report-title">Auditoria Aprovada — 0 Riscos Detectados</h3>
            <p className="security-report-desc">
              Reproduza a auditoria estática a qualquer momento na sua máquina antes de instalar qualquer skill:
            </p>
            <div className="security-report-actions">
              <div className="cmd">
                <code>skillspector scan claude/skills -r --no-llm</code>
                <CopyButton
                  className="cmd-copy"
                  text="skillspector scan claude/skills -r --no-llm"
                  aria-label="Copiar comando de auditoria NVIDIA SkillSpector"
                  title="Copiar comando"
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
                </CopyButton>
              </div>
              <a
                href="https://github.com/diego-ruas/maleta.dev/blob/main/SKILLSPECTOR_REPORT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gh"
              >
                <span>Ver Relatório</span>
                <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
              </a>
            </div>
          </div>
        </div>
      </details>
    </Reveal>
  );
}

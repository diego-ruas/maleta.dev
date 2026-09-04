"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { DownloadIcon } from "@/components/icons/download";
import { SearchIcon } from "@/components/icons/search";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { CodeIcon } from "@/components/icons/code";
import { TerminalIcon } from "@/components/icons/terminal";
import { ClaudeIcon } from "@/components/icons/claude";
import { CodexIcon } from "@/components/icons/codex";
import { ZapIcon } from "@/components/icons/zap";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import SkillCard from "@/components/skills/SkillCard";
import RepoScan from "@/components/skills/RepoScan";
import { SKILL_PRESETS, type SkillPreset } from "@/lib/data";
import { getCategoryIcon } from "@/lib/iconMap";
import { useToolkit } from "@/lib/toolkitContext";

type ExplorerStep = "presets" | "skills" | "hub" | "summary";

interface SkillsExplorerProps {
  categories: readonly { label: string; key: string }[];
}

export default function SkillsExplorer({ categories }: SkillsExplorerProps) {
  const {
    targetTool,
    setTargetTool,
    targetOs,
    setTargetOs,
    selectedSkills,
    activePreset,
    isPresetActive,
    activePresets,
    customSkills,
    allMergedSkills,
    installCommand,
    selectedPlugins,
    togglePreset,
    toggleSkill,
    selectAllSkills,
    clearSkills,
    addCustomSkill,
    removeCustomSkill,
    downloadScript,
  } = useToolkit();

  const [activeStep, setActiveStep] = useState<ExplorerStep>("presets");
  const [search, setSearch] = useState("");
  const [announcedCount, setAnnouncedCount] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewScope, setViewScope] = useState<"all" | "selected">("all");
  const panelRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Move o foco pro painel a cada troca de etapa: sem isso o foco fica preso
  // no botão do stepper (ruim pra teclado/leitor de tela e no mobile o
  // usuário não percebe que o conteúdo mudou). Pula o mount inicial: focar
  // ali rola a página pra seção ao simplesmente abrir o site.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    panelRef.current?.focus();
  }, [activeStep]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "repo-add" || hash === "hub") {
        setActiveStep("hub");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const visibleSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allMergedSkills.filter((skill) => {
      if (viewScope === "selected" && !selectedSkills.has(skill.name)) {
        return false;
      }
      const matchCat = activeCategory === "all" || skill.category === activeCategory;
      const matchQ =
        !q || skill.name.toLowerCase().includes(q) || skill.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [allMergedSkills, activeCategory, search, viewScope, selectedSkills]);

  // Anuncio de contagem debounced: a contagem visivel atualiza a cada tecla,
  // mas anunciar isso via aria-live a cada tecla e ruido pro leitor de tela.
  useEffect(() => {
    const t = setTimeout(() => setAnnouncedCount(visibleSkills.length), 500);
    return () => clearTimeout(t);
  }, [visibleSkills.length]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.key] =
        cat.key === "all"
          ? allMergedSkills.length
          : allMergedSkills.filter((s) => s.category === cat.key).length;
    }
    if (customSkills.length > 0) counts["Externas"] = customSkills.length;
    return counts;
  }, [categories, allMergedSkills, customSkills.length]);

  const allChips = useMemo(
    () => (customSkills.length > 0 ? [...categories, { label: "Externas", key: "Externas" }] : categories),
    [categories, customSkills.length]
  );

  const selectedPresetObj: SkillPreset | undefined = useMemo(
    () => SKILL_PRESETS.find((p) => p.id === activePreset),
    [activePreset]
  );

  const steps = [
    {
      id: "presets" as const,
      panelId: undefined as string | undefined,
      num: "01",
      title: "Presets & Base",
      subtitle: activePreset ? selectedPresetObj?.name ?? "Preset Ativo" : "Escolha inicial",
      Icon: SlidersHorizontalIcon,
      badgeText: `${selectedSkills.size} skills`,
    },
    {
      id: "skills" as const,
      num: "02",
      title: "Ajuste Fino",
      subtitle: "Catálogo e filtros",
      Icon: CodeIcon,
      badgeText: `${selectedSkills.size}/${allMergedSkills.length}`,
    },
    {
      id: "hub" as const,
      panelId: "repo-add",
      num: "03",
      title: "Hub GitHub",
      subtitle: "Skills comunitárias",
      Icon: SearchIcon,
      badgeText: customSkills.length > 0 ? `+${customSkills.length} ext` : "opcional",
    },
    {
      id: "summary" as const,
      num: "04",
      title: "Pacote & Instalação",
      subtitle: "One-liner PowerShell",
      Icon: TerminalIcon,
      badgeText: selectedSkills.size > 0 ? "pronto" : "vazio",
    },
  ];

  return (
    <div className="skills-explorer-container">
      {/* 1. PIPELINE STEPPER NAV BAR */}
      <nav className="explorer-pipeline-nav" aria-label="Etapas de configuração do toolkit">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const isDone =
            (step.id === "presets" && selectedSkills.size > 0) ||
            (step.id === "skills" && selectedSkills.size > 0) ||
            (step.id === "hub" && customSkills.length > 0);

          return (
            <button
              key={step.id}
              type="button"
              className={`explorer-pipeline-step${isActive ? " active" : ""}${isDone ? " done" : ""}`}
              aria-current={isActive ? "step" : undefined}
              aria-controls={step.panelId ?? `explorer-panel-${step.id}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="pipeline-step-header">
                <span className="pipeline-step-num">{step.num}</span>
                <span className="pipeline-step-badge">{step.badgeText}</span>
              </div>
              <div className="pipeline-step-info">
                <span className="pipeline-step-title">
                  <AnimatedIcon Icon={step.Icon} className="icon" size={14} />
                  <span>{step.title}</span>
                </span>
                <span className="pipeline-step-sub">{step.subtitle}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 2. ETAPA 01: PRESETS & BASE */}
      {activeStep === "presets" && (
        <section ref={panelRef} tabIndex={-1} id="explorer-panel-presets" className="explorer-stage-panel" aria-label="Etapa 1: Presets recomendados">
          <div className="stage-panel-header">
            <div>
              <span className="section-tag-prefix">{"// ETAPA 01"}</span>
              <h3 className="stage-panel-title">Comece por uma base</h3>
              <p className="stage-panel-desc">
                Escolha uma ou mais bases; você pode ajustar as skills depois.
              </p>
            </div>
            {activePresets.size > 0 && (
              <div className="stage-status-box">
                <span className="status-dot"></span>
                <span>
                  Bases ativas: <strong>{activePresets.size}</strong> ({selectedSkills.size} skills selecionadas)
                </span>
              </div>
            )}
          </div>

          <div className="preset-cards-grid" role="group" aria-label="Catálogo de presets">
            {SKILL_PRESETS.map((preset) => {
              const isActive = isPresetActive(preset.id);
              return (
                <div
                  key={preset.id}
                  className={`preset-showcase-card${isActive ? " active" : ""}`}
                >
                  <div className="preset-card-top">
                    <div className="preset-card-title-wrap">
                      <span className="preset-card-badge">{preset.badge}</span>
                      <h4 className="preset-card-name">{preset.name}</h4>
                    </div>
                    <span className="preset-card-count">{preset.skills.length} skills</span>
                  </div>

                  <p className="preset-card-desc">{preset.description}</p>

                  <details
                    className="preset-card-details"
                  >
                    <summary>Ver skills incluídas</summary>
                    <div className="preset-card-preview-tags">
                      {preset.skills.slice(0, 4).map((skillName) => (
                        <span key={skillName} className="preset-skill-tag">
                          {skillName}
                        </span>
                      ))}
                      {preset.skills.length > 4 && (
                        <span className="preset-skill-tag-more">+{preset.skills.length - 4} mais</span>
                      )}
                    </div>
                  </details>

                  <div className="preset-card-footer">
                    <button
                      type="button"
                      className={`btn-gh-sm preset-apply-btn${isActive ? " active" : ""}`}
                      aria-pressed={isActive}
                      onClick={() => togglePreset(preset.id)}
                    >
                      {isActive ? (
                        <>
                          <AnimatedIcon Icon={CheckIcon} className="icon" size={14} />
                          <span>Base Selecionada</span>
                        </>
                      ) : (
                        <span>+ Adicionar esta base</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stage-nav-footer">
            <span className="stage-summary-text">
              <strong>{selectedSkills.size}</strong> skills carregadas no seu pacote
            </span>
            <div className="stage-nav-buttons">
              <button
                type="button"
                className="btn-gh"
                onClick={() => setActiveStep("summary")}
              >
                <span>Ir direto para instalação</span>
                <AnimatedIcon Icon={ChevronRightIcon} className="icon" size={16} />
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveStep("skills")}
              >
                <span>Ajustar skills individualmente</span>
                <AnimatedIcon Icon={ChevronRightIcon} className="icon" size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. ETAPA 02: AJUSTE FINO (CATÁLOGO DE SKILLS) */}
      {activeStep === "skills" && (
        <section ref={panelRef} tabIndex={-1} id="explorer-panel-skills" className="explorer-stage-panel" aria-label="Etapa 2: Ajuste fino de skills">
          <div className="stage-panel-header">
            <div>
              <span className="section-tag-prefix">{"// ETAPA 02"}</span>
              <h3 className="stage-panel-title">Ajuste fino do catálogo</h3>
              <p className="stage-panel-desc">
                Filtre por categoria ou faça uma busca direta. Marque ou desmarque qualquer skill para ajustar seu pacote.
              </p>
            </div>
            <div className="skills-selection-status-badge">
              <span>Pacote ativo:</span>
              <strong>{selectedSkills.size} skills selecionadas</strong>
            </div>
          </div>

          {/* Barra de Filtros e Busca */}
          <div className="skills-filter-section">
            <div className="skills-search-row">
              <div className="skills-search-bar">
                <AnimatedIcon Icon={SearchIcon} className="skills-search-icon" size={16} />
                <label htmlFor="skills-search" className="sr-only">Buscar skill no catálogo</label>
                <input
                  type="search"
                  id="skills-search"
                  placeholder="Buscar skill no catálogo (ex.: a11y, test, cloudflare, design…)"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="skills-scope-toggle" role="group" aria-label="Escopo de exibição">
                <button
                  type="button"
                  className={`scope-toggle-btn${viewScope === "all" ? " active" : ""}`}
                  aria-pressed={viewScope === "all"}
                  onClick={() => setViewScope("all")}
                >
                  <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={14} />
                  <span>Todas ({allMergedSkills.length})</span>
                </button>
                <button
                  type="button"
                  className={`scope-toggle-btn${viewScope === "selected" ? " active" : ""}`}
                  aria-pressed={viewScope === "selected"}
                  onClick={() => setViewScope("selected")}
                >
                  <AnimatedIcon Icon={CheckIcon} className="icon" size={14} />
                  <span>Selecionadas ({selectedSkills.size})</span>
                </button>
              </div>
            </div>

            <div className="skills-category-chips" role="group" aria-label="Filtrar por categoria">
              {allChips.map((cat) => {
                const ChipIcon = getCategoryIcon(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    className={`category-chip-btn${cat.key === activeCategory ? " active" : ""}`}
                    aria-pressed={cat.key === activeCategory ? "true" : "false"}
                    onClick={() => setActiveCategory(cat.key)}
                  >
                    <AnimatedIcon Icon={ChipIcon} className="chip-icon" size={14} />
                    <span>{cat.label}</span>
                    <span className="chip-count">({categoryCounts[cat.key] ?? 0})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra rápida de ações em lote */}
          <div className="skills-batch-bar">
            <div className="selection-quick-btns">
              <button type="button" className="btn-gh-sm" onClick={selectAllSkills}>
                Marcar Todas ({allMergedSkills.length})
              </button>
              <button type="button" className="btn-gh-sm" onClick={clearSkills}>
                Desmarcar Todas
              </button>
            </div>
            <span className="skills-viewing-count">
              Exibindo <strong>{visibleSkills.length}</strong> de {allMergedSkills.length} skills
            </span>
            <span className="sr-only" aria-live="polite">
              {announcedCount !== null && `Exibindo ${announcedCount} de ${allMergedSkills.length} skills`}
            </span>
          </div>

          {/* Grid de Skills */}
          <div className="skills-results-container">
            <ul className="skills-list" id="skills-list">
              {visibleSkills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  selected={selectedSkills.has(skill.name)}
                  onToggleSelect={() => toggleSkill(skill.name)}
                />
              ))}
            </ul>

            {visibleSkills.length === 0 && (
              <div className="skills-empty-box">
                <p>
                  {search.trim()
                    ? `Nenhuma skill encontrada para "${search.trim()}".`
                    : viewScope === "selected"
                    ? "Nenhuma skill selecionada no momento."
                    : "Nenhuma skill encontrada nesta categoria."}
                </p>
                <button
                  type="button"
                  className="btn-gh"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setViewScope("all");
                  }}
                >
                  Limpar filtros de busca
                </button>
              </div>
            )}
          </div>

          <div className="stage-nav-footer">
            <button
              type="button"
              className="btn-gh"
              onClick={() => setActiveStep("presets")}
            >
              <AnimatedIcon Icon={ChevronLeftIcon} className="icon" size={16} />
              <span>Voltar para Presets</span>
            </button>
            <div className="stage-nav-buttons">
              <button
                type="button"
                className="btn-gh"
                onClick={() => setActiveStep("hub")}
              >
                <span>Importar do GitHub (Etapa 03)</span>
                <AnimatedIcon Icon={ChevronRightIcon} className="icon" size={16} />
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveStep("summary")}
              >
                <span>Finalizar pacote (Etapa 04)</span>
                <AnimatedIcon Icon={ChevronRightIcon} className="icon" size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. ETAPA 03: HUB COMUNITÁRIO GITHUB */}
      {activeStep === "hub" && (
        <section ref={panelRef} tabIndex={-1} className="explorer-stage-panel" id="repo-add" aria-label="Etapa 3: Hub Comunitário do GitHub">
          <div className="stage-panel-header">
            <div>
              <span className="section-tag-prefix">{"// ETAPA 03"}</span>
              <h3 className="stage-panel-title">Descobrir & Importar do GitHub</h3>
              <p className="stage-panel-desc">
                Pesquise repositórios abertos no ecossistema GitHub, inspecione o <code>SKILL.md</code> e importe diretamente para o seu instalador com 1 clique.
              </p>
            </div>
            <div className="stage-status-box">
              <span>Externas no pacote:</span>
              <strong>{customSkills.length} skills</strong>
            </div>
          </div>

          <RepoScan
            existing={customSkills}
            builtInSkills={allMergedSkills.map((s) => s.name)}
            onAdd={addCustomSkill}
            onRemove={removeCustomSkill}
          />

          <div className="stage-nav-footer">
            <button
              type="button"
              className="btn-gh"
              onClick={() => setActiveStep("skills")}
            >
              <AnimatedIcon Icon={ChevronLeftIcon} className="icon" size={16} />
              <span>Voltar para Catálogo</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveStep("summary")}
            >
              <span>Concluir e Gerar Comando (Etapa 04)</span>
              <AnimatedIcon Icon={ChevronRightIcon} className="icon" size={16} />
            </button>
          </div>
        </section>
      )}

      {/* 5. ETAPA 04: PACOTE FINAL & INSTALAÇÃO */}
      {activeStep === "summary" && (
        <section ref={panelRef} tabIndex={-1} id="explorer-panel-summary" className="explorer-stage-panel" aria-label="Etapa 4: Resumo do Pacote e Instalação">
          <div className="stage-panel-header">
            <div>
              <span className="section-tag-prefix">{"// ETAPA 04"}</span>
              <h3 className="stage-panel-title">Seu pacote sob medida está pronto</h3>
              <p className="stage-panel-desc">
                Revise o conteúdo selecionado, escolha a ferramenta de destino e copie seu comando de instalação PowerShell.
              </p>
            </div>
          </div>

          <div className="summary-stage-grid">
            {/* Resumo e Seleções */}
            <div className="summary-details-card">
              <div className="summary-section-label">
                <span>{"// Ferramenta Alvo"}</span>
              </div>
              <div className="summary-tool-switcher" role="group" aria-label="Ferramenta de instalação">
                <button
                  type="button"
                  className={`summary-tool-btn${targetTool === "claude" ? " active" : ""}`}
                  aria-pressed={targetTool === "claude"}
                  onClick={() => setTargetTool("claude")}
                >
                  <AnimatedIcon Icon={ClaudeIcon} className="icon" size={14} />
                  <span>Claude Code</span>
                </button>
                <button
                  type="button"
                  className={`summary-tool-btn${targetTool === "codex" ? " active" : ""}`}
                  aria-pressed={targetTool === "codex"}
                  onClick={() => setTargetTool("codex")}
                >
                  <AnimatedIcon Icon={CodexIcon} className="icon" size={14} />
                  <span>Codex</span>
                </button>
                <button
                  type="button"
                  className={`summary-tool-btn${targetTool === "agents" ? " active" : ""}`}
                  aria-pressed={targetTool === "agents"}
                  onClick={() => setTargetTool("agents")}
                >
                  <span>Universal Agents (~/.agents)</span>
                </button>
                <button
                  type="button"
                  className={`summary-tool-btn${targetTool === "all" ? " active" : ""}`}
                  aria-pressed={targetTool === "all"}
                  onClick={() => setTargetTool("all")}
                >
                  <AnimatedIcon Icon={ZapIcon} className="icon" size={14} />
                  <span>Todos (Claude + Codex + Agents)</span>
                </button>
              </div>

              <div className="summary-section-label">
                <span>{"// Sistema Operacional"}</span>
              </div>
              <div className="summary-tool-switcher" role="group" aria-label="Sistema operacional de destino">
                <button
                  type="button"
                  className={`summary-tool-btn${targetOs === "windows" ? " active" : ""}`}
                  aria-pressed={targetOs === "windows"}
                  onClick={() => setTargetOs("windows")}
                >
                  <span>Windows (PowerShell)</span>
                </button>
                <button
                  type="button"
                  className={`summary-tool-btn${targetOs === "unix" ? " active" : ""}`}
                  aria-pressed={targetOs === "unix"}
                  onClick={() => setTargetOs("unix")}
                >
                  <span>Linux / macOS (bash)</span>
                </button>
              </div>

              <div className="summary-section-label" style={{ marginTop: "1rem" }}>
                <span>{`// Skills Ativas no Pacote (${selectedSkills.size})`}</span>
              </div>

              {selectedSkills.size > 0 ? (
                <div className="summary-skills-chips-wrap">
                  {[...selectedSkills].sort().map((name) => (
                    <span key={name} className="summary-skill-chip">
                      <span>{name}</span>
                      <button
                        type="button"
                        className="summary-chip-remove"
                        onClick={() => toggleSkill(name)}
                        aria-label={`Remover "${name}" do pacote`}
                        title={`Remover "${name}" do pacote`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="summary-empty-alert">
                  <p>Nenhuma skill selecionada. Escolha um preset ou marque skills no catálogo.</p>
                  <button
                    type="button"
                    className="btn-gh-sm"
                    onClick={() => {
                      togglePreset("essentials");
                      setActiveStep("presets");
                    }}
                  >
                    Carregar preset Essenciais
                  </button>
                </div>
              )}
            </div>

            {/* Terminal Box & Comandos */}
            <div className="summary-command-card">
              <div className="summary-command-header">
                <div className="terminal-dots" aria-hidden="true">
                  <span className="terminal-dot"></span>
                  <span className="terminal-dot"></span>
                  <span className="terminal-dot"></span>
                </div>
                <span className="summary-command-title">{targetOs === "unix" ? "install.sh" : "install.ps1"}</span>
              </div>

              <div className="summary-code-box">
                <pre>
                  <code>{installCommand}</code>
                </pre>
              </div>

              <div className="summary-install-actions">
                <CopyButton
                  text={installCommand}
                  className="btn-primary summary-copy-btn"
                  disabled={selectedSkills.size === 0}
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon" size={14} />
                  <AnimatedIcon Icon={CheckIcon} className="icon-check" size={14} />
                  <span>
                    Copiar One-Liner ({selectedSkills.size} skills
                    {selectedPlugins.size > 0 ? ` + ${selectedPlugins.size} plugins` : ""})
                  </span>
                </CopyButton>

                <button
                  type="button"
                  className="btn-gh"
                  disabled={selectedSkills.size === 0}
                  onClick={downloadScript}
                  title="Baixar arquivo .ps1 customizado"
                >
                  <AnimatedIcon Icon={DownloadIcon} className="icon" size={14} />
                  <span>Baixar .{targetOs === "unix" ? "sh" : "ps1"}</span>
                </button>
              </div>

              <p className="stage-panel-desc">
                Precisa do agente antes? <code>npm install -g @anthropic-ai/claude-code</code>
                {targetTool === "codex" || targetTool === "all" ? (
                  <> ou <code>npm install -g @openai/codex</code></>
                ) : null}
                . Depois de rodar o comando, confirme com <code>/skills</code> no agente.
              </p>
            </div>
          </div>

          <div className="stage-nav-footer">
            <button
              type="button"
              className="btn-gh"
              onClick={() => setActiveStep("skills")}
            >
              <AnimatedIcon Icon={ChevronLeftIcon} className="icon" size={16} />
              <span>Voltar e Ajustar Skills</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

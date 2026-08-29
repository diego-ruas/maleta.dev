"use client";

import { useMemo, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { DownloadIcon } from "@/components/icons/download";
import { SearchIcon } from "@/components/icons/search";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import SkillCard from "@/components/skills/SkillCard";
import RepoScan from "@/components/skills/RepoScan";
import { SKILL_PRESETS } from "@/lib/data";
import { getCategoryIcon } from "@/lib/iconMap";
import { useToolkit, type CustomSkill } from "@/lib/toolkitContext";

export type { CustomSkill };

interface SkillsExplorerProps {
  categories: readonly { label: string; key: string }[];
}

export default function SkillsExplorer({ categories }: SkillsExplorerProps) {
  const {
    selectedSkills,
    activePreset,
    customSkills,
    allMergedSkills,
    installCommand,
    applyPreset,
    toggleSkill,
    selectAllSkills,
    clearSkills,
    addCustomSkill,
    removeCustomSkill,
    downloadScript,
  } = useToolkit();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewScope, setViewScope] = useState<"all" | "selected">("all");

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

  return (
    <div className="skills-explorer-container">
      {/* 1. PRESETS RÁPIDOS */}
      <div className="presets-quick-bar">
        <div className="presets-quick-header">
          <span className="presets-quick-title">Presets recomendados:</span>
          {activePreset && (
            <span className="presets-quick-active-indicator">
              Ativo: <strong>{SKILL_PRESETS.find((p) => p.id === activePreset)?.name}</strong>
            </span>
          )}
        </div>
        <div className="presets-quick-pills" role="group" aria-label="Presets recomendados">
          {SKILL_PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-pill-btn${isActive ? " active" : ""}`}
                onClick={() => applyPreset(preset.id)}
                title={preset.description}
              >
                <span className="preset-pill-name">{preset.name}</span>
                <span className="preset-pill-count">{preset.skills.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FILTROS, ESCOPO E BUSCA */}
      <div className="skills-filter-section">
        <div className="skills-search-row">
          <div className="skills-search-bar">
            <AnimatedIcon Icon={SearchIcon} className="skills-search-icon" size={16} />
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
              onClick={() => setViewScope("all")}
            >
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={14} />
              <span>Todas ({allMergedSkills.length})</span>
            </button>
            <button
              type="button"
              className={`scope-toggle-btn${viewScope === "selected" ? " active" : ""}`}
              onClick={() => setViewScope("selected")}
            >
              <AnimatedIcon Icon={CheckIcon} className="icon" size={14} />
              <span>Selecionadas ({selectedSkills.size})</span>
            </button>
            <a href="#repo-add" className="scope-toggle-btn hub-shortcut-btn">
              <AnimatedIcon Icon={SearchIcon} className="icon" size={14} />
              <span>Ir para o Hub &darr;</span>
            </a>
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

      {/* 3. BARRA DE AÇÃO & INSTALAÇÃO */}
      <div className="skills-action-bar">
        <div className="skills-selection-summary">
          <span className="selection-status-badge">
            <strong>{selectedSkills.size}</strong> {selectedSkills.size === 1 ? "skill selecionada" : "skills selecionadas"}
          </span>
          <div className="selection-quick-btns">
            <button type="button" className="btn-gh-sm" onClick={selectAllSkills}>
              Marcar Todas
            </button>
            <button type="button" className="btn-gh-sm" onClick={clearSkills}>
              Desmarcar Todas
            </button>
          </div>
        </div>

        <div className="skills-install-controls">
          <CopyButton
            id="copy-command"
            className="btn-primary copy-installer-btn"
            text={installCommand}
            disabled={selectedSkills.size === 0}
          >
            <span>Copiar One-Liner Customizado ({selectedSkills.size})</span>
            <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
            <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
          </CopyButton>

          <button
            type="button"
            className="btn-gh download-installer-btn"
            disabled={selectedSkills.size === 0}
            onClick={downloadScript}
            title="Baixar instalador .ps1 customizado com sua seleção"
          >
            <span>Baixar .ps1</span>
            <AnimatedIcon Icon={DownloadIcon} className="icon" size={16} />
          </button>
        </div>
      </div>

      {/* 4. LISTA DE SKILLS (CATÁLOGO) */}
      <div className="skills-results-container">
        <ul className="skills-list" id="skills-list" role="group" aria-labelledby="skills-heading">
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

      {/* 5. HUB COMUNITÁRIO GITHUB */}
      <div className="skills-community-hub-card" id="repo-add">
        <div className="community-hub-card-header">
          <div className="community-hub-title-group">
            <div className="section-header-badge">
              <span className="section-tag-prefix">{"// HUB COMUNITÁRIO GITHUB"}</span>
            </div>
            <h3 className="community-hub-title">Descobrir & Importar Skills do GitHub</h3>
            <p className="community-hub-subtitle">
              Pesquise qualquer repositório aberto na comunidade, inspecione as instruções do <code>SKILL.md</code> e importe diretamente para o seu instalador com 1 clique.
            </p>
          </div>
        </div>

        <RepoScan
          existing={customSkills}
          builtInSkills={allMergedSkills.map((s) => s.name)}
          onAdd={addCustomSkill}
          onRemove={removeCustomSkill}
        />
      </div>
    </div>
  );
}

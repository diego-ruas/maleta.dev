"use client";

import { useEffect, useMemo, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { useToast } from "@/components/Toast";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { DownloadIcon } from "@/components/icons/download";
import SkillCard, { type DisplaySkill } from "@/components/skills/SkillCard";
import RepoScan from "@/components/skills/RepoScan";
import { type Skill, SKILL_PRESETS } from "@/lib/data";

export interface CustomSkill {
  name: string;
  repo: string;
  path: string;
  desc: string;
}

const SELECTED_KEY = "aitoolkit-selected-skills";
const CUSTOM_KEY = "aitoolkit-custom-skills";
const EXTERNAL_CATEGORY = "Externas";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface SkillsExplorerProps {
  skills: Skill[];
  categories: readonly { label: string; key: string }[];
}

export default function SkillsExplorer({ skills, categories }: SkillsExplorerProps) {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [viewScope, setViewScope] = useState<"preset" | "all">("all");
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const savedCustom = loadJSON<CustomSkill[]>(CUSTOM_KEY, []);
    setCustomSkills(savedCustom);

    const validNames = new Set([...skills.map((s) => s.name), ...savedCustom.map((s) => s.name)]);
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          setSelected(new Set(saved.filter((n) => validNames.has(n))));
          setActivePreset(null);
          setViewScope("all");
        }
      } catch {
        // mantém padrão
      }
    }
  }, [skills]);

  const mergedSkills: DisplaySkill[] = useMemo(
    () => [
      ...skills,
      ...customSkills.map((c) => ({
        name: c.name,
        category: EXTERNAL_CATEGORY,
        description: c.desc || `Skill comunitária de ${c.repo}`,
      })),
    ],
    [skills, customSkills]
  );

  const visibleSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mergedSkills.filter((skill) => {
      // Se estiver no modo preset e não estiver buscando textualmente, filtra pelas selecionadas/preset
      if (viewScope === "preset" && !q && activeCategory === "all") {
        if (!selected.has(skill.name)) return false;
      }
      const matchCat = activeCategory === "all" || skill.category === activeCategory;
      const matchQ =
        !q || skill.name.toLowerCase().includes(q) || skill.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [mergedSkills, activeCategory, search, viewScope, selected]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.key] = cat.key === "all" ? mergedSkills.length : mergedSkills.filter((s) => s.category === cat.key).length;
    }
    if (customSkills.length > 0) counts[EXTERNAL_CATEGORY] = customSkills.length;
    return counts;
  }, [categories, mergedSkills, customSkills.length]);

  function persistSelected(next: Set<string>) {
    setSelected(next);
    try {
      localStorage.setItem(SELECTED_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }

  function toggleSelect(name: string) {
    setActivePreset(null);
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    persistSelected(next);
  }

  function selectAll() {
    setActivePreset(null);
    setViewScope("all");
    persistSelected(new Set(mergedSkills.map((s) => s.name)));
    showToast(`Todas as ${mergedSkills.length} skills selecionadas`, "check");
  }

  function selectNone() {
    setActivePreset(null);
    persistSelected(new Set());
    showToast("Seleção limpa", "check");
  }

  function addCustomSkill(skill: CustomSkill) {
    const nextCustom = [...customSkills.filter((c) => c.name !== skill.name), skill];
    setCustomSkills(nextCustom);
    const nextSelected = new Set(selected);
    nextSelected.add(skill.name);
    persistSelected(nextSelected);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(nextCustom));
    } catch {
      // ignore
    }
  }

  function removeCustomSkill(name: string) {
    const nextCustom = customSkills.filter((c) => c.name !== name);
    setCustomSkills(nextCustom);
    const nextSelected = new Set(selected);
    nextSelected.delete(name);
    persistSelected(nextSelected);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(nextCustom));
    } catch {
      // ignore
    }
    showToast(`Skill comunitária "${name}" removida`, "check");
  }

  function applyPreset(presetId: string) {
    const preset = SKILL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const validNames = new Set(mergedSkills.map((s) => s.name));
    const next = new Set(preset.skills.filter((name) => validNames.has(name)));
    setActivePreset(presetId);
    setViewScope("preset");
    persistSelected(next);
    showToast(`Preset "${preset.name}" carregado (${next.size} skills)`, "check");
  }

  function downloadScript() {
    const list = [...selected].sort().map((n) => `'${n.replace(/'/g, "''")}'`).join(",\n    ");
    const scriptContent = `<#
  Maleta.dev — Instalador de Skills Customizado
  Execute no PowerShell (sem necessidade de admin ou git clone prévio):
#>
$ErrorActionPreference = 'Stop'
$Skills = @(
    ${list}
)
Write-Host "[maleta.dev] Instalando $($Skills.Count) skills selecionadas..." -ForegroundColor Cyan
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills $Skills
`;
    const blob = new Blob([scriptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "instalar-skills.ps1";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("instalar-skills.ps1 baixado com sucesso!", "download");
  }

  const installCommand = useMemo(() => {
    if (selected.size === 0) return "# Selecione ao menos uma skill";
    if (selected.size === mergedSkills.length && customSkills.length === 0) {
      return "irm https://maleta.dev/install.ps1 | iex";
    }
    const list = [...selected].sort().map((n) => `'${n.replace(/'/g, "''")}'`).join(", ");
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @(${list})`;
  }, [selected, mergedSkills.length, customSkills.length]);

  const allChips = useMemo(
    () => (customSkills.length > 0 ? [...categories, { label: "Externas", key: EXTERNAL_CATEGORY }] : categories),
    [categories, customSkills.length]
  );

  return (
    <div className="skills-explorer-container">
      {/* 1. PRESETS RECOMENDADOS (COMPACTO E DIRETO) */}
      <div className="skills-presets-card">
        <div className="presets-header">
          <span className="presets-label">Presets Recomendados:</span>
          <span className="presets-sublabel">Selecione um pacote temático para carregar instantaneamente</span>
        </div>
        <div className="presets-list" role="group" aria-label="Presets recomendados">
          {SKILL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-btn${activePreset === preset.id ? " active" : ""}`}
              onClick={() => applyPreset(preset.id)}
              title={preset.description}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-badge">{preset.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. BARRA DE BUSCA, ESCOPO E FILTRO */}
      <div className="skills-filter-section">
        <div className="skills-search-row">
          <div className="skills-search-bar">
            <input
              type="search"
              id="skills-search"
              placeholder="Buscar skill no catálogo (ex.: a11y, test, cloudflare, design…)"
              autoComplete="off"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setViewScope("all");
              }}
            />
          </div>

          <div className="skills-scope-toggle" role="group" aria-label="Modo de visualização">
            <button
              type="button"
              className={`scope-toggle-btn${viewScope === "preset" ? " active" : ""}`}
              onClick={() => setViewScope("preset")}
              title="Exibir apenas as skills do preset atual / selecionadas"
            >
              Foco no Preset ({selected.size})
            </button>
            <button
              type="button"
              className={`scope-toggle-btn${viewScope === "all" ? " active" : ""}`}
              onClick={() => setViewScope("all")}
              title="Exibir todo o catálogo de skills"
            >
              Ver Catálogo Completo
            </button>
          </div>
        </div>

        {viewScope === "all" && (
          <div className="skills-category-chips" role="group" aria-label="Filtrar por categoria">
            {allChips.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-chip-btn${cat.key === activeCategory ? " active" : ""}`}
                aria-pressed={cat.key === activeCategory ? "true" : "false"}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span className="chip-count">({categoryCounts[cat.key] ?? 0})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. BARRA DE SELEÇÃO & INSTALAÇÃO (STICKY / PROEMINENTE) */}
      <div className="skills-action-bar">
        <div className="skills-selection-summary">
          <span className="selection-status-badge">
            <strong>{selected.size}</strong> {selected.size === 1 ? "skill selecionada" : "skills selecionadas"}
          </span>
          <div className="selection-quick-btns">
            <button type="button" className="btn-gh-sm" onClick={selectAll}>
              Marcar Todas
            </button>
            <button type="button" className="btn-gh-sm" onClick={selectNone}>
              Desmarcar Todas
            </button>
          </div>
        </div>

        <div className="skills-install-controls">
          <CopyButton
            id="copy-command"
            className="btn-primary copy-installer-btn"
            text={installCommand}
            disabled={selected.size === 0}
          >
            <span>Copiar One-Liner ({selected.size})</span>
            <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
            <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
          </CopyButton>

          <button
            type="button"
            className="btn-gh download-installer-btn"
            disabled={selected.size === 0}
            onClick={downloadScript}
            title="Baixar instalador .ps1 customizado com sua seleção"
          >
            <span>Baixar .ps1</span>
            <AnimatedIcon Icon={DownloadIcon} className="icon" size={16} />
          </button>
        </div>
      </div>

      {/* 4. LISTA DE SKILLS (ESTILO HUB DA COMUNIDADE — ROLAGEM INTERNA DE ATÉ 5 ITENS) */}
      <div className="skills-results-container">
        <ul className="skills-list" id="skills-list" role="group" aria-labelledby="skills-heading">
          {visibleSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              selected={selected.has(skill.name)}
              onToggleSelect={() => toggleSelect(skill.name)}
            />
          ))}
        </ul>

        {visibleSkills.length === 0 && (
          <div className="skills-empty-box">
            <p>
              {search.trim()
                ? `Nenhuma skill encontrada para "${search.trim()}".`
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

      {/* 5. HUB COMUNITÁRIO DE SKILLS */}
      <div className="skills-community-hub-container">
        <div className="community-hub-header">
          <h3>Hub Comunitário de Skills</h3>
          <p>
            Pesquise repositórios da comunidade ou informe links do GitHub para descobrir e importar novas skills sem clonar repositórios.
          </p>
        </div>
        <RepoScan
          existing={customSkills}
          builtInSkills={skills.map((s) => s.name)}
          onAdd={addCustomSkill}
          onRemove={removeCustomSkill}
        />
      </div>
    </div>
  );
}

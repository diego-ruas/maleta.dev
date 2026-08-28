"use client";

import { useEffect, useMemo, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { useToast } from "@/components/Toast";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { DownloadIcon } from "@/components/icons/download";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import SkillCard, { type DisplaySkill } from "@/components/skills/SkillCard";
import RepoScan from "@/components/skills/RepoScan";
import type { Skill } from "@/lib/data";

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
  const [selecting, setSelecting] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(skills.map((s) => s.name)));
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [openTip, setOpenTip] = useState<string | null>(null);

  // Primeira visita: tudo marcado, espelhando o instalador. Uma seleção vazia
  // já salva ("Nenhum") e uma escolha é preciso sobreviver ao reload.
  useEffect(() => {
    const savedCustom = loadJSON<CustomSkill[]>(CUSTOM_KEY, []);
    setCustomSkills(savedCustom);

    const validNames = new Set([...skills.map((s) => s.name), ...savedCustom.map((s) => s.name)]);
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          setSelected(new Set(saved.filter((n) => validNames.has(n))));
        }
      } catch {
        // ignore, keep default (all selected)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openTip) return;
    function handleDocClick(e: MouseEvent) {
      if (!(e.target instanceof Element) || !e.target.closest(".skill-card")) {
        setOpenTip(null);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [openTip]);

  const mergedSkills: DisplaySkill[] = useMemo(
    () => [
      ...skills,
      ...customSkills.map((c) => ({ name: c.name, category: EXTERNAL_CATEGORY, description: c.desc || `Skill externa de ${c.repo}` })),
    ],
    [skills, customSkills]
  );

  const visibleSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mergedSkills.filter((skill) => {
      const matchCat = activeCategory === "all" || skill.category === activeCategory;
      const matchQ =
        !q || skill.name.toLowerCase().includes(q) || skill.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [mergedSkills, activeCategory, search]);

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
      // ignore quota errors
    }
  }

  function toggleSelect(name: string) {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    persistSelected(next);
  }

  function selectAll() {
    persistSelected(new Set(mergedSkills.map((s) => s.name)));
  }

  function selectNone() {
    persistSelected(new Set());
  }

  function toggleTip(name: string) {
    setOpenTip((cur) => (cur === name ? null : name));
  }

  function addCustomSkill(skill: CustomSkill) {
    const next = [...customSkills, skill];
    setCustomSkills(next);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }

  function downloadSelection() {
    const content =
      "# Maleta.dev — skills selecionadas\n# Salve como claude/skills-selection.txt no repo clonado e rode claude/install.ps1\n" +
      [...selected].sort().join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skills-selection.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("skills-selection.txt baixado", "download");
  }

  const installCommand = useMemo(() => {
    const list = [...selected].sort().map((n) => `'${n.replace(/'/g, "''")}'`).join(", ");
    return `$s = @(${list}); foreach ($n in $s) { $d = "$env:USERPROFILE\\.claude\\skills\\$n"; New-Item -ItemType Directory $d -Force | Out-Null; Copy-Item ".\\claude\\skills\\$n\\*" $d -Recurse -Force }`;
  }, [selected]);

  const allChips = useMemo(
    () => (customSkills.length > 0 ? [...categories, { label: "Externas", key: EXTERNAL_CATEGORY }] : categories),
    [categories, customSkills.length]
  );

  return (
    <>
      <div className="skills-toolbar">
        <div className="skills-toolbar-row">
          <div className="skills-search-wrap">
            <label htmlFor="skills-search">Buscar skill</label>
            <input
              type="search"
              id="skills-search"
              placeholder="ex.: a11y, cloudflare, docx…"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            id="personalize-toggle"
            className="btn-gh skills-personalize-toggle"
            onClick={() => setSelecting((s) => !s)}
          >
            <span>{selecting ? "Ver descrições" : "Selecionar skills"}</span>
            <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
          </button>
        </div>
        <div className="articles-filter" role="group" aria-label="Filtrar por categoria">
          {allChips.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`filter-btn${cat.key === activeCategory ? " active" : ""}`}
              aria-pressed={cat.key === activeCategory ? "true" : "false"}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label} <span className="filter-count">({categoryCounts[cat.key] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>
      <p id="skills-count" className="skills-count" role="status" aria-live="polite">
        {visibleSkills.length} {visibleSkills.length === 1 ? "skill" : "skills"}
      </p>
      <div id="selection-controls" className="selection-controls" hidden={!selecting}>
        <span id="selection-count" className="selection-count" role="status" aria-live="polite">
          {selected.size} de {mergedSkills.length} selecionadas
        </span>
        <button type="button" id="select-all" className="btn-gh" onClick={selectAll}>
          Tudo
        </button>
        <button type="button" id="select-none" className="btn-gh" onClick={selectNone}>
          Nenhum
        </button>
        <button
          type="button"
          id="download-selection"
          className="btn-gh"
          disabled={selected.size === 0}
          onClick={downloadSelection}
        >
          <span>Baixar skills-selection.txt</span>
          <AnimatedIcon Icon={DownloadIcon} className="icon" size={16} />
        </button>
        <CopyButton
          id="copy-command"
          className="btn-primary"
          text={installCommand}
          disabled={selected.size === 0}
        >
          <span>Copiar comando</span>
          <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
          <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
        </CopyButton>
        <a href="#instalar" className="btn-gh selection-next-btn">
          <span>Como instalar com seleção &darr;</span>
        </a>
        <p className="selection-help">
          Baixe o arquivo e salve como <code>claude/skills-selection.txt</code> no repo clonado —
          tanto <code>claude/install.ps1</code> quanto <code>scripts/install.ps1</code> respeitam
          esse arquivo e instalam só as marcadas. Apague o arquivo para voltar a instalar as{" "}
          {skills.length}. Ou cole o comando e copie as selecionadas agora, direto da pasta
          clonada.
        </p>
      </div>
      <RepoScan existing={customSkills} onAdd={addCustomSkill} />
      <div className="skills-grid" id="skills-grid" role="group" aria-labelledby="skills-heading">
        {visibleSkills.map((skill) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            selecting={selecting}
            selected={selected.has(skill.name)}
            tipOpen={openTip === skill.name}
            onToggleSelect={() => toggleSelect(skill.name)}
            onToggleTip={() => toggleTip(skill.name)}
          />
        ))}
      </div>
      <p id="skills-empty" className="skills-empty" hidden={visibleSkills.length !== 0}>
        {search.trim()
          ? `Nenhuma skill encontrada para "${search.trim()}".`
          : "Nenhuma skill encontrada nessa categoria."}{" "}
        <button
          type="button"
          id="clear-filters"
          className="btn-gh"
          onClick={() => {
            setSearch("");
            setActiveCategory("all");
          }}
        >
          Limpar filtros
        </button>
      </p>
    </>
  );
}

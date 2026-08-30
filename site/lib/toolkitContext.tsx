"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/Toast";
import { SKILLS, SKILL_PRESETS, type Skill } from "@/lib/data";

export interface CustomSkill {
  name: string;
  repo: string;
  path: string;
  desc: string;
}

export type ToolTarget = "all" | "claude" | "codex" | "agents";
export type OsTarget = "windows" | "unix";

const SELECTED_KEY = "aitoolkit-selected-skills";
const CUSTOM_KEY = "aitoolkit-custom-skills";
const TOOL_KEY = "aitoolkit-target-tool";
const OS_KEY = "aitoolkit-target-os";
const EXTERNAL_CATEGORY = "Externas";

function detectOs(): OsTarget {
  if (typeof navigator === "undefined") return "windows";
  return /win/i.test(navigator.platform || navigator.userAgent || "") ? "windows" : "unix";
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface ToolkitContextType {
  targetTool: ToolTarget;
  setTargetTool: (tool: ToolTarget) => void;
  targetOs: OsTarget;
  setTargetOs: (os: OsTarget) => void;
  selectedSkills: Set<string>;
  activePreset: string | null;
  isPresetActive: (presetId: string) => boolean;
  activePresets: Set<string>;
  customSkills: CustomSkill[];
  allMergedSkills: Skill[];
  installCommand: string;
  applyPreset: (presetId: string) => void;
  togglePreset: (presetId: string) => void;
  toggleSkill: (name: string) => void;
  selectAllSkills: () => void;
  clearSkills: () => void;
  addCustomSkill: (skill: CustomSkill) => void;
  removeCustomSkill: (name: string) => void;
  downloadScript: () => void;
}

const ToolkitContext = createContext<ToolkitContextType | null>(null);

export function ToolkitProvider({ children }: { children: React.ReactNode }) {
  const showToast = useToast();
  const [targetTool, setTargetToolState] = useState<ToolTarget>("all");
  const [targetOs, setTargetOsState] = useState<OsTarget>("windows");
  const [activePreset, setActivePreset] = useState<string | null>("essentials");
  const [activePresetIds, setActivePresetIds] = useState<Set<string>>(() => new Set(["essentials"]));
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(() => {
    const defaultPreset = SKILL_PRESETS.find((p) => p.id === "essentials");
    return new Set(defaultPreset ? defaultPreset.skills : []);
  });

  useEffect(() => {
    const savedTool = localStorage.getItem(TOOL_KEY) as ToolTarget | null;
    if (savedTool && (savedTool === "all" || savedTool === "claude" || savedTool === "codex" || savedTool === "agents")) {
      setTargetToolState(savedTool);
    }

    const savedOs = localStorage.getItem(OS_KEY) as OsTarget | null;
    if (savedOs === "windows" || savedOs === "unix") {
      setTargetOsState(savedOs);
    } else {
      setTargetOsState(detectOs());
    }

    const savedCustom = loadJSON<CustomSkill[]>(CUSTOM_KEY, []);
    setCustomSkills(savedCustom);

    const validNames = new Set([...SKILLS.map((s) => s.name), ...savedCustom.map((s) => s.name)]);
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          const loadedSkills = new Set<string>(saved.filter((n) => validNames.has(n)));
          setSelectedSkills(loadedSkills);
          
          // Reconstruir quais presets estão ativos baseado nas skills carregadas
          const active = new Set<string>();
          for (const preset of SKILL_PRESETS) {
            const validPresetSkills = preset.skills.filter((name) => validNames.has(name));
            if (validPresetSkills.length > 0 && validPresetSkills.every((name) => loadedSkills.has(name))) {
              active.add(preset.id);
            }
          }
          setActivePresetIds(active);
          setActivePreset(active.size === 1 ? [...active][0] : null);
        }
      } catch {
        // mantém padrão
      }
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      e.preventDefault();
      const id = href.slice(1);

      window.dispatchEvent(new CustomEvent("maleta-navigate", { detail: id }));

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion ? "instant" : "smooth",
            block: "start",
          });
        }
      };

      scrollToElement();
      setTimeout(scrollToElement, 50);

      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  const setTargetTool = (tool: ToolTarget) => {
    setTargetToolState(tool);
    try {
      localStorage.setItem(TOOL_KEY, tool);
    } catch {
      // ignore
    }
  };

  const setTargetOs = (os: OsTarget) => {
    setTargetOsState(os);
    try {
      localStorage.setItem(OS_KEY, os);
    } catch {
      // ignore
    }
  };

  const allMergedSkills: Skill[] = useMemo(
    () => [
      ...SKILLS,
      ...customSkills.map((c) => ({
        name: c.name,
        category: EXTERNAL_CATEGORY,
        description: c.desc || `Skill comunitária de ${c.repo}`,
      })),
    ],
    [customSkills]
  );

  const isPresetActive = (presetId: string): boolean => {
    return activePresetIds.has(presetId);
  };

  const activePresets = activePresetIds;

  function persistSelected(next: Set<string>) {
    setSelectedSkills(next);
    try {
      localStorage.setItem(SELECTED_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }

  function togglePreset(presetId: string) {
    const preset = SKILL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const validNames = new Set(allMergedSkills.map((s) => s.name));
    const validPresetSkills = preset.skills.filter((name) => validNames.has(name));
    const isCurrentlyActive = activePresetIds.has(presetId);

    const nextPresetIds = new Set(activePresetIds);
    const nextSkills = new Set(selectedSkills);

    if (isCurrentlyActive) {
      nextPresetIds.delete(presetId);

      // Coletar todas as skills que ainda pertencem a OUTROS presets que continuam ativos
      const skillsKeptByOtherActivePresets = new Set<string>();
      for (const remainingPresetId of nextPresetIds) {
        const otherPreset = SKILL_PRESETS.find((p) => p.id === remainingPresetId);
        if (otherPreset) {
          for (const s of otherPreset.skills) {
            skillsKeptByOtherActivePresets.add(s);
          }
        }
      }

      // Remover apenas as skills deste preset que NÃO pertencem a nenhum outro preset ativo
      let removedCount = 0;
      for (const skillName of validPresetSkills) {
        if (!skillsKeptByOtherActivePresets.has(skillName)) {
          if (nextSkills.has(skillName)) {
            nextSkills.delete(skillName);
            removedCount++;
          }
        }
      }

      setActivePresetIds(nextPresetIds);
      setActivePreset(nextPresetIds.size === 1 ? [...nextPresetIds][0] : null);
      persistSelected(nextSkills);
      showToast(`Base "${preset.name}" desativada (-${removedCount} skill${removedCount !== 1 ? "s" : ""})`, "check");
    } else {
      nextPresetIds.add(presetId);

      let addedCount = 0;
      for (const skillName of validPresetSkills) {
        if (!nextSkills.has(skillName)) {
          nextSkills.add(skillName);
          addedCount++;
        }
      }

      setActivePresetIds(nextPresetIds);
      setActivePreset(presetId);
      persistSelected(nextSkills);
      showToast(
        addedCount === 0
          ? `Base "${preset.name}" ativada`
          : `Base "${preset.name}" combinada (+${addedCount} skill${addedCount !== 1 ? "s" : ""})`,
        "check"
      );
    }
  }

  function applyPreset(presetId: string) {
    togglePreset(presetId);
  }

  function toggleSkill(name: string) {
    const next = new Set(selectedSkills);
    const nextPresetIds = new Set(activePresetIds);

    if (next.has(name)) {
      next.delete(name);
      // Se removeu uma skill, remover qualquer preset ativo que a continha
      for (const pId of activePresetIds) {
        const preset = SKILL_PRESETS.find((p) => p.id === pId);
        if (preset && preset.skills.includes(name)) {
          nextPresetIds.delete(pId);
        }
      }
    } else {
      next.add(name);
      // Se adicionou uma skill, verificar se completou algum preset
      for (const preset of SKILL_PRESETS) {
        const validNames = new Set(allMergedSkills.map((s) => s.name));
        const validSkills = preset.skills.filter((s) => validNames.has(s));
        if (validSkills.length > 0 && validSkills.every((s) => next.has(s))) {
          nextPresetIds.add(preset.id);
        }
      }
    }

    setActivePresetIds(nextPresetIds);
    setActivePreset(nextPresetIds.size === 1 ? [...nextPresetIds][0] : null);
    persistSelected(next);
  }

  function selectAllSkills() {
    setActivePreset(null);
    setActivePresetIds(new Set(SKILL_PRESETS.map((p) => p.id)));
    persistSelected(new Set(allMergedSkills.map((s) => s.name)));
    showToast(`Todas as ${allMergedSkills.length} skills selecionadas`, "check");
  }

  function clearSkills() {
    setActivePreset(null);
    setActivePresetIds(new Set());
    persistSelected(new Set());
    showToast("Seleção limpa", "check");
  }

  function addCustomSkill(skill: CustomSkill) {
    const nextCustom = [...customSkills.filter((c) => c.name !== skill.name), skill];
    setCustomSkills(nextCustom);
    const nextSelected = new Set(selectedSkills);
    nextSelected.add(skill.name);
    persistSelected(nextSelected);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(nextCustom));
    } catch {
      // ignore
    }
    showToast(`Skill comunitária "${skill.name}" adicionada ao pacote!`, "check");
  }

  function removeCustomSkill(name: string) {
    const nextCustom = customSkills.filter((c) => c.name !== name);
    setCustomSkills(nextCustom);
    const nextSelected = new Set(selectedSkills);
    nextSelected.delete(name);
    persistSelected(nextSelected);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(nextCustom));
    } catch {
      // ignore
    }
    showToast(`Skill comunitária "${name}" removida`, "check");
  }

  function downloadScript() {
    const isUnix = targetOs === "unix";
    const skillsList = [...selectedSkills].sort();
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    let scriptContent: string;
    let filename: string;
    if (isUnix) {
      const toolFlag = targetTool !== "all" ? ` --tools ${targetTool}` : "";
      scriptContent = `#!/usr/bin/env bash
# Maleta.dev — Instalador Customizado Sob Medida
# Execute no bash/zsh (sem necessidade de git clone previo):
set -euo pipefail
echo "[maleta.dev] Instalando ${skillsList.length} skills customizadas..."
curl -fsSL https://maleta.dev/install.sh | bash -s --${toolFlag} --skills ${skillsList.join(",")}
`;
      filename = "instalar-maleta.sh";
    } else {
      const list = skillsList.map((n) => `'${n.replace(/'/g, "''")}'`).join(",\n    ");
      scriptContent = `<#
  Maleta.dev — Instalador Customizado Sob Medida
  Execute no PowerShell (sem necessidade de admin ou git clone prévio):
#>
$ErrorActionPreference = 'Stop'
$Skills = @(
    ${list}
)
Write-Host "[maleta.dev] Instalando $($Skills.Count) skills customizadas..." -ForegroundColor Cyan
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills $Skills
`;
      filename = "instalar-maleta.ps1";
    }
    const blob = new Blob([scriptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`${filename} baixado com sucesso!`, "download");
  }

  const installCommand = useMemo(() => {
    if (selectedSkills.size === 0) return "# Selecione ao menos uma skill para gerar seu comando";
    const skillsList = [...selectedSkills].sort();
    if (targetOs === "unix") {
      const toolFlag = targetTool !== "all" ? ` --tools ${targetTool}` : "";
      return `curl -fsSL https://maleta.dev/install.sh | bash -s --${toolFlag} --skills ${skillsList.join(",")}`;
    }
    const list = skillsList.map((n) => `'${n.replace(/'/g, "''")}'`).join(", ");
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${list})`;
  }, [selectedSkills, targetTool, targetOs]);

  return (
    <ToolkitContext.Provider
      value={{
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
        applyPreset,
        togglePreset,
        toggleSkill,
        selectAllSkills,
        clearSkills,
        addCustomSkill,
        removeCustomSkill,
        downloadScript,
      }}
    >
      {children}
    </ToolkitContext.Provider>
  );
}

export function useToolkit() {
  const ctx = useContext(ToolkitContext);
  if (!ctx) {
    throw new Error("useToolkit must be used within a ToolkitProvider");
  }
  return ctx;
}

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

export type ToolTarget = "all" | "claude" | "opencode";

const SELECTED_KEY = "aitoolkit-selected-skills";
const CUSTOM_KEY = "aitoolkit-custom-skills";
const TOOL_KEY = "aitoolkit-target-tool";
const EXTERNAL_CATEGORY = "Externas";

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
  selectedSkills: Set<string>;
  activePreset: string | null;
  customSkills: CustomSkill[];
  allMergedSkills: Skill[];
  installCommand: string;
  applyPreset: (presetId: string) => void;
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
  const [activePreset, setActivePreset] = useState<string | null>("essentials");
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(() => {
    const defaultPreset = SKILL_PRESETS.find((p) => p.id === "essentials");
    return new Set(defaultPreset ? defaultPreset.skills : []);
  });

  useEffect(() => {
    const savedTool = localStorage.getItem(TOOL_KEY) as ToolTarget | null;
    if (savedTool && (savedTool === "all" || savedTool === "claude" || savedTool === "opencode")) {
      setTargetToolState(savedTool);
    }

    const savedCustom = loadJSON<CustomSkill[]>(CUSTOM_KEY, []);
    setCustomSkills(savedCustom);

    const validNames = new Set([...SKILLS.map((s) => s.name), ...savedCustom.map((s) => s.name)]);
    const raw = localStorage.getItem(SELECTED_KEY);
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          setSelectedSkills(new Set(saved.filter((n) => validNames.has(n))));
          setActivePreset(null);
        }
      } catch {
        // mantém padrão
      }
    }
  }, []);

  const setTargetTool = (tool: ToolTarget) => {
    setTargetToolState(tool);
    try {
      localStorage.setItem(TOOL_KEY, tool);
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

  function persistSelected(next: Set<string>) {
    setSelectedSkills(next);
    try {
      localStorage.setItem(SELECTED_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }

  function applyPreset(presetId: string) {
    const preset = SKILL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const validNames = new Set(allMergedSkills.map((s) => s.name));
    const next = new Set(preset.skills.filter((name) => validNames.has(name)));
    setActivePreset(presetId);
    persistSelected(next);
    showToast(`Preset "${preset.name}" carregado (${next.size} skills)`, "check");
  }

  function toggleSkill(name: string) {
    setActivePreset(null);
    const next = new Set(selectedSkills);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    persistSelected(next);
  }

  function selectAllSkills() {
    setActivePreset(null);
    persistSelected(new Set(allMergedSkills.map((s) => s.name)));
    showToast(`Todas as ${allMergedSkills.length} skills selecionadas`, "check");
  }

  function clearSkills() {
    setActivePreset(null);
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
    const list = [...selectedSkills].sort().map((n) => `'${n.replace(/'/g, "''")}'`).join(",\n    ");
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    const scriptContent = `<#
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
    const blob = new Blob([scriptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "instalar-maleta.ps1";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("instalar-maleta.ps1 baixado com sucesso!", "download");
  }

  const installCommand = useMemo(() => {
    if (selectedSkills.size === 0) return "# Selecione ao menos uma skill para gerar seu comando";
    const list = [...selectedSkills].sort().map((n) => `'${n.replace(/'/g, "''")}'`).join(", ");
    const toolParam = targetTool !== "all" ? ` -Tools ${targetTool}` : "";
    return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${list})`;
  }, [selectedSkills, targetTool]);

  return (
    <ToolkitContext.Provider
      value={{
        targetTool,
        setTargetTool,
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

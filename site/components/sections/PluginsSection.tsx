"use client";

import { useMemo, useState, useEffect } from "react";
import Reveal from "@/components/Reveal";
import AnimatedIcon from "@/components/AnimatedIcon";
import CopyButton from "@/components/CopyButton";
import { CheckIcon } from "@/components/icons/check";
import { CopyIcon } from "@/components/icons/copy";
import { useToast } from "@/components/Toast";
import { PLUGIN_GROUPS, type PluginItem } from "@/lib/data";

interface FlatPlugin extends PluginItem {
  tool: string;
}

const PLUGINS_SELECTED_KEY = "maleta-selected-plugins";

export default function PluginsSection() {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [activeTool, setActiveTool] = useState<"all" | "Claude Code" | "opencode">("all");

  const allPlugins: FlatPlugin[] = useMemo(() => {
    return PLUGIN_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        tool: group.tool,
      }))
    );
  }, []);

  const [selected, setSelected] = useState<Set<string>>(() => {
    return new Set(allPlugins.map((p) => `${p.tool}:${p.name}`));
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLUGINS_SELECTED_KEY);
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          setSelected(new Set(saved));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  function persistSelected(next: Set<string>) {
    setSelected(next);
    try {
      localStorage.setItem(PLUGINS_SELECTED_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }

  function togglePlugin(pluginKey: string) {
    const next = new Set(selected);
    if (next.has(pluginKey)) next.delete(pluginKey);
    else next.add(pluginKey);
    persistSelected(next);
  }

  function selectAll() {
    const next = new Set(allPlugins.map((p) => `${p.tool}:${p.name}`));
    persistSelected(next);
    showToast(`Todos os ${allPlugins.length} plugins selecionados`, "check");
  }

  function selectNone() {
    persistSelected(new Set());
    showToast("Seleção de plugins limpa", "check");
  }

  const filteredPlugins = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPlugins.filter((plugin) => {
      const matchTool = activeTool === "all" || plugin.tool === activeTool;
      const matchQ =
        !q ||
        plugin.name.toLowerCase().includes(q) ||
        plugin.description.toLowerCase().includes(q) ||
        plugin.tool.toLowerCase().includes(q);
      return matchTool && matchQ;
    });
  }, [allPlugins, activeTool, search]);

  const claudeSelected = useMemo(() => {
    return allPlugins
      .filter((p) => p.tool === "Claude Code" && selected.has(`${p.tool}:${p.name}`))
      .map((p) => p.name);
  }, [allPlugins, selected]);

  const pluginInstallCommand = useMemo(() => {
    if (selected.size === 0) return "# Nenhum plugin selecionado";
    if (claudeSelected.length > 0) {
      return claudeSelected.map((n) => `claude plugin install ${n}`).join(" ; ");
    }
    return "# Plugins do opencode são provisionados via ~/.config/opencode/opencode.jsonc";
  }, [selected.size, claudeSelected]);

  return (
    <Reveal id="plugins" className="reveal" ariaLabelledby="plugins-heading">
      <div className="plugins-header-wrap">
        <div>
          <h2 id="plugins-heading">Plugins</h2>
          <p>Selecione e gerencie os plugins instalados para Claude Code e opencode.</p>
        </div>
      </div>

      <div className="plugins-explorer-wrap">
        {/* 1. BARRA DE BUSCA E FILTROS */}
        <div className="plugins-filter-bar">
          <div className="plugins-search-input-wrap">
            <input
              type="search"
              id="plugins-search"
              placeholder="Buscar plugin (ex.: superpowers, memory, ponytail, figma, review…)"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="plugins-tool-tabs" role="group" aria-label="Filtrar por ferramenta">
            <button
              type="button"
              className={`plugin-tab-btn${activeTool === "all" ? " active" : ""}`}
              onClick={() => setActiveTool("all")}
            >
              Todos ({allPlugins.length})
            </button>
            <button
              type="button"
              className={`plugin-tab-btn${activeTool === "Claude Code" ? " active" : ""}`}
              onClick={() => setActiveTool("Claude Code")}
            >
              Claude Code ({allPlugins.filter((p) => p.tool === "Claude Code").length})
            </button>
            <button
              type="button"
              className={`plugin-tab-btn${activeTool === "opencode" ? " active" : ""}`}
              onClick={() => setActiveTool("opencode")}
            >
              opencode ({allPlugins.filter((p) => p.tool === "opencode").length})
            </button>
          </div>
        </div>

        {/* 2. BARRA DE AÇÃO / COMANDO */}
        <div className="plugins-action-bar">
          <div className="plugins-selection-status">
            <span className="plugins-status-count">
              <strong>{selected.size}</strong> de {allPlugins.length} plugins selecionados
            </span>
            <div className="plugins-quick-actions">
              <button type="button" className="btn-gh-sm" onClick={selectAll}>
                Marcar Todos
              </button>
              <button type="button" className="btn-gh-sm" onClick={selectNone}>
                Desmarcar Todos
              </button>
            </div>
          </div>

          <div className="plugins-command-action">
            <CopyButton
              id="copy-plugins-cmd"
              className="btn-primary copy-installer-btn"
              text={pluginInstallCommand}
              disabled={selected.size === 0}
            >
              <span>Copiar Comando de Plugins</span>
              <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={16} />
              <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={16} />
            </CopyButton>
          </div>
        </div>

        {/* 3. LISTA DE PLUGINS */}
        <ul className="plugins-list" role="group" aria-labelledby="plugins-heading">
          {filteredPlugins.map((plugin) => {
            const pluginKey = `${plugin.tool}:${plugin.name}`;
            const isSelected = selected.has(pluginKey);

            return (
              <li key={pluginKey} className={`plugin-row-item${isSelected ? " selected" : ""}`}>
                <div className="plugin-row-main">
                  <div className="plugin-row-info">
                    <div className="plugin-row-title-row">
                      <span className="plugin-row-name">{plugin.name}</span>
                      <span className={`plugin-row-tool-chip ${plugin.tool === "Claude Code" ? "claude" : "opencode"}`}>
                        {plugin.tool}
                      </span>
                    </div>
                    <p className="plugin-row-desc">{plugin.description}</p>
                  </div>

                  <div className="plugin-row-actions-cell">
                    <button
                      type="button"
                      className={`btn-gh plugin-row-select-btn${isSelected ? " active" : ""}`}
                      onClick={() => togglePlugin(pluginKey)}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? (
                        <>
                          <span>Selecionado</span>
                          <AnimatedIcon Icon={CheckIcon} className="icon icon-check-small" size={14} />
                        </>
                      ) : (
                        <span>+ Selecionar</span>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {filteredPlugins.length === 0 && (
          <div className="skills-empty-box">
            <p>Nenhum plugin encontrado para &quot;{search}&quot;.</p>
            <button
              type="button"
              className="btn-gh"
              onClick={() => {
                setSearch("");
                setActiveTool("all");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </Reveal>
  );
}

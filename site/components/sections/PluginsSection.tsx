"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import AnimatedIcon from "@/components/AnimatedIcon";
import { CheckIcon } from "@/components/icons/check";
import { ClaudeIcon } from "@/components/icons/claude";
import { useToast } from "@/components/Toast";
import { useToolkit } from "@/lib/toolkitContext";
import { PLUGIN_GROUPS, type PluginItem } from "@/lib/data";

interface FlatPlugin extends PluginItem {
  tool: string;
}

const ALL_PLUGINS: FlatPlugin[] = PLUGIN_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    tool: group.tool,
  }))
);

const ALL_PLUGIN_CATEGORIES: string[] = [
  "all",
  ...Array.from(new Set(ALL_PLUGINS.map((p) => p.category).filter(Boolean) as string[])),
];

export default function PluginsSection() {
  const showToast = useToast();
  const { selectedPlugins: selected, togglePlugin, setSelectedPlugins } = useToolkit();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  function selectAll() {
    setSelectedPlugins(new Set(ALL_PLUGINS.map((p) => p.id)));
    showToast(`Todos os ${ALL_PLUGINS.length} plugins selecionados`, "check");
  }

  function selectNone() {
    setSelectedPlugins(new Set());
    showToast("Seleção de plugins limpa", "check");
  }

  const filteredPlugins = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_PLUGINS.filter((plugin) => {
      const matchCategory = selectedCategory === "all" || plugin.category === selectedCategory;
      const matchQ =
        !q ||
        plugin.name.toLowerCase().includes(q) ||
        plugin.description.toLowerCase().includes(q) ||
        (plugin.category && plugin.category.toLowerCase().includes(q));
      return matchCategory && matchQ;
    });
  }, [selectedCategory, search]);

  return (
    <Reveal id="plugins" className="reveal" ariaLabelledby="plugins-heading">
      <div className="plugins-header-wrap">
        <div>
          <h2 id="plugins-heading">Plugins</h2>
          <p className="section-glossary">
            {"// Plugin = pacote que adiciona comandos ao Claude Code."}
          </p>
          <p>Potencialize seus assistentes com memória persistente, fluxos de engenharia estruturados, design e código limpo.</p>
        </div>
      </div>

      <details className="plugins-disclosure" open>
        <summary>
          <span>Configurar plugins opcionais</span>
          <span className="plugins-disclosure-count">{ALL_PLUGINS.length} disponíveis</span>
        </summary>
        <div className="plugins-explorer-wrap">
        {/* 1. BARRA DE BUSCA E FILTROS */}
        <div className="plugins-filter-bar">
          <div className="plugins-search-input-wrap">
            <label htmlFor="plugins-search" className="sr-only">Buscar plugins</label>
            <input
              type="search"
              id="plugins-search"
              placeholder="Buscar plugins (ex.: superpowers, memory, ponytail, figma, git…)"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* Chips de Categoria de Plugins */}
        <div className="plugins-category-chips" role="group" aria-label="Filtrar plugins por categoria">
          {ALL_PLUGIN_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === "all" ? ALL_PLUGINS.length : ALL_PLUGINS.filter((p) => p.category === cat).length;
            const label = cat === "all" ? "Todas Categorias" : cat;
            return (
              <button
                key={cat}
                type="button"
                className={`plugin-category-chip${isActive ? " active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{label}</span>
                <span className="plugin-chip-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 2. BARRA DE AÇÃO / COMANDO */}
        <div className="plugins-action-bar">
          <div className="plugins-selection-status">
            <span className="plugins-status-count" aria-live="polite">
              <strong>{selected.size}</strong> de {ALL_PLUGINS.length} plugins selecionados (<strong>{filteredPlugins.length}</strong> visíveis)
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
          <p className="plugins-persist-note">
            Os plugins escolhidos entram no mesmo comando gerado na Etapa 04 do catálogo.
          </p>
        </div>

        {/* 3. LISTA DE PLUGINS */}
        <ul className="plugins-list">
          {filteredPlugins.map((plugin) => {
            const isSelected = selected.has(plugin.id);

            return (
              <li key={plugin.id} className={`plugin-row-item${isSelected ? " selected" : ""}`}>
                <div className="plugin-row-main">
                  <div className="plugin-row-icon-cell">
                    <AnimatedIcon Icon={ClaudeIcon} className="plugin-item-icon" size={20} />
                  </div>
                  <div className="plugin-row-info">
                    <div className="plugin-row-title-row">
                      <span className="plugin-row-name">{plugin.name}</span>
                      {plugin.category && (
                        <span className="plugin-row-category-chip">
                          {plugin.category}
                        </span>
                      )}
                    </div>
                    <p className="plugin-row-desc">{plugin.description}</p>
                  </div>

                  <div className="plugin-row-actions-cell">
                    <button
                      type="button"
                      className={`btn-gh plugin-row-select-btn${isSelected ? " active" : ""}`}
                      onClick={() => togglePlugin(plugin.id)}
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
            <p>Nenhum plugin encontrado para os filtros selecionados.</p>
            <button
              type="button"
              className="btn-gh"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
        </div>
      </details>
    </Reveal>
  );
}

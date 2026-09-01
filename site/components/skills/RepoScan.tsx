"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useToast } from "@/components/Toast";
import type { CustomSkill } from "@/lib/toolkitContext";

export interface RepoResult {
  name: string;
  path: string;
  repo: string;
  isOfficial?: boolean;
  desc?: string;
}

const COMMUNITY_SOURCES = [
  { repo: "anthropics/skills", label: "anthropics/skills", tag: "Oficial" },
  { repo: "cloudflare/skills", label: "cloudflare/skills", tag: "Cloudflare" },
  { repo: "mattpocock/skills", label: "mattpocock/skills", tag: "Comunidade" },
  { repo: "cursor/plugins", label: "cursor/plugins", tag: "Cursor" },
  { repo: "obra/superpowers", label: "obra/superpowers", tag: "Comunidade" },
  { repo: "nanocoai/nanoclaw", label: "nanocoai/nanoclaw", tag: "Comunidade" },
  { repo: "JimLiu/baoyu-skills", label: "baoyu-skills", tag: "Comunidade" },
  { repo: "OthmanAdi/planning-with-files", label: "planning-with-files", tag: "Comunidade" },
] as const;

const GH_TOKEN_KEY = "maleta-gh-token";
const RECENT_SEARCHES_KEY = "maleta-recent-scans";

function repoKey(url: string): string {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)/);
  if (m) return m[1].replace(/\.git$/, "");
  if (/^[^/\s]+\/[^/\s]+$/.test(url.trim())) return url.trim();
  return "";
}

interface RepoScanProps {
  existing: CustomSkill[];
  builtInSkills?: string[];
  onAdd: (skill: CustomSkill) => void;
  onRemove?: (skillName: string) => void;
}

export default function RepoScan({ existing, builtInSkills = [], onAdd, onRemove }: RepoScanProps) {
  const showToast = useToast();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"community" | "custom">("community");
  const [repoInput, setRepoInput] = useState("");
  const [communityQuery, setCommunityQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [results, setResults] = useState<RepoResult[]>([]);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, string>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [ghToken, setGhToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [searchTopic, setSearchTopic] = useState<"skills" | "plugins">("skills");
  const scanningRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  function cancelScan() {
    abortRef.current?.abort();
  }

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(GH_TOKEN_KEY) || "";
      setGhToken(savedToken);
      const savedRecent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
      if (Array.isArray(savedRecent)) {
        setRecentSearches(savedRecent.slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  function saveRecent(term: string) {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleSaveToken(val: string) {
    setGhToken(val.trim());
    try {
      if (val.trim()) {
        localStorage.setItem(GH_TOKEN_KEY, val.trim());
        showToast("GitHub Token salvo localmente!", "check");
      } else {
        localStorage.removeItem(GH_TOKEN_KEY);
        showToast("Token removido", "check");
      }
    } catch {
      // ignore
    }
  }

  function getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (ghToken) {
      headers.Authorization = `token ${ghToken}`;
    }
    return headers;
  }

  async function scanRepo(targetRepo: string) {
    const key = repoKey(targetRepo);
    if (!key) {
      setError(true);
      setStatus("Informe um repositório válido, ex.: anthropics/skills ou https://github.com/obra/superpowers");
      return;
    }
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    setError(false);
    setScanStep(`Inspecionando árvore de arquivos em ${key}…`);
    setStatus(`Buscando skills em ${key}…`);
    setResults([]);
    setResultFilter("");
    saveRecent(key);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const treeRes = await fetch(`https://api.github.com/repos/${key}/git/trees/HEAD?recursive=1`, {
        headers: getHeaders(),
        signal: controller.signal,
      });
      if (treeRes.status === 403) {
        throw new Error(
          ghToken
            ? "Limite da API do GitHub atingido mesmo com token."
            : "Limite anônimo da API do GitHub atingido (60 req/hora). Adicione um GitHub Token abaixo para 5.000 req/h."
        );
      }
      if (!treeRes.ok) throw new Error("Repositório não encontrado ou sem acesso público.");
      const tree = await treeRes.json();

      const skills: RepoResult[] = (tree.tree || [])
        .filter((e: { type: string; path: string }) => e.type === "blob" && /(^|\/)SKILL\.md$/i.test(e.path))
        .map((e: { path: string }) => {
          const parts = e.path.split("/");
          const name = parts.length > 1 ? parts[parts.length - 2] : key.split("/")[1];
          return {
            name,
            path: e.path,
            repo: key,
            isOfficial: key === "anthropics/skills",
          };
        })
        .filter((s: RepoResult) => s.name && !s.name.startsWith("."));

      if (!skills.length) {
        setStatus(`Nenhuma SKILL.md encontrada em ${key}.`);
        return;
      }
      setStatus(`${skills.length} skill(s) encontrada(s) em ${key}.`);
      setResults(skills);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("Busca cancelada.");
      } else {
        setError(true);
        setStatus(err instanceof Error ? err.message : "Falha ao escanear o repositório.");
      }
    } finally {
      scanningRef.current = false;
      setScanning(false);
      setScanStep("");
    }
  }

  async function searchCommunity(overrideQuery?: string, overrideTopic?: "skills" | "plugins") {
    const qTerm = typeof overrideQuery === "string" ? overrideQuery : communityQuery;
    const activeTopic = overrideTopic || searchTopic;
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    setError(false);

    const topicLabel =
      activeTopic === "plugins"
        ? "topic:claude-plugins"
        : "topic:claude-skills";

    setScanStep(`Consultando repositórios com o tópico ${topicLabel}...`);
    setStatus(`Pesquisando ${activeTopic.toUpperCase()} na comunidade do GitHub...`);
    setResults([]);
    setResultFilter("");
    if (qTerm.trim()) saveRecent(qTerm.trim());
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const q = qTerm.trim()
        ? `${topicLabel}+${encodeURIComponent(qTerm.trim())}`
        : `${topicLabel}+sort:stars`;

      const searchRes = await fetch(`https://api.github.com/search/repositories?q=${q}&per_page=6`, {
        headers: getHeaders(),
        signal: controller.signal,
      });
      if (searchRes.status === 403) {
        throw new Error(
          ghToken
            ? "Limite da API do GitHub atingido."
            : "Limite anônimo da API do GitHub atingido (60 req/hora). Adicione um GitHub Token abaixo para 5.000 req/h."
        );
      }
      if (!searchRes.ok) throw new Error("Falha na busca comunitária do GitHub.");

      const searchData = await searchRes.json();
      const repos: string[] = (searchData.items || []).map((r: { full_name: string }) => r.full_name);

      if (!repos.length) {
        setStatus(`Nenhum repositório comunitário de ${activeTopic} encontrado com esse termo.`);
        return;
      }

      setScanStep(`Analisando ${repos.length} repositórios encontrados...`);
      const allFound: RepoResult[] = [];

      for (let i = 0; i < repos.length; i++) {
        if (controller.signal.aborted) break;
        const repo = repos[i];
        setScanStep(`[${i + 1}/${repos.length}] Analisando ${repo}...`);
        try {
          const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/HEAD?recursive=1`, {
            headers: getHeaders(),
            signal: controller.signal,
          });
          if (treeRes.ok) {
            const tree = await treeRes.json();
            const skills: RepoResult[] = (tree.tree || [])
              .filter((e: { type: string; path: string }) => e.type === "blob" && /(^|\/)SKILL\.md$/i.test(e.path))
              .map((e: { path: string }) => {
                const parts = e.path.split("/");
                const name = parts.length > 1 ? parts[parts.length - 2] : repo.split("/")[1];
                return {
                  name,
                  path: e.path,
                  repo,
                  isOfficial: repo === "anthropics/skills",
                };
              })
              .filter((s: RepoResult) => s.name && !s.name.startsWith("."));

            allFound.push(...skills);
          }
        } catch {
          // Continua para o próximo repositório
        }
      }

      if (controller.signal.aborted) {
        setStatus("Busca cancelada.");
        if (allFound.length) setResults(allFound);
        return;
      }

      if (!allFound.length) {
        setStatus(`Nenhuma skill/plugin com SKILL.md encontrada nos ${repos.length} repositórios retornados.`);
        return;
      }

      setStatus(`${allFound.length} recurso(s) descoberto(s) na comunidade (${activeTopic}).`);
      setResults(allFound);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("Busca cancelada.");
      } else {
        setError(true);
        setStatus(err instanceof Error ? err.message : "Falha ao pesquisar na comunidade.");
      }
    } finally {
      scanningRef.current = false;
      setScanning(false);
      setScanStep("");
    }
  }

  async function toggleDetails(result: RepoResult) {
    const key = `${result.repo}/${result.path}`;
    if (expandedDetails[key]) {
      setExpandedDetails((cur) => {
        const next = { ...cur };
        delete next[key];
        return next;
      });
      return;
    }

    setLoadingDetails((cur) => ({ ...cur, [key]: true }));
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${result.repo}/HEAD/${result.path}`);
      const text = res.ok ? await res.text() : "";
      const mDesc = text.match(/^description\s*:\s*(.+)$/m);
      const descText = mDesc
        ? mDesc[1].trim().replace(/^["']|["']$/g, "")
        : text.slice(0, 200).replace(/---[\s\S]*?---/, "").trim();
      setExpandedDetails((cur) => ({
        ...cur,
        [key]: descText || "Instruções operacionais para agentes Claude Code e Codex.",
      }));
    } catch {
      setExpandedDetails((cur) => ({ ...cur, [key]: "Não foi possível carregar a descrição no momento." }));
    } finally {
      setLoadingDetails((cur) => ({ ...cur, [key]: false }));
    }
  }

  async function addResult(result: RepoResult) {
    if (builtInSkills.includes(result.name)) {
      showToast(`A skill "${result.name}" já é nativa do Maleta.dev!`, "check");
      return;
    }
    if (existing.some((e) => e.name === result.name && e.repo === result.repo)) {
      showToast("Essa skill já foi adicionada à seleção", "check");
      return;
    }
    let desc = expandedDetails[`${result.repo}/${result.path}`] || "";
    if (!desc) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${result.repo}/HEAD/${result.path}`);
        const text = res.ok ? await res.text() : "";
        const m = text.match(/^description\s*:\s*(.+)$/m);
        desc = m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
      } catch {
        // fallback
      }
    }
    onAdd({
      name: result.name,
      repo: result.repo,
      path: result.path,
      desc: desc || `Skill comunitária de ${result.repo}`,
    });
    showToast(`Skill "${result.name}" adicionada à seleção!`, "check");
  }

  function addAllResults() {
    let addedCount = 0;
    for (const r of filteredResults) {
      if (!builtInSkills.includes(r.name) && !existing.some((e) => e.name === r.name && e.repo === r.repo)) {
        onAdd({
          name: r.name,
          repo: r.repo,
          path: r.path,
          desc: expandedDetails[`${r.repo}/${r.path}`] || `Skill comunitária de ${r.repo}`,
        });
        addedCount++;
      }
    }
    if (addedCount > 0) {
      showToast(`${addedCount} skills adicionadas com sucesso!`, "check");
    } else {
      showToast("Todas as skills encontradas já estavam adicionadas ou são nativas", "check");
    }
  }

  const filteredResults = useMemo(() => {
    const q = resultFilter.trim().toLowerCase();
    if (!q) return results;
    return results.filter((r) => r.name.toLowerCase().includes(q) || r.repo.toLowerCase().includes(q));
  }, [results, resultFilter]);

  return (
    <div className="repo-add">
      <div className="repo-add-header">
        <div className="repo-mode-tabs" role="group" aria-label="Modo de busca">
          <button
            type="button"
            aria-pressed={mode === "community"}
            className={`repo-tab-btn${mode === "community" ? " active" : ""}`}
            onClick={() => setMode("community")}
          >
            Buscar na Comunidade
          </button>
          <button
            type="button"
            aria-pressed={mode === "custom"}
            className={`repo-tab-btn${mode === "custom" ? " active" : ""}`}
            onClick={() => setMode("custom")}
          >
            Escanear Repositório
          </button>
        </div>

        <button
          type="button"
          className="repo-token-toggle-btn"
          aria-expanded={showTokenInput}
          aria-controls="repo-token-panel"
          onClick={() => setShowTokenInput((s) => !s)}
          title="Configurar GitHub Token para aumentar limite da API (opcional)"
        >
          {ghToken ? "[Token Ativo (5.000/h)]" : "[Configurar GitHub API]"}
        </button>
      </div>

      <AnimatePresence initial={!reduceMotion}>
        {showTokenInput && (
          <motion.div
            id="repo-token-panel"
            className="repo-token-panel"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
          >
            <div className="repo-token-inputs">
              <label htmlFor="gh-token-input">GitHub Personal Access Token (PAT) — opcional:</label>
              <div className="repo-token-row">
                <input
                  type="password"
                  id="gh-token-input"
                  autoComplete="off"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                />
                <button type="button" className="btn-gh" onClick={() => handleSaveToken(ghToken)}>
                  Salvar
                </button>
                {ghToken && (
                  <button
                    type="button"
                    className="btn-gh"
                    onClick={() => {
                      setGhToken("");
                      handleSaveToken("");
                    }}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
            <p className="repo-token-help">
              Aumenta o limite de 60 requisições/hora para 5.000/hora. O token é armazenado exclusivamente no seu navegador (localStorage).
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "community" ? (
        <div className="repo-community-section">
          <div className="repo-sources-presets">
            <span className="repo-sources-label">Fontes Recomendadas:</span>
            <div className="repo-source-chips">
              {COMMUNITY_SOURCES.map((src) => (
                <button
                  key={src.repo}
                  type="button"
                  className="repo-source-chip"
                  disabled={scanning}
                  title={scanning ? "Aguarde a busca atual terminar" : `Escanear ${src.repo}`}
                  onClick={() => {
                    setRepoInput(src.repo);
                    scanRepo(src.repo);
                  }}
                >
                  <span className="repo-chip-name">{src.label}</span>
                  <span className={`repo-chip-tag ${src.tag.toLowerCase()}`}>{src.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Tipo de Busca no GitHub: Skills / Plugins */}
          <div className="repo-topic-selector" role="group" aria-label="Tipo de busca no GitHub">
            <button
              type="button"
              className={`repo-topic-btn${searchTopic === "skills" ? " active" : ""}`}
              aria-pressed={searchTopic === "skills"}
              disabled={scanning}
              title={scanning ? "Aguarde a busca atual terminar" : undefined}
              onClick={() => {
                setSearchTopic("skills");
                searchCommunity(undefined, "skills");
              }}
            >
              <span>Skills (topic:claude-skills)</span>
            </button>
            <button
              type="button"
              className={`repo-topic-btn${searchTopic === "plugins" ? " active" : ""}`}
              aria-pressed={searchTopic === "plugins"}
              disabled={scanning}
              title={scanning ? "Aguarde a busca atual terminar" : undefined}
              onClick={() => {
                setSearchTopic("plugins");
                searchCommunity(undefined, "plugins");
              }}
            >
              <span>Plugins (topic:claude-plugins)</span>
            </button>
          </div>

          <div className="repo-add-form">
            <div className="skills-search-wrap">
              <label htmlFor="community-search">Buscar {searchTopic.toUpperCase()} na comunidade do GitHub</label>
              <input
                type="search"
                id="community-search"
                placeholder={`Pesquisar ${searchTopic} (ex.: a11y, test, git, web, agent, design, memory, figma…)`}
                autoComplete="off"
                value={communityQuery}
                onChange={(e) => setCommunityQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchCommunity();
                }}
              />
            </div>
            <button
              type="button"
              className="btn-gh repo-search-submit"
              disabled={scanning}
              onClick={() => searchCommunity()}
            >
              {scanning ? (
                <span className="repo-btn-loading">
                  <span className="repo-spinner-dot" /> Varrendo…
                </span>
              ) : (
                "Buscar na Comunidade"
              )}
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="repo-recent-searches">
              <span className="repo-recent-label">Recentes:</span>
              <div className="repo-recent-chips">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="repo-recent-chip"
                    disabled={scanning}
                    title={scanning ? "Aguarde a busca atual terminar" : undefined}
                    onClick={() => {
                      if (term.includes("/")) {
                        setRepoInput(term);
                        scanRepo(term);
                      } else {
                        setCommunityQuery(term);
                        searchCommunity(term);
                      }
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="repo-add-form">
          <div className="skills-search-wrap">
            <label htmlFor="repo-url">Escanear qualquer repositório do GitHub</label>
            <input
              type="url"
              id="repo-url"
              placeholder="https://github.com/owner/repo ou owner/repo"
              autoComplete="off"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") scanRepo(repoInput);
              }}
            />
          </div>
          <button
            type="button"
            id="repo-scan"
            className="btn-gh repo-search-submit"
            disabled={scanning}
            onClick={() => scanRepo(repoInput)}
          >
            {scanning ? (
              <span className="repo-btn-loading">
                <span className="repo-spinner-dot" /> Escaneando…
              </span>
            ) : (
              "Escanear"
            )}
          </button>
        </div>
      )}

      {scanning && scanStep && (
        <div className="repo-scanning-banner" role="status" aria-live="polite">
          <div className="repo-scanning-bar">
            <div className="repo-scanning-progress" />
          </div>
          <p className="repo-scanning-text">{scanStep}</p>
          <button type="button" className="btn-gh-sm" onClick={cancelScan}>
            Cancelar
          </button>
        </div>
      )}

      {status && !scanning && (
        <p
          id="repo-status"
          className={error ? "repo-status error" : "repo-status"}
          role={error ? "alert" : "status"}
          aria-live={error ? "assertive" : "polite"}
        >
          {error ? `[!] ${status}` : `[ok] ${status}`}
        </p>
      )}

      <AnimatePresence initial={!reduceMotion}>
        {results.length > 0 && (
          <div className="repo-results-container">
            <div className="repo-results-topbar">
              <div className="repo-results-summary">
                <span className="repo-results-count">
                  Encontradas: <strong>{results.length}</strong> skills
                </span>
                {results.length > 5 && (
                  <>
                  <label htmlFor="repo-results-filter" className="sr-only">Filtrar resultados encontrados</label>
                  <input
                    type="search"
                    id="repo-results-filter"
                    className="repo-results-filter-input"
                    placeholder="Filtrar nesta lista…"
                    value={resultFilter}
                    onChange={(e) => setResultFilter(e.target.value)}
                  />
                  </>
                )}
              </div>
              <div className="repo-results-actions">
                <button type="button" className="btn-gh repo-add-all-btn" onClick={addAllResults}>
                  + Adicionar todas à seleção
                </button>
                <button
                  type="button"
                  className="repo-results-clear-btn"
                  onClick={() => {
                    setResults([]);
                    setStatus("");
                    setResultFilter("");
                  }}
                  title="Fechar resultados"
                >
                  Limpar
                </button>
              </div>
            </div>

            <motion.ul
              id="repo-results"
              className="repo-results"
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              exit={reduceMotion ? undefined : "hidden"}
              variants={{
                hidden: { opacity: 0, height: 0 },
                visible: {
                  opacity: 1,
                  height: "auto",
                  transition: { staggerChildren: 0.03, duration: 0.2 },
                },
              }}
            >
              {filteredResults.map((r) => {
                const key = `${r.repo}/${r.path}`;
                const isBuiltIn = builtInSkills.includes(r.name);
                const isAdded = existing.some((e) => e.name === r.name && e.repo === r.repo);
                const isExpanded = Boolean(expandedDetails[key]);
                const isLoadingDesc = Boolean(loadingDetails[key]);

                return (
                  <motion.li
                    key={key}
                    className={`repo-result${isBuiltIn ? " is-builtin" : ""}`}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <div className="repo-result-main">
                      <div className="repo-result-info">
                        <div className="repo-result-title-row">
                          <span className="repo-result-name">{r.name}</span>
                          {r.isOfficial && <span className="repo-chip-tag oficial">Oficial</span>}
                          {isBuiltIn && <span className="repo-chip-tag nativa">Já no Maleta.dev</span>}
                        </div>
                        <div className="repo-result-meta-row">
                          <a
                            href={`https://github.com/${r.repo}/tree/HEAD/${r.path.replace(/\/SKILL\.md$/, "")}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="repo-result-repo"
                            title="Ver código no GitHub"
                          >
                            {r.repo}/{r.path.replace(/\/SKILL\.md$/, "")} ↗
                          </a>
                          <button
                            type="button"
                            className="repo-details-toggle"
                            onClick={() => toggleDetails(r)}
                          >
                            {isLoadingDesc ? "Carregando…" : isExpanded ? "Ocultar resumo" : "Ver resumo"}
                          </button>
                        </div>
                      </div>

                      <div className="repo-result-actions-cell">
                        {isBuiltIn ? (
                          <span className="repo-builtin-badge">Nativa</span>
                        ) : (
                          <button
                            type="button"
                            className={`btn-gh repo-result-add${isAdded ? " added" : ""}`}
                            onClick={() => {
                              if (isAdded && onRemove) {
                                onRemove(r.name);
                              } else {
                                addResult(r);
                              }
                            }}
                            title={isAdded ? "Remover esta skill da seleção" : "Adicionar à seleção"}
                          >
                            {isAdded ? "Adicionada (Remover)" : "+ Adicionar"}
                          </button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence initial={!reduceMotion}>
                      {isExpanded && (
                        <motion.div
                          className="repo-result-details-panel"
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                          exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                        >
                          <p className="repo-details-desc">{expandedDetails[key]}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

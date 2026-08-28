"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/Toast";
import type { CustomSkill } from "@/components/skills/SkillsExplorer";

interface RepoResult {
  name: string;
  path: string;
  repo: string;
}

function repoKey(url: string): string {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return m ? m[1].replace(/\.git$/, "") : "";
}

interface RepoScanProps {
  existing: CustomSkill[];
  onAdd: (skill: CustomSkill) => void;
}

export default function RepoScan({ existing, onAdd }: RepoScanProps) {
  const showToast = useToast();
  const [repoUrl, setRepoUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [results, setResults] = useState<RepoResult[]>([]);
  const scanningRef = useRef(false); // ponytail: uma scan por vez, sem debounce/paralelismo

  async function scan() {
    const key = repoKey(repoUrl);
    if (!key) {
      setError(false);
      setStatus("Cole uma URL de repo válida, ex.: https://github.com/obra/superpowers");
      return;
    }
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanning(true);
    setError(false);
    setStatus(`Escaneando ${key}…`);
    setResults([]);

    try {
      const treeRes = await fetch(`https://api.github.com/repos/${key}/git/trees/HEAD?recursive=1`);
      if (treeRes.status === 403) throw new Error("Limite da API do GitHub atingido (60/h). Tente de novo mais tarde.");
      if (!treeRes.ok) throw new Error("Repo não encontrado ou sem acesso público.");
      const tree = await treeRes.json();
      const skills: RepoResult[] = (tree.tree || [])
        .filter((e: { type: string; path: string }) => e.type === "blob" && /(^|\/)SKILL\.md$/.test(e.path))
        .map((e: { path: string }) => ({
          name: e.path.split("/").slice(-2, -1)[0],
          path: e.path,
          repo: key,
        }))
        .filter((s: RepoResult) => s.name);

      if (!skills.length) {
        setStatus("Nenhuma SKILL.md encontrada nesse repo.");
        return;
      }
      setStatus(`${skills.length} skill(s) encontrada(s) em ${key}.`);
      setResults(skills);
    } catch (err) {
      setError(true);
      setStatus(err instanceof Error ? err.message : "Falha ao escanear o repo.");
    } finally {
      scanningRef.current = false;
      setScanning(false);
    }
  }

  async function addResult(result: RepoResult) {
    if (existing.some((e) => e.name === result.name && e.repo === result.repo)) {
      showToast("Essa skill já foi adicionada", "check");
      return;
    }
    // Descricao vem do frontmatter; falha -> descricao vazia (ponytail: lazy, 1 req)
    let desc = "";
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${result.repo}/HEAD/${result.path}`);
      const text = res.ok ? await res.text() : "";
      const m = text.match(/^description\s*:\s*(.+)$/m);
      desc = m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
    } catch {
      // fallback já é desc vazia
    }
    onAdd({ name: result.name, repo: result.repo, path: result.path, desc });
    showToast("Skill adicionada", "plus");
  }

  return (
    <div className="repo-add" id="repo-add">
      <div className="repo-add-form">
        <div className="skills-search-wrap">
          <label htmlFor="repo-url">Adicionar skills de um repo do GitHub</label>
          <input
            type="url"
            id="repo-url"
            placeholder="https://github.com/owner/repo"
            autoComplete="off"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") scan();
            }}
          />
        </div>
        <button type="button" id="repo-scan" className="btn-gh" disabled={scanning} onClick={scan}>
          {scanning ? "Escaneando…" : "Escanear"}
        </button>
      </div>
      <p id="repo-status" className={error ? "repo-status error" : "repo-status"} role="status" aria-live="polite">
        {status}
      </p>
      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul
            id="repo-results"
            className="repo-results"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: {
                opacity: 1,
                height: "auto",
                transition: { staggerChildren: 0.05, duration: 0.2 },
              },
            }}
          >
            {results.map((r) => (
              <motion.li
                key={`${r.repo}/${r.path}`}
                className="repo-result"
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <span className="repo-result-name">{r.name}</span>
                <span className="repo-result-repo">
                  {r.repo}/{r.path.replace(/\/SKILL\.md$/, "")}
                </span>
                <button type="button" className="btn-gh repo-result-add" onClick={() => addResult(r)}>
                  Adicionar
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

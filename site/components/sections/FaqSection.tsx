"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ChevronDownIcon } from "@/components/icons/chevron-down";

interface FaqItemProps {
  id: string;
  question: string;
  children: React.ReactNode;
}

function FaqItem({ id, question, children }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className={`faq-item${isOpen ? " open" : ""}`}>
      <button
        type="button"
        id={`faq-btn-${id}`}
        className="faq-summary"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${id}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{question}</span>
        <motion.span
          className="faq-caret-wrap"
          animate={reduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${id}`}
            role="region"
            aria-labelledby={`faq-btn-${id}`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="faq-content"
          >
            <div className="faq-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  return (
    <Reveal id="faq" className="reveal" ariaLabelledby="faq-heading">
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <FaqItem id="tools" question="Onde as skills vão parar na minha máquina?">
          <ul className="faq-list-detail">
            <li><strong>Claude Code</strong>: <code>~/.claude/skills/</code>, mais marketplaces e plugins selecionados.</li>
            <li><strong>Codex</strong> e <strong>Agentes & IDEs</strong>: <code>~/.agents/skills/</code>, lido por Antigravity, Devin, Gemini CLI e outros que seguem o padrão de skills em Markdown.</li>
            <li><strong>Todos</strong>: sincroniza Claude Code, Codex e IDEs/Agentes de uma vez.</li>
          </ul>
        </FaqItem>

        <FaqItem id="privacy" question="Meus dados ou chaves são enviados para algum lugar?">
          <p>
            Não. Os scripts só copiam arquivos para dentro da sua pasta de usuário (<code>%USERPROFILE%</code> no Windows, <code>$HOME</code> no Linux/macOS). Nenhum dado, histórico ou chave de API é coletado ou transmitido.
          </p>
        </FaqItem>

        <FaqItem id="hub" question="Como funciona o Hub Comunitário no site?">
          <p>
            Busca na API do GitHub repositórios com a tag <code>topic:claude-skills</code> e repositórios oficiais como <code>anthropics/skills</code>. Localiza arquivos <code>SKILL.md</code> e deixa adicioná-los à sua seleção com 1 clique.
          </p>
        </FaqItem>

        <FaqItem id="iniciante" question="Nunca usei nenhum dos dois. Por onde começo?">
          <p>
            Instale um agente com <code>npm install -g @anthropic-ai/claude-code</code> (ou <code>npm install -g @openai/codex</code>), cole o comando pronto no topo desta página e reabra o terminal. Depois digite <code>/skills</code> dentro do agente para ver o que foi instalado.
          </p>
        </FaqItem>
      </div>
    </Reveal>
  );
}

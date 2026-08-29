"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 06. DÚVIDAS FREQUENTES"}</span>
      </div>
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <FaqItem id="tools" question="Preciso instalar as duas ferramentas?">
          <p>
            Não. O instalador permite provisionar o ambiente completo (Claude Code + opencode) ou escolher apenas uma das ferramentas através de <code>-Tools claude</code> ou <code>-Tools opencode</code>.
          </p>
        </FaqItem>

        <FaqItem id="builder" question="Como o site gera o instalador customizado em 1 clique?">
          <p>
            O construtor na Hero e na seção de Skills compõe um comando PowerShell determinístico que invoca remotamente o script oficial <code>https://maleta.dev/install.ps1</code>, parametrizando apenas o alvo (<code>-Tools</code>) e a lista exata das skills selecionadas (<code>-Skills @(...)</code>). Nada além do estritamente escolhido é instalado.
          </p>
        </FaqItem>

        <FaqItem id="privacy" question="Meus dados ou chaves são enviados para algum lugar?">
          <p>
            Não. O repositório é 100% local e seguro. Os scripts apenas copiam arquivos de configuração para a sua máquina (<code>%USERPROFILE%</code> e <code>%LOCALAPPDATA%</code>). Nenhum dado pessoal, histórico de conversa ou chave de API é coletado ou transmitido.
          </p>
        </FaqItem>

        <FaqItem id="update" question="Como o instalador preserva minhas configurações existentes?">
          <p>
            Antes de qualquer alteração, o instalador cria um backup automático dos arquivos existentes (como <code>settings.json.pre-install.bak</code>) e realiza a mescla inteligente de regras e plugins, garantindo que suas preferências pré-existentes nunca sejam sobrescritas de forma destrutiva.
          </p>
        </FaqItem>

        <FaqItem id="multi-agent" question="Como funcionam as regras multi-agente (Cursor, Windsurf, Copilot)?">
          <p>
            O repositório disponibiliza pontos de entrada universais como <code>AGENTS.md</code>, <code>.cursorrules</code>, <code>.windsurfrules</code> e <code>.clinerules</code>. Qualquer agente ou LLM (Codex, Devin, Gemini, Antigravity, Claude ou Cursor) carrega automaticamente as diretrizes e padrões de engenharia ao abrir o projeto.
          </p>
        </FaqItem>

        <FaqItem id="git" question="Preciso ter o Git instalado?">
          <p>
            Não. A <strong>Instalação Expressa (One-Liner)</strong> funciona diretamente pelo PowerShell nativo do Windows (PowerShell 5.1+), sem depender de Git instalado. Caso prefira a instalação manual local, você pode clonar o repositório ou baixar o script <code>.ps1</code> gerado pelo site.
          </p>
        </FaqItem>

        <FaqItem id="admin" question="Preciso de privilégios de administrador?">
          <p>
            Não. Os scripts gravam apenas nos diretórios do seu próprio usuário (<code>%USERPROFILE%</code> e <code>%LOCALAPPDATA%</code>). O parâmetro <code>-ExecutionPolicy Bypass</code> serve apenas para que o PowerShell aceite rodar o script na sessão atual, sem alterar as políticas de segurança globais do Windows.
          </p>
        </FaqItem>

        <FaqItem id="hub" question="Como funciona o Hub Comunitário no site?">
          <p>
            O Hub se conecta diretamente à API pública do GitHub para buscar repositórios com a tag <code>topic:claude-skills</code> e repositórios oficiais/upstream (como <code>anthropics/skills</code> e <code>cloudflare/skills</code>). Ele localiza arquivos <code>SKILL.md</code>, extrai suas instruções e permite adicioná-las à sua seleção personalizada com 1 clique.
          </p>
        </FaqItem>

        <FaqItem id="license" question="Qual é a licença do projeto?">
          <p>
            O código deste repositório (scripts, documentação, site e instaladores) é distribuído sob a licença <a href="https://github.com/diego-ruas/maleta.dev/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a>. As skills e plugins de terceiros mantêm suas respectivas licenças originais de seus autores.
          </p>
        </FaqItem>
      </div>
    </Reveal>
  );
}

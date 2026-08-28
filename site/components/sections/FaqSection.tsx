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
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <FaqItem id="tools" question="Preciso instalar as duas ferramentas?">
          <p>
            Não. O <code>scripts/install.ps1</code> instala tudo, mas cada
            pasta tem o próprio <code>install.ps1</code> — rode só o da
            ferramenta que você usa. O repo também tem uma pasta{" "}
            <code>antigravity/</code>, mas ela é um placeholder: hoje o
            instalador dela não copia nada.
          </p>
        </FaqItem>

        <FaqItem id="privacy" question="Meus dados são enviados para algum lugar?">
          <p>
            Não. O repositório é instalação somente: os scripts copiam
            arquivos para a sua máquina e nada do seu ambiente é enviado de
            volta.
          </p>
        </FaqItem>

        <FaqItem id="update" question="Como atualizo depois de instalar?">
          <p>
            Rode <code>git pull</code> na pasta clonada e execute o
            instalador da ferramenta de novo — ele recopia skills e
            configurações por cima. <code>settings.json</code> e{" "}
            <code>~/.claude.json</code> são mesclados e ganham um{" "}
            <code>.pre-install.bak</code> antes; já o{" "}
            <code>~/.claude/CLAUDE.md</code> é sobrescrito sem backup. Nada é
            removido: tirar uma skill do repo não a apaga de{" "}
            <code>~/.claude/skills/</code>.
          </p>
        </FaqItem>

        <FaqItem id="git" question="Sem Git na máquina?">
          <p>
            Use o botão <strong>Baixar ZIP</strong> no topo da página, extraia
            a pasta e rode o instalador como no passo 03.
          </p>
        </FaqItem>

        <FaqItem id="admin" question="Precisa de administrador?">
          <p>
            Não. Os scripts só escrevem em <code>%USERPROFILE%</code> e{" "}
            <code>%LOCALAPPDATA%</code>. O{" "}
            <code>-ExecutionPolicy Bypass</code> serve apenas para o Windows
            aceitar rodar um script não assinado — não altera a política da
            máquina.
          </p>
        </FaqItem>

        <FaqItem id="license" question="Qual é a licença?">
          <p>
            O wrapper do repositório (scripts, docs, configurações) é MIT. As
            skills de terceiros dentro de <code>claude/skills/</code>{" "}
            pertencem aos seus autores e mantêm as próprias licenças.
          </p>
        </FaqItem>
      </div>
    </Reveal>
  );
}
